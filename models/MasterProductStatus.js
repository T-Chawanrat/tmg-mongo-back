// models/MasterProductStatus.js
import mongoose from "mongoose";

const MasterProductStatusSchema = new mongoose.Schema(
  {
    status_code: { type: Number, unique: true, index: true },
    status_name: { type: String, required: true },
  },
  {
    collection: "master_product_status",
    timestamps: false,
  }
);

export default mongoose.model(
  "MasterProductStatus",
  MasterProductStatusSchema
);