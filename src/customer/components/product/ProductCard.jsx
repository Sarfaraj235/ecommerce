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
      className="group flex h-full min-h-[470px] w-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-gray-100">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-105"
        />

        {discount > 0 && (
          <span className="absolute top-3 left-3 rounded-full bg-red-500 px-2.5 py-1 text-xs font-semibold tracking-wide text-white shadow">
            {discount}% OFF
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 min-h-[3rem] text-base font-semibold leading-6 text-gray-900">{title}</h3>
        <p className="mt-1 text-sm text-gray-500">{brand}</p>

        <div className="mt-3 flex items-center gap-2">
          <span className="text-xl font-bold text-gray-900">Rs {price}</span>
          {oldPrice && <span className="text-sm text-gray-400 line-through">Rs {oldPrice}</span>}
        </div>

        <button
          onClick={handleAddToCart}
          className="mt-auto w-full rounded-lg bg-black py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
