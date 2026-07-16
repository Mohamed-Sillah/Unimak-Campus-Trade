import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT || 5000;
export const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
export const DB_PATH = process.env.DB_PATH || "./ucampt.db";
