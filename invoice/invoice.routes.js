import express from "express";
import { createInvoice, getAllInvoices } from "./invoice.controller.js";

const router = express.Router();

router.post("/", createInvoice);
router.get("/", getAllInvoices);

export default router;
