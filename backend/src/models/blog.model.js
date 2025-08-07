    const mongoose = require('mongoose');

    const BlogSchema = new mongoose.Schema({
    title:        { type: String, required: true },
    excerpt:      { type: String, required: true },
    content:      { type: String, required: true },
    date:         { type: Date,   default: Date.now },
    author:       { type: String, required: true },
    image:        { type: String, required: true },
    tags:         [{ type: String }],
    category:     { type: String, required: true },
    isActive:     { type: Boolean, default: true },
    views:        { type: Number, default: 0 },
    slug:         { type: String, required: true, unique: true },
    }, { timestamps: true });

    module.exports = mongoose.model('Blog', BlogSchema);