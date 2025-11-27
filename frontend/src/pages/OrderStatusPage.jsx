import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader, Clock, Truck, Home, AlertCircle } from "lucide-react";
import axios from "axios";
import { AuthContext } from "../components/AuthContext";
import OrderItem from "../components/OrderItem";

const OrderStatusPage = () => {
  const { orderId } = useParams();
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const palette = {
    primary: "#0F1E3D",
    accent: "#4A90E2",
    background: "#F5F7FA",
    gray: "#757575",
    white: "#FFFFFF",
  };

  const statusSteps = [
    { key: "Processing", label: "Processing", icon: Clock },
    { key: "Shipped", label: "Shipped", icon: Truck },
    { key: "Delivered", label: "Delivered", icon: Home },
  ];

  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);
      try {
        const token = authState?.token || localStorage.getItem("customerToken"); // use correct key
        if (!token) {
          setError("You must be logged in to view this order.");
          setLoading(false);
          return;
        }

        const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.get(
          `http://localhost:5000/api/orders/${orderId}`,
          { headers }
        );
        setOrder(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to fetch order details. Please try again."
        );
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) fetchOrderDetails();
  }, [orderId, authState?.token]);

  if (loading) {
    return (
      <div
        className="flex justify-center items-center h-screen"
        style={{ background: palette.background }}
      >
        <Loader
          className="animate-spin w-12 h-12"
          style={{ color: palette.primary }}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen" style={{ background: palette.background }}>
        <div className="max-w-5xl mx-auto px-4 py-12">
          <div
            className="flex gap-3 p-4 rounded-lg"
            style={{ background: "#FFE5E5", color: palette.accent }}
          >
            <AlertCircle size={20} />
            <p>{error}</p>
          </div>
          <button
            onClick={() => navigate("/order-history")}
            className="mt-6 px-6 py-3 text-white rounded-lg font-semibold"
            style={{ background: palette.primary }}
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen" style={{ background: palette.background }}>
        <div className="max-w-5xl mx-auto px-4 py-12 text-center">
          <p style={{ color: palette.gray }} className="text-lg mb-6">
            Order not found
          </p>
          <button
            onClick={() => navigate("/order-history")}
            className="px-6 py-3 text-white rounded-lg font-semibold"
            style={{ background: palette.primary }}
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  const currentStatusIndex = statusSteps.findIndex(
    (s) => s.key === order.order_status
  );
  const subtotal = order.orderDetails.reduce(
    (sum, item) => sum + item.subtotal,
    0
  );

  return (
    <div className="min-h-screen" style={{ background: palette.background }}>
      <div className="max-w-5xl mx-auto px-4 py-12">
        <h1
          className="text-4xl font-bold mb-8"
          style={{ color: palette.primary }}
        >
          Order Tracking
        </h1>

        {/* Order Header */}
        <div
          className="rounded-lg shadow-md p-6 mb-8"
          style={{ background: palette.white }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p style={{ color: palette.gray }} className="text-sm mb-1">
                Order ID
              </p>
              <p
                className="text-lg font-bold"
                style={{ color: palette.primary }}
              >
                #{order._id}
              </p>
            </div>
            <div>
              <p style={{ color: palette.gray }} className="text-sm mb-1">
                Order Date
              </p>
              <p
                className="text-lg font-bold"
                style={{ color: palette.primary }}
              >
                {new Date(order.order_date).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p style={{ color: palette.gray }} className="text-sm mb-1">
                Payment Status
              </p>
              <p
                className="text-lg font-bold"
                style={{
                  color:
                    order.payment_status === "Paid"
                      ? "#10B981"
                      : palette.accent,
                }}
              >
                {order.payment_status}
              </p>
            </div>
            <div>
              <p style={{ color: palette.gray }} className="text-sm mb-1">
                Total Amount
              </p>
              <p
                className="text-lg font-bold"
                style={{ color: palette.accent }}
              >
                ${order.total_amount?.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Status Timeline */}
        <div
          className="rounded-lg shadow-md p-6 mb-8"
          style={{ background: palette.white }}
        >
          <h2
            className="text-2xl font-bold mb-8"
            style={{ color: palette.primary }}
          >
            Order Status
          </h2>
          <div className="flex justify-between items-center mb-8">
            {statusSteps.map((step, index) => {
              const isCompleted = index <= currentStatusIndex;
              const IconComponent = step.icon;
              return (
                <div
                  key={step.key}
                  className="flex-1 flex flex-col items-center"
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-all"
                    style={{
                      background: isCompleted ? palette.accent : "#E0E0E0",
                    }}
                  >
                    <IconComponent
                      size={24}
                      color={isCompleted ? palette.white : palette.gray}
                    />
                  </div>
                  <p
                    className="text-sm font-semibold text-center"
                    style={{
                      color: isCompleted ? palette.primary : palette.gray,
                    }}
                  >
                    {step.label}
                  </p>
                  {index < statusSteps.length - 1 && (
                    <div
                      className="h-1 flex-1 mt-3"
                      style={{
                        background: isCompleted ? palette.accent : "#E0E0E0",
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
          <p
            className="text-center text-lg font-semibold"
            style={{ color: palette.primary }}
          >
            Current Status:{" "}
            <span style={{ color: palette.accent }}>{order.order_status}</span>
          </p>
        </div>

        {/* Shipping Address */}
        <div
          className="rounded-lg shadow-md p-6 mb-8"
          style={{ background: palette.white }}
        >
          <h2
            className="text-2xl font-bold mb-4"
            style={{ color: palette.primary }}
          >
            Shipping Address
          </h2>
          <p style={{ color: palette.gray }}>{order.shipping_address}</p>
        </div>

        {/* Order Items */}
        <div
          className="rounded-lg shadow-md p-6"
          style={{ background: palette.white }}
        >
          <h2
            className="text-2xl font-bold mb-6"
            style={{ color: palette.primary }}
          >
            Order Items
          </h2>
          <div className="space-y-4">
            {order.orderDetails?.map((item) => (
              <OrderItem key={item._id} item={item} />
            ))}
          </div>

          <div
            className="mt-6 pt-6 border-t"
            style={{ borderColor: "#E0E0E0" }}
          >
            <div className="flex justify-between text-lg font-bold mb-4">
              <span style={{ color: palette.primary }}>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-2xl font-bold">
              <span style={{ color: palette.primary }}>Total:</span>
              <span style={{ color: palette.accent }}>
                ${order.total_amount?.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate("/order-history")}
          className="mt-8 px-6 py-3 text-white rounded-lg font-semibold hover:opacity-90"
          style={{ background: palette.primary }}
        >
          Back to Order History
        </button>
      </div>
    </div>
  );
};

export default OrderStatusPage;
