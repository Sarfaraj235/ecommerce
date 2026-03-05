const steps = ["Login", "Delivery Address", "Order Summary", "Payment"];

export default function Stepper({ step }) {
  return (
    <div className="rs-stepper rounded bg-white p-3 shadow sm:p-4">
      <div className="rs-stepper-inner flex items-center justify-between">
        {steps.map((label, i) => {
          const active = step >= i + 1;
          return (
            <div key={i} className="flex w-full items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold sm:text-base
                ${active ? "bg-purple-600 text-white" : "bg-gray-300 text-gray-600"}`}
              >
                {i + 1}
              </div>
              <span className={`ml-2 text-xs sm:text-sm ${active ? "font-semibold text-purple-600" : "text-gray-500"}`}>
                {label}
              </span>
              {i !== steps.length - 1 && (
                <div className={`mx-3 h-[2px] flex-1 ${active ? "bg-purple-600" : "bg-gray-300"}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
