const mongoose = require("mongoose");
const { defaultStringConfig } = require("../../utils/mongoose");

const productImageSchema = new mongoose.Schema(
  {
    image_id: {
      ...defaultStringConfig,
      required: true,
    },
    product_id: {
        ...defaultStringConfig,
        required: true,
      },
    image_url: {
      ...defaultStringConfig,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("productImage", productImageSchema);
