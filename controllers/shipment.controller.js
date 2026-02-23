import Shipment from "../models/Shipment.js";
import DupShipment from "../models/DupShipment.js";
import MasterWarehouse from "../models/MasterWarehouse.js";
import MasterProductStatus from "../models/MasterProductStatus.js";
import QuotationAdv from "../models/QuotationAdv.js";
import { generateBillNo } from "../utils/generateBillNo.js";

// export const createShipment = async (req, res) => {
//   try {
//     const body = req.body;

//     if (!body.sendId) {
//       return res.status(400).json({ message: "sendId is required" });
//     }

//     const serialNos = body.detail?.flatMap((d) => d.serialNo || []) || [];

//     if (serialNos.length === 0) {
//       return res.status(400).json({ message: "serialNo not found" });
//     }

//     const subdistrict = body.head?.subdistrict;
//     const district = body.head?.district;
//     const province = body.head?.province;

//     const matchedWarehouse = await MasterWarehouse.findOne({
//       sub_district_name_th: subdistrict,
//       district_name_th: district,
//       province_name_th: province,
//     }).lean();

//     if (!matchedWarehouse) {
//       await DupShipment.create({
//         sendId: body.sendId,
//         payload: body,
//         serialNos,
//         reason: "invalid address",
//         status: "INVALID_ADDRESS",
//       });

//       return res.status(409).json({
//         success: false,
//         message: "ที่อยู่ไม่ถูกต้อง",
//         serialNos,
//       });
//     }

//     const existedShipment = await Shipment.findOne({
//       serialNos: { $in: serialNos },
//     }).lean();

//     const existedDup = await DupShipment.findOne({
//       serialNos: { $in: serialNos },
//       status: "DUP_SN",
//     }).lean();

//     if (existedShipment || existedDup) {
//       await DupShipment.create({
//         sendId: body.sendId,
//         payload: body,
//         serialNos,
//         reason: "serial duplicated",
//         status: "DUP_SN",
//       });

//       return res.status(409).json({
//         success: false,
//         message: "พบ serial ซ้ำ",
//         serialNos,
//       });
//     }

//     /* ----------------------------------------
//        ✅ ตรงนี้ค่อย generate bill
//     ---------------------------------------- */

//     const customerCode = "ADV0001"; // ชั่วคราว
//     const billNo = await generateBillNo(customerCode);

//     const firstDetail = body.detail[0];
//     const packageId = firstDetail.packageId;

//     const quotation = await Quotation.findOne({
//       package_id: packageId,
//     }).lean();

//     if (!quotation) {
//       return res.status(400).json({
//         success: false,
//         message: "ไม่พบ package ใน quotations",
//       });
//     }

//     const doc = await Shipment.create({
//       bill_no: billNo,
//       sendId: body.sendId,
//       payload: body,
//       serialNos,

//       sub_district_id: matchedWarehouse.sub_district_id,
//       warehouse: matchedWarehouse.warehouse_name,

//       package_name: quotation.package_name,
//       package_price: quotation.package_price,
//     });

//     res.status(201).json({
//       success: true,
//       bill_no: billNo,
//       id: doc._id,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "server error" });
//   }
// };

