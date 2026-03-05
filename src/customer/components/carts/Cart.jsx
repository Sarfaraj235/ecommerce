import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getCart, removeCartItem, updateCartItem } from "../../../state/cart/Action";

const normalizeCartItem = (item) => {
  const product = item?.product || {};
  const id = item?.id || item?._id || item?.cartItemId;
  const qty = Number(item?.quantity ?? item?.qty ?? 1);
  const discountedPrice = Number(product?.discountedPrice ?? item?.discountedPrice ?? item?.price ?? 0);
  const mrp = Number(product?.price ?? product?.mrp ?? item?.mrp ?? item?.oldPrice ?? discountedPrice);

  return {
    id,
    title: product?.title || product?.name || item?.title || "Product",
    size: item?.size || "N/A",
    color: product?.color || item?.color || "N/A",
    seller: product?.brand || product?.brandName || item?.seller || "Store",
    qty,
    price: discountedPrice,
    oldPrice: mrp,
    image:
      product?.imageUrl ||
      product?.image ||
      product?.images?.[0] ||
      item?.image ||
      "https://via.placeholder.com/120x160?text=Product",
  };
};

export default function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart, cartItems, loading, error } = useSelector((state) => state.cart);
  const { jwt } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!jwt) {
      navigate("/login");
      return;
    }
    dispatch(getCart());
  }, [dispatch, jwt, navigate]);

  const items = useMemo(() => (Array.isArray(cartItems) ? cartItems.map(normalizeCartItem) : []), [cartItems]);

  const handleCheckOut = () => {
    navigate("/checkout?step=2");
  };

  const increase = (item) => {
    dispatch(
      updateCartItem({
        cartItemId: item.id,
        data: { quantity: item.qty + 1 },
      })
    );
  };

  const decrease = (item) => {
    if (item.qty <= 1) return;
    dispatch(
      updateCartItem({
        cartItemId: item.id,
        data: { quantity: item.qty - 1 },
      })
    );
  };

  const remove = (id) => {
    dispatch(removeCartItem(id));
  };

  const computedTotalPrice = items.reduce((sum, item) => sum + item.oldPrice * item.qty, 0);
  const computedFinalAmount = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const totalPrice = Number(cart?.totalPrice ?? computedTotalPrice);
  const finalAmount = Number(cart?.totalDiscountedPrice ?? computedFinalAmount);
  const totalDiscount = Number(cart?.discount ?? Math.max(0, totalPrice - finalAmount));
  const totalItems = Number(cart?.totalItem ?? items.reduce((sum, item) => sum + item.qty, 0));

  return (
    <div className="min-h-screen bg-gray-100 py-4 sm:py-6">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {loading && <p className="rounded bg-white p-4 text-sm text-gray-500">Loading cart...</p>}
          {error && <p className="rounded bg-white p-4 text-sm text-red-500">{error}</p>}

          {!loading && items.length === 0 && (
            <div className="rounded bg-white p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-800">Your cart is empty</h3>
              <button
                onClick={() => navigate("/")}
                className="mt-4 rounded bg-black px-5 py-2 text-sm font-medium text-white"
              >
                Continue Shopping
              </button>
            </div>
          )}

          {items.map((item) => (
            <div key={item.id} className="flex flex-col gap-4 rounded bg-white p-4 shadow sm:flex-row">
              <div className="flex flex-col items-center gap-3 sm:items-start">
                <img src={item.image} alt={item.title} className="h-44 w-full rounded object-cover sm:h-36 sm:w-28" />
                <div className="flex items-center rounded border">
                  <button onClick={() => decrease(item)} className="px-3 py-1 text-lg font-bold text-gray-600">
                    -
                  </button>
                  <span className="px-3 font-semibold">{item.qty}</span>
                  <button onClick={() => increase(item)} className="px-3 py-1 text-lg font-bold text-gray-600">
                    +
                  </button>
                </div>
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{item.title}</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Size: {item.size}, Color: {item.color}
                </p>
                <p className="mt-1 text-xs text-gray-400">Seller: {item.seller}</p>

                <div className="mt-3 flex flex-wrap items-center gap-2 sm:gap-3">
                  <span className="text-lg font-bold">Rs {item.price}</span>
                  <span className="text-gray-400 line-through">Rs {item.oldPrice}</span>
                  {item.oldPrice > 0 && (
                    <span className="text-sm font-semibold text-green-600">
                      {Math.max(0, Math.round(((item.oldPrice - item.price) / item.oldPrice) * 100))}% off
                    </span>
                  )}
                </div>

                <button
                  onClick={() => remove(item.id)}
                  className="mt-4 text-sm font-semibold text-purple-600 hover:underline"
                >
                  REMOVE
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="h-fit rounded bg-white p-5 shadow">
          <h2 className="mb-4 border-b pb-3 font-semibold text-gray-700">PRICE DETAILS</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Price ({totalItems} items)</span>
              <span>Rs {totalPrice}</span>
            </div>
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>-Rs {totalDiscount}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Charges</span>
              <span className="font-semibold text-green-600">Free</span>
            </div>
            <hr />
            <div className="flex justify-between text-base font-semibold">
              <span>Total Amount</span>
              <span>Rs {finalAmount}</span>
            </div>
            <p className="pt-2 font-semibold text-green-600">You will save Rs {totalDiscount} on this order</p>
          </div>

          <button
            onClick={handleCheckOut}
            disabled={items.length === 0}
            className="mt-5 w-full rounded bg-purple-600 py-3 font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            CHECK OUT
          </button>
        </div>
      </div>
    </div>
  );
}
