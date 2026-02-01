// Blog Application - Practical Example

const mongoose = require('mongoose');

// Author Schema
const authorSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    bio: String,
    avatar: String
}, { timestamps: true });

// Post Schema
const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, unique: true },
    content: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author' },
    tags: [String],
    published: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    comments: [{
        user: String,
        text: String,
        createdAt: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

// Generate slug before saving
postSchema.pre('save', function (next) {
    if (this.isModified('title')) {
        this.slug = this.title.toLowerCase().replace(/\s+/g, '-');
    }
    next();
});

// Indexes
postSchema.index({ title: 'text', content: 'text', tags: 'text' });
postSchema.index({ published: 1, createdAt: -1 });
postSchema.index({ author: 1 });

const Author = mongoose.model('Author', authorSchema);
const Post = mongoose.model('Post', postSchema);

// Get published posts with author
async function getPublishedPosts(page = 1, limit = 10) {
    return await Post.find({ published: true })
        .populate('author', 'name avatar')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);
}

// Search posts
async function searchPosts(query) {
    return await Post.find({
        $text: { $search: query },
        published: true
    }).select('title slug createdAt');
}

// Add comment
async function addComment(postId, user, text) {
    return await Post.findByIdAndUpdate(
        postId,
        {
            $push: {
                comments: { user, text, createdAt: new Date() }
            }
        },
        { new: true }
    );
}

// Get popular posts by views
async function getPopularPosts(limit = 5) {
    return await Post.find({ published: true })
        .sort({ views: -1 })
        .limit(limit)
        .populate('author', 'name');
}

module.exports = {
    Author,
    Post,
    getPublishedPosts,
    searchPosts,
    addComment,
    getPopularPosts
};
