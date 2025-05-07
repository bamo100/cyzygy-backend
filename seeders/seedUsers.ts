import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import { assignRandomAvatar } from "../src/utils/helper";

// Define the IUser interface
interface IUser {
  email: string;
  firstName: string;
  lastName: string;
  password?: string;
  role: string;
  avatar?: string;
  status: 'active' | 'inactive' | 'suspended';
}

// Mongoose schema
const userSchema = new mongoose.Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String },
    role: { type: String, required: true },
    avatar: { type: String },
    status: { type: String, enum: ['active', 'inactive', 'suspended'], default: 'active' },
  },
  { timestamps: true }
);

// Model
const User = mongoose.model<IUser>('User', userSchema);

// Connect and seed
async function seedUsers() {
  const dbUrl = process.env.MONGO_URI || ''; 
    if (!dbUrl) {
        console.error('❌ MongoDB URI not provided in environment variables.');
        process.exit(1);
    } 
  try {
    await mongoose.connect(dbUrl);

    const users: IUser[] = [];

    for (let i = 0; i < 100; i++) {
      users.push({
        email: faker.internet.email(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        password: faker.internet.password(),
        role: faker.helpers.arrayElement(['admin', 'user']),
        avatar: assignRandomAvatar(),
        status: faker.helpers.arrayElement(['active', 'inactive', 'suspended']),
      });
    }

    await User.insertMany(users);
    console.log('✅ Seeded 100 users successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding users:', err);
    process.exit(1);
  }
}

seedUsers();
