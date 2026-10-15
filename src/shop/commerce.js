// Browser-safe Storefront token only. Never use a Shopify Admin API token here.
const domain = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN || 'rj5ha2-v0.myshopify.com';
// Public Storefront token from Shopify's generated Buy Button, intended for browser use.
const token = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN || 'd878b81e280bedb97ee27c918ac362f6';
export const commerceConfigured = Boolean(domain && token);
export const productPurchasable = product => commerceConfigured && Object.values(product.variants).every(Boolean);
export const cartPurchasable = (items, products) => items.length > 0 && items.every(item => products.find(p => p.id === item.id)?.variants[`${item.color}/${item.size}`]);
export async function checkout(items, products) {
  if (!commerceConfigured) throw new Error('Checkout is not connected yet.');
  if (!cartPurchasable(items, products)) throw new Error('Remove items that are not available yet to continue to checkout.');
  const lines = items.map(item => {
    const product = products.find(p => p.id === item.id);
    const merchandiseId = product?.variants[`${item.color}/${item.size}`];
    if (!merchandiseId) throw new Error('This variant is not connected to Shopify yet.');
    return { merchandiseId, quantity: item.quantity };
  });
  const response = await fetch(`https://${domain}/api/2026-07/graphql.json`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': token },
    body: JSON.stringify({ query: `mutation CreateCart($input: CartInput!) { cartCreate(input: $input) { cart { checkoutUrl } userErrors { message } } }`, variables: { input: { lines } } })
  });
  if (!response.ok) throw new Error('Unable to connect to checkout.');
  const data = await response.json();
  const error = data.errors?.[0]?.message || data.data?.cartCreate?.userErrors?.[0]?.message;
  const url = data.data?.cartCreate?.cart?.checkoutUrl;
  if (error || !url) throw new Error(error || 'Checkout is unavailable.');
  window.location.assign(url);
}
