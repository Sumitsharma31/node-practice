// Complete CRUD Operations in MongoDB

const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

async function runCRUD() {
    try {
        await client.connect();
        const db = client.db('practiceDB');
        const users = db.collection('users');

        // ============================================
        // CREATE (Insert) Operations
        // ============================================

        // Insert One Document
        const insertOneResult = await users.insertOne({
            name: 'Alice',
            age: 25,
            email: 'alice@example.com',
            status: 'active',
            createdAt: new Date()
        });
        console.log('Insert One:', insertOneResult.insertedId);

        // Insert Many Documents
        const insertManyResult = await users.insertMany([
            { name: 'Bob', age: 30, email: 'bob@example.com', status: 'active' },
            { name: 'Charlie', age: 35, email: 'charlie@example.com', status: 'inactive' },
            { name: 'David', age: 28, email: 'david@example.com', status: 'active' }
        ]);
        console.log('Insert Many:', insertManyResult.insertedCount);

        // ============================================
        // READ (Find) Operations
        // ============================================

        // Find One Document
        const user = await users.findOne({ name: 'Alice' });
        console.log('Find One:', user);

        // Find All Documents
        const allUsers = await users.find({}).toArray();
        console.log('Find All:', allUsers.length, 'users');

        // Find with Query Filter
        const activeUsers = await users.find({ status: 'active' }).toArray();
        console.log('Active Users:', activeUsers.length);

        // Find with Projection (select specific fields)
        const namesOnly = await users.find({}, {
            projection: { name: 1, email: 1, _id: 0 }
        }).toArray();
        console.log('Names Only:', namesOnly);

        // Find with Limit, Skip, Sort
        const paginatedUsers = await users.find({})
            .sort({ age: -1 })  // Sort by age descending
            .skip(1)            // Skip first document
            .limit(2)           // Limit to 2 documents
            .toArray();
        console.log('Paginated:', paginatedUsers);

        // Count Documents
        const userCount = await users.countDocuments({ status: 'active' });
        console.log('Active user count:', userCount);

        // ============================================
        // UPDATE Operations
        // ============================================

        // Update One Document
        const updateOneResult = await users.updateOne(
            { name: 'Alice' },
            {
                $set: { age: 26, updatedAt: new Date() },
                $inc: { loginCount: 1 }
            }
        );
        console.log('Update One:', updateOneResult.modifiedCount);

        // Update Many Documents
        const updateManyResult = await users.updateMany(
            { status: 'active' },
            {
                $set: { verified: true },
                $currentDate: { lastModified: true }
            }
        );
        console.log('Update Many:', updateManyResult.modifiedCount);

        // Replace One Document
        const replaceResult = await users.replaceOne(
            { name: 'Charlie' },
            {
                name: 'Charlie Brown',
                age: 36,
                email: 'charlie.brown@example.com',
                status: 'active'
            }
        );
        console.log('Replace One:', replaceResult.modifiedCount);

        // Find and Update (returns the document)
        const updatedUser = await users.findOneAndUpdate(
            { name: 'Bob' },
            { $set: { age: 31 } },
            { returnDocument: 'after' }  // Return updated document
        );
        console.log('Find and Update:', updatedUser);

        // ============================================
        // DELETE Operations
        // ============================================

        // Delete One Document
        const deleteOneResult = await users.deleteOne({ name: 'David' });
        console.log('Delete One:', deleteOneResult.deletedCount);

        // Delete Many Documents
        const deleteManyResult = await users.deleteMany({ status: 'inactive' });
        console.log('Delete Many:', deleteManyResult.deletedCount);

        // Find and Delete (returns the deleted document)
        const deletedUser = await users.findOneAndDelete({ age: { $lt: 25 } });
        console.log('Find and Delete:', deletedUser);

        // ============================================
        // Bulk Write Operations
        // ============================================

        const bulkResult = await users.bulkWrite([
            {
                insertOne: {
                    document: { name: 'Eve', age: 22, status: 'active' }
                }
            },
            {
                updateOne: {
                    filter: { name: 'Alice' },
                    update: { $set: { premium: true } }
                }
            },
            {
                deleteOne: {
                    filter: { age: { $gt: 40 } }
                }
            }
        ]);
        console.log('Bulk Write:', bulkResult);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.close();
    }
}

// Run the CRUD operations
runCRUD();

// ============================================
// Export for use in other files
// ============================================
module.exports = { runCRUD };
