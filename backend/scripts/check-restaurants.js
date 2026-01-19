#!/usr/bin/env node
/**
 * Check all restaurants in production database
 */

const mongoose = require('mongoose');
require('dotenv').config();

const Restaurant = require('../src/models/Restaurant');
const User = require('../src/models/User');

const MONGO_URI = process.env.MONGO_URI;

async function checkRestaurants() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    const restaurants = await Restaurant.find({})
      .populate('ownerId', 'name email phone')
      .sort({ createdAt: -1 });

    console.log(`📊 Total Restaurants: ${restaurants.length}\n`);
    console.log('═══════════════════════════════════════════════════\n');

    restaurants.forEach((restaurant, index) => {
      console.log(`${index + 1}. ${restaurant.name}`);
      console.log(`   City: ${restaurant.address.city}`);
      console.log(`   Owner: ${restaurant.ownerId?.name || 'Unknown'} (${restaurant.ownerId?.email || 'N/A'})`);
      console.log(`   Status: ${restaurant.isActive ? '✅ Active' : '❌ Inactive'}`);
      console.log(`   Location: [${restaurant.location.coordinates[0]}, ${restaurant.location.coordinates[1]}]`);
      console.log(`   Created: ${restaurant.createdAt}`);
      console.log('');
    });

    console.log('═══════════════════════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkRestaurants();
