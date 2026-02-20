const STORAGE_KEY = "mock_payment_transactions";

const randomPart = () => Math.random().toString(36).slice(2, 10);

const buildId = (prefix) => `${prefix}_${randomPart()}${Date.now().toString(36)}`;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const saveTransaction = (transaction) => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const existing = raw ? JSON.parse(raw) : [];
    const next = [transaction, ...(Array.isArray(existing) ? existing : [])].slice(0, 20);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Ignore storage failures in demo mode.
  }
};

const statusDetails = {
  success: { status: "captured", message: "Payment captured successfully." },
  failed: { status: "failed", message: "Payment failed in test mode." },
  cancelled: { status: "cancelled", message: "Payment was cancelled by user." },
};

export const processMockPayment = async ({
  amount,
  currency = "INR",
  orderId,
  paymentMethod,
  outcome = "success",
  customer = {},
} = {}) => {
  const selectedOutcome = statusDetails[outcome] ? outcome : "success";
  const detail = statusDetails[selectedOutcome];
  const razorpayOrderId = orderId || buildId("order");
  const paymentId = buildId("pay");
  const signature = buildId("sig");

  await sleep(1200);

  const response = {
    gateway: "razorpay-mock",
    mode: "test",
    status: detail.status,
    message: detail.message,
    amount: Number(amount) || 0,
    currency,
    method: paymentMethod,
    email: customer?.email || "",
    contact: customer?.phone || "",
    razorpay_order_id: razorpayOrderId,
    razorpay_payment_id: paymentId,
    razorpay_signature: signature,
    created_at: new Date().toISOString(),
  };

  if (detail.status !== "captured") {
    response.error = {
      code: "PAYMENT_ERROR",
      description: detail.message,
      source: "gateway",
      step: "payment_authorization",
      reason: selectedOutcome,
    };
  }

  saveTransaction(response);
  return response;
};
