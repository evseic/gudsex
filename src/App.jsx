import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowUpRight, ArrowLeft, ArrowRight, X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { products, money } from './shop/products';
import { StoreInfo, StoreFooter, SizeGuide } from './shop/StoreInfo';
import { checkout, commerceConfigured, productPurchasable, cartPurchasable } from './shop/commerce';

function readStorage(key, fallback) { try { const value = JSON.parse(localStorage.getItem(key)); return Array.isArray(value) ? value : fallback; } catch { return fallback; } }
function publicRoute() { return /^#\/(shop|look|product\/|info\/)/.test(location.hash); }
function infoRoute() { return location.hash.startsWith('#/info/') ? location.hash.slice(7) : null; }
function hasAccess() { try { return localStorage.getItem('gudsex_access_v1') === 'granted'; } catch { return false; } }
function routeProduct() { return products.find(p => location.hash === `#/product/${p.id}`) || null; }
function Modal({ label, children, onClose, className = '' }) {
  const ref = useRef(null);
  useEffect(() => { const dialog = ref.current; dialog.showModal(); return () => dialog.close(); }, []);
  return <dialog ref={ref} className={`gx-dialog ${className}`} aria-label={label} onCancel={onClose} onClick={e => { if(e.target === e.currentTarget) onClose(); }}>
    <button className="gx-close" aria-label="Close" onClick={onClose}><X size={22}/></button>{children}
  </dialog>;
}
function Quantity({ value, onChange, label = 'Quantity' }) {
  return <div className="gx-quantity"><button aria-label={`Decrease ${label}`} disabled={value <= 1} onClick={() => onChange(value - 1)}><Minus size={14}/></button><span aria-live="polite">{value}</span><button aria-label={`Increase ${label}`} disabled={value >= 10} onClick={() => onChange(value + 1)}><Plus size={14}/></button></div>;
}
function ProductImage({ product, color = 'White', ...props }) { return <img key={color} className="gx-product-image" src={product.images[color]} alt={`${color} ${product.name}`} {...props}/>; }
function ProductPage({ product, onBack, onAdd }) {
  const [color, setColor] = useState('White'); const [size, setSize] = useState(product.sizes.length === 1 ? 'One Size' : '');
  const [view, setView] = useState('front');
  const [quantity, setQuantity] = useState(1); const [notice, setNotice] = useState('');
  const heading = useRef(null);
  useEffect(() => { heading.current?.focus({preventScroll:true}); }, []);
  return <main className="gx-detail">
    <div className="gx-gallery"><div className={`gx-detail-photo gx-view-${view}`}><img className="gx-product-image" src={view === 'back' ? product.backImages[color] : product.images[color]} alt={`${color} ${product.name}, ${view === 'detail' ? 'logo close-up' : view + ' view'}`}/><span className="gx-photo-caption">GUDSEX / {product.number} / {color.toUpperCase()} / {view.toUpperCase()}</span></div><div className="gx-gallery-tabs" role="group" aria-label="Product views">{['front','back','detail'].map(v => <button key={v} aria-pressed={view === v} onClick={()=>setView(v)}>{v === 'detail' ? 'LOGO CLOSE-UP' : v.toUpperCase()}</button>)}</div><p className="gx-image-note">Product mockups. Colors and placement may vary slightly.</p></div>
    <div className="gx-detail-copy"><button className="gx-text-button" onClick={onBack}><ArrowLeft size={16}/> THE LOOK</button>
      <p className="gx-eyebrow">THE FIRST EXPRESSION / {product.number}</p><h1 ref={heading} tabIndex={-1}>{product.name}</h1>
      <p className="gx-description">{product.description}</p><p className="gx-price">{product.price == null ? 'Price to be announced' : money(product.price)}</p>
      <fieldset><legend>COLOR <span>{color}</span></legend><div className="gx-swatches">{product.colors.map(c => <button key={c} className={`gx-swatch ${c.toLowerCase()}`} aria-label={c} aria-pressed={color === c} onClick={() => {setColor(c);setView('front');setNotice('');}}><span>{c}</span></button>)}</div></fieldset>
      <fieldset><legend>SIZE {product.sizes.length === 1 && <span>One Size</span>}</legend><div className="gx-sizes">{product.sizes.map(s => <button key={s} aria-pressed={size === s} onClick={() => {setSize(s);setNotice('');}}>{s}</button>)}</div></fieldset>
      <p className="gx-fit-note">{product.fit}</p><div className="gx-quantity-row"><span className="gx-eyebrow">QUANTITY</span><Quantity value={quantity} onChange={setQuantity}/></div>
      <button className="gx-primary" disabled={!productPurchasable(product)} onClick={() => { if(!size) {setNotice('Choose your size first.');return;} onAdd({ id: product.id, color, size, quantity });setNotice('Added to your bag.'); }}>{productPurchasable(product) ? 'ADD TO CART' : 'COMING SOON'} <Plus size={18}/></button>
      <p className="gx-notice" role="status">{notice}</p><p className="gx-commerce-note">{productPurchasable(product) ? 'Secure checkout powered by Shopify.' : 'Collection preview. Checkout opens when the store launches.'}</p>
      <div className="gx-buy-help"><a href="#/info/shipping">Shipping & delivery</a><a href="mailto:love@gudsex.com?subject=Returns%20question">Returns questions</a></div><details><summary>THE DETAILS <Plus size={14}/></summary>{product.details.map(d => <p key={d}>{d}</p>)}</details><details><summary>SIZE & FIT <Plus size={14}/></summary><p>{product.fit}</p><p>{product.measurementNote}</p><SizeGuide product={product}/><a className="gx-inline-link" href={product.sizeGuide} target="_blank" rel="noreferrer">View supplier measurements <ArrowUpRight size={12}/></a></details><details><summary>CARE <Plus size={14}/></summary>{product.care.map(c=><p key={c}>{c}</p>)}</details>
    </div>
  </main>;
}
export default function App() {
  const [mode, setMode] = useState((hasAccess() || publicRoute()) ? (infoRoute() ? 'info' : routeProduct() ? 'product' : 'reveal') : 'landing');
  const [phase, setPhase] = useState(location.hash === '#/shop' ? 'pieces' : hasAccess() || publicRoute() ? 'model' : 'closed'); const [showId, setShowId] = useState(0); const [preview, setPreview] = useState(null);
  const [product, setProduct] = useState(routeProduct()); const [bagOpen, setBagOpen] = useState(false);
  const [cart, setCart] = useState(() => readStorage('gudsex_cart_v1', []).filter(i => products.some(p => p.id === i.id && p.colors.includes(i.color) && p.sizes.includes(i.size)) && Number.isInteger(i.quantity) && i.quantity > 0 && i.quantity <= 10));
  const [cartError, setCartError] = useState(''); const [checkoutBusy, setCheckoutBusy] = useState(false);
  const [info, setInfo] = useState(infoRoute());
  const [interacted, setInteracted] = useState(false); const [added, setAdded] = useState('');
  const timers = useRef([]); const experienceRef = useRef(null);
  const count = cart.reduce((sum, i) => sum + i.quantity, 0);
  useLayoutEffect(() => {experienceRef.current?.scrollTo(0,0);}, [mode, product?.id]);
  useEffect(() => { try {localStorage.setItem('gudsex_cart_v1', JSON.stringify(cart));} catch {} }, [cart]);
  useEffect(() => {
    const begin = () => { timers.current.forEach(clearTimeout); timers.current = []; const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches; setShowId(id => id + 1);setMode('reveal');setPhase('closed');setProduct(null);setInteracted(false); timers.current.push(setTimeout(() => setPhase('opening'), reduced ? 0 : 30), setTimeout(() => setPhase('statement'), 1000), setTimeout(() => setPhase('model'), 3000)); };
    window.addEventListener('gudsex:access', begin);
    const route = () => {const p = routeProduct();setProduct(p);if(hasAccess() || publicRoute()) {const page=infoRoute();setInfo(page);setMode(page ? 'info' : p ? 'product' : 'reveal');if(!p && !page) setPhase(location.hash === '#/shop' ? 'pieces' : 'model');}}; window.addEventListener('hashchange', route);
    return () => {window.removeEventListener('gudsex:access', begin);window.removeEventListener('hashchange', route);timers.current.forEach(clearTimeout);};
  }, []);
  useEffect(() => {
    if(mode === 'landing') return;
    const elements = [...document.body.children].filter(e => e.id !== 'shop-root' && e.tagName !== 'SCRIPT');
    elements.forEach(e => { e.inert = true; e.setAttribute('aria-hidden','true'); });
    document.body.classList.add('gx-active'); window.dispatchEvent(new CustomEvent('gudsex:stage'));
    return () => { elements.forEach(e => {e.inert = false;e.removeAttribute('aria-hidden');});document.body.classList.remove('gx-active'); };
  }, [mode]);
  useEffect(() => {
    if(mode !== 'reveal' || phase !== 'model' || interacted || preview) return;
    const timer = setTimeout(exitModel, 10000); return () => clearTimeout(timer);
  }, [mode, phase, interacted, preview]);
  function exitModel() {setInteracted(true);setPhase('exit');timers.current.push(setTimeout(() => {setPhase('pieces');}, matchMedia('(prefers-reduced-motion: reduce)').matches ? 50 : 1700));}
  function openProduct(p) {timers.current.forEach(clearTimeout);timers.current=[];setPreview(null);setMode('product');setProduct(p);location.hash = `/product/${p.id}`;}
  function shop() {timers.current.forEach(clearTimeout);timers.current=[];setPreview(null);setProduct(null);setInteracted(true);setMode('reveal');setPhase('pieces');location.hash='/shop';}
  function back() {timers.current.forEach(clearTimeout);timers.current=[];setProduct(null);setInteracted(true);setMode('reveal');setPhase('model');location.hash = '/look';}
  function add(item) {setCart(old => {const found = old.find(i => i.id === item.id && i.color === item.color && i.size === item.size);return found ? old.map(i => i === found ? {...i,quantity:Math.min(10,i.quantity + item.quantity)} : i) : [...old,item];});setAdded('Added to your bag');}
  function update(index, quantity) {setCart(old => old.map((i,n) => n === index ? {...i,quantity} : i));}
  const floatingCart = <button className="gx-floating-cart" aria-label={`Open shopping bag, ${count} items`} onClick={() => {setCheckoutBusy(false);setBagOpen(true);}}><ShoppingBag size={19}/><span>BAG ({count})</span></button>;
  const bagUI = bagOpen && <Modal label="Your shopping bag" onClose={() => setBagOpen(false)} className="gx-cart"><p className="gx-eyebrow">YOUR SELECTION</p><h2>Bag <em>({count})</em></h2>{cart.length === 0 ? <div className="gx-empty"><ShoppingBag size={30}/><p>Your bag is waiting.</p><button className="gx-primary" onClick={() => {setBagOpen(false);back();}}>RETURN TO THE LOOK <ArrowRight size={17}/></button></div> : <><div className="gx-cart-items">{cart.map((item, index) => {const p = products.find(p => p.id === item.id);return <div className="gx-cart-item" key={`${item.id}-${item.color}-${item.size}`}><ProductImage product={p} color={item.color}/><div><h3>{p.short}</h3><p>{item.color} / {item.size}</p><Quantity value={item.quantity} onChange={q => update(index,q)} label={`${p.short} quantity`}/><button className="gx-remove" onClick={() => setCart(old => old.filter((_,n) => n !== index))}>REMOVE</button></div><span>{p.price == null ? 'TBA' : money(p.price * item.quantity)}</span></div>;})}</div><div className="gx-cart-total"><span>SUBTOTAL</span><span>{cart.every(i => products.find(p => p.id === i.id).price != null) ? money(cart.reduce((n,i) => n + products.find(p => p.id === i.id).price * i.quantity,0)) : 'TO BE ANNOUNCED'}</span></div><button className="gx-primary" disabled={!commerceConfigured || !cartPurchasable(cart,products) || checkoutBusy} onClick={async () => {setCartError('');setCheckoutBusy(true);try {await checkout(cart,products);} catch(e) {setCartError(e.message);setCheckoutBusy(false);}}}>{checkoutBusy ? 'CONNECTING…' : commerceConfigured && cartPurchasable(cart,products) ? 'CHECKOUT' : 'ITEMS NOT AVAILABLE YET'} <ArrowUpRight size={18}/></button><p className="gx-commerce-note">{!cartPurchasable(cart,products) ? 'Remove items marked coming soon to check out. Your other selections stay in your bag.' : commerceConfigured ? 'Shipping and taxes calculated at checkout.' : 'Your selection is saved on this device. No payment is taken.'}</p><p role="alert" className="gx-notice">{cartError}</p></>}</Modal>;
  if(mode === 'landing') return <>{floatingCart}{bagUI}</>;
  return <div ref={experienceRef} className={`gx-experience gx-mode-${mode} gx-sequence-${phase}`}>
    <header className="gx-header" inert={mode === 'reveal' && !['model','pieces'].includes(phase) ? true : undefined}><button className="gx-logo" onClick={() => {back();}}>gudsex<span>✦</span></button><nav aria-label="Shop navigation"><button className="gx-nav gx-shop-link" onClick={shop}>SHOP</button><button className="gx-nav" onClick={() => {back();}}>THE LOOK</button><button className="gx-bag" onClick={() => {setCheckoutBusy(false);setBagOpen(true);}} aria-label={`Shopping bag, ${count} items`}><ShoppingBag size={17}/><span>BAG ({count})</span></button></nav></header>
    {mode === 'reveal' ? <main key={`stage-${showId}`} className={`gx-stage gx-phase-${phase}`}>
      <div className="gx-stage-light"/><div className="gx-stage-collection" aria-hidden={phase !== 'pieces'} inert={phase !== 'pieces' ? true : undefined}><p className="gx-eyebrow">GUDSEX / THE PIECES</p><div>{products.map(p => <button className="gx-stage-piece" key={p.id} onClick={() => openProduct(p)} aria-label={`View ${p.name}`}><img src={p.images.White} alt={p.name}/><span>{p.short} <ArrowUpRight size={16}/></span></button>)}</div></div><p className="gx-stage-caption">GUDSEX / THE FIRST EXPRESSION</p>
      <div className="gx-model-wrap" aria-hidden={!['model','exit'].includes(phase)} inert={phase !== 'model' ? true : undefined}><img className="gx-model" src="/model-street-cutout.webp" alt="Model wearing the GUDSEX white T-shirt and cap"/>
        <button className="gx-hotspot gx-cap-hotspot" aria-label="Take a closer look at the GUDSEX cap" onClick={() => {setInteracted(true);setPreview(products[1]);}} onFocus={() => setInteracted(true)} disabled={phase !== 'model'}><span className="gx-dot"/><span>CAP <ArrowUpRight size={13}/></span></button>
        <button className="gx-hotspot gx-shirt-hotspot" aria-label="Take a closer look at the GUDSEX T-shirt" onClick={() => {setInteracted(true);setPreview(products[0]);}} onFocus={() => setInteracted(true)} disabled={phase !== 'model'}><span className="gx-dot"/><span>T-SHIRT <ArrowUpRight size={13}/></span></button>
      </div>
      <div className="gx-stage-bottom" aria-hidden={!['model','pieces'].includes(phase)} inert={!['model','pieces'].includes(phase) ? true : undefined}><div><p className="gx-eyebrow">THE SHOW IS OPEN</p><h1>{phase === 'pieces' ? 'The pieces.' : 'Meet the first expression.'}</h1><p className="gx-discovery-hint">{phase === 'pieces' ? 'Select a piece to enter.' : 'Select a piece. Take a closer look.'}</p></div><button className="gx-outline" onClick={phase === 'pieces' ? back : exitModel} disabled={phase === 'exit'}>{phase === 'pieces' ? 'RETURN TO THE LOOK' : 'VIEW THE PIECES'} <ArrowRight size={17}/></button></div>
      <div className="gx-statement" role="status" aria-hidden={phase !== 'statement'}><p><span>SEE IT.</span> <span>WANT IT.</span> <span>FUCK IT.</span></p></div>
      {['model','pieces'].includes(phase) && <button className="gx-replay" onClick={() => window.dispatchEvent(new CustomEvent('gudsex:access'))}>REPLAY SHOW</button>}
    </main> : mode === 'info' ? <StoreInfo page={info} onShop={shop}/> : product ? <ProductPage key={product.id} product={product} onBack={back} onAdd={add}/> : null}
    <StoreFooter/>
    <span className="gx-sr-only" role="status">{added}</span>
    {preview && <Modal label={`Closer look: ${preview.name}`} onClose={() => setPreview(null)} className="gx-preview"><div className="gx-preview-photo"><button aria-label={`Open ${preview.name} product page`} onClick={() => openProduct(preview)}><ProductImage product={preview}/></button></div><div className="gx-preview-copy"><p className="gx-eyebrow">A CLOSER LOOK / {preview.number}</p><h2>{preview.short}</h2><p>{preview.description}</p><button className="gx-primary" onClick={() => openProduct(preview)}>VIEW ITEM <ArrowUpRight size={18}/></button></div></Modal>}
    {floatingCart}{bagUI}
  </div>;
}
