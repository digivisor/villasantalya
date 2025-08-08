const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    subject: { type: String },
    message: { type: String, required: true },
    status: { type: String, enum: ["pending", "read"], default: "pending" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contact", contactSchema);