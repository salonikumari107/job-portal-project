import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import fs from 'fs'; 
import morgan from 'morgan';
import { fileURLToPath } from 'url'; 
import mongoose from 'mongoose';

// Env variables load karein
dotenv.config(); 

// Routes Imports
// Make sure ye files routes folder mein exists karti hain aur extension .js hai
import authRoutes from './routes/authRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// --- DATABASE CONNECTION ---
const connectDB = async () => {
    try {
        // saloni_23: Aapka connection string env file se aa raha hai
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB Connected Successfully!");
    } catch (error) {
        console.error("❌ MongoDB Error:", error.message);
        process.exit(1);
    }
};

connectDB(); 

// --- MIDDLEWARES ---
// --- MIDDLEWARES ---
app.use(cors({
    origin: "https://job-portal-project-1-7llf.onrender.com", // Sirf ye ek link rakhein jo console mein dikh raha hai
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // OPTIONS zaroori hai pre-flight ke liye
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser()); 

// ✅ UPLOADS FOLDER CHECK
// Agar uploads folder nahi hai toh ye automatically bana dega (taaki resume upload mein error na aaye)
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}
app.use('/uploads', express.static(uploadDir));

// --- ROUTES ---
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/jobs', jobRoutes);
app.use('/api/v1/application', applicationRoutes); 

// Global Error Handler (Extra safety)
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
});

// --- SERVER START ---


const PORT = process.env.PORT || 10000; 

// 2. Host '0.0.0.0' add karein jo Render ke liye zaroori hai
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 SERVER RUNNING ON PORT: ${PORT}`);
});