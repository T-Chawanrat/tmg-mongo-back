import mongoose from "mongoose";

const MasterWarehouseSchema = new mongoose.Schema(
  {
    sub_district_id: String,
    sub_district_name_th: { type: String, index: true },
    sub_district_name_en: String,

    district_id: String,
    district_name_th: { type: String, index: true },
    district_name_en: String,
    province_id: String,
    province_name_th: { type: String, index: true },
    province_name_en: String,

    zip_code: String,

    warehouse_id: { type: String, index: true },
    warehouse_code: String,
    warehouse_name: String,
  },
  {
    timestamps: false,
    collection: "master_warehouses", // 👈 สำคัญ
  },
);

export default mongoose.model("MasterWarehouse", MasterWarehouseSchema);
