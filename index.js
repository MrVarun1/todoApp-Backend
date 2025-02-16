import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

import route from "./routes.js";

// Environment Variables
dotenv.config();
const mongoURI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

// App Config
const app = express();
app.use(express.json());
app.use(cors());
app.use(route);

const initializeDbandServer = async () => {
  try {
    await mongoose.connect(mongoURI);

    app.listen(PORT, () => console.log("Server is running on port 5000"));
  } catch (err) {
    console.error("Error connecting to database", err);
    process.exit(1);
  }
};

initializeDbandServer();
