#!/usr/bin/env node
/**
 * Approve and activate all restaurants
 */

const mongoose = require('mongoose');
require('dotenv').config();

const Restaurant = require('../src/models/Restaurant');

const MONGO_URI = process.env.MONGO_URI;

async function approveRestaurants() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // First, approve and activate all restaurants
    const approveResult = await Restaurant.updateMany(
      {},
      {
        $set: {
          isApproved: true,
          isActive: true
        }
      }
    );

    console.log(`✅ Approved ${approveResult.modifiedCount} restaurants\n`);

    // Fix restaurants with [0, 0] coordinates
    const fixLocationResult = await Restaurant.updateMany(
      { 'location.coordinates': [0, 0] },
      {
        $set: {
          'location.coordinates': [80.8306, 27.2858] // Default to Sidhauli
        }
      }
    );

    console.log(`✅ Fixed ${fixLocationResult.modifiedCount} restaurant locations\n`);

    // Now fetch and display all restaurants
    const restaurants = await Restaurant.find({});
    
    console.log('📊 Current Restaurants:\n');
    restaurants.forEach((restaurant, index) => {
      console.log(`${index + 1}. ${restaurant.name}`);
      console.log(`   City: ${restaurant.address.city}`);
      console.log(`   Active: ${restaurant.isActive ? '✅' : '❌'}`);
      console.log(`   Approved: ${restaurant.isApproved ? '✅' : '❌'}`);
      console.log(`   Location: [${restaurant.location.coordinates[0]}, ${restaurant.location.coordinates[1]}]`);
      console.log('');
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

approveRestaurants();
