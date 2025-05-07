import * as React from "react";
import { formatPrice } from "@/lib/utils";

interface OrderConfirmationEmailTemplateProps {
  orderId: string;
  userEmail: string;
  orderTotal: number;
  orderItems: {
    _id: string;
    name: string;
    color: string;
    size: string;
    price: number;
    quantity: number;
    imageUrl: string;
  }[];
}

export const OrderConfirmationEmailTemplate: React.FC<
  Readonly<OrderConfirmationEmailTemplateProps>
> = ({ orderId, userEmail, orderTotal, orderItems }) => (
  <div
    style={{
      fontFamily: "Arial, sans-serif",
      color: "#333",
      lineHeight: "1.6",
      padding: "20px",
      maxWidth: "600px",
      margin: "0 auto",
      border: "1px solid #ddd",
      borderRadius: "8px",
      backgroundColor: "#f9f9f9",
    }}
  >
    {/* Header */}
    <header style={{ textAlign: "center", marginBottom: "20px" }}>
      <h1 style={{ color: "#007bff", fontSize: "24px", margin: "0" }}>
        Thank You for Your Order!
      </h1>
    </header>

    {/* Greeting & Confirmation */}
    <main>
      <p style={{ fontSize: "16px" }}>Hi there,</p>
      <p style={{ fontSize: "16px" }}>
        Your order has been placed successfully. We will send the shipping
        details shortly.
      </p>
      <p style={{ fontSize: "16px" }}>Here's a summary of your order.</p>

      {/* Order Details */}
      <div
        style={{
          backgroundColor: "#fff",
          padding: "15px",
          borderRadius: "8px",
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          marginTop: "20px",
        }}
      >
        <p
          style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "10px" }}
        >
          Order No: {orderId}
        </p>

        {/* Order Items */}
        {orderItems.map((item) => (
          <div
            key={item._id}
            style={{
              display: "flex",
              alignItems: "center",
              borderBottom: "1px solid #ddd",
              paddingBottom: "10px",
              marginBottom: "10px",
            }}
          >
            <img
              src={item.imageUrl}
              alt={item.name}
              style={{
                width: "50px",
                height: "50px",
                objectFit: "cover",
                borderRadius: "5px",
                marginRight: "10px",
              }}
            />
            <div>
              <p style={{ fontSize: "14px", fontWeight: "bold" }}>
                {item.name}
              </p>
              <p style={{ fontSize: "14px", color: "#666" }}>
                {item.color} | {item.size}
              </p>
              <p style={{ fontSize: "14px", color: "#333" }}>
                Qty: {item.quantity} | {formatPrice(item.price * item.quantity)}
              </p>
            </div>
          </div>
        ))}

        {/* Total Amount */}
        <p
          style={{
            fontSize: "16px",
            fontWeight: "bold",
            marginTop: "15px",
            textAlign: "right",
          }}
        >
          Total: {formatPrice(orderTotal)}
        </p>
      </div>
    </main>

    {/* Footer */}
    <footer
      style={{
        marginTop: "20px",
        textAlign: "center",
        fontSize: "14px",
        color: "#666",
      }}
    >
      <p>&copy; {new Date().getFullYear()} Lush. All rights reserved.</p>
    </footer>
  </div>
);
