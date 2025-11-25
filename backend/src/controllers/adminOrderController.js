import Order from "../models/Order.js";

// Admin: Update order status and optionally payment status
export const processOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { order_status, payment_status } = req.body;

    // Validate order exists
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Update allowed fields
    if (order_status) order.order_status = order_status;
    if (payment_status) order.payment_status = payment_status;

    await order.save();

    res.status(200).json({ message: "Order updated successfully", order });
  } catch (error) {
    console.error("Error processing order:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin: Get all orders with customer and details
import OrderDetail from "../models/OrderDetail.js";
import Product from "../models/Product.js";
import Customer from "../models/Customer.js";

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("customer_id", "username email full_name")
      .sort({ order_date: -1 })
      .lean();

    // Attach order details and product info
    const ordersWithDetails = await Promise.all(
      orders.map(async (order) => {
        const details = await OrderDetail.find({ order_id: order._id })
          .populate("product_id", "product_name author unit_price")
          .lean();
        return { ...order, order_details: details };
      })
    );

    res.status(200).json(ordersWithDetails);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Server error" });
  }
};
