const mongoose = require('mongoose');

const claimRequestSchema = new mongoose.Schema(
  {
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      required: true
    },
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    message: {
      type: String,
      required: [true, 'Please provide details or proof of your claim'],
      trim: true,
      maxlength: [1000, 'Proof message cannot exceed 1000 characters']
    },
    status: {
      type: String,
      required: [true, 'Claim status is required'],
      enum: ['Pending', 'Accepted', 'Rejected'],
      default: 'Pending'
    }
  },
  {
    timestamps: true // Captures createdAt and updatedAt
  }
);

const ClaimRequest = mongoose.model('ClaimRequest', claimRequestSchema);

module.exports = ClaimRequest;
