import OrdersFilter from "./OrdersFilter";
import OrderCard from "./OrderCard";

const orders = [
  {
    id: 1,
    title: "Men Slim Mid Rise Black Jeans",
    size: "M",
    price: 1099,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5-Z7TGUITVbmYIWUsqOYpMen6qLWZ8V694Q&s",
    status: "Delivered",
    deliveryDate: "Mar 03",
  },
  {
    id: 2,
    title: "Women Bodycon Yellow Dress",
    size: "M",
    price: 499,
    image: "https://www.berrylush.com/cdn/shop/products/1_bef98cb9-94f0-409a-beed-4a1058c2f1d8.jpg?v=1752846585",
    status: "In Transit",
    deliveryDate: "Mar 06",
  },
  {
    id: 3,
    title: "Yellow Mirrorwork Net Lehenga",
    size: "M",
    price: 11999,
    image: "https://littlewish.in/wp-content/uploads/2018/11/7306_D.jpg",
    status: "Processing",
    deliveryDate: "Mar 01",
  },
];


export default function OrdersPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <OrdersFilter />

        {/* Orders List */}
        <div className="md:col-span-3 space-y-4">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      </div>
    </div>
  );
}
