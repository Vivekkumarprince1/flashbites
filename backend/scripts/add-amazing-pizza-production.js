#!/usr/bin/env node
/**
 * Setup Script for AMAZING PIZZA Restaurant - PRODUCTION
 * Location: Sidhauli, Sitapur, Uttar Pradesh
 * Owner: Sumit
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../src/models/User');
const Restaurant = require('../src/models/Restaurant');
const MenuItem = require('../src/models/MenuItem');

const MONGO_URI = process.env.MONGO_URI;

// Restaurant Owner Details
const OWNER_DATA = {
  name: 'Sumit',
  email: 'amazingpizza.flashbites@gmail.com',
  password: 'AmazingPizza@2026',
  phone: '8445233393', // Changed to avoid duplicate
  role: 'restaurant_owner'
};

// Restaurant Details
const RESTAURANT_DATA = {
  name: 'AMAZING PIZZA',
  description: 'Best pizzas, burgers, momos and Chinese food in Sidhauli. Fresh ingredients, amazing taste!',
  cuisines: ['Pizza', 'Fast Food', 'Chinese', 'Burger', 'Momos'],
  phone: '8445233392',
  email: 'amazingpizza.flashbites@gmail.com',
  address: {
    street: 'NH-24, Near V-Mart Basement',
    city: 'Sidhauli',
    state: 'Uttar Pradesh',
    zipCode: '261303',
    country: 'India'
  },
  location: { 
    type: 'Point', 
    coordinates: [80.8306, 27.2858] // Sidhauli, Sitapur coordinates
  },
  deliveryFee: 30,
  minOrderAmount: 199,
  deliveryTime: 40,
  isPureVeg: true,
  isActive: true,
  openingHours: {
    monday: { open: '10:00', close: '23:00' },
    tuesday: { open: '10:00', close: '23:00' },
    wednesday: { open: '10:00', close: '23:00' },
    thursday: { open: '10:00', close: '23:00' },
    friday: { open: '10:00', close: '23:00' },
    saturday: { open: '10:00', close: '23:00' },
    sunday: { open: '10:00', close: '23:00' }
  }
};

// Menu Items - Valid categories: 'Starters', 'Main Course', 'Desserts', 'Beverages', 'Breads', 'Rice', 'Snacks'
const MENU_ITEMS = [
  // PIZZA - Regular (7 inch)
  {
    name: 'Onion Pizza (7")',
    description: 'Fresh onion topping with cheese and special sauce - Regular size',
    category: 'Main Course',
    tags: ['Pizza', 'Regular', '7 inch'],
    price: 99,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800',
    isVeg: true,
    isAvailable: true,
    prepTime: 20
  },
  {
    name: 'Tomato Pizza (7")',
    description: 'Fresh tomato slices with cheese and herbs - Regular size',
    category: 'Main Course',
    tags: ['Pizza', 'Regular', '7 inch'],
    price: 99,
    image: 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=800',
    isVeg: true,
    isAvailable: true,
    prepTime: 20
  },
  {
    name: 'Capsicum Pizza (7")',
    description: 'Fresh capsicum with cheese and Italian seasonings - Regular size',
    category: 'Main Course',
    tags: ['Pizza', 'Regular', '7 inch'],
    price: 109,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800',
    isVeg: true,
    isAvailable: true,
    prepTime: 20
  },
  {
    name: 'Corn Pizza (7")',
    description: 'Sweet corn kernels with cheese - Regular size',
    category: 'Main Course',
    tags: ['Pizza', 'Regular', '7 inch'],
    price: 119,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800',
    isVeg: true,
    isAvailable: true,
    prepTime: 20
  },
  {
    name: 'Paneer Pizza (7")',
    description: 'Cottage cheese cubes with special sauce - Regular size',
    category: 'Main Course',
    tags: ['Pizza', 'Regular', '7 inch'],
    price: 129,
    image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=800',
    isVeg: true,
    isAvailable: true,
    prepTime: 22
  },
  {
    name: 'Mushroom Pizza (7")',
    description: 'Fresh mushrooms with cheese and herbs - Regular size',
    category: 'Main Course',
    tags: ['Pizza', 'Regular', '7 inch'],
    price: 139,
    image: 'https://images.unsplash.com/photo-1572448862527-d3c904757de6?w=800',
    isVeg: true,
    isAvailable: true,
    prepTime: 22
  },

  // PIZZA - Medium (9 inch)
  {
    name: 'Onion Pizza (9")',
    description: 'Fresh onion topping with cheese and special sauce - Medium size',
    category: 'Main Course',
    tags: ['Pizza', 'Medium', '9 inch'],
    price: 159,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800',
    isVeg: true,
    isAvailable: true,
    prepTime: 25
  },
  {
    name: 'Tomato Pizza (9")',
    description: 'Fresh tomato slices with cheese and herbs - Medium size',
    category: 'Main Course',
    tags: ['Pizza', 'Medium', '9 inch'],
    price: 159,
    image: 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=800',
    isVeg: true,
    isAvailable: true,
    prepTime: 25
  },
  {
    name: 'Capsicum Pizza (9")',
    description: 'Fresh capsicum with cheese and Italian seasonings - Medium size',
    category: 'Main Course',
    tags: ['Pizza', 'Medium', '9 inch'],
    price: 179,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800',
    isVeg: true,
    isAvailable: true,
    prepTime: 25
  },
  {
    name: 'Corn Pizza (9")',
    description: 'Sweet corn kernels with cheese - Medium size',
    category: 'Main Course',
    tags: ['Pizza', 'Medium', '9 inch'],
    price: 189,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800',
    isVeg: true,
    isAvailable: true,
    prepTime: 25
  },
  {
    name: 'Paneer Pizza (9")',
    description: 'Cottage cheese cubes with special sauce - Medium size',
    category: 'Main Course',
    tags: ['Pizza', 'Medium', '9 inch'],
    price: 199,
    image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=800',
    isVeg: true,
    isAvailable: true,
    prepTime: 27
  },
  {
    name: 'Mushroom Pizza (9")',
    description: 'Fresh mushrooms with cheese and herbs - Medium size',
    category: 'Main Course',
    tags: ['Pizza', 'Medium', '9 inch'],
    price: 219,
    image: 'https://images.unsplash.com/photo-1572448862527-d3c904757de6?w=800',
    isVeg: true,
    isAvailable: true,
    prepTime: 27
  },

  // PIZZA - Large (12 inch)
  {
    name: 'Onion Pizza (12")',
    description: 'Fresh onion topping with cheese and special sauce - Large size',
    category: 'Main Course',
    tags: ['Pizza', 'Large', '12 inch'],
    price: 249,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800',
    isVeg: true,
    isAvailable: true,
    prepTime: 30
  },
  {
    name: 'Tomato Pizza (12")',
    description: 'Fresh tomato slices with cheese and herbs - Large size',
    category: 'Main Course',
    tags: ['Pizza', 'Large', '12 inch'],
    price: 249,
    image: 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=800',
    isVeg: true,
    isAvailable: true,
    prepTime: 30
  },
  {
    name: 'Capsicum Pizza (12")',
    description: 'Fresh capsicum with cheese and Italian seasonings - Large size',
    category: 'Main Course',
    tags: ['Pizza', 'Large', '12 inch'],
    price: 279,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800',
    isVeg: true,
    isAvailable: true,
    prepTime: 30
  },
  {
    name: 'Corn Pizza (12")',
    description: 'Sweet corn kernels with cheese - Large size',
    category: 'Main Course',
    tags: ['Pizza', 'Large', '12 inch'],
    price: 299,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800',
    isVeg: true,
    isAvailable: true,
    prepTime: 30
  },
  {
    name: 'Paneer Pizza (12")',
    description: 'Cottage cheese cubes with special sauce - Large size',
    category: 'Main Course',
    tags: ['Pizza', 'Large', '12 inch'],
    price: 319,
    image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=800',
    isVeg: true,
    isAvailable: true,
    prepTime: 32
  },
  {
    name: 'Mushroom Pizza (12")',
    description: 'Fresh mushrooms with cheese and herbs - Large size',
    category: 'Main Course',
    tags: ['Pizza', 'Large', '12 inch'],
    price: 339,
    image: 'https://images.unsplash.com/photo-1572448862527-d3c904757de6?w=800',
    isVeg: true,
    isAvailable: true,
    prepTime: 32
  },

  // BURGER
  {
    name: 'Veg Burger',
    description: 'Classic veggie patty with fresh vegetables',
    category: 'Snacks',
    tags: ['Burger'],
    price: 49,
    image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=800',
    isVeg: true,
    isAvailable: true,
    prepTime: 15
  },
  {
    name: 'Aloo Tikki Burger',
    description: 'Crispy potato patty with special sauce',
    category: 'Snacks',
    tags: ['Burger'],
    price: 59,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800',
    isVeg: true,
    isAvailable: true,
    prepTime: 15
  },
  {
    name: 'Paneer Burger',
    description: 'Grilled paneer patty with cheese and veggies',
    category: 'Snacks',
    tags: ['Burger'],
    price: 79,
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800',
    isVeg: true,
    isAvailable: true,
    prepTime: 18
  },
  {
    name: 'Cheese Burger',
    description: 'Double cheese with veggie patty',
    category: 'Snacks',
    tags: ['Burger'],
    price: 89,
    image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=800',
    isVeg: true,
    isAvailable: true,
    prepTime: 18
  },

  // MOMOS
  {
    name: 'Veg Steamed Momos (8 pcs)',
    description: 'Steamed dumplings with vegetable filling',
    category: 'Starters',
    tags: ['Momos', 'Steamed'],
    price: 69,
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800',
    isVeg: true,
    isAvailable: true,
    prepTime: 15
  },
  {
    name: 'Paneer Steamed Momos (8 pcs)',
    description: 'Steamed momos with paneer filling',
    category: 'Starters',
    tags: ['Momos', 'Steamed'],
    price: 79,
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800',
    isVeg: true,
    isAvailable: true,
    prepTime: 15
  },
  {
    name: 'Veg Fried Momos (8 pcs)',
    description: 'Crispy fried dumplings with vegetable filling',
    category: 'Starters',
    tags: ['Momos', 'Fried'],
    price: 89,
    image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=800',
    isVeg: true,
    isAvailable: true,
    prepTime: 18
  },
  {
    name: 'Paneer Fried Momos (8 pcs)',
    description: 'Crispy fried momos with paneer filling',
    category: 'Starters',
    tags: ['Momos', 'Fried'],
    price: 99,
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800',
    isVeg: true,
    isAvailable: true,
    prepTime: 18
  },

  // CHINESE
  {
    name: 'Veg Chowmein',
    description: 'Stir-fried noodles with vegetables',
    category: 'Main Course',
    tags: ['Chinese', 'Noodles'],
    price: 79,
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800',
    isVeg: true,
    isAvailable: true,
    prepTime: 20
  },
  {
    name: 'Paneer Chowmein',
    description: 'Noodles with cottage cheese and vegetables',
    category: 'Main Course',
    tags: ['Chinese', 'Noodles'],
    price: 99,
    image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=800',
    isVeg: true,
    isAvailable: true,
    prepTime: 20
  },
  {
    name: 'Veg Fried Rice',
    description: 'Aromatic fried rice with mixed vegetables',
    category: 'Rice',
    tags: ['Chinese', 'Fried Rice'],
    price: 89,
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800',
    isVeg: true,
    isAvailable: true,
    prepTime: 20
  },
  {
    name: 'Paneer Fried Rice',
    description: 'Fried rice with paneer cubes',
    category: 'Rice',
    tags: ['Chinese', 'Fried Rice'],
    price: 109,
    image: 'https://images.unsplash.com/photo-1516684669134-de6f7c473a2a?w=800',
    isVeg: true,
    isAvailable: true,
    prepTime: 22
  },
  {
    name: 'Spring Roll (4 pcs)',
    description: 'Crispy vegetable spring rolls',
    category: 'Starters',
    tags: ['Chinese', 'Spring Roll'],
    price: 79,
    image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?w=800',
    isVeg: true,
    isAvailable: true,
    prepTime: 15
  },
  {
    name: 'Manchurian (Dry)',
    description: 'Crispy veg balls in Indo-Chinese sauce',
    category: 'Starters',
    tags: ['Chinese', 'Manchurian'],
    price: 99,
    image: 'https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=800',
    isVeg: true,
    isAvailable: true,
    prepTime: 20
  },
  {
    name: 'Manchurian (Gravy)',
    description: 'Veg balls in flavorful gravy',
    category: 'Main Course',
    tags: ['Chinese', 'Manchurian'],
    price: 119,
    image: 'https://images.unsplash.com/photo-1585937421612-70e008356f33?w=800',
    isVeg: true,
    isAvailable: true,
    prepTime: 22
  },

  // BEVERAGES
  {
    name: 'Cold Drink (250ml)',
    description: 'Chilled soft drink',
    category: 'Beverages',
    tags: ['Drink'],
    price: 20,
    image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=800',
    isVeg: true,
    isAvailable: true,
    prepTime: 2
  },
  {
    name: 'Cold Drink (500ml)',
    description: 'Chilled soft drink',
    category: 'Beverages',
    tags: ['Drink'],
    price: 30,
    image: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=800',
    isVeg: true,
    isAvailable: true,
    prepTime: 2
  },
  {
    name: 'Mineral Water',
    description: 'Packaged drinking water',
    category: 'Beverages',
    tags: ['Water'],
    price: 20,
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
    isVeg: true,
    isAvailable: true,
    prepTime: 1
  }
];

async function setupAmazingPizza() {
  try {
    console.log('🔌 Connecting to Production MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to Production MongoDB\n');

    // Step 1: Create Restaurant Owner
    console.log('👤 Creating Restaurant Owner...');
    let owner = await User.findOne({ email: OWNER_DATA.email });
    
    if (owner) {
      console.log('⚠️  Owner already exists. Using existing owner.');
    } else {
      // Check if phone exists
      const phoneExists = await User.findOne({ phone: OWNER_DATA.phone });
      if (phoneExists) {
        console.log('⚠️  Phone number already in use. Checking user...');
        owner = phoneExists;
        console.log(`   Using existing user: ${owner.email}`);
      } else {
        const hashedPassword = await bcrypt.hash(OWNER_DATA.password, 10);
        owner = await User.create({
          ...OWNER_DATA,
          password: hashedPassword
        });
        console.log('✅ Owner created successfully!');
        console.log(`   Email: ${OWNER_DATA.email}`);
        console.log(`   Password: ${OWNER_DATA.password}`);
        console.log(`   Phone: ${OWNER_DATA.phone}\n`);
      }
    }

    // Step 2: Create Restaurant
    console.log('🏪 Creating Restaurant...');
    let restaurant = await Restaurant.findOne({ 
      name: RESTAURANT_DATA.name,
      'address.city': 'Sidhauli'
    });

    if (restaurant) {
      console.log('⚠️  Restaurant already exists. Updating details...');
      restaurant = await Restaurant.findByIdAndUpdate(
        restaurant._id,
        { ...RESTAURANT_DATA, ownerId: owner._id },
        { new: true }
      );
    } else {
      restaurant = await Restaurant.create({
        ...RESTAURANT_DATA,
        ownerId: owner._id
      });
      console.log('✅ Restaurant created successfully!');
      console.log(`   Name: ${RESTAURANT_DATA.name}`);
      console.log(`   Address: ${RESTAURANT_DATA.address.street}, ${RESTAURANT_DATA.address.city}`);
      console.log(`   Min Order: ₹${RESTAURANT_DATA.minOrderAmount}\n`);
    }

    // Step 3: Create Menu Items
    console.log('🍕 Creating Menu Items...');
    let createdCount = 0;
    let skippedCount = 0;

    for (const itemData of MENU_ITEMS) {
      const existingItem = await MenuItem.findOne({
        restaurantId: restaurant._id,
        name: itemData.name
      });

      if (existingItem) {
        skippedCount++;
      } else {
        await MenuItem.create({
          ...itemData,
          restaurantId: restaurant._id
        });
        createdCount++;
      }
    }

    console.log(`✅ Menu setup complete!`);
    console.log(`   Created: ${createdCount} items`);
    console.log(`   Skipped: ${skippedCount} items (already exist)\n`);

    // Summary
    console.log('═══════════════════════════════════════════════════');
    console.log('🎉 AMAZING PIZZA Setup Complete - PRODUCTION!');
    console.log('═══════════════════════════════════════════════════');
    console.log('\n📋 Login Credentials:');
    console.log(`   Email: ${OWNER_DATA.email}`);
    console.log(`   Password: ${OWNER_DATA.password}`);
    console.log(`   Phone: ${OWNER_DATA.phone}`);
    console.log('\n🏪 Restaurant Details:');
    console.log(`   Name: ${RESTAURANT_DATA.name}`);
    console.log(`   Location: ${RESTAURANT_DATA.address.city}, ${RESTAURANT_DATA.address.state}`);
    console.log(`   Phone: ${RESTAURANT_DATA.phone}`);
    console.log(`   Min Order: ₹${RESTAURANT_DATA.minOrderAmount}`);
    console.log(`   Delivery Fee: ₹${RESTAURANT_DATA.deliveryFee}`);
    console.log(`   Pure Veg: ${RESTAURANT_DATA.isPureVeg ? 'Yes' : 'No'}`);
    console.log('\n📦 Menu Items:');
    console.log(`   Total: ${MENU_ITEMS.length} items`);
    console.log(`   Categories: Pizza, Burger, Momos, Chinese, Beverages`);
    console.log('\n✨ Restaurant is now LIVE on Production!');
    console.log('   Login at: https://flashbites-backend.up.railway.app');
    console.log('═══════════════════════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting up AMAZING PIZZA:', error);
    process.exit(1);
  }
}

// Run the setup
setupAmazingPizza();
