const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide an item title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Please provide an item description'],
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    category: {
      type: String,
      required: [true, 'Please provide a category'],
      trim: true
    },
    type: {
      type: String,
      required: [true, 'Please specify the item type (Lost or Found)'],
      enum: ['Lost', 'Found'],
      default: 'Lost'
    },
    status: {
      type: String,
      required: [true, 'Please specify the item status'],
      enum: ['Lost', 'Found', 'Claimed', 'Resolved'],
      default: 'Lost'
    },
    location: {
      type: String,
      required: [true, 'Please provide the location'],
      trim: true
    },
    date: {
      type: Date,
      required: [true, 'Please provide the date of the event']
    },
    imageUrl: {
      type: String,
      default: ''
    },
    contactPreference: {
      type: String,
      required: [true, 'Please provide a contact preference (e.g., email, phone)'],
      trim: true
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true // Automatically handles createdAt and updatedAt
  }
);

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
