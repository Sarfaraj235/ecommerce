export default function OrdersFilter() {
  return (
    <div className="bg-white rounded shadow p-5 h-fit">
      <h3 className="font-semibold mb-3">Filters</h3>

      <div className="mb-4">
        <p className="font-medium text-sm mb-2">ORDER STATUS</p>
        {["On The Way", "Delivered", "Cancelled", "Returned"].map((status) => (
          <label key={status} className="flex items-center gap-2 text-sm mb-2">
            <input type="checkbox" />
            {status}
          </label>
        ))}
      </div>
    </div>
  );
}
