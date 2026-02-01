// MongoDB Schema Validation

const mongoose = require('mongoose');

// ============================================
// 1. Mongoose Validation
// ============================================

const userSchema = new mongoose.Schema({
    // Required field
    email: {
        type: String,
        required: [true, 'Email is required']
    },

    // String validators
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minlength: [3, 'Username must be at least 3 characters'],
        maxlength: [20, 'Username cannot exceed 20 characters'],
        match: [/^[a-zA-Z0-9]+$/, 'Username can only contain letters and numbers']
    },

    // Number validators
    age: {
        type: Number,
        min: [0, 'Age cannot be negative'],
        max: [120, 'Age seems invalid'],
        validate: {
            validator: Number.isInteger,
            message: 'Age must be an integer'
        }
    },

    // Enum values
    role: {
        type: String,
        enum: ['user', 'admin', 'moderator'],
        default: 'user'
    },

    // Custom validator
    password: {
        type: String,
        validate: {
            validator: function (v) {
                return /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/.test(v);
            },
            message: 'Password must be 8+ chars with uppercase, lowercase, and number'
        }
    }
});

// ============================================
// 2. Native MongoDB Validation
// ============================================

const productValidation = {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: ['name', 'price', 'category'],
            properties: {
                name: {
                    bsonType: 'string',
                    description: 'must be a string and is required'
                },
                price: {
                    bsonType: 'number',
                    minimum: 0,
                    description: 'must be a positive number'
                },
                category: {
                    enum: ['Electronics', 'Clothing', 'Food'],
                    description: 'must be one of the enum values'
                },
                tags: {
                    bsonType: 'array',
                    items: {
                        bsonType: 'string'
                    }
                }
            }
        }
    }
};

// Apply to collection
async function applyValidation() {
    const { MongoClient } = require('mongodb');
    const client = new MongoClient('mongodb://localhost:27017');

    await client.connect();
    const db = client.db('practiceDB');

    await db.createCollection('products', productValidation);
    await client.close();
}

module.exports = { userSchema, productValidation, applyValidation };
