import express from "express";
import { getMasterWarehouses } from "../controllers/masterWarehouse.controller.js";

const router = express.Router();

router.get("/master/warehouses", getMasterWarehouses);

export default router;
