// Confirmed retail prices and published Printful-synced Shopify variants.
export const products = [
  { id: 'tshirt', name: 'GUDSEX T-SHIRT', short: 'T-SHIRT', number: '01', price: 50, currency: 'EUR',
    description: 'An oversized silhouette. A quiet statement. The GUDSEX signature in deep burgundy.',
    details: ['100% organic combed ring-spun cotton', '200 g/m² fabric weight', 'Oversized silhouette with dropped shoulders', 'High, wide ribbed collar and set-in sleeves', 'Signature burgundy GUDSEX chest graphic', 'White / Black · S—XL'],
    fit: 'An intentionally oversized fit. Compare garment measurements with a T-shirt you already love before choosing your size.',
    measurementNote: 'Measure a similar T-shirt laid flat, then compare its chest width and body length with the supplier’s size guide. Sizes can differ between regions.',
    sizeGuide: 'https://www.printful.com/custom/collections/style-trends/unisex-organic-oversized-high-neck-t-shirt-stanley-stella-satu020',
    care: ['Follow the care label on your garment.', 'Wash inside out with similar colors on a gentle, cold cycle. Avoid bleach and ironing directly over the design.'],
    backImages: { White: '/products/tshirt-white-back.png', Black: '/products/tshirt-black-back.png' },
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
    details: ['100% chino cotton twill', 'Unstructured, six-panel, low-profile design', 'Signature burgundy GUDSEX embroidery', 'Six embroidered ventilation eyelets', 'Adjustable strap with an antique-style buckle', 'White / Black · One Size'],
    fit: 'Adjustable head circumference: 52.1–61.9 cm (20½–24⅜ in). Use the rear buckle strap to find your fit.',
    measurementNote: 'Measure around your head where the cap will sit. Check the supplier’s measurements before ordering.',
    sizeGuide: 'https://www.printful.com/custom/hats/dad-hats/classic-dad-cap-yupoong-6245cm',
    care: ['Spot-clean gently with a damp cloth and mild detergent. Let air-dry.', 'Follow the care label. Avoid machine washing or tumble drying to help preserve the shape and embroidery.'],
    backImages: { White: '/products/cap-white-back.png', Black: '/products/cap-black-back.png' },
    colors: ['White', 'Black'], sizes: ['One Size'],
    images: { White: '/products/cap-white.webp', Black: '/products/cap-black-v4.webp' },
    variants: { 'White/One Size': 'gid://shopify/ProductVariant/54315448893768', 'Black/One Size': 'gid://shopify/ProductVariant/54315448861000' } }
];
export const money = value => new Intl.NumberFormat('en', { style: 'currency', currency: 'EUR' }).format(value);
