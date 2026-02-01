// E-commerce Database - Practical Example

const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: String,
    address: {
        street: String,
        city: String,
        zipCode: String
    },
    cart: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: Number
    }],
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }]
}, { timestamps: true });

// Product Schema
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true, min: 0 },
    category: String,
    stock: { type: Number, default: 0 },
    images: [String],
    ratings: {
        average: { type: Number, default: 0 },
        count: { type: Number, default: 0 }
    }
}, { timestamps: true });

// Order Schema
const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: Number,
        price: Number
    }],
    total: Number,
    status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    shippingAddress: {
        street: String,
        city: String,
        zipCode: String
    }
}, { timestamps: true });

// Common Operations
const User = mongoose.model('User', userSchema);
const Product = mongoose.model('Product', productSchema);
const Order = mongoose.model('Order', orderSchema);

// Add to cart
async function addToCart(userId, productId, quantity) {
    return await User.findByIdAndUpdate(
        userId,
        {
            $push: {
                cart: { product: productId, quantity }
            }
        },
        { new: true }
    );
}

// Create order from cart
async function checkout(userId) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const user = await User.findById(userId).populate('cart.product').session(session);

        const orderItems = user.cart.map(item => ({
            product: item.product._id,
            quantity: item.quantity,
            price: item.product.price
        }));

        const total = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        const order = await Order.create([{
            user: userId,
            items: orderItems,
            total,
            shippingAddress: user.address
        }], { session });

        // Clear cart
        await User.findByIdAndUpdate(userId, { cart: [] }, { session });

        // Update stock
        for (const item of orderItems) {
            await Product.findByIdAndUpdate(
                item.product,
                { $inc: { stock: -item.quantity } },
                { session }
            );
        }

        await session.commitTransaction();
        return order[0];
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
}

module.exports = { User, Product, Order, addToCart, checkout };
