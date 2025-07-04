import mongoose, { Schema, model, models } from 'mongoose';

export interface IGuide {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  category: string;
  location: string;
  youtubeEmbed: string;
  instagram?: string;
  lat: number;
  lng: number;
  price?: number;
  rating?: {
    stars: number;
    count: number;
  };
  active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const GuideSchema = new Schema<IGuide>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  category: { type: String, required: true, default: 'Guía turística' },
  location: { type: String, required: true },
  youtubeEmbed: { type: String, required: true },
  instagram: { type: String },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  price: { type: Number },
  rating: {
    stars: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  active: { type: Boolean, default: true }
}, {
  timestamps: true
});

const Guide = models.Guide || model<IGuide>('Guide', GuideSchema);

export default Guide;