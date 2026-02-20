import React from 'react'

const AddressCard = () => {
  return (
     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Saved Address */}
      <div className="bg-white rounded shadow p-5">
        <h3 className="font-semibold mb-3">Delivery Address</h3>
        <p className="font-semibold">Raam Kapoor</p>
        <p className="text-sm text-gray-600">
          Mumbai, Gokul Dham Market, 400001
        </p>
        <p className="text-sm text-gray-600 mt-1">Phone: 9167459820</p>

      </div>
      </div>
  )
}

export default AddressCard
