const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

// Define the schema
const GuideSchema = new mongoose.Schema({
  images: mongoose.Schema.Types.Mixed
}, { strict: false });

const Guide = mongoose.models.Guide || mongoose.model('Guide', GuideSchema);

async function migrateImages() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find all guides
    const guides = await Guide.find({});
    console.log(`Found ${guides.length} guides to process`);

    let updatedCount = 0;

    for (const guide of guides) {
      if (guide.images && Array.isArray(guide.images)) {
        let needsUpdate = false;
        const updatedImages = guide.images.map(img => {
          if (typeof img === 'string') {
            needsUpdate = true;
            return { url: img, caption: '' };
          }
          return img;
        });

        if (needsUpdate) {
          guide.images = updatedImages;
          await guide.save();
          updatedCount++;
          console.log(`Updated guide ${guide.name} (${guide._id})`);
        }
      }
    }

    console.log(`Migration complete! Updated ${updatedCount} guides`);
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
migrateImages();