// models/trip.model.js
import mongoose from "mongoose";

const tripSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "A trip must have a title"],
      trim: true,
    },
    destination: {
      type: String,
      required: [true, "A trip must have a destination"],
    },
    price: {
      type: Number,
      required: [true, "A trip must have a price"],
      min: [0, "Price must be above 0"],
    },
    durationDays: {
      type: Number,
      required: [true, "A trip must have a duration"],
    },
    rating: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
    },
    startDate: {
      type: Date,
      required: [true, "A trip must have a start date"],
    },
    endDate: {
      type: Date,
      required: [true, "A trip must have an end date"],
    },
    type: {
      type: String,
      enum: ["city", "beach", "wildlife", "adventure"],
      required: [true, "A trip must have a type"],
    },
    availableSeats: {
      type: Number,
      required: [true, "A trip must have available seats"],
      min: [1, "At least 1 seat required"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
      select: false, // hide from API responses by default
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt automatically
  }
);

const Trip = mongoose.model("Trip", tripSchema);

export default Trip;
