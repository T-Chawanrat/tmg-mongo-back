import MasterWarehouse from "../models/MasterWarehouse.js";

export const getMasterWarehouses = async (req, res) => {
  try {
    const {
      province,
      district,
      sub_district,
      zip_code,
      warehouse_id,
    } = req.query;

    const filter = {};

    // ใช้ชื่อไทยเป็นหลัก (ตาม data จริง)
    if (province) filter.province_name_th = province;
    if (district) filter.district_name_th = district;
    if (sub_district) filter.sub_district_name_th = sub_district;
    if (zip_code) filter.zip_code = zip_code;
    if (warehouse_id) filter.warehouse_id = warehouse_id;

    const data = await MasterWarehouse.find(filter).lean();

    res.json({
      success: true,
      count: data.length,
      data,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "server error",
    });
  }
};
