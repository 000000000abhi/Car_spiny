const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    carType: { type: String, required: true },
    dealer: { type: String, required: true },
    company: { type: String, required: true },
    tags: { type: [String], default: [] },
    images: [
      {
        data: { type: String },  // Base64 image data, no longer required
        contentType: { type: String }  // Image MIME type, no longer required
      }
    ]
}, { timestamps: true });

module.exports = mongoose.model("Car", carSchema);
