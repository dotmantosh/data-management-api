const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    sectors: [
      {
        label: {
          type: String,
        },
        value: {
          type: String,
        },
      },
    ],
    terms: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Data = mongoose.model("Data", dataSchema);
module.exports = Data;
