import BillCounter from "../models/BillCounter.js";

export const generateBillNo = async (customerCode) => {
  const now = new Date();

  const year = now.getFullYear().toString().slice(-2); // 26
  const month = String(now.getMonth() + 1).padStart(2, "0"); // 02
  const day = String(now.getDate()).padStart(2, "0"); // 15

  const dateKey = `${year}${month}${day}`; // 260215

  const counterKey = `DO-${customerCode}-${dateKey}`;

  const counter = await BillCounter.findOneAndUpdate(
    { key: counterKey },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  const running = String(counter.seq).padStart(6, "0");

  return `DO-${customerCode}-${dateKey}-${running}`;
};
