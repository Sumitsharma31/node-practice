// MongoDB Indexing Examples

const { MongoClient } = require('mongodb');

async function indexingExamples() {
    const client = new MongoClient('mongodb://localhost:27017');

    try {
        await client.connect();
        const db = client.db('practiceDB');
        const users = db.collection('users');

        // Single Field Index
        await users.createIndex({ email: 1 });
        await users.createIndex({ createdAt: -1 });

        // Compound Index
        await users.createIndex({ lastName: 1, firstName: 1 });
        await users.createIndex({ category: 1, price: -1 });

        // Unique Index
        await users.createIndex({ email: 1 }, { unique: true });

        // Sparse Index
        await users.createIndex({ phoneNumber: 1 }, { sparse: true });

        // Text Index
        const products = db.collection('products');
        await products.createIndex({ name: 'text', description: 'text' });

        // TTL Index
        const sessions = db.collection('sessions');
        await sessions.createIndex({ createdAt: 1 }, { expireAfterSeconds: 3600 });

        // List all indexes
        const indexes = await users.indexes();
        console.log('Indexes:', indexes);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.close();
    }
}

module.exports = { indexingExamples };
