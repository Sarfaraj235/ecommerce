import { useNavigate } from "react-router-dom";
import { calculateDiscount } from "./discountUtils";

const ProductCard = ({ product }) => {
  const { id, image, title, brand, price, oldPrice } = product;

  const discount = calculateDiscount(oldPrice, price);
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    navigate("/cart");
  };

  return (
    <div
      onClick={() => navigate(`/product/${id}`)}
      className="flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-50">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-contain p-2 sm:p-3 transition hover:scale-105"
        />

        {discount > 0 && (
          <span className="absolute top-2 left-2 rounded bg-red-500 px-2 py-1 text-xs text-white">
            {discount}% OFF
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-2.5 sm:p-3">
        <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold text-gray-900">{title}</h3>
        <p className="mt-1 text-xs text-gray-500">{brand}</p>

        <div className="mt-2 flex items-center gap-2">
          <span className="text-base font-bold">Rs {price}</span>
          {oldPrice && <span className="text-xs text-gray-400 line-through">Rs {oldPrice}</span>}
        </div>

        <button
          onClick={handleAddToCart}
          className="mt-auto w-full rounded bg-black py-1.5 text-xs sm:text-sm text-white transition hover:bg-gray-800"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
