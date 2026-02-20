import React from "react";
 const HomeSectionCard = ({product} )=>  {
  return (

    <div className="w-64 bg-white border rounded-xl shadow-md hover:shadow-xl transition p-4 cursor-pointer">
      <img 
        src={product.image}
        className="h-45 w-full object-top rounded-lg"
      />

      <div className="mt-3 space-y-2">
    
        <p className="text-sm text-black-100">{product.title}</p>

      </div>
    </div>
  );

}

export default HomeSectionCard