export const createShipment = async (req, res) => {
  try {
    const body = req.body;

    if (!body.sendId) {
      return res.status(400).json({ message: "sendId is required" });
    }

    if (!Array.isArray(body.detail) || body.detail.length === 0) {
      return res.status(400).json({ message: "detail is required" });
    }

    /* -----------------------------
       🔹 รวม serial ทั้งหมด
    ----------------------------- */
    const allSerials = body.detail.flatMap((d) => d.serialNo || []) || [];

    if (allSerials.length === 0) {
      return res.status(400).json({ message: "serialNo not found" });
    }

    // 🔹 กัน serial ซ้ำใน request เดียวกัน
    const uniqueSerials = [...new Set(allSerials)];

    if (uniqueSerials.length !== allSerials.length) {
      return res.status(400).json({
        success: false,
        message: "พบ serial ซ้ำภายใน request เดียวกัน",
      });
    }

    /* -----------------------------
       🔹 ตรวจที่อยู่
    ----------------------------- */
    const subdistrict = body.head?.subdistrict;
    const district = body.head?.district;
    const province = body.head?.province;

    const matchedWarehouse = await MasterWarehouse.findOne({
      sub_district_name_th: subdistrict,
      district_name_th: district,
      province_name_th: province,
    }).lean();

    if (!matchedWarehouse) {
      await DupShipment.create({
        sendId: body.sendId,
        payload: body,
        serialNos: allSerials,
        reason: "invalid address",
        status: "INVALID_ADDRESS",
      });

      return res.status(409).json({
        success: false,
        message: "ที่อยู่ไม่ถูกต้อง",
        serialNos: allSerials,
      });
    }

    /* -----------------------------
       🔹 เช็ค serial ซ้ำ (แก้ตรงนี้สำคัญ)
    ----------------------------- */
    const existedShipment = await Shipment.findOne({
      "packages.serialNos": { $in: allSerials },
    }).lean();

    const existedDup = await DupShipment.findOne({
      serialNos: { $in: allSerials },
      status: "DUP_SN",
    }).lean();

    if (existedShipment || existedDup) {
      await DupShipment.create({
        sendId: body.sendId,
        payload: body,
        serialNos: allSerials,
        reason: "serial duplicated",
        status: "DUP_SN",
      });

      return res.status(409).json({
        success: false,
        message: "พบ serial ซ้ำ",
        serialNos: allSerials,
      });
    }

    /* -----------------------------
       🔹 Generate Bill
    ----------------------------- */
    const customerCode = "ADV0001";
    const billNo = await generateBillNo(customerCode);

    /* -----------------------------
       🔹 ดึง quotations ทั้งหมดทีเดียว
    ----------------------------- */
    const packageIds = body.detail.map((d) => d.packageId);

    const quotations = await QuotationAdv.find({
      package_id: { $in: packageIds },
    }).lean();

    if (quotations.length !== packageIds.length) {
      return res.status(400).json({
        success: false,
        message: "มี package บางรายการไม่พบใน quotations",
      });
    }

    /* -----------------------------
       🔹 Map packages
    ----------------------------- */
    const packages = [];
    let totalPrice = 0;
    let groupId = null;
    let groupBill = null;

    for (const item of body.detail) {
      const quotation = quotations.find((q) => q.package_id === item.packageId);

      if (!quotation) {
        return res.status(400).json({
          success: false,
          message: `ไม่พบ package ${item.packageId}`,
        });
      }
      groupId = quotation.group_id;
      groupBill = quotation.group_bill;

      packages.push({
        package_id: quotation.package_id,
        package_name: quotation.package_name,
        package_price: quotation.package_price,
        serialNos: item.serialNo || [],
      });

      totalPrice += quotation.package_price * (item.serialNo?.length || 0);
    }

    const defaultStatus = await MasterProductStatus.findOne({
      status_code: 1,
    }).lean();

    if (!defaultStatus) {
      return res.status(500).json({
        success: false,
        message: "ไม่พบ master status",
      });
    }
    /* -----------------------------
       🔹 Create Shipment
    ----------------------------- */
    const doc = await Shipment.create({
      bill_no: billNo,
      sendId: body.sendId,
      payload: body,

      status_code: defaultStatus.status_code,
      status_name: defaultStatus.status_name,

      group_id: groupId,
      group_bill: groupBill,

      packages,
      total_price: totalPrice,

      sub_district_id: matchedWarehouse.sub_district_id,
      warehouse: matchedWarehouse.warehouse_name,
    });

    return res.status(201).json({
      success: true,
      bill_no: billNo,
      total_price: totalPrice,
      id: doc._id,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "server error" });
  }
};

export const getShipments = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 20;

    const skip = (page - 1) * pageSize;

    const [data, count] = await Promise.all([
      Shipment.find().sort({ createdAt: -1 }).skip(skip).limit(pageSize).lean(),
      Shipment.countDocuments(),
    ]);

    res.json({
      success: true,
      data,
      count,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "server error" });
  }
};

export const getDupShipments = async (req, res) => {
  try {
    const data = await DupShipment.find().sort({ createdAt: -1 }).lean();

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "server error" });
  }
};
