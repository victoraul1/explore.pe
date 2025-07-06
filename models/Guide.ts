import mongoose, { Schema, model, models } from 'mongoose';

export interface IGuide {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  whatsapp?: string;
  category: string;
  location: string;
  youtubeEmbed: string;
  instagram?: string;
  facebook?: string;
  services?: string;
  images?: string[];
  lat: number;
  lng: number;
  price?: number;
  rating?: {
    stars: number;
    count: number;
  };
  active?: boolean;
  emailVerified?: boolean;
  verificationToken?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  role?: 'guide' | 'admin';
  userType?: 'guide' | 'explorer';
  createdAt?: Date;
  updatedAt?: Date;
}

const GuideSchema = new Schema<IGuide>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  phone: { type: String, required: function() { return this.userType === 'guide'; } },
  whatsapp: { type: String },
  category: { type: String, required: true, default: 'Guía turística' },
  location: { type: String, required: true },
  youtubeEmbed: { type: String, required: true },
  instagram: { type: String },
  facebook: { type: String },
  services: { type: String },
  images: [{ type: String }],
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  price: { type: Number },
  rating: {
    stars: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  active: { type: Boolean, default: true },
  emailVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
  passwordResetToken: { type: String },
  passwordResetExpires: { type: Date },
  role: { type: String, enum: ['guide', 'admin'], default: 'guide' },
  userType: { type: String, enum: ['guide', 'explorer'], default: 'guide' }
}, {
  timestamps: true
});

const Guide = models.Guide || model<IGuide>('Guide', GuideSchema);

export default Guide;