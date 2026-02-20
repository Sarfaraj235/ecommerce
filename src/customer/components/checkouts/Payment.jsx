import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { api } from "../../../state/config/ApiConfig";
import { processMockPayment } from "../../../state/payment/mockGateway";

const PAYMENT_MODE = import.meta.env.VITE_PAYMENT_MODE || "test";

const normalizeCartItem = (item) => {
  const product = item?.product || {};
  const quantity = Number(item?.quantity ?? item?.qty ?? 1);
  const discountedPrice = Number(product?.discountedPrice ?? item?.discountedPrice ?? item?.price ?? 0);

  return {
    id: item?.id || item?._id || item?.cartItemId,
    title: product?.title || product?.name || item?.title || "Product",
    qty: Number.isFinite(quantity) ? quantity : 1,
    price: Number.isFinite(discountedPrice) ? discountedPrice : 0,
  };
};

export default function Payment({ setStep, orderId, address }) {
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.cart);
  const [method, setMethod] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [outcome, setOutcome] = useState("success");
  const [paymentResult, setPaymentResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const items = useMemo(
    () => (Array.isArray(cartItems) ? cartItems.map(normalizeCartItem) : []),
    [cartItems]
  );

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.qty, 0),
    [items]
  );

  const deliveryCharge = 0;
  const discount = 0;
  const total = Math.max(0, subtotal + deliveryCharge - discount);

  const handlePayment = async () => {
    if (!orderId || total <= 0 || isProcessing) return;

    setIsProcessing(true);
    setPaymentResult(null);
    setErrorMessage("");

    try {
      const response = await processMockPayment({
        amount: total,
        currency: "INR",
        orderId,
        paymentMethod: method,
        outcome,
        customer: {
          phone: address?.phone,
        },
      });

      await api.post("/api/payments/mock/record", {
        orderId: Number(orderId),
        paymentMethod: method.toUpperCase(),
        status:
          response.status === "captured"
            ? "SUCCESS"
            : response.status === "cancelled"
              ? "CANCELLED"
              : "FAILED",
        paymentId: response.razorpay_payment_id,
        amount: response.amount,
        currency: response.currency,
        gatewayOrderId: response.razorpay_order_id,
        gatewayPaymentId: response.razorpay_payment_id,
        gatewaySignature: response.razorpay_signature,
        message: response.message,
      });

      setPaymentResult(response);
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || error?.message || "Unable to process payment.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Payment Methods */}
      <div className="bg-white rounded shadow p-6">
        <h3 className="font-semibold mb-4">Payment Method</h3>
        <p className="mb-3 rounded border border-blue-100 bg-blue-50 px-3 py-2 text-xs text-blue-700">
          Gateway: Razorpay Mock ({PAYMENT_MODE})
        </p>

        {["card", "upi", "cod"].map((m) => (
          <label
            key={m}
            className={`flex items-center gap-3 p-3 border rounded mb-3 cursor-pointer
            ${method === m ? "border-purple-600 bg-purple-50" : "border-gray-300"}`}
          >
            <input
              type="radio"
              checked={method === m}
              onChange={() => setMethod(m)}
            />
            <span className="font-medium uppercase">{m}</span>
          </label>
        ))}

        <div className="mb-2 mt-4">
          <p className="mb-2 text-xs font-semibold uppercase text-gray-500">Demo Result</p>
          <div className="grid grid-cols-3 gap-2">
            {["success", "failed", "cancelled"].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setOutcome(status)}
                className={`rounded border px-2 py-1 text-xs font-medium capitalize ${
                  outcome === status
                    ? "border-purple-600 bg-purple-50 text-purple-700"
                    : "border-gray-300 text-gray-600"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {method === "card" && (
          <div className="space-y-3 mt-3">
            <input placeholder="Card Number" className="input" />
            <div className="flex gap-3">
              <input placeholder="MM/YY" className="input" />
              <input placeholder="CVV" className="input" />
            </div>
          </div>
        )}

        {method === "upi" && (
          <input placeholder="Enter UPI ID" className="input mt-3" />
        )}

        {method === "cod" && (
          <p className="mt-3 text-sm text-gray-600">
            Pay when your order is delivered.
          </p>
        )}

        <button
          onClick={handlePayment}
          disabled={!orderId || total <= 0 || isProcessing}
          className="mt-6 w-full py-3 bg-purple-600 text-white rounded font-semibold hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isProcessing ? "Processing Payment..." : "Pay Now"}
        </button>

        <button
          type="button"
          onClick={() => setStep(3)}
          className="mt-3 w-full rounded border border-gray-300 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Back to Summary
        </button>

        {!orderId && (
          <p className="mt-3 text-sm text-red-600">
            Order is not created yet. Go back and complete address/order details.
          </p>
        )}

        {errorMessage && <p className="mt-3 text-sm text-red-600">{errorMessage}</p>}

        {paymentResult && (
          <div
            className={`mt-4 rounded border px-3 py-3 text-sm ${
              paymentResult.status === "captured"
                ? "border-green-200 bg-green-50 text-green-700"
                : "border-rose-200 bg-rose-50 text-rose-700"
            }`}
          >
            <p className="font-semibold">
              {paymentResult.status === "captured" ? "Payment Successful" : "Payment Not Completed"}
            </p>
            <p className="mt-1">Order ID: {paymentResult.razorpay_order_id}</p>
            <p>Payment ID: {paymentResult.razorpay_payment_id}</p>
            {paymentResult.status === "captured" && (
              <button
                type="button"
                onClick={() => navigate("/")}
                className="mt-3 rounded bg-green-600 px-3 py-2 text-xs font-semibold text-white hover:bg-green-700"
              >
                Continue Shopping
              </button>
            )}
          </div>
        )}

      </div>

      {/* Order Total */}
      <div className="bg-white rounded shadow p-6 h-fit">
        <h3 className="font-semibold mb-3">Price Details</h3>
        <div className="flex justify-between mb-2">
          <span>Subtotal</span>
          <span>Rs {subtotal}</span>
        </div>
        <div className="flex justify-between mb-2 text-green-600">
          <span>Discount</span>
          <span>-Rs {discount}</span>
        </div>
        <div className="flex justify-between mb-3">
          <span>Delivery</span>
          <span className="text-green-600">{deliveryCharge === 0 ? "Free" : `Rs ${deliveryCharge}`}</span>
        </div>
        <hr />
        <div className="flex justify-between mt-3 font-semibold text-lg">
          <span>Total</span>
          <span>Rs {total}</span>
        </div>
      </div>
    </div>
  );
}
