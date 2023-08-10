const mongoose = require("mongoose");
const { defaultStringConfig } = require("../../utils/mongoose");

const assetsCSSSchema = new mongoose.Schema(
  {
    asset_id: {
      ...defaultStringConfig,
      required: true,
    },
    key: {
      ...defaultStringConfig,
      required: true,
    },
    public_url: {
      ...defaultStringConfig,
      required: true,
    },
    content: {
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

module.exports = mongoose.model("AssetsCSSSchema", assetsCSSSchema);
