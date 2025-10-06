import catchAsync from "../utils/catchAsync.js";
import Invoice from "./invoice.model.js";
import Address from "../address/address.model.js";

// @route POST /api/v1/invoices
// @desc Create a new invoice
// @access Private
export const createInvoice = catchAsync(async (req, res, next) => {
  const { billFrom, billTo } = req.body;

  let fromAddress = await Address.findOne(billFrom);
  if (!fromAddress) {
    fromAddress = await Address.create(billFrom);
  }

  let toAddress = await Address.findOne(billTo);
  if (!toAddress) {
    toAddress = await Address.create(billTo);
  }

  req.body.billFromAddress = fromAddress._id;
  req.body.billToAddress = toAddress._id;
  const newInvoice = await Invoice.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      invoice: newInvoice,
    },
  });
});

// @route GET /api/v1/invoices
// @desc Get all invoices
// @access Private
export const getAllInvoices = catchAsync(async (req, res, next) => {
  const invoices = await Invoice.find()
    .populate("billFromAddress")
    .populate("billToAddress");
  res.status(200).json({
    status: "success",
    data: {
      invoices,
    },
  });
});
