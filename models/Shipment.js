// import mongoose from "mongoose";

// const ShipmentSchema = new mongoose.Schema(
//   {
//     bill_no: {
//       type: String,
//       unique: true,
//       index: true,
//     },
//     sendId: {
//       type: String,
//       index: true,
//     },

//     payload: {
//       type: mongoose.Schema.Types.Mixed,
//       required: true,
//     },

//     serialNos: {
//       type: [String],
//       index: true,
//     },

//     // ✅ เพิ่มคอลัมน์ใหม่
//     sub_district_id: {
//       type: String, // ถ้าเป็นตัวเลข เปลี่ยนเป็น Number ได้
//       index: true,
//     },

//     warehouse: {
//       type: String,
//       index: true,
//     },

//     package_name: {
//       type: String,
//     },

//     package_price: {
//       type: Number,
//       default: 0,
//     },
//   },
//   {
//     timestamps: true,
//     collection: "shipments",
//   },
// );

// export default mongoose.model("Shipment", ShipmentSchema);

import mongoose from "mongoose";

const ShipmentSchema = new mongoose.Schema(
  {
    bill_no: {
      type: String,
      unique: true,
      index: true,
    },

    sendId: {
      type: String,
      index: true,
    },

    // ✅ เพิ่มสถานะ
    status_code: {
      type: Number,
      index: true,
      default: 1, // เช่น เริ่มต้น = รับเข้าระบบ
    },

    status_name: {
      type: String,
    },

    // ✅ เพิ่มกลุ่ม
    group_id: {
      type: Number,
      index: true,
    },

    group_bill: {
      type: String,
      index: true,
    },

    payload: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },

    packages: [
      {
        package_id: {
          type: String,
          index: true,
        },

        package_name: {
          type: String,
        },

        package_price: {
          type: Number,
          default: 0,
        },

        serialNos: {
          type: [String],
        },
      },
    ],

    total_price: {
      type: Number,
      default: 0,
    },

    sub_district_id: {
      type: String,
      index: true,
    },

    warehouse: {
      type: String,
      index: true,
    },
  },
  {
    timestamps: true,
    collection: "shipments",
  },
);

export default mongoose.model("Shipment", ShipmentSchema);
