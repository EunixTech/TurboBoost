const mongoose = require("mongoose");
const { defaultStringConfig } = require("../../utils/mongoose");

const productSchema = new mongoose.Schema(
  {
    product_id: {
      ...defaultStringConfig,
      required: true,
    },
    admin_graphql_api_id: {
      ...defaultStringConfig,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("product", productSchema);
