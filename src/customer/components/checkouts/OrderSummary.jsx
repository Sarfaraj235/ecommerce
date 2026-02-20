import { useMemo } from "react";
import { useSelector } from "react-redux";

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

export default function OrderSummary({ setStep, address, orderId }) {
  const { cartItems } = useSelector((state) => state.cart);

  const items = useMemo(
    () => (Array.isArray(cartItems) ? cartItems.map(normalizeCartItem) : []),
    [cartItems]
  );

  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="rounded bg-white p-6 shadow lg:col-span-2">
        <h3 className="mb-4 font-semibold">Order Summary</h3>
        {orderId && <p className="mb-3 text-sm text-gray-500">Order ID: {orderId}</p>}

        {items.length === 0 && (
          <p className="rounded border border-dashed border-gray-300 p-4 text-sm text-gray-600">
            No items found in your cart.
          </p>
        )}

        {items.map((item) => (
          <div key={item.id} className="flex justify-between border-b py-3">
            <div>
              <p className="font-medium">{item.title}</p>
              <p className="text-sm text-gray-500">Qty: {item.qty}</p>
            </div>
            <p className="font-semibold">Rs {item.price * item.qty}</p>
          </div>
        ))}

        <div className="mt-4 flex justify-between text-sm font-semibold text-gray-700">
          <span>Total</span>
          <span>Rs {total}</span>
        </div>

        <button
          onClick={() => setStep(4)}
          disabled={items.length === 0 || !address}
          className="mt-6 rounded bg-purple-600 px-6 py-3 font-semibold text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Continue to Payment
        </button>
        {!address && (
          <p className="mt-2 text-sm text-gray-500">Please select or add a delivery address first.</p>
        )}
      </div>

      <div className="h-fit rounded bg-white p-5 shadow">
        <h3 className="mb-3 font-semibold">Delivery Address</h3>
        {address ? (
          <>
            <p className="font-medium">
              {address?.firstName} {address?.lastName}
            </p>
            <p className="text-sm text-gray-600">
              {address?.street}
              {address?.address ? `, ${address?.address}` : ""}
            </p>
            <p className="text-sm text-gray-600">
              {address?.city}, {address?.state} - {address?.zip}
            </p>
            <p className="mt-1 text-sm text-gray-600">Phone: {address?.phone}</p>
          </>
        ) : (
          <p className="text-sm text-gray-600">Address will appear after you add or select delivery details.</p>
        )}
      </div>
    </div>
  );
}
