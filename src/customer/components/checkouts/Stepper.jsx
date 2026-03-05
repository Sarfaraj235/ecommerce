const steps = ["Login", "Delivery Address", "Order Summary", "Payment"];

export default function Stepper({ step }) {
  return (
    <div className="bg-white rounded shadow p-4 flex items-center justify-between">
      {steps.map((label, i) => {
        const active = step >= i + 1;
        return (
          <div key={i} className="flex items-center w-full">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold
              ${active ? "bg-purple-600 text-white" : "bg-gray-300 text-gray-600"}`}
            >
              {i + 1}
            </div>
            <span className={`ml-2 text-sm ${active ? "text-purple-600 font-semibold" : "text-gray-500"}`}>
              {label}
            </span>
            {i !== steps.length - 1 && (
              <div className={`flex-1 h-[2px] mx-3 ${active ? "bg-purple-600" : "bg-gray-300"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
