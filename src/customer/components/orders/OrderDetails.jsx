import AddressCard from "./AddressCard";

const order = {
    statusIndex: 1, // 0-based: 0=Placed, 1=Order Confirmed, ...
    steps: ["Placed", "Order Confirmed", "Shipped", "Out For Delivery", "Delivered"],
    items: [
        {
            id: 1,
            title: "Men Slim Mid Rise Black Jeans",
            color: "Pink",
            size: "M",
            seller: "Iinaria",
            price: 1099,
            image:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5-Z7TGUITVbmYIWUsqOYpMen6qLWZ8V694Q&s",
        },
        {
            id: 2,
            title: "Women Bodycon Yellow Dress",
            color: "Pink",
            size: "M",
            seller: "Faltooo Fashion",
            price: 499,
            image:
                "https://www.berrylush.com/cdn/shop/products/1_bef98cb9-94f0-409a-beed-4a1058c2f1d8.jpg?v=1752846585",
        },
        {
            id: 3,
            title: "Women Skater Yellow Dress",
            color: "Pink",
            size: "M",
            seller: "Tokyo Talkies",
            price: 1099,
            image:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxkysK9k2wTQZQyK0-Y3XByd6w1m4r4c7N3w&s",
        },
    ],
};

export default function OrderDetails() {
    return (




        <div className="min-h-screen bg-gray-100 py-8">

            <div className="max-w-6xl mx-auto px-4 mb-6">
                <div className="bg-white rounded-xl shadow p-6">
                    <AddressCard />
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 space-y-6">
                {/* Status Stepper */}
                <div className="bg-white rounded-xl shadow p-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-gray-700">Order Status</h3>
                        <button className="text-xs font-semibold text-purple-600 hover:underline">
                            Cancel Order
                        </button>
                    </div>

                    <div className="mt-6 flex items-center">
                        {order.steps.map((step, idx) => (
                            <div className="flex items-center flex-1" key={step}>
                                <div className="flex flex-col items-center">
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold
                    ${idx <= order.statusIndex
                                                ? "bg-purple-600 text-white"
                                                : "bg-gray-200 text-gray-500"
                                            }`}
                                    >
                                        {idx + 1}
                                    </div>
                                    <span className="mt-2 text-[11px] sm:text-xs text-gray-600 text-center">
                                        {step}
                                    </span>
                                </div>

                                {idx < order.steps.length - 1 && (
                                    <div
                                        className={`h-1 flex-1 mx-2 rounded
                    ${idx < order.statusIndex
                                                ? "bg-purple-600"
                                                : "bg-gray-200"
                                            }`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Items */}
                <div className="space-y-4">
                    {order.items.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white rounded-xl shadow p-4 flex flex-col sm:flex-row gap-4"
                        >
                            <img
                                src={item.image}
                                alt={item.title}
                                className="w-24 h-24 object-contain rounded-lg"
                            />
                            <div className="flex-1">
                                <h4 className="font-semibold text-gray-800">{item.title}</h4>
                                <p className="text-sm text-gray-500">
                                    Color: {item.color} &nbsp; Size: {item.size}
                                </p>
                                <p className="text-sm text-gray-500">Seller: {item.seller}</p>
                                <p className="mt-2 font-semibold text-gray-800">
                                    Rs. {item.price}
                                </p>
                            </div>
                            <button className="text-sm font-semibold text-purple-600 hover:underline self-start sm:self-center">
                                Rate &amp; Review Product
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
