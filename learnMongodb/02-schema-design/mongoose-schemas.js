// Mongoose Schema Design Examples

const mongoose = require('mongoose');

// ============================================
// 1. Basic Schema
// ============================================
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    age: Number,
    isActive: Boolean,
    createdAt: Date
});

const User = mongoose.model('User', userSchema);

// ============================================
// 2. Schema with Validation
// ============================================
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
        minlength: [3, 'Name must be at least 3 characters'],
        maxlength: [100, 'Name cannot exceed 100 characters']
    },
    price: {
        type: Number,
        required: true,
        min: [0, 'Price cannot be negative'],
        validate: {
            validator: function (v) {
                return v > 0;
            },
            message: 'Price must be greater than 0'
        }
    },
    category: {
        type: String,
        enum: ['Electronics', 'Clothing', 'Food', 'Books'],
        required: true
    },
    inStock: {
        type: Boolean,
        default: true
    },
    tags: [String],
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    }
}, {
    timestamps: true  // Adds createdAt and updatedAt automatically
});

const Product = mongoose.model('Product', productSchema);

// ============================================
// 3. Nested Schema (Embedded Documents)
// ============================================
const addressSchema = new mongoose.Schema({
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: { type: String, default: 'USA' }
});

const customerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    address: addressSchema,  // Embedded document
    shippingAddresses: [addressSchema],  // Array of embedded documents
    phone: {
        countryCode: String,
        number: String
    }
});

const Customer = mongoose.model('Customer', customerSchema);

// ============================================
// 4. Schema with Methods
// ============================================
const accountSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    balance: { type: Number, default: 0 }
});

// Instance method
accountSchema.methods.deposit = function (amount) {
    this.balance += amount;
    return this.save();
};

accountSchema.methods.withdraw = function (amount) {
    if (this.balance >= amount) {
        this.balance -= amount;
        return this.save();
    }
    throw new Error('Insufficient balance');
};

// Static method
accountSchema.statics.findByUsername = function (username) {
    return this.findOne({ username });
};

const Account = mongoose.model('Account', accountSchema);

// ============================================
// 5. Schema with Virtual Properties
// ============================================
const personSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    birthDate: Date
});

// Virtual property (not stored in DB)
personSchema.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`;
});

personSchema.virtual('age').get(function () {
    if (!this.birthDate) return null;
    const today = new Date();
    const birth = new Date(this.birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
});

// Include virtuals in JSON output
personSchema.set('toJSON', { virtuals: true });
personSchema.set('toObject', { virtuals: true });

const Person = mongoose.model('Person', personSchema);

// ============================================
// 6. Schema with Middleware (Hooks)
// ============================================
const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: String,
    slug: String,
    author: String,
    views: { type: Number, default: 0 },
    published: { type: Boolean, default: false }
}, { timestamps: true });

// Pre-save middleware
postSchema.pre('save', function (next) {
    // Generate slug from title
    if (this.isModified('title')) {
        this.slug = this.title.toLowerCase().replace(/\s+/g, '-');
    }
    next();
});

// Post-save middleware
postSchema.post('save', function (doc) {
    console.log(`Post saved: ${doc.title}`);
});

// Pre-remove middleware
postSchema.pre('remove', function (next) {
    console.log('Deleting post:', this.title);
    next();
});

const Post = mongoose.model('Post', postSchema);

// ============================================
// 7. Schema with References (Population)
// ============================================
const authorSchema = new mongoose.Schema({
    name: String,
    email: String,
    bio: String
});

const Author = mongoose.model('Author', authorSchema);

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    isbn: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author',  // Reference to Author model
        required: true
    },
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }],
    publishedDate: Date,
    pages: Number
});

const Book = mongoose.model('Book', bookSchema);

// ============================================
// 8. Discriminators (Inheritance)
// ============================================
const eventSchema = new mongoose.Schema({
    title: String,
    date: Date
}, { discriminatorKey: 'kind', timestamps: true });

const Event = mongoose.model('Event', eventSchema);

// Conference inherits from Event
const conferenceSchema = new mongoose.Schema({
    location: String,
    attendees: Number
});

const Conference = Event.discriminator('Conference', conferenceSchema);

// Webinar inherits from Event
const webinarSchema = new mongoose.Schema({
    url: String,
    platform: String
});

const Webinar = Event.discriminator('Webinar', webinarSchema);

// ============================================
// 9. Schema with Indexes
// ============================================
const articleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: String,
    author: String,
    tags: [String],
    publishedAt: Date
});

// Single field index
articleSchema.index({ author: 1 });

// Compound index
articleSchema.index({ author: 1, publishedAt: -1 });

// Text index for search
articleSchema.index({ title: 'text', content: 'text' });

// Unique index
articleSchema.index({ title: 1 }, { unique: true });

const Article = mongoose.model('Article', articleSchema);

// ============================================
// Export all models
// ============================================
module.exports = {
    User,
    Product,
    Customer,
    Account,
    Person,
    Post,
    Author,
    Book,
    Event,
    Conference,
    Webinar,
    Article
};
