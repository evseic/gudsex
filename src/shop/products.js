// Confirmed retail prices and published Printful-synced Shopify variants.
export const products = [
  { id: 'tshirt', name: 'GUDSEX T-SHIRT', short: 'T-SHIRT', number: '01', price: 50, currency: 'EUR',
    description: 'An oversized silhouette. A quiet statement. The GUDSEX signature in deep burgundy.',
    details: ['Relaxed, oversized silhouette', 'Signature GUDSEX chest graphic', 'White / Black · S—XL'],
    colors: ['White', 'Black'], sizes: ['S', 'M', 'L', 'XL'],
    images: { White: '/products/tshirt-white.webp', Black: '/products/tshirt-black-v4.webp' },
    variants: {
      'Black/S': 'gid://shopify/ProductVariant/54315787977032',
      'Black/M': 'gid://shopify/ProductVariant/54315788009800',
      'Black/L': 'gid://shopify/ProductVariant/54315788042568',
      'Black/XL': 'gid://shopify/ProductVariant/54315788075336',
      'White/S': 'gid://shopify/ProductVariant/54315788108104',
      'White/M': 'gid://shopify/ProductVariant/54315788140872',
      'White/L': 'gid://shopify/ProductVariant/54315788173640',
      'White/XL': 'gid://shopify/ProductVariant/54315788206408'
    } },
  { id: 'cap', name: 'GUDSEX CAP', short: 'CAP', number: '02', price: 40, currency: 'EUR',
    description: 'The finishing gesture. A classic cap carrying the GUDSEX signature in burgundy.',
    details: ['Signature embroidered GUDSEX mark', 'One size', 'White / Black'],
    colors: ['White', 'Black'], sizes: ['One Size'],
    images: { White: '/products/cap-white.webp', Black: '/products/cap-black-v4.webp' },
    variants: { 'White/One Size': 'gid://shopify/ProductVariant/54315448893768', 'Black/One Size': 'gid://shopify/ProductVariant/54315448861000' } }
];
export const money = value => new Intl.NumberFormat('en', { style: 'currency', currency: 'EUR' }).format(value);
