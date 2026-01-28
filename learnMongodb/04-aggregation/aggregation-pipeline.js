// MongoDB Aggregation Pipeline Examples

const { MongoClient } = require('mongodb');

async function aggregationExamples() {
    const client = new MongoClient('mongodb://localhost:27017');

    try {
        await client.connect();
        const db = client.db('practiceDB');
        const orders = db.collection('orders');
        const products = db.collection('products');

        // ============================================
        // 1. Basic Aggregation - $match, $group
        // ============================================

        // Group by category and count
        const categoryCount = await products.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 },
                    avgPrice: { $avg: '$price' },
                    totalValue: { $sum: '$price' }
                }
            }
        ]).toArray();
        console.log('Category Stats:', categoryCount);

        // ============================================
        // 2. $match - Filtering (like WHERE in SQL)
        // ============================================

        const filteredAgg = await orders.aggregate([
            {
                $match: {
                    status: 'completed',
                    total: { $gte: 100 }
                }
            },
            {
                $group: {
                    _id: '$customerId',
                    totalSpent: { $sum: '$total' },
                    orderCount: { $sum: 1 }
                }
            }
        ]).toArray();

        // ============================================
        // 3. $project - Field Selection & Transformation
        // ============================================

        const projected = await products.aggregate([
            {
                $project: {
                    name: 1,
                    price: 1,
                    discountedPrice: { $multiply: ['$price', 0.9] },
                    category: { $toUpper: '$category' },
                    _id: 0
                }
            }
        ]).toArray();

        // ============================================
        // 4. $sort - Sorting
        // ============================================

        const sorted = await products.aggregate([
            { $match: { inStock: true } },
            { $sort: { price: -1, name: 1 } },  // Price desc, name asc
            { $limit: 10 }
        ]).toArray();

        // ============================================
        // 5. $limit and $skip - Pagination
        // ============================================

        const paginated = await products.aggregate([
            { $sort: { createdAt: -1 } },
            { $skip: 20 },
            { $limit: 10 }
        ]).toArray();

        // ============================================
        // 6. $unwind - Deconstruct Arrays
        // ============================================

        // Unwind tags array
        const unwoundTags = await products.aggregate([
            { $unwind: '$tags' },
            {
                $group: {
                    _id: '$tags',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]).toArray();

        // ============================================
        // 7. $lookup - JOIN Collections
        // ============================================

        const ordersWithCustomers = await orders.aggregate([
            {
                $lookup: {
                    from: 'customers',
                    localField: 'customerId',
                    foreignField: '_id',
                    as: 'customerDetails'
                }
            },
            {
                $unwind: '$customerDetails'
            },
            {
                $project: {
                    orderId: 1,
                    total: 1,
                    'customerDetails.name': 1,
                    'customerDetails.email': 1
                }
            }
        ]).toArray();

        // ============================================
        // 8. $group - Aggregation Operators
        // ============================================

        const groupStats = await orders.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    totalRevenue: { $sum: '$total' },
                    avgOrderValue: { $avg: '$total' },
                    minOrder: { $min: '$total' },
                    maxOrder: { $max: '$total' },
                    firstOrder: { $first: '$createdAt' },
                    lastOrder: { $last: '$createdAt' },
                    customers: { $addToSet: '$customerId' },  // Unique customers
                    allItems: { $push: '$items' }  // All items
                }
            }
        ]).toArray();

        // ============================================
        // 9. $addFields - Add Computed Fields
        // ============================================

        const withComputedFields = await products.aggregate([
            {
                $addFields: {
                    discount: { $multiply: ['$price', 0.1] },
                    finalPrice: {
                        $subtract: ['$price', { $multiply: ['$price', 0.1] }]
                    },
                    isExpensive: { $gt: ['$price', 500] }
                }
            }
        ]).toArray();

        // ============================================
        // 10. $bucket - Group by Range
        // ============================================

        const priceBuckets = await products.aggregate([
            {
                $bucket: {
                    groupBy: '$price',
                    boundaries: [0, 50, 100, 200, 500, 1000],
                    default: '1000+',
                    output: {
                        count: { $sum: 1 },
                        products: { $push: '$name' },
                        avgPrice: { $avg: '$price' }
                    }
                }
            }
        ]).toArray();

        // ============================================
        // 11. $facet - Multiple Aggregations
        // ============================================

        const faceted = await products.aggregate([
            {
                $facet: {
                    categoryCounts: [
                        { $group: { _id: '$category', count: { $sum: 1 } } }
                    ],
                    priceStats: [
                        {
                            $group: {
                                _id: null,
                                avg: { $avg: '$price' },
                                min: { $min: '$price' },
                                max: { $max: '$price' }
                            }
                        }
                    ],
                    topExpensive: [
                        { $sort: { price: -1 } },
                        { $limit: 5 },
                        { $project: { name: 1, price: 1 } }
                    ]
                }
            }
        ]).toArray();

        // ============================================
        // 12. $out - Write Results to Collection
        // ============================================

        await products.aggregate([
            { $match: { inStock: true } },
            {
                $group: {
                    _id: '$category',
                    products: { $push: '$$ROOT' },
                    count: { $sum: 1 }
                }
            },
            { $out: 'products_by_category' }
        ]).toArray();

        // ============================================
        // 13. Date Aggregation
        // ============================================

        const salesByMonth = await orders.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    totalSales: { $sum: '$total' },
                    orderCount: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': -1, '_id.month': -1 } }
        ]).toArray();

        // ============================================
        // 14. String Aggregation
        // ============================================

        const stringOps = await products.aggregate([
            {
                $project: {
                    name: 1,
                    upperName: { $toUpper: '$name' },
                    lowerName: { $toLower: '$name' },
                    nameLength: { $strLenCP: '$name' },
                    firstLetter: { $substr: ['$name', 0, 1] },
                    concat: {
                        $concat: ['$name', ' - ', '$category']
                    }
                }
            }
        ]).toArray();

        // ============================================
        // 15. Conditional Aggregation
        // ============================================

        const conditional = await products.aggregate([
            {
                $project: {
                    name: 1,
                    price: 1,
                    priceCategory: {
                        $switch: {
                            branches: [
                                { case: { $lt: ['$price', 50] }, then: 'Budget' },
                                { case: { $lt: ['$price', 200] }, then: 'Mid-range' },
                                { case: { $lt: ['$price', 500] }, then: 'Premium' }
                            ],
                            default: 'Luxury'
                        }
                    },
                    availability: {
                        $cond: {
                            if: '$inStock',
                            then: 'Available',
                            else: 'Out of Stock'
                        }
                    }
                }
            }
        ]).toArray();

        // ============================================
        // 16. Complex Real-world Example
        // ============================================

        // Customer Order Analysis
        const customerAnalysis = await orders.aggregate([
            // Match completed orders from last year
            {
                $match: {
                    status: 'completed',
                    createdAt: { $gte: new Date('2023-01-01') }
                }
            },
            // Join with customers
            {
                $lookup: {
                    from: 'customers',
                    localField: 'customerId',
                    foreignField: '_id',
                    as: 'customer'
                }
            },
            { $unwind: '$customer' },
            // Group by customer
            {
                $group: {
                    _id: '$customerId',
                    customerName: { $first: '$customer.name' },
                    totalOrders: { $sum: 1 },
                    totalSpent: { $sum: '$total' },
                    avgOrderValue: { $avg: '$total' },
                    firstOrder: { $min: '$createdAt' },
                    lastOrder: { $max: '$createdAt' }
                }
            },
            // Calculate customer tier
            {
                $addFields: {
                    tier: {
                        $switch: {
                            branches: [
                                { case: { $gte: ['$totalSpent', 1000] }, then: 'Gold' },
                                { case: { $gte: ['$totalSpent', 500] }, then: 'Silver' }
                            ],
                            default: 'Bronze'
                        }
                    }
                }
            },
            // Sort by total spent
            { $sort: { totalSpent: -1 } },
            // Top 100 customers
            { $limit: 100 }
        ]).toArray();

        console.log('Aggregation examples completed');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.close();
    }
}

module.exports = { aggregationExamples };

if (require.main === module) {
    aggregationExamples();
}
