import express from "express";
import { createShipment } from "../controllers/shipment.controller.js";

const router = express.Router();

router.post("/shipments", createShipment);

export default router;
