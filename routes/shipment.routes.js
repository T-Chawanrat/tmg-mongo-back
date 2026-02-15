import express from "express";
import { createShipment , getShipments } from "../controllers/shipment.controller.js";

const router = express.Router();

router.get("/", getShipments);
router.post("/shipments", createShipment);

export default router;
