const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Роман', 'Детектив', 'Фантастика', 'Наука', 'Поэзия', 'Драма', 'Приключения', 'Детская', 'История', 'Философия']
  },
  year: {
    type: Number,
    required: true,
    min: 1000,
    max: new Date().getFullYear()
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  coverImage: {
    type: String,
    default: '/covers/default.jpg'
  },
  fileUrl: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    default: 0,
    min: 0
  },
  status: {
    type: String,
    enum: ['available', 'unavailable', 'rented'],
    default: 'available'
  },
  isRented: {
    type: Boolean,
    default: false
  },
  rentedBy: {
    type: String,
    default: null
  },
  rentEndDate: {
    type: Date,
    default: null
  },
  likesCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

bookSchema.index({ category: 1 });
bookSchema.index({ author: 1 });
bookSchema.index({ year: -1 });

module.exports = mongoose.model('Book', bookSchema);