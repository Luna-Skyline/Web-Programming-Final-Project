import Order from "../models/Order.js";
import OrderDetail from "../models/OrderDetail.js";
import Product from "../models/Product.js";
import Customer from "../models/Customer.js";

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

    // If order is delivered and payment method is COD, mark as paid
    if (
      order.order_status === "Delivered" &&
      order.payment_method === "cod"
    ) {
      order.payment_status = "Paid";
    }

    await order.save();

    res.status(200).json({ message: "Order updated successfully", order });
  } catch (error) {
    console.error("Error processing order:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin: Get all orders with customer and details
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

//Get order by ID with customer and details
export const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId)
      .populate("customer_id", "username email full_name")
      .lean();
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    const orderDetails = await OrderDetail.find({ order_id: orderId })
      .populate("product_id", "product_name author unit_price")
      .lean();
    res.status(200).json({ ...order, order_details: orderDetails });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin: Delete order by ID
export const deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.id;

    const deletedOrder = await Order.findByIdAndDelete(orderId);
    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    // Also delete associated order details
    await OrderDetail.deleteMany({ order_id: orderId });

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ message: "Server error" });
  }
};
