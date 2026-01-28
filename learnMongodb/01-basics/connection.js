
// ============================================
// 1. Native MongoDB Driver Connection
// ============================================
const { MongoClient } = require('mongodb');

// Connection URI
const uri = 'mongodb://localhost:27017';
const dbName = 'practiceDB';

// Method 1: Using MongoClient
async function connectMongoDB() {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log('✅ Connected to MongoDB');

        const db = client.db(dbName);
        const collection = db.collection('users');

        // Perform operations
        await collection.insertOne({ name: 'John', age: 30 });

    } catch (error) {
        console.error('❌ Connection error:', error);
    } finally {
        await client.close();
    }
}

