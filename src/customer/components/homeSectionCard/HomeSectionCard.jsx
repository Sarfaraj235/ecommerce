import React from "react";
 const HomeSectionCard = ({product} )=>  {
  return (

    <div className="w-full max-w-[320px] bg-white border rounded-xl shadow-md hover:shadow-xl transition p-3 sm:p-4 cursor-pointer">
      <img 
        src={product.image}
        alt={product.title || "product"}
        className="h-72 sm:h-80 w-full object-cover rounded-lg"
      />

      <div className="mt-3 space-y-2">
    
        <p className="text-sm sm:text-base text-gray-900 leading-snug">{product.title}</p>

      </div>
    </div>
  );

}

export default HomeSectionCard
