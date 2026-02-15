import fs from "fs";
import https from "https";
import morgan from "morgan";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { connectMongo } from "./config/mongo.js";

import masterWarehouseRoutes from "./routes/masterWarehouse.routes.js";
import shipmentRoutes from "./routes/shipment.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(morgan("dev"));
dotenv.config({
  path: path.join(__dirname, ".env"),
});
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/labels", express.static(path.join(__dirname, "labels")));

app.use("/", shipmentRoutes);
app.use("/", masterWarehouseRoutes);

app.get("/test", (req, res) => {
  res.send("Backend is working!");
});

const PORT = process.env.PORT || 8010;

await connectMongo();

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
