const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

// Define the schema
const guideSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  // ... other fields
}, { collection: 'guides' });

const Guide = mongoose.models.Guide || mongoose.model('Guide', guideSchema);

async function resetPassword() {
  try {
    // Find Victor Galindo
    const user = await Guide.findOne({ name: 'Victor Galindo' });
    
    if (!user) {
      console.log('User Victor Galindo not found');
      process.exit(1);
    }

    console.log('Found user:', user.name, user.email);

    // Hash the new password
    const hashedPassword = await bcrypt.hash('nicolas', 12);

    // Update the password
    user.password = hashedPassword;
    await user.save();

    console.log('Password successfully updated for Victor Galindo');
    console.log('Email:', user.email);
    console.log('New password: nicolas');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

resetPassword();