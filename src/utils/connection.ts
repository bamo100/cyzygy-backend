import mongoose from "mongoose";

// const MONGO_URI = process.env.MONGO_URI;  
// console.log(`MongoDB URI: ${MONGO_URI}`); // Log the MongoDB URI for debugging

export const connectDB = async (MONGO_URI: string) => {
    try {
        if (!MONGO_URI) {
            throw new Error("MONGO_URI environment variable is not defined");
        }
        const conn = await mongoose.connect(MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('MongoDB connection error:', error);
        // Retry connection after 5 seconds
        setTimeout(() => connectDB(MONGO_URI), 5000);
    }
};