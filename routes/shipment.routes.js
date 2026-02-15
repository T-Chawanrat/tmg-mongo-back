import express from "express";
import { createShipment , getShipments , getDupShipments } from "../controllers/shipment.controller.js";

const router = express.Router();

router.get("/getadv", getShipments);
router.get("/dup", getDupShipments);
router.post("/shipments", createShipment)

export default router;
