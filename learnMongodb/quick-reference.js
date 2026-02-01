// MongoDB Quick Reference Guide

// ============================================
// CONNECTION
// ============================================
const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');

// Native Driver
const client = new MongoClient('mongodb://localhost:27017');
await client.connect();
const db = client.db('dbName');
const collection = db.collection('collectionName');

// Mongoose
await mongoose.connect('mongodb://localhost:27017/dbName');

// ============================================
// CRUD OPERATIONS
// ============================================

// CREATE
await collection.insertOne({ name: 'John', age: 30 });
await collection.insertMany([{ ...}, { ...}]);

// READ
await collection.findOne({ name: 'John' });
await collection.find({ age: { $gte: 18 } }).toArray();
await collection.find().limit(10).skip(5).sort({ age: -1 }).toArray();

// UPDATE
await collection.updateOne({ name: 'John' }, { $set: { age: 31 } });
await collection.updateMany({ status: 'active' }, { $set: { verified: true } });

// DELETE
await collection.deleteOne({ name: 'John' });
await collection.deleteMany({ age: { $lt: 18 } });

// ============================================
// QUERY OPERATORS
// ============================================

// Comparison
{ age: { $gt: 30 } }          // Greater than
{ age: { $gte: 30 } }         // Greater than or equal
{ age: { $lt: 30 } }          // Less than
{ age: { $lte: 30 } }         // Less than or equal
{ age: { $ne: 30 } }          // Not equal
{ age: { $in: [20, 30, 40] } } // In array
{ age: { $nin: [20, 30] } }    // Not in array

// Logical
{ $and: [{ age: { $gte: 18 } }, { status: 'active' }] }
{ $or: [{ age: { $lt: 18 } }, { verified: false }] }
{ $nor: [{ age: { $lt: 18 } }, { verified: false }] }
{ price: { $not: { $gt: 100 } } }

// Element
{ field: { $exists: true } }
{ field: { $type: 'string' } }

// Array
{ tags: { $all: ['tag1', 'tag2'] } }
{ tags: { $size: 3 } }
{ items: { $elemMatch: { price: { $gte: 100 } } } }

// ============================================
// AGGREGATION PIPELINE
// ============================================

collection.aggregate([
    { $match: { status: 'active' } },
    { $group: { _id: '$category', total: { $sum: '$price' } } },
    { $sort: { total: -1 } },
    { $limit: 10 },
    { $project: { category: '$_id', total: 1, _id: 0 } }
]);

// ============================================
// COMMON AGGREGATION OPERATORS
// ============================================

$sum, $avg, $min, $max, $first, $last
$push, $addToSet
$concat, $substr, $toUpper, $toLower
$add, $subtract, $multiply, $divide
$year, $month, $dayOfMonth

// ============================================
// INDEXES
// ============================================

// Create
await collection.createIndex({ email: 1 });
await collection.createIndex({ lastName: 1, firstName: 1 });
await collection.createIndex({ email: 1 }, { unique: true });
await collection.createIndex({ name: 'text', description: 'text' });

// List
await collection.indexes();

// Drop
await collection.dropIndex('email_1');

// ============================================
// MONGOOSE SCHEMA
// ============================================

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true },
    age: { type: Number, min: 0, max: 120 },
    role: { type: String, enum: ['user', 'admin'] },
    profile: {
        bio: String,
        avatar: String
    }
}, { timestamps: true });

// ============================================
// UPDATE OPERATORS
// ============================================

$set        // Set field value
$inc        // Increment number
$push       // Add to array
$pull       // Remove from array
$addToSet   // Add unique to array
$pop        // Remove first/last from array
$unset      // Remove field
$rename     // Rename field
$mul        // Multiply
$currentDate // Set to current date

// Examples
{ $set: { status: 'active' } }
{ $inc: { views: 1 } }
{ $push: { tags: 'new' } }
{ $pull: { tags: 'old' } }

module.exports = {};
