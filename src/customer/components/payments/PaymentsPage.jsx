import { useEffect, useState } from "react";
import { api } from "../../../state/config/ApiConfig";

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPayments = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/api/payments/mock/me");
      setPayments(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Unable to load payment history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="mx-auto max-w-5xl px-4">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Payment History</h2>
          <button
            type="button"
            onClick={fetchPayments}
            disabled={loading}
            className="rounded border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
          >
            Refresh
          </button>
        </div>

        <div className="rounded bg-white p-5 shadow">
          {loading && <p className="text-sm text-gray-500">Loading payment history...</p>}
          {!loading && error && <p className="text-sm text-red-600">{error}</p>}
          {!loading && !error && payments.length === 0 && (
            <p className="text-sm text-gray-500">No payments found yet.</p>
          )}

          {!loading && !error && payments.length > 0 && (
            <div className="space-y-3">
              {payments.map((payment) => (
                <div key={payment.id || payment.paymentId} className="rounded border border-gray-200 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-gray-800">Payment ID: {payment.paymentId || "-"}</p>
                    <span
                      className={`rounded px-2 py-1 text-xs font-semibold ${
                        payment.status === "SUCCESS"
                          ? "bg-green-100 text-green-700"
                          : payment.status === "FAILED" || payment.status === "CANCELLED"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {payment.status || "UNKNOWN"}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">Order: {payment.order?.id || payment.orderId || "-"}</p>
                  <p className="text-sm text-gray-600">Method: {payment.paymentMethod || "-"}</p>
                  <p className="text-sm text-gray-600">
                    Amount: {payment.amount ?? 0} {payment.currency || "INR"}
                  </p>
                  <p className="text-xs text-gray-500">Date: {payment.createdAt || payment.created_at || "-"}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
