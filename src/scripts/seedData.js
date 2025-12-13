const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User.model');
const Category = require('../models/Category.model');
const Color = require('../models/Color.model');
const Size = require('../models/Size.model');

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
    const categories = [
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

    for (const cat of categories) {
      const exists = await Category.findOne({ name: cat.name });
      if (!exists) {
        await Category.create(cat);
      }
    }
    console.log('✓ Categories created');

    // Create colors
    const colors = [
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

    for (const color of colors) {
      const exists = await Color.findOne({ name: color.name });
      if (!exists) {
        await Color.create(color);
      }
    }
    console.log('✓ Colors created');

    // Create sizes
    const sizes = [
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

    for (const size of sizes) {
      const exists = await Size.findOne({ name: size.name, category: size.category });
      if (!exists) {
        await Size.create(size);
      }
    }
    console.log('✓ Sizes created');

    console.log('\n✅ Database seeded successfully!');
    console.log('\nDefault Credentials:');
    console.log('Admin - Email: admin@uniformroom.com, Password: admin123');
    console.log('User - Email: user@uniformroom.com, Password: user123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
