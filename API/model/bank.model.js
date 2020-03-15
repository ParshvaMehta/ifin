var mongoose = require("mongoose");

var BankSchema = new mongoose.Schema({
  name: String,
  description: String,
  type: {
    type: String,
    enum: [
      "Public Sector",
      "Private Sector",
      "Local Area",
      "Small Finance",
      "Payments",
      "Financial Institutions",
      "Regional Rural",
      "Foreign",
      "State Co-operative",
      "Urban Co-operative"
    ],
    default: "Public Sector"
  },
  created_at: { type: Date, default: Date.now },
  status: { type: Number, default: 1 },
  logo: { type: String, default: "default-logo.png" }
});

module.exports = mongoose.model("Bank", BankSchema);
