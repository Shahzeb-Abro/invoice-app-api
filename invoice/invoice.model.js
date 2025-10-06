import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema({
  invoiceId: { type: String, required: true, unique: true },
  billFromAddress: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
    required: true,
  },
  billToAddress: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
    required: true,
  },
  clientName: { type: String, required: true },
  clientEmail: { type: String, required: true },
  invoiceDate: { type: Date, required: true },
  paymentTerms: { type: String, required: true },
  projectDescription: { type: String, required: true },
  items: [
    {
      description: { type: String, required: true },
      quantity: { type: Number, required: true },
      unitPrice: { type: Number, required: true },
      total: { type: Number, required: true },
    },
  ],
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ["draft", "pending", "paid"],
    default: "draft",
  },
});

const Invoice = mongoose.model("Invoice", invoiceSchema);
export default Invoice;
