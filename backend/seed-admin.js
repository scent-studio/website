const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = 'mongodb+srv://scentstudio2_db_user:Ov5WkuHynL9MOAF8@cluster0.wnwfw0i.mongodb.net/scent-studio';

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, lowercase: true },
  password: String,
  role: { type: String, default: 'customer' },
  avatar: { type: String, default: '' },
  phone: { type: String, default: '' },
  isVerified: { type: Boolean, default: false },
  addresses: [],
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model('User', userSchema);

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB Atlas');

    const existing = await User.findOne({ email: 'admin@luxuryperfume.com' });
    if (existing) {
      console.log('Admin user already exists');
      await mongoose.disconnect();
      return;
    }

    const admin = await User.create({
      name: 'Admin',
      email: 'admin@luxuryperfume.com',
      password: 'Test@1234',
      role: 'admin',
      isVerified: true,
    });

    console.log('Admin created:', admin.email);
    await mongoose.disconnect();
    console.log('Done');
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

seed();
