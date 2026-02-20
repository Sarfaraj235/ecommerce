const CartItem = ({ item, onIncrease, onDecrease, onRemove }) => {
  const discount = Math.round(
    ((item.oldPrice - item.price) / item.oldPrice) * 100
  );

  return (
    <div className="flex items-center gap-5 bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition">
      {/* Image */}
      <img
        src={item.image}
        alt={item.title}
        className="w-20 h-28 object-cover rounded-lg border"
      />

      {/* Details */}
      <div className="flex-1">
        <h3 className="font-semibold text-gray-800">{item.title}</h3>
        <p className="text-sm text-gray-500">
          Size: {item.size} | Color: {item.color}
        </p>
        <p className="text-xs text-gray-400 mt-1">Seller: {item.seller}</p>

        {/* Price */}
        <div className="flex items-center gap-3 mt-2">
          <span className="text-lg font-bold text-gray-900">₹{item.price}</span>
          <span className="text-sm line-through text-gray-400">
            ₹{item.oldPrice}
          </span>
          <span className="text-sm font-semibold text-green-600">
            {discount}% off
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col items-end gap-2">
        <div className="flex items-center bg-gray-100 rounded-full px-3 py-1 gap-3">
          <button
            onClick={() => onDecrease(item.id)}
            className="w-6 h-6 rounded-full bg-white shadow text-gray-700 font-bold hover:scale-105 transition"
          >
            −
          </button>
          <span className="font-semibold">{item.qty}</span>
          <button
            onClick={() => onIncrease(item.id)}
            className="w-6 h-6 rounded-full bg-white shadow text-gray-700 font-bold hover:scale-105 transition"
          >
            +
          </button>
        </div>

        <button
          onClick={() => onRemove(item.id)}
          className="text-sm font-semibold text-violet-600 hover:underline"
        >
          REMOVE
        </button>
      </div>
    </div>
  );
};

export default CartItem;
