import Order from "../models/Order.js";
import OrderDetail from "../models/OrderDetail.js";
import Product from "../models/Product.js";

// Admin: Generate filtered sales report
export const generateSalesReport = async (req, res) => {
  try {
    const { startDate, endDate, product_id, category_id } = req.query;

    //Build order filter
    const orderFilter = {
      order_status: "Completed",
      payment_status: "Paid",
    };

    if (startDate || endDate) {
      orderFilter.order_date = {};
      if (startDate) orderFilter.order_date.$gte = new Date(startDate);
      if (endDate) orderFilter.order_date.$lte = new Date(endDate);
    }

    //Fetch orders
    const orders = await Order.find(orderFilter).lean();

    //Fetch order details with product info
    const reportData = await Promise.all(
      orders.map(async (order) => {
        let detailsQuery = { order_id: order._id };

        let details = await OrderDetail.find(detailsQuery)
          .populate({
            path: "product_id",
            select: "product_name author unit_price category_id",
          })
          .lean();

        // Filter by product_id if provided
        if (product_id) {
          details = details.filter(
            (item) => item.product_id._id.toString() === product_id
          );
        }

        // Filter by category_id if provided
        if (category_id) {
          details = details.filter(
            (item) =>
              item.product_id.category_id &&
              item.product_id.category_id.toString() === category_id
          );
        }

        return details.map((item) => ({
          order_id: order._id,
          order_date: order.order_date,
          product_name: item.product_id.product_name,
          author: item.product_id.author,
          category_id: item.product_id.category_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          subtotal: item.subtotal,
        }));
      })
    );

    const flattenedReport = reportData.flat();

    // Aggregate totals
    const totalRevenue = flattenedReport.reduce(
      (acc, item) => acc + item.subtotal,
      0
    );
    const totalOrders = new Set(
      flattenedReport.map((item) => item.order_id.toString())
    ).size;

    res.status(200).json({
      totalRevenue,
      totalOrders,
      sales: flattenedReport,
    });
  } catch (error) {
    console.error("Error generating filtered sales report:", error);
    res.status(500).json({ message: "Server error" });
  }
};
