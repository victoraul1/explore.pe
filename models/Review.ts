import mongoose, { Schema, model, models } from 'mongoose';

export interface IReview {
  _id?: string;
  guideId: string;
  explorerId: string;
  explorerName: string;
  rating: number;
  comment: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const ReviewSchema = new Schema<IReview>({
  guideId: { 
    type: String, 
    required: true,
    index: true 
  },
  explorerId: { 
    type: String, 
    required: true,
    index: true 
  },
  explorerName: { 
    type: String, 
    required: true 
  },
  rating: { 
    type: Number, 
    required: true,
    min: 1,
    max: 5
  },
  comment: { 
    type: String, 
    required: true,
    minlength: 10,
    maxlength: 500
  }
}, {
  timestamps: true
});

// Ensure one review per explorer per guide
ReviewSchema.index({ guideId: 1, explorerId: 1 }, { unique: true });

const Review = models.Review || model<IReview>('Review', ReviewSchema);

export default Review;