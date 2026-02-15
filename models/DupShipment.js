import mongoose from "mongoose";

const DupShipmentSchema = new mongoose.Schema(
  {
    sendId: {
      type: String,
      index: true,
    },

    payload: mongoose.Schema.Types.Mixed,

    serialNos: {
      type: [String],
      index: true,
    },

    reason: String,

    // ✅ status (EN)
    status: {
      type: String,
      enum: ["DUP_SN", "INVALID_ADDRESS"],
      index: true,
    },
  },
  {
    timestamps: true,
    collection: "dup",
  },
);

export default mongoose.model("DupShipment", DupShipmentSchema);
