// models/Quotation.js
import mongoose from "mongoose";

const QuotationSchema = new mongoose.Schema(
  {
    group_id: { type: Number, index: true },
    group_bill: { type: String, index: true },

    width: Number,
    length: Number,
    height: Number,
    weight: Number,
    w_l_h: Number,

    package_code: String,
    package_id: { type: Number, index: true },
    package_name: String,
    package_price: Number,
  },
  {
    collection: "quotations_adv",
    timestamps: false,
  },
);

export default mongoose.model("QuotationAdv", QuotationSchema);
