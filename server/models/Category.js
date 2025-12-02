const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a category name'],
    unique: true,
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
  }
}, { timestamps: true });

// Create slug from name
CategorySchema.pre('save', function(next) {
  if (!this.isModified('name')) {
    next();
  }
  this.slug = this.name.toLowerCase().split(' ').join('-');
  next();
});

module.exports = mongoose.model('Category', CategorySchema);