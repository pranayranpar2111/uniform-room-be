const mongoose = require('mongoose');
const dotenv = require('dotenv');
const slugify = require('slugify');
const User = require('../models/User.model');
const Category = require('../models/Category.model');
const Color = require('../models/Color.model');
const Size = require('../models/Size.model');
const Product = require('../models/Product.model');
const Banner = require('../models/Banner.model');
const Discount = require('../models/Discount.model');
const SizeChart = require('../models/SizeChart.model');

// Load env vars
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

const seedData = async () => {
  try {
    console.log('Seeding database...');

    // Create admin user
    const adminExists = await User.findOne({ email: 'admin@uniformroom.com' });

    if (!adminExists) {
      await User.create({
        name: 'Admin User',
        email: 'admin@uniformroom.com',
        password: 'admin123',
        role: 'admin',
        phone: '+1234567890'
      });
      console.log('✓ Admin user created');
    }

    // Create test user
    const userExists = await User.findOne({ email: 'user@uniformroom.com' });

    if (!userExists) {
      await User.create({
        name: 'Test User',
        email: 'user@uniformroom.com',
        password: 'user123',
        role: 'user',
        phone: '+1234567890'
      });
      console.log('✓ Test user created');
    }

    // Create categories
    const categoryData = [
      {
        name: 'Men',
        description: "Men's clothing and accessories",
        image: {
          url: 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891',
          publicId: 'men-category'
        },
        order: 1,
        status: 'active'
      },
      {
        name: 'Women',
        description: "Women's clothing and accessories",
        image: {
          url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b',
          publicId: 'women-category'
        },
        order: 2,
        status: 'active'
      },
      {
        name: 'Kids',
        description: "Children's clothing",
        image: {
          url: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9',
          publicId: 'kids-category'
        },
        order: 3,
        status: 'active'
      },
      {
        name: 'Accessories',
        description: 'Various accessories and add-ons',
        image: {
          url: 'https://images.unsplash.com/photo-1556306535-0f09a537f0a3',
          publicId: 'accessories-category'
        },
        order: 4,
        status: 'active'
      }
    ];

    for (const cat of categoryData) {
      const exists = await Category.findOne({ name: cat.name });
      if (!exists) {
        await Category.create(cat);
      }
    }
    console.log('✓ Categories created');

    // Create colors
    const colorsData = [
      { name: 'Black', hex: '#000000' },
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Navy Blue', hex: '#001F3F' },
      { name: 'Gray', hex: '#AAAAAA' },
      { name: 'Red', hex: '#FF4136' },
      { name: 'Blue', hex: '#0074D9' },
      { name: 'Green', hex: '#2ECC40' },
      { name: 'Yellow', hex: '#FFDC00' },
      { name: 'Brown', hex: '#8B4513' },
      { name: 'Pink', hex: '#FFC0CB' }
    ];

    for (const color of colorsData) {
      const exists = await Color.findOne({ name: color.name });
      if (!exists) {
        await Color.create(color);
      }
    }
    console.log('✓ Colors created');

    // Create sizes
    const sizesData = [
      { name: 'XS', value: 'Extra Small', category: 'General', order: 1 },
      { name: 'S', value: 'Small', category: 'General', order: 2 },
      { name: 'M', value: 'Medium', category: 'General', order: 3 },
      { name: 'L', value: 'Large', category: 'General', order: 4 },
      { name: 'XL', value: 'Extra Large', category: 'General', order: 5 },
      { name: '2XL', value: '2X Large', category: 'General', order: 6 },
      { name: '28', value: 'Waist 28', category: 'Pants', order: 1 },
      { name: '30', value: 'Waist 30', category: 'Pants', order: 2 },
      { name: '32', value: 'Waist 32', category: 'Pants', order: 3 },
      { name: '34', value: 'Waist 34', category: 'Pants', order: 4 },
      { name: '36', value: 'Waist 36', category: 'Pants', order: 5 }
    ];

    for (const size of sizesData) {
      const exists = await Size.findOne({ name: size.name, category: size.category });
      if (!exists) {
        await Size.create(size);
      }
    }
    console.log('✓ Sizes created');

    // Get IDs for products
    const menCat = await Category.findOne({ name: 'Men' });
    const womenCat = await Category.findOne({ name: 'Women' });
    const kidsCat = await Category.findOne({ name: 'Kids' });
    const accessoriesCat = await Category.findOne({ name: 'Accessories' });

    const blackColor = await Color.findOne({ name: 'Black' });
    const whiteColor = await Color.findOne({ name: 'White' });
    const navyColor = await Color.findOne({ name: 'Navy Blue' });
    const grayColor = await Color.findOne({ name: 'Gray' });
    const redColor = await Color.findOne({ name: 'Red' });
    const blueColor = await Color.findOne({ name: 'Blue' });
    const greenColor = await Color.findOne({ name: 'Green' });
    const brownColor = await Color.findOne({ name: 'Brown' });
    const pinkColor = await Color.findOne({ name: 'Pink' });

    const sizeS = await Size.findOne({ name: 'S', category: 'General' });
    const sizeM = await Size.findOne({ name: 'M', category: 'General' });
    const sizeL = await Size.findOne({ name: 'L', category: 'General' });
    const sizeXL = await Size.findOne({ name: 'XL', category: 'General' });

    // Create products (clear existing first so re-running seed always loads product data)
    const productCount = await Product.countDocuments();
    if (productCount > 0) {
      await Product.deleteMany({});
      console.log(`✓ Cleared ${productCount} existing product(s)`);
    }
    const products = [
        {
          name: 'Cosmo Naminos Delementum Bra',
          sku: 'SKU-001',
          description: 'Premium quality uniform piece. Nibh semper bibid et nunc aeneque phasellus odio demoistrasce valued lorem. Pellentesque diam dolor sit amet.',
          shortDescription: 'Premium uniform essential',
          category: womenCat?._id || menCat?._id,
          price: 69,
          comparePrice: 89,
          stock: 50,
          images: [
            { url: 'https://images.unsplash.com/photo-1558769132-cb1aea913ec4', publicId: 'prod-1' }
          ],
          colors: [blackColor?._id, whiteColor?._id, navyColor?._id, grayColor?._id],
          sizes: [sizeS?._id, sizeM?._id, sizeL?._id, sizeXL?._id],
          variants: [
            { color: blackColor?._id, size: sizeS?._id, stock: 10 },
            { color: blackColor?._id, size: sizeM?._id, stock: 12 },
            { color: whiteColor?._id, size: sizeM?._id, stock: 8 },
            { color: navyColor?._id, size: sizeL?._id, stock: 10 }
          ],
          featured: true,
          status: 'active',
          weight: 0.2,
          rating: { average: 4.5, count: 18 }
        },
        {
          name: 'Naminos Cosmo Delementum Brana',
          sku: 'SKU-002',
          description: 'Classic uniform style. Vitae malesuada magna congue lunea. Comfortable and durable for everyday wear.',
          shortDescription: 'Classic uniform style',
          category: menCat?._id || womenCat?._id,
          price: 89,
          comparePrice: 99,
          stock: 40,
          images: [
            { url: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1', publicId: 'prod-2' }
          ],
          colors: [navyColor?._id, blueColor?._id, redColor?._id, greenColor?._id],
          sizes: [sizeS?._id, sizeM?._id, sizeL?._id, sizeXL?._id],
          variants: [
            { color: navyColor?._id, size: sizeM?._id, stock: 15 },
            { color: blueColor?._id, size: sizeL?._id, stock: 10 }
          ],
          featured: true,
          status: 'active',
          weight: 0.25,
          rating: { average: 4.2, count: 12 }
        },
        {
          name: 'Vitae Malesuada Magna Congue Lunea',
          sku: 'SKU-003',
          description: 'Trending design with premium finish. Limited-time offer. Neque mollis urnan lementum.',
          shortDescription: 'Trending design',
          category: womenCat?._id || menCat?._id,
          price: 62.3,
          comparePrice: 89,
          discount: 30,
          stock: 35,
          images: [
            { url: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105', publicId: 'prod-3' }
          ],
          colors: [grayColor?._id, blackColor?._id],
          sizes: [sizeS?._id, sizeM?._id, sizeL?._id],
          variants: [
            { color: grayColor?._id, size: sizeM?._id, stock: 20 }
          ],
          featured: true,
          status: 'active',
          weight: 0.22,
          rating: { average: 4.8, count: 25 }
        },
        {
          name: 'Neque Mollis Urnan Lementum',
          sku: 'SKU-004',
          description: 'Out of stock item - Lobortin tincidunt denis loremousia. Check back soon.',
          shortDescription: 'Coming back soon',
          category: menCat?._id,
          price: 109,
          comparePrice: 120,
          stock: 0,
          images: [
            { url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35', publicId: 'prod-4' }
          ],
          colors: [blackColor?._id, navyColor?._id, greenColor?._id],
          sizes: [sizeM?._id, sizeL?._id, sizeXL?._id],
          variants: [],
          featured: false,
          status: 'active',
          weight: 0.3,
          rating: { average: 4.0, count: 8 }
        },
        {
          name: 'Lamcorper Ostique Amattis Drosele',
          sku: 'SKU-005',
          description: 'Bundle offer. Suscipit quamet turpis eleifenda. Best value pack.',
          shortDescription: 'Bundle offer',
          category: kidsCat?._id || womenCat?._id,
          price: 69,
          comparePrice: 89,
          discount: 22,
          stock: 60,
          images: [
            { url: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04', publicId: 'prod-5' }
          ],
          colors: [whiteColor?._id, blueColor?._id, redColor?._id],
          sizes: [sizeS?._id, sizeM?._id, sizeL?._id],
          variants: [
            { color: whiteColor?._id, size: sizeS?._id, stock: 20 },
            { color: blueColor?._id, size: sizeM?._id, stock: 15 }
          ],
          featured: true,
          status: 'active',
          weight: 0.18,
          rating: { average: 4.6, count: 30 }
        },
        {
          name: 'Suscipit Quamet Turpis Eleifenda',
          sku: 'SKU-006',
          description: 'New release. Milancelos Cosmo Naminos Delementum. Fresh design for the season.',
          shortDescription: 'New release',
          category: womenCat?._id,
          price: 80,
          comparePrice: 89,
          discount: 10,
          stock: 45,
          images: [
            { url: 'https://images.unsplash.com/photo-1445205170230-053b83016050', publicId: 'prod-6' }
          ],
          colors: [blackColor?._id, whiteColor?._id, pinkColor?._id].filter(Boolean),
          sizes: [sizeS?._id, sizeM?._id, sizeL?._id],
          variants: [
            { color: blackColor?._id, size: sizeM?._id, stock: 18 }
          ],
          featured: true,
          status: 'active',
          weight: 0.2,
          rating: { average: 4.7, count: 14 }
        },
        {
          name: 'Milancelos Cosmo Naminos Delementum',
          sku: 'SKU-007',
          description: 'Affordable quality. Perfect for everyday uniform needs.',
          shortDescription: 'Everyday essential',
          category: kidsCat?._id,
          price: 39,
          stock: 80,
          images: [
            { url: 'https://images.unsplash.com/photo-1475180098004-ca77a66827be', publicId: 'prod-7' }
          ],
          colors: [navyColor?._id, redColor?._id],
          sizes: [sizeS?._id, sizeM?._id, sizeL?._id],
          variants: [
            { color: navyColor?._id, size: sizeS?._id, stock: 25 }
          ],
          featured: true,
          status: 'active',
          weight: 0.15,
          rating: { average: 4.3, count: 22 }
        },
        {
          name: 'Lobortin Tincidunt Denis Loremousia',
          sku: 'SKU-008',
          description: 'Premium uniform shirt. Nibh semper bibid et nunc aeneque phasellus odio. Shipping: Calculate at Checkout.',
          shortDescription: 'Premium uniform shirt',
          category: menCat?._id,
          price: 35,
          comparePrice: 65,
          stock: 55,
          images: [
            { url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c', publicId: 'prod-8' }
          ],
          colors: [greenColor?._id, blueColor?._id, brownColor?._id].filter(Boolean),
          sizes: [sizeS?._id, sizeM?._id, sizeL?._id, sizeXL?._id],
          variants: [
            { color: greenColor?._id, size: sizeM?._id, stock: 15 },
            { color: blueColor?._id, size: sizeL?._id, stock: 12 }
          ],
          featured: true,
          status: 'active',
          weight: 2.08,
          rating: { average: 4.5, count: 18 }
        },
        {
          name: 'Classic Uniform Cap & Badge Set',
          sku: 'SKU-009',
          description: 'Professional cap with embroidered logo and matching badge. Perfect for corporate and service uniforms.',
          shortDescription: 'Cap and badge set',
          category: accessoriesCat?._id || menCat?._id,
          price: 24.99,
          comparePrice: 32,
          stock: 100,
          images: [
            { url: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b', publicId: 'prod-9' }
          ],
          colors: [blackColor?._id, navyColor?._id],
          sizes: [sizeS?._id, sizeM?._id, sizeL?._id],
          variants: [
            { color: blackColor?._id, size: sizeM?._id, stock: 40 },
            { color: navyColor?._id, size: sizeL?._id, stock: 35 }
          ],
          featured: true,
          status: 'active',
          weight: 0.15,
          rating: { average: 4.4, count: 28 }
        },
        {
          name: 'Women\'s Blazer & Trousers Set',
          sku: 'SKU-010',
          description: 'Elegant blazer and tailored trousers for formal workplace attire. Wrinkle-resistant fabric.',
          shortDescription: 'Formal blazer set',
          category: womenCat?._id,
          price: 129,
          comparePrice: 159,
          discount: 19,
          stock: 30,
          images: [
            { url: 'https://images.unsplash.com/photo-1595776613215-fe04b78de7d0', publicId: 'prod-10' }
          ],
          colors: [blackColor?._id, navyColor?._id, grayColor?._id],
          sizes: [sizeS?._id, sizeM?._id, sizeL?._id, sizeXL?._id],
          variants: [
            { color: blackColor?._id, size: sizeM?._id, stock: 10 },
            { color: navyColor?._id, size: sizeL?._id, stock: 8 }
          ],
          featured: true,
          status: 'active',
          weight: 0.8,
          rating: { average: 4.7, count: 16 }
        },
        {
          name: 'Kids Polo Shirt Pack (3-Pack)',
          sku: 'SKU-011',
          description: 'Comfortable cotton polo shirts for school or team wear. Available in assorted colors.',
          shortDescription: 'Kids polo 3-pack',
          category: kidsCat?._id,
          price: 44.99,
          comparePrice: 54,
          stock: 75,
          images: [
            { url: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4', publicId: 'prod-11' }
          ],
          colors: [whiteColor?._id, navyColor?._id, redColor?._id, greenColor?._id],
          sizes: [sizeS?._id, sizeM?._id, sizeL?._id],
          variants: [
            { color: whiteColor?._id, size: sizeS?._id, stock: 20 },
            { color: navyColor?._id, size: sizeM?._id, stock: 18 }
          ],
          featured: true,
          status: 'active',
          weight: 0.35,
          rating: { average: 4.6, count: 42 }
        },
        {
          name: 'Leather Belt & Tie Combo',
          sku: 'SKU-012',
          description: 'Genuine leather belt with matching tie. Essential accessories for complete uniform look.',
          shortDescription: 'Belt and tie combo',
          category: accessoriesCat?._id || menCat?._id,
          price: 49,
          comparePrice: 65,
          stock: 60,
          images: [
            { url: 'https://images.unsplash.com/photo-1624222247344-550fb60583c2', publicId: 'prod-12' }
          ],
          colors: [blackColor?._id, brownColor?._id, navyColor?._id],
          sizes: [sizeM?._id, sizeL?._id],
          variants: [
            { color: blackColor?._id, size: sizeM?._id, stock: 25 },
            { color: brownColor?._id, size: sizeL?._id, stock: 20 }
          ],
          featured: false,
          status: 'active',
          weight: 0.4,
          rating: { average: 4.5, count: 31 }
        },
        {
          name: 'Men\'s Oxford Dress Shirt',
          sku: 'SKU-013',
          description: 'Crisp Oxford cotton dress shirt. Ideal for office and formal occasions. Easy care.',
          shortDescription: 'Oxford dress shirt',
          category: menCat?._id,
          price: 59,
          comparePrice: 79,
          stock: 45,
          images: [
            { url: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10', publicId: 'prod-13' }
          ],
          colors: [whiteColor?._id, blueColor?._id, pinkColor?._id].filter(Boolean),
          sizes: [sizeS?._id, sizeM?._id, sizeL?._id, sizeXL?._id],
          variants: [
            { color: whiteColor?._id, size: sizeM?._id, stock: 15 },
            { color: whiteColor?._id, size: sizeL?._id, stock: 12 }
          ],
          featured: true,
          status: 'active',
          weight: 0.3,
          rating: { average: 4.6, count: 55 }
        },
        {
          name: 'Uniform Name Badge Holder',
          sku: 'SKU-014',
          description: 'Durable plastic badge holder with clip. Fits standard ID cards and name badges.',
          shortDescription: 'Badge holder',
          category: accessoriesCat?._id,
          price: 8.99,
          stock: 200,
          images: [
            { url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62', publicId: 'prod-14' }
          ],
          colors: [blackColor?._id, whiteColor?._id],
          sizes: [sizeM?._id],
          variants: [
            { color: blackColor?._id, size: sizeM?._id, stock: 100 }
          ],
          featured: false,
          status: 'active',
          weight: 0.02,
          rating: { average: 4.2, count: 89 }
        },
        {
          name: 'Girls\' Pleated Skirt & Blouse',
          sku: 'SKU-015',
          description: 'School uniform classic. Pleated skirt with matching short-sleeve blouse. Machine washable.',
          shortDescription: 'School skirt and blouse',
          category: kidsCat?._id,
          price: 52,
          comparePrice: 64,
          stock: 50,
          images: [
            { url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f', publicId: 'prod-15' }
          ],
          colors: [navyColor?._id, blackColor?._id, greenColor?._id],
          sizes: [sizeS?._id, sizeM?._id, sizeL?._id],
          variants: [
            { color: navyColor?._id, size: sizeS?._id, stock: 18 },
            { color: navyColor?._id, size: sizeM?._id, stock: 16 }
          ],
          featured: true,
          status: 'active',
          weight: 0.25,
          rating: { average: 4.5, count: 24 }
        },
        {
          name: 'Women\'s Cardigan Sweater',
          sku: 'SKU-016',
          description: 'Soft V-neck cardigan for layering. Perfect for office or casual uniform dress code.',
          shortDescription: 'Cardigan sweater',
          category: womenCat?._id,
          price: 67,
          comparePrice: 85,
          stock: 40,
          images: [
            { url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27', publicId: 'prod-16' }
          ],
          colors: [blackColor?._id, grayColor?._id, navyColor?._id, whiteColor?._id],
          sizes: [sizeS?._id, sizeM?._id, sizeL?._id],
          variants: [
            { color: grayColor?._id, size: sizeM?._id, stock: 14 },
            { color: blackColor?._id, size: sizeL?._id, stock: 10 }
          ],
          featured: true,
          status: 'active',
          weight: 0.4,
          rating: { average: 4.7, count: 19 }
        },
        {
          name: 'Men\'s Chino Trousers',
          sku: 'SKU-017',
          description: 'Smart casual chino trousers. Stretch fabric for comfort. Multiple inseam options.',
          shortDescription: 'Chino trousers',
          category: menCat?._id,
          price: 69,
          comparePrice: 89,
          stock: 55,
          images: [
            { url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80', publicId: 'prod-17' }
          ],
          colors: [navyColor?._id, blackColor?._id, brownColor?._id, grayColor?._id],
          sizes: [sizeS?._id, sizeM?._id, sizeL?._id, sizeXL?._id],
          variants: [
            { color: navyColor?._id, size: sizeM?._id, stock: 15 },
            { color: blackColor?._id, size: sizeL?._id, stock: 12 }
          ],
          featured: true,
          status: 'active',
          weight: 0.5,
          rating: { average: 4.4, count: 38 }
        }
    ];

    // Ensure all product refs are valid and set slug (insertMany skips pre-save hook)
    for (const p of products) {
      p.slug = slugify(p.name, { lower: true, strict: true }) + '-' + (p.sku || '').toLowerCase().replace(/\s/g, '');
      if (p.colors.some(c => !c)) {
        p.colors = p.colors.filter(Boolean);
        if (p.colors.length === 0) p.colors = [blackColor?._id];
      }
      if (p.sizes.some(s => !s)) {
        p.sizes = p.sizes.filter(Boolean);
        if (p.sizes.length === 0) p.sizes = [sizeM?._id];
      }
      if (!p.category) p.category = menCat?._id;
    }

    await Product.insertMany(products);
    console.log('✓ Products created');

    // Create banners
    const bannerCount = await Banner.countDocuments();
    if (bannerCount === 0) {
      const now = new Date();
      const startDate = new Date(now);
      const endDate = new Date(now);
      endDate.setMonth(endDate.getMonth() + 2);

      await Banner.insertMany([
        {
          title: 'Sale Upto 70% Off',
          subtitle: 'Special Offers',
          description: 'Quisquemos sodales suscipit ditaemcos condimentum de cosmo. Limited-time only.',
          image: {
            url: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da',
            publicId: 'banner-hero-1'
          },
          link: '/search',
          buttonText: 'Shop Now',
          order: 1,
          startDate,
          endDate,
          status: 'active',
          type: 'hero'
        },
        {
          title: 'Sale Upto 70% Off',
          subtitle: 'Special Offers 2',
          description: 'Quisquemos sodales suscipit ditaemcos condimentum de cosmo. Limited-time only.',
          image: {
            url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8',
            publicId: 'banner-hero-2'
          },
          link: '/search',
          buttonText: 'Shop Now',
          order: 2,
          startDate,
          endDate,
          status: 'active',
          type: 'hero'
        }
      ]);
      console.log('✓ Banners created');
    }

    // Create discounts
    const discountCount = await Discount.countDocuments();
    if (discountCount === 0) {
      const now = new Date();
      const startDate = new Date(now);
      const endDate = new Date(now);
      endDate.setFullYear(endDate.getFullYear() + 1);

      await Discount.insertMany([
        {
          code: 'SAVE10',
          title: '10% Off',
          description: 'Get 10% off on your order',
          type: 'percentage',
          value: 10,
          minPurchase: 50,
          usageLimit: 1000,
          startDate,
          endDate,
          status: 'active'
        },
        {
          code: 'SAVE20',
          title: '20% Off',
          description: 'Get 20% off on your order',
          type: 'percentage',
          value: 20,
          minPurchase: 100,
          maxDiscount: 50,
          usageLimit: 500,
          startDate,
          endDate,
          status: 'active'
        },
        {
          code: 'FLAT15',
          title: '$15 Off',
          description: 'Flat $15 off on orders over $75',
          type: 'fixed',
          value: 15,
          minPurchase: 75,
          usageLimit: 200,
          startDate,
          endDate,
          status: 'active'
        }
      ]);
      console.log('✓ Discounts created');
    }

    // Create size charts
    const sizeChartCount = await SizeChart.countDocuments();
    if (sizeChartCount === 0 && menCat && womenCat) {
      await SizeChart.insertMany([
        {
          name: 'Men T-Shirt',
          category: menCat._id,
          measurements: [
            { name: 'Chest', unit: 'inches', description: 'Measure under arms' },
            { name: 'Length', unit: 'inches', description: 'From shoulder to hem' },
            { name: 'Sleeve', unit: 'inches', description: 'From center back' }
          ],
          sizes: [
            { size: 'S', measurements: { Chest: '35-36', Length: '27', Sleeve: '32' } },
            { size: 'M', measurements: { Chest: '38-40', Length: '28', Sleeve: '33' } },
            { size: 'L', measurements: { Chest: '42-44', Length: '29', Sleeve: '34' } },
            { size: 'XL', measurements: { Chest: '46-48', Length: '30', Sleeve: '35' } }
          ],
          howToMeasure: [
            { measurement: 'Chest', instruction: 'Measure around the fullest part of chest' },
            { measurement: 'Length', instruction: 'Measure from highest point of shoulder to bottom hem' }
          ],
          status: 'active'
        },
        {
          name: 'Women Top',
          category: womenCat._id,
          measurements: [
            { name: 'Bust', unit: 'inches', description: 'Around fullest part' },
            { name: 'Waist', unit: 'inches', description: 'Natural waist' },
            { name: 'Hip', unit: 'inches', description: 'Around fullest part' }
          ],
          sizes: [
            { size: 'XS', measurements: { Bust: '32', Waist: '26', Hip: '35' } },
            { size: 'S', measurements: { Bust: '34', Waist: '28', Hip: '37' } },
            { size: 'M', measurements: { Bust: '36', Waist: '30', Hip: '39' } },
            { size: 'L', measurements: { Bust: '38', Waist: '32', Hip: '41' } }
          ],
          howToMeasure: [
            { measurement: 'Bust', instruction: 'Measure around the fullest part of bust' },
            { measurement: 'Waist', instruction: 'Measure at natural waistline' }
          ],
          status: 'active'
        }
      ]);
      console.log('✓ Size charts created');
    }

    console.log('\n✅ Database seeded successfully!');
    console.log('\nDefault Credentials:');
    console.log('Admin - Email: admin@uniformroom.com, Password: admin123');
    console.log('User - Email: user@uniformroom.com, Password: user123');
    console.log('\nDiscount codes: SAVE10 (10% off), SAVE20 (20% off), FLAT15 ($15 off)');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
