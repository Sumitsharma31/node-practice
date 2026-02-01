
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

// ============================================
// 2. Mongoose Connection
// ============================================
const mongoose = require('mongoose');

async function connectMongoose() {
  try {
    await mongoose.connect('mongodb://localhost:27017/practiceDB');
    console.log('✅ Mongoose connected');
  } catch (error) {
    console.error('❌ Mongoose connection error:', error);
  }
}

// Connection events
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to DB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

// ============================================
// 3. MongoDB Atlas Connection (Cloud)
// ============================================
const atlasUri = 'mongodb+srv://username:password@cluster.mongodb.net/myDatabase?retryWrites=true&w=majority';

async function connectAtlas() {
  try {
    await mongoose.connect(atlasUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB Atlas');
  } catch (error) {
    console.error('❌ Atlas connection error:', error);
  }
}

// ============================================
// 4. Connection Pool Configuration
// ============================================
const poolClient = new MongoClient(uri, {
  maxPoolSize: 10,
  minPoolSize: 5,
  maxIdleTimeMS: 30000,
  serverSelectionTimeoutMS: 5000,
});

// ============================================
// 5. Best Practices
// ============================================

// Reusable connection module
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

  const client = await MongoClient.connect(uri);
  const db = client.db(dbName);

  cachedDb = db;
  return db;
}

// Export for use in other files
module.exports = {
  connectMongoDB,
  connectMongoose,
  connectToDatabase,
};
