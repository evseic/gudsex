import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export function BrandStory() {
  return <section className="gx-story"><p className="gx-eyebrow">THE FIRST EXPRESSION</p><div><h2>A quiet statement.<br/>Your own expression.</h2><p>gudsex starts with two everyday pieces: an oversized T-shirt and a classic cap. Black and white, marked with our burgundy signature. Wear them together. Make the look your own.</p></div><a href="#/shop" className="gx-inline-link">Explore the pieces <ArrowUpRight size={15}/></a></section>;
}
export function StoreFooter() {
  return <footer className="gx-store-footer"><div><a href="#/shop" className="gx-footer-brand">gudsex ✦</a><span>THE FIRST EXPRESSION</span></div><nav aria-label="Customer service"><a href="#/info/about">Our story</a><a href="#/info/shipping">Shipping & delivery</a><a href="#/info/contact">Contact</a><a href="mailto:love@gudsex.com?subject=Returns%20question">Returns questions</a><a href="https://www.instagram.com/gudsex.club/" target="_blank" rel="noreferrer">Instagram <ArrowUpRight size={12}/></a></nav><p>© {new Date().getFullYear()} gudsex</p></footer>;
}
export function StoreInfo({page, onShop}) {
  const contact=page==='contact'; const shipping=page==='shipping';
  return <main className="gx-info"><p className="gx-eyebrow">GUDSEX / {contact ? 'HERE FOR YOU' : shipping ? 'YOUR ORDER' : 'OUR STORY'}</p><h1>{contact ? 'Let’s talk.' : shipping ? 'From us to you.' : 'The first expression.'}</h1>
    {contact ? <><p>Questions about sizing, your order, delivery, or a return? Write to us with your order number if you have one.</p><a className="gx-contact-email" href="mailto:love@gudsex.com">love@gudsex.com <ArrowUpRight size={22}/></a><p>Find the collection and share your look on <a href="https://www.instagram.com/gudsex.club/" target="_blank" rel="noreferrer">Instagram @gudsex.club</a>.</p></> : shipping ? <><h2>Where we deliver</h2><p>Enter your country and delivery address at checkout to see the shipping options available for your order. Availability depends on the destination and the products in your bag.</p><h2>Shipping costs</h2><p>Shipping charges and applicable taxes are shown at checkout before you pay.</p><h2>Production & delivery</h2><p>Your pieces are made to order. Production happens before shipping, so allow time for both. Delivery times vary by destination and carrier. If you need an order for a particular date, contact us before ordering.</p><h2>Track your order</h2><p>Once your order ships, use the tracking link in your shipping confirmation. Items may arrive in separate packages.</p><h2>Need a hand?</h2><p>Email <a href="mailto:love@gudsex.com">love@gudsex.com</a> for delivery or returns questions.</p></> : <><p>gudsex starts with a simple idea: everyday pieces can carry a personal statement.</p><p>Our first expression pairs an oversized T-shirt with a classic, embroidered cap. A black-and-white foundation. A burgundy signature. Two pieces to wear your way.</p><p>This is the beginning. Join us.</p></>}
    <button className="gx-outline" onClick={onShop}>SHOP THE PIECES <ArrowUpRight size={17}/></button></main>;
}

// Product measurements read from Printful's Stanley/Stella SATU020 size guide.
export function SizeGuide({product}) {
  const [unit,setUnit] = React.useState('cm');
  if(product.id !== 'tshirt') return null;
  const rows=[['S',28.75,24.75,9.5],['M',29.5,26.375,9.625],['L',30.25,28,9.875],['XL',31.5,29.875,10]];
  return <div><div className="gx-gallery-tabs gx-unit-tabs" role="group" aria-label="Measurement units">{['cm','in'].map(u=><button key={u} aria-pressed={unit===u} onClick={()=>setUnit(u)}>{u.toUpperCase()}</button>)}</div><table className="gx-size-table"><caption>Garment measurements in {unit === 'cm' ? 'centimeters' : 'inches'}. Width is measured flat, underarm to underarm.</caption><thead><tr>{['Size','Length','Width','Sleeve'].map(h=><th key={h} scope="col">{h}</th>)}</tr></thead><tbody>{rows.map(([s,...values])=><tr key={s}><th scope="row">{s}</th>{values.map((v,i)=><td key={i}>{Number((v*(unit==='cm'?2.54:1)).toFixed(unit==='cm'?1:3))}</td>)}</tr>)}</tbody></table><p>Supplier measurements may vary by up to 5 cm (2 in). Compare measurements rather than relying on your usual size.</p></div>;
}
