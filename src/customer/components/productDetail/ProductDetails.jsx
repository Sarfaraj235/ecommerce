import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Rating } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { findProductsById } from "../../../state/product/Action";
import { addItemToCart, getCart } from "../../../state/cart/Action";
import HomeSectionCard from "../homeSectionCard/HomeSectionCard";
import { calculateDiscount } from "../product/discountUtils";

const normalizeProduct = (source) => {
  if (!source) return null;

  const image =
    source?.image ||
    source?.imageUrl ||
    source?.images?.[0] ||
    source?.imageUrls?.[0] ||
    "https://via.placeholder.com/320x420?text=Product";

  const price = source?.discountedPrice ?? source?.price ?? 0;
  const oldPrice = source?.mrp ?? source?.oldPrice ?? source?.price ?? price;

  return {
    ...source,
    id: source?.id || source?._id || source?.productId,
    title: source?.title || source?.name || "Untitled Product",
    brand: source?.brand || source?.brandName || "Brand",
    image,
    price,
    oldPrice,
  };
};

const normalizeSizeOptions = (sizes) => {
  if (!Array.isArray(sizes) || sizes.length === 0) return ["S", "M", "L", "XL"];

  return sizes
    .map((size) => {
      if (typeof size === "string" || typeof size === "number") return String(size);
      if (size && typeof size === "object") return String(size.name || size.size || "");
      return "";
    })
    .filter(Boolean);
};

export default function ProductDetails() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { product, products, loading, error } = useSelector((state) => state.product);
  const { loading: cartLoading } = useSelector((state) => state.cart);
  const { jwt } = useSelector((state) => state.auth);

  useEffect(() => {
    if (productId) {
      dispatch(findProductsById({ productId }));
    }
  }, [dispatch, productId]);

  const currentProduct = useMemo(() => {
    const source = product?.product || product?.data || product;
    return normalizeProduct(source);
  }, [product]);

  const [selectedSize, setSelectedSize] = useState("M");
  const [addToCartError, setAddToCartError] = useState("");
  const rawSizes = Array.isArray(currentProduct?.sizes)
    ? currentProduct.sizes
    : Array.isArray(currentProduct?.size)
      ? currentProduct.size
      : [];
  const sizeOptions = normalizeSizeOptions(rawSizes);

  useEffect(() => {
    if (!sizeOptions.includes(selectedSize)) {
      setSelectedSize(sizeOptions[0]);
    }
  }, [sizeOptions, selectedSize]);

  if (loading) {
    return <div className="p-20 text-center text-gray-500">Loading product...</div>;
  }

  if (error) {
    return (
      <div className="p-20 text-center">
        <h2 className="text-xl font-bold text-gray-800">Unable to load product</h2>
        <p className="mt-2 text-gray-500">{error}</p>
        <button onClick={() => navigate(-1)} className="mt-4 rounded bg-black px-6 py-2 text-white">
          Go Back
        </button>
      </div>
    );
  }

  if (!currentProduct) {
    return (
      <div className="p-20 text-center">
        <h2 className="text-xl font-bold text-gray-800">Product not found</h2>
        <p className="mt-2 text-gray-500">Please try another product.</p>
        <button onClick={() => navigate(-1)} className="mt-4 rounded bg-black px-6 py-2 text-white">
          Go Back
        </button>
      </div>
    );
  }

  const { image, title, brand, price, oldPrice } = currentProduct;
  const discount = calculateDiscount(oldPrice, price);
  const relatedProducts =
    (Array.isArray(products?.content) ? products.content : Array.isArray(products) ? products : [])
      .map(normalizeProduct)
      .filter(
        (item) =>
          item && String(item.id) !== String(currentProduct.id)
      )
      .slice(0, 4);

  const handleAddToCart = async () => {
    if (!jwt) {
      navigate("/login");
      return;
    }

    setAddToCartError("");
    const numericProductId = Number(currentProduct.id ?? productId);
    if (Number.isNaN(numericProductId) || numericProductId <= 0) {
      setAddToCartError("Invalid product id. Please reload and try again.");
      return;
    }

    const payload = {
      productId: numericProductId,
      size: selectedSize,
      quantity: 1,
    };

    try {
      await dispatch(addItemToCart(payload));
      await dispatch(getCart());
      navigate("/cart");
    } catch (err) {
      setAddToCartError(err.message || "Unable to add item to cart.");
    }
  };

  return (
    <div className="bg-white px-4 sm:px-6 lg:px-24">
      <nav className="py-4 text-sm text-gray-500">
        Men / Clothing / <span className="font-medium text-gray-800">{title}</span>
      </nav>

      <div className="mt-4 lg:grid lg:grid-cols-2 lg:gap-x-14">
        <div className="overflow-hidden rounded-2xl bg-gray-100 shadow-sm transition hover:shadow-md">
          <img src={image} alt={title} className="h-full w-full object-cover transition duration-300 hover:scale-105" />
        </div>

        <div className="mt-10 lg:mt-0">
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">{brand}</p>
          <h1 className="mt-1 text-2xl font-bold text-gray-900">{title}</h1>

          <div className="mt-4 flex items-center gap-4">
            <span className="text-2xl font-bold text-gray-900">Rs {price}</span>
            {oldPrice && <span className="text-gray-400 line-through">Rs {oldPrice}</span>}
            {discount > 0 && (
              <span className="rounded-full bg-gradient-to-r from-green-500 to-emerald-600 px-3 py-1 text-xs font-semibold text-white">
                {discount}% OFF
              </span>
            )}
          </div>

          <div className="mt-4 flex items-center gap-2">
            <Rating value={4.5} precision={0.5} readOnly size="small" />
            <span className="text-sm text-gray-500">56,540 Ratings | 3,870 Reviews</span>
          </div>

          <div className="mt-8">
            <h3 className="text-sm font-medium text-gray-700">Select Size</h3>
            <div className="mt-4 flex gap-3">
              {sizeOptions.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`rounded-lg border px-6 py-2 text-sm font-medium transition ${
                    selectedSize === size
                      ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm"
                      : "border-gray-300 hover:border-indigo-400 hover:bg-gray-50"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={cartLoading}
            className="mt-10 w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-3 font-bold tracking-wide text-white shadow-md transition hover:opacity-90"
          >
            {cartLoading ? "Adding..." : "Add To Cart"}
          </button>
          {addToCartError && <p className="mt-3 text-sm text-red-600">{addToCartError}</p>}
        </div>
      </div>

      <hr className="my-16" />

      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <h1 className="mb-6 text-xl font-bold">Similar Products</h1>
          <div className="flex flex-wrap gap-5">
            {relatedProducts.map((item) => (
              <HomeSectionCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
