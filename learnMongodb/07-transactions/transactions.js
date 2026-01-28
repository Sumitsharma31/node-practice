// MongoDB Transactions (ACID)

const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');

// ============================================
// 1. Mongoose Transactions
// ============================================

async function mongooseTransaction() {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const Account = mongoose.model('Account');

        // Deduct from sender
        await Account.updateOne(
            { username: 'alice' },
            { $inc: { balance: -100 } },
            { session }
        );

        // Add to receiver
        await Account.updateOne(
            { username: 'bob' },
            { $inc: { balance: 100 } },
            { session }
        );

        // Commit transaction
        await session.commitTransaction();
        console.log('Transaction completed successfully');
    } catch (error) {
        // Rollback on error
        await session.abortTransaction();
        console.error('Transaction failed:', error);
    } finally {
        session.endSession();
    }
}

// ============================================
// 2. Native Driver Transactions
// ============================================

async function nativeTransaction() {
    const client = new MongoClient('mongodb://localhost:27017');

    try {
        await client.connect();
        const session = client.startSession();

        await session.withTransaction(async () => {
            const db = client.db('bankDB');
            const accounts = db.collection('accounts');

            await accounts.updateOne(
                { username: 'alice' },
                { $inc: { balance: -100 } },
                { session }
            );

            await accounts.updateOne(
                { username: 'bob' },
                { $inc: { balance: 100 } },
                { session }
            );
        });

        console.log('Transaction completed');
    } finally {
        await client.close();
    }
}

// ============================================
// 3. Multi-Document Transaction Example
// ============================================

async function orderTransaction() {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const Order = mongoose.model('Order');
        const Product = mongoose.model('Product');
        const User = mongoose.model('User');

        // Create order
        const order = await Order.create([{
            userId: 'user123',
            items: [{ productId: 'prod456', quantity: 2 }],
            total: 200
        }], { session });

        // Update product inventory
        await Product.updateOne(
            { _id: 'prod456' },
            { $inc: { stock: -2 } },
            { session }
        );

        // Update user's order history
        await User.updateOne(
            { _id: 'user123' },
            { $push: { orders: order[0]._id } },
            { session }
        );

        await session.commitTransaction();
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
}

module.exports = {
    mongooseTransaction,
    nativeTransaction,
    orderTransaction
};
