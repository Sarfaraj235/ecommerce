export default function Success() {
  return (
    <div className="max-w-2xl mx-auto bg-white rounded shadow p-10 text-center">
      <h2 className="text-2xl font-bold text-green-600">🎉 Order Placed!</h2>
      <p className="mt-3 text-gray-600">
        Thank you for your purchase. Your order has been successfully placed.
      </p>
      <button className="mt-6 px-6 py-3 bg-purple-600 text-white rounded font-semibold hover:bg-purple-700">
        Continue Shopping
      </button>
    </div>
  );
}
