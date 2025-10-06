import express from "express";
import catchAsync from "../utils/catchAsync.js";
import APIFeatures from "../utils/apiFeatures.js";
import Trip from "./invoice.model.js";

const router = express.Router();

router.get(
  "/",
  catchAsync(async (req, res) => {
    const features = new APIFeatures(Trip.find(), req.query)
      .filter()
      .search()
      .sort()
      .limitFields()
      .paginate();

    const trips = await features.query;

    res.status(200).json({
      status: "success",
      results: trips.length,
      data: {
        trips,
      },
    });
  })
);

export default router;
