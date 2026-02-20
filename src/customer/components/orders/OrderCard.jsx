import { useNavigate } from "react-router-dom";

export default function OrderCard({ order }) {
  const navigate = useNavigate();

  // Navigate to order details page
  const goToOrderDetails = () => {
    navigate(`/account/order/${order.id}`);
  };

  return (
    <div
      onClick={goToOrderDetails}
      className="bg-white rounded-xl shadow hover:shadow-lg transition p-4 flex flex-col sm:flex-row gap-4 cursor-pointer"
    >
      {/* ================= PRODUCT IMAGE ================= */}
      <img
        src={order.image}
        alt={order.title}
        className="w-28 h-28 object-contain rounded-lg"
      />

      {/* ================= ORDER DETAILS ================= */}
      <div className="flex-1">
        <h4 className="font-semibold">{order.title}</h4>
        <p className="text-sm text-gray-500">Size: {order.size}</p>
        <p className="mt-1 font-semibold text-gray-800">Rs {order.price}</p>
      </div>

      {/* ================= STATUS SECTION ================= */}
      <div className="flex flex-col justify-between text-sm">
        <span
          className={`px-3 py-1 rounded-full w-fit font-medium
            ${
              order.status === "Delivered"
                ? "bg-green-100 text-green-600"
                : order.status === "On The Way"
                ? "bg-blue-100 text-blue-600"
                : "bg-gray-200 text-gray-600"
            }`}
        >
          {order.status}
        </span>

        <p className="text-xs text-gray-500 mt-2">
          Expected Delivery on{" "}
          <span className="font-medium">{order.deliveryDate}</span>
        </p>

        {/* Stop bubbling so button doesn't trigger card click */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            goToOrderDetails();
          }}
          className="mt-2 text-purple-600 text-sm font-semibold hover:underline"
        >
          View Details
        </button>
      </div>
    </div>
  );
}
