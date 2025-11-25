import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  customer_id: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
  order_date: { type: Date, default: Date.now },
  order_status: {
    type: String,
    enum: ["Pending", "Processing", "Compeleted", "Delivered", "Cancelled"],
    default: "Pending",
  },
  total_amount: { type: Number, required: true }, //Decimal(12,2)
  payment_status: {
    type: String,
    enum: ["Pending", "Paid", "Failed"],
    default: "Pending",
  },
  payment_method: { type: String, maxlength: 50 },
  shipping_address: { type: String },
  updated_at: { type: Date, default: Date.now },
});
OrderSchema.pre("save", function (next) {
  this.updated_at = new Date();
  next();
});

export default mongoose.model("Order", OrderSchema);
