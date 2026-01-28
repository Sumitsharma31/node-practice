// MongoDB Relationship Patterns

const mongoose = require('mongoose');

// ============================================
// 1. ONE-TO-ONE Relationship
// ============================================

// Embedded Document (Recommended for 1:1)
const userProfileSchema = new mongoose.Schema({
    username: String,
    email: String,
    profile: {
        firstName: String,
        lastName: String,
        age: Number,
        bio: String
    }
});

// Referenced Document (Alternative)
const profileSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    age: Number,
    bio: String
});

const userRefSchema = new mongoose.Schema({
    username: String,
    email: String,
    profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile'
    }
});

// ============================================
// 2. ONE-TO-MANY Relationship
// ============================================

// Method 1: Embedded Documents (Good for small, bounded arrays)
const blogPostSchema = new mongoose.Schema({
    title: String,
    content: String,
    comments: [{
        user: String,
        text: String,
        createdAt: Date
    }]
});

// Method 2: Child Referencing (Parent stores child IDs)
const authorSchema = new mongoose.Schema({
    name: String,
    books: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book'
    }]
});

const bookSchema = new mongoose.Schema({
    title: String,
    isbn: String,
    publishedDate: Date
});

// Method 3: Parent Referencing (Child stores parent ID)
const postSchema = new mongoose.Schema({
    title: String,
    content: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author'
    }
});

// ============================================
// 3. MANY-TO-MANY Relationship
// ============================================

// Student-Course Example
const studentSchema = new mongoose.Schema({
    name: String,
    email: String,
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }]
});

const courseSchema = new mongoose.Schema({
    name: String,
    code: String,
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    }]
});

// ============================================
// 4. Using populate() for references
// ============================================

async function populateExamples() {
    const Author = mongoose.model('Author', authorSchema);
    const Book = mongoose.model('Book', bookSchema);

    // Simple populate
    const authorWithBooks = await Author.findOne().populate('books');

    // Populate specific fields
    const authorSelected = await Author.findOne()
        .populate('books', 'title isbn');

    // Nested populate
    const Post = mongoose.model('Post', postSchema);
    const postWithAuthorBooks = await Post.findOne()
        .populate({
            path: 'author',
            populate: { path: 'books' }
        });

    // Multiple populates
    const result = await Post.findOne()
        .populate('author')
        .populate('comments.user');
}

module.exports = {
    userProfileSchema,
    blogPostSchema,
    authorSchema,
    bookSchema,
    studentSchema,
    courseSchema
};
