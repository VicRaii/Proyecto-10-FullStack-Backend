const mongoose = require("mongoose");

const championSchema = new mongoose.Schema(
  {
    img: { type: String, required: true },
    name: { type: String, required: true },
    role: {
      type: [String],
      required: true,
      enum: ["fighter", "assasin", "marksman", "tank", "mage", "support"],
    },
  },
  {
    timestamps: true,
    collection: "champions",
  }
);

const Champion = mongoose.model("champions", championSchema, "champions");
module.exports = Champion;
