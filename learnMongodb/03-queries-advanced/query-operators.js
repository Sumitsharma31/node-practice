// Advanced MongoDB Query Operators

const { MongoClient } = require('mongodb');

async function advancedQueries() {
    const client = new MongoClient('mongodb://localhost:27017');

    try {
        await client.connect();
        const db = client.db('practiceDB');
        const products = db.collection('products');

        // ============================================
        // 1. Comparison Operators
        // ============================================

        // $eq - Equal to
        const equalQuery = await products.find({ price: { $eq: 100 } }).toArray();

        // $ne - Not equal to
        const notEqualQuery = await products.find({ category: { $ne: 'Electronics' } }).toArray();

        // $gt, $gte - Greater than, Greater than or equal
        const greaterQuery = await products.find({ price: { $gt: 50 } }).toArray();
        const gteQuery = await products.find({ price: { $gte: 50 } }).toArray();

        // $lt, $lte - Less than, Less than or equal
        const lessQuery = await products.find({ price: { $lt: 100 } }).toArray();
        const lteQuery = await products.find({ price: { $lte: 100 } }).toArray();

        // $in - Matches any value in array
        const inQuery = await products.find({
            category: { $in: ['Electronics', 'Books', 'Clothing'] }
        }).toArray();

        // $nin - Matches none of the values in array
        const ninQuery = await products.find({
            category: { $nin: ['Food', 'Toys'] }
        }).toArray();

        // ============================================
        // 2. Logical Operators
        // ============================================

        // $and - Logical AND
        const andQuery = await products.find({
            $and: [
                { price: { $gte: 50 } },
                { price: { $lte: 200 } },
                { inStock: true }
            ]
        }).toArray();

        // $or - Logical OR
        const orQuery = await products.find({
            $or: [
                { category: 'Electronics' },
                { price: { $lt: 20 } }
            ]
        }).toArray();

        // $nor - Logical NOR
        const norQuery = await products.find({
            $nor: [
                { category: 'Food' },
                { price: { $gt: 1000 } }
            ]
        }).toArray();

        // $not - Logical NOT
        const notQuery = await products.find({
            price: { $not: { $gt: 100 } }
        }).toArray();

        // ============================================
        // 3. Element Operators
        // ============================================

        // $exists - Field exists
        const existsQuery = await products.find({ discount: { $exists: true } }).toArray();

        // $type - Field is of specified type
        const typeQuery = await products.find({ price: { $type: 'number' } }).toArray();
        const typeStringQuery = await products.find({ name: { $type: 'string' } }).toArray();

        // ============================================
        // 4. Array Operators
        // ============================================

        // $all - Array contains all specified elements
        const allQuery = await products.find({
            tags: { $all: ['new', 'featured'] }
        }).toArray();

        // $elemMatch - Array element matches all conditions
        const elemMatchQuery = await products.find({
            reviews: {
                $elemMatch: {
                    rating: { $gte: 4 },
                    verified: true
                }
            }
        }).toArray();

        // $size - Array has specified size
        const sizeQuery = await products.find({
            tags: { $size: 3 }
        }).toArray();

        // ============================================
        // 5. String Operators (Using Regex)
        // ============================================

        // $regex - Pattern matching
        const regexQuery = await products.find({
            name: { $regex: /laptop/i }  // Case-insensitive
        }).toArray();

        // Starts with
        const startsWithQuery = await products.find({
            name: { $regex: /^Apple/ }
        }).toArray();

        // Ends with
        const endsWithQuery = await products.find({
            name: { $regex: /Pro$/ }
        }).toArray();

        // Contains
        const containsQuery = await products.find({
            description: { $regex: /wireless/ }
        }).toArray();

        // ============================================
        // 6. Evaluation Operators
        // ============================================

        // $expr - Compare fields within document
        const exprQuery = await products.find({
            $expr: { $gt: ['$discountPrice', '$cost'] }
        }).toArray();

        // $mod - Modulo operation
        const modQuery = await products.find({
            quantity: { $mod: [10, 0] }  // Divisible by 10
        }).toArray();

        // $text - Text search
        // First create text index: products.createIndex({ name: 'text', description: 'text' })
        const textQuery = await products.find({
            $text: { $search: 'laptop wireless' }
        }).toArray();

        // ============================================
        // 7. Complex Nested Queries
        // ============================================

        // Query nested objects
        const nestedQuery = await products.find({
            'details.weight': { $lt: 5 },
            'details.dimensions.height': { $gt: 10 }
        }).toArray();

        // Query array of objects
        const arrayObjectQuery = await products.find({
            'reviews.rating': { $gte: 4 }
        }).toArray();

        // ============================================
        // 8. Projection (Field Selection)
        // ============================================

        // Include specific fields
        const includeFields = await products.find(
            { category: 'Electronics' },
            { projection: { name: 1, price: 1, _id: 0 } }
        ).toArray();

        // Exclude specific fields
        const excludeFields = await products.find(
            {},
            { projection: { reviews: 0, internalNotes: 0 } }
        ).toArray();

        // Array slice
        const arraySlice = await products.find(
            {},
            { projection: { reviews: { $slice: 5 } } }  // First 5 reviews
        ).toArray();

        // ============================================
        // 9. Sorting, Limiting, Skipping
        // ============================================

        // Sort
        const sorted = await products.find({})
            .sort({ price: -1, name: 1 })  // Price desc, name asc
            .toArray();

        // Limit
        const limited = await products.find({})
            .limit(10)
            .toArray();

        // Skip (for pagination)
        const page = 2;
        const pageSize = 10;
        const paginated = await products.find({})
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .toArray();

        // Combined
        const combined = await products.find({ inStock: true })
            .sort({ createdAt: -1 })
            .skip(10)
            .limit(5)
            .toArray();

        // ============================================
        // 10. Distinct Values
        // ============================================

        const distinctCategories = await products.distinct('category');
        console.log('Categories:', distinctCategories);

        const distinctBrands = await products.distinct('brand', { inStock: true });
        console.log('Brands in stock:', distinctBrands);

        // ============================================
        // 11. Counting
        // ============================================

        const totalCount = await products.countDocuments({});
        const activeCount = await products.countDocuments({ inStock: true });
        const estimatedCount = await products.estimatedDocumentCount();

        console.log('Query examples executed successfully');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.close();
    }
}

// Export for use
module.exports = { advancedQueries };

// Run if executed directly
if (require.main === module) {
    advancedQueries();
}
