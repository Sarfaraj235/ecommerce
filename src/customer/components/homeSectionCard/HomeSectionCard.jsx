import React from "react";
 const HomeSectionCard = ({product, onClick} )=>  {
 return (

    <div onClick={onClick} className="rs-home-card h-[300px] w-64 bg-white border rounded-xl shadow-md hover:shadow-xl transition p-3 cursor-pointer flex flex-col">
      <img 
        src={product.image}
        alt={product.title || "product"}
        className="rs-home-card-image h-52 w-full object-cover object-top rounded-lg"
      />

      <div className="mt-2 h-10">
        <p className="text-[13px] text-gray-800 leading-5 overflow-hidden text-ellipsis [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical]">
          {product.title}
        </p>

      </div>
    </div>
  );

}

export default HomeSectionCard
