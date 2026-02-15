// models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    password: {
      type: String,
      required: true
    },

    first_name: String,
    last_name: String,
    address: String,
    sub_district: String,
    district: String,
    province: String,
    tel: String,
    contact_name: String,
    contact_tax_id: String,
    quotation_name: String,
    dc: String,
    warehouse: String,
 
   is_active: {
      type: Boolean,
      default: true
    },
    is_deleted: {
      type: Boolean,
      default: false
    },
    role: {
      type: String,
      enum: ["DEV","SYSADMIN", "ADMIN", "CS", "CUSTOMER", "TRUCK", "MANAGER"],
      required: true
    }
  },
    { timestamps: true }
    
);

export default mongoose.model("User", UserSchema);
