// Set real prices and Shopify variant IDs here before launch.
export const products = [
  { id: 'tshirt', name: 'GUDSEX T-SHIRT', short: 'T-SHIRT', number: '01', price: null, currency: 'EUR',
    description: 'An oversized silhouette. A quiet statement. The GUDSEX signature in deep burgundy.',
    details: ['Relaxed, oversized silhouette', 'Signature GUDSEX chest graphic', 'White / Black · S—XL'],
    colors: ['White', 'Black'], sizes: ['S', 'M', 'L', 'XL'],
    images: { White: '/products/tshirt-white.webp', Black: '/products/tshirt-black-v4.webp' },
    variants: Object.fromEntries(['White', 'Black'].flatMap(color => ['S','M','L','XL'].map(size => [`${color}/${size}`, null]))) },
  { id: 'cap', name: 'GUDSEX CAP', short: 'CAP', number: '02', price: null, currency: 'EUR',
    description: 'The finishing gesture. A classic cap carrying the GUDSEX signature in burgundy.',
    details: ['Signature embroidered GUDSEX mark', 'One size', 'White / Black'],
    colors: ['White', 'Black'], sizes: ['One Size'],
    images: { White: '/products/cap-white.webp', Black: '/products/cap-black-v4.webp' },
    variants: { 'White/One Size': null, 'Black/One Size': null } }
];
export const money = value => new Intl.NumberFormat('en', { style: 'currency', currency: 'EUR' }).format(value);
