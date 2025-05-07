import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

// Define the interface for User document
export interface IUser extends Document {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: string;
  status: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

// Create a schema for the User model
const userSchema: Schema<IUser> = new Schema(
  {
    email: { type: String, required: true, unique: true },
    firstName: { type: String, required: true},
    lastName: { type: String, required: true},
    password: { type: String },
    role: { type: String, required: true },
    avatar: { type: String },
    status: {type: String, enum: ['active', 'inactive', 'suspended'], default: 'active'},
  },
  { timestamps: true }
);

userSchema.methods.comparePassword = async function (candidate: string) {
    return bcrypt.compare(candidate, this.password);
};

// Create and export the User model
export default mongoose.model<IUser>("User", userSchema);