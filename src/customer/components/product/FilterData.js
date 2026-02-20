const FilterData = [
  {
    id: 'color',
    name: 'Color',
    options: [
      { value: 'white', label: 'White' },
      { value: 'black', label: 'Black' },
      { value: 'blue', label: 'Blue' },
      { value: 'green', label: 'Green' },
      { value: 'yellow', label: 'Yellow' },
      { value: 'purple', label: 'Purple' },
    ],
  },
  {
    id: 'size',
    name: 'Size',
    options: [
      { value: 's', label: 'S' },
      { value: 'm', label: 'M' },
      { value: 'l', label: 'L' },
      { value: 'xl', label: 'XL' },
    ],
  },
  {
    id: 'price',
    name: 'Price',
    options: [
      { value: '0-499', label: '₹0 – ₹499' },
      { value: '500-999', label: '₹500 – ₹999' },
      { value: '1000-1999', label: '₹1000 – ₹1999' },
      { value: '2000+', label: '₹2000 and above' },
    ],
  },
  {
    id: 'discount',
    name: 'DISCOUNT RANGE',
    options: [
      { value: '10', label: '10% and above' },
      { value: '20', label: '20% and above' },
      { value: '30', label: '30% and above' },
      { value: '40', label: '40% and above' },
      { value: '50', label: '50% and above' },
      { value: '60', label: '60% and above' },
    ],
  },
  {
    id: 'availability',
    name: 'Availability',
    options: [
      { value: 'inStock', label: 'In Stock' },
      { value: 'outOfStock', label: 'Out of Stock' },
    ],
  },
]

export default FilterData
