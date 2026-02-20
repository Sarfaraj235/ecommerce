'use client'

import { useState, useEffect, useMemo } from 'react'
import { useSearchParams, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { ChevronDownIcon, FunnelIcon, Squares2X2Icon } from '@heroicons/react/20/solid'
import ProductCard from './ProductCard'
import FilterData from './FilterData'
import { findProducts } from '../../../state/product/Action'

const sortOptions = [
  { name: 'Most Popular', value: 'popularity' },
  { name: 'Best Rating', value: 'rating' },
  { name: 'Newest', value: 'newest' },
  { name: 'Price: Low to High', value: 'price_low' },
  { name: 'Price: High to Low', value: 'price_high' },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const readFiltersFromParams = (searchParams) => {
  const initialFilters = {}
  FilterData.forEach((section) => {
    const valuesFromUrl = searchParams.getAll(section.id)
    if (valuesFromUrl.length > 0) initialFilters[section.id] = valuesFromUrl
  })
  return initialFilters
}

const getPriceRange = (selectedPrice = []) => {
  if (!selectedPrice.length) return { minPrice: 0, maxPrice: 100000 }

  const ranges = selectedPrice.map((range) => {
    if (range === '2000+') return { min: 2000, max: 100000 }
    const [min, max] = range.split('-').map(Number)
    return { min: Number.isNaN(min) ? 0 : min, max: Number.isNaN(max) ? 100000 : max }
  })

  return {
    minPrice: Math.min(...ranges.map((r) => r.min)),
    maxPrice: Math.max(...ranges.map((r) => r.max)),
  }
}

const parsePageNumberFromUrl = (pageNumberParam) => {
  const parsed = Number(pageNumberParam)
  if (Number.isNaN(parsed) || parsed < 1) return 0
  return parsed - 1
}

const normalizeProduct = (item, idx) => {
  const id = item?.id || item?._id || item?.productId || String(idx)
  const image =
    item?.image ||
    item?.imageUrl ||
    item?.images?.[0] ||
    item?.imageUrls?.[0] ||
    'https://via.placeholder.com/320x420?text=Product'

  const price = item?.discountedPrice ?? item?.price ?? 0
  const oldPrice = item?.mrp ?? item?.oldPrice ?? item?.price ?? price

  return {
    ...item,
    id,
    image,
    title: item?.title || item?.name || 'Untitled Product',
    brand: item?.brand || item?.brandName || 'Brand',
    price,
    oldPrice,
  }
}

export default function Product() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const { levelThree } = useParams()
  const dispatch = useDispatch()

  const { products, loading, error } = useSelector((state) => state.product)

  const [filters, setFilters] = useState(() => readFiltersFromParams(searchParams))
  const [selectedSort, setSelectedSort] = useState(() => searchParams.get('sort') || '')
  const [currentPage, setCurrentPage] = useState(() => parsePageNumberFromUrl(searchParams.get('pageNumber')))
  const [pageSize, setPageSize] = useState(() => Number(searchParams.get('pageSize')) || 12)
  const defaultColors = useMemo(() => {
    const fromFilters = FilterData.find((section) => section.id === 'color')?.options?.map((o) => o.value) || []
    // Backend requires `color` param; include common colors so "no selection" still behaves like "all products".
    const commonColors = ['pink', 'red', 'orange', 'grey', 'gray', 'brown', 'maroon', 'navy', 'beige']
    return Array.from(new Set([...fromFilters, ...commonColors]))
  }, [])
  const defaultSizes = useMemo(() => {
    const fromFilters = FilterData.find((section) => section.id === 'size')?.options?.map((o) => o.value) || []
    const commonSizes = ['xxs', 'xs', 'xxl', '3xl', '4xl', '5xl', 'free']
    return Array.from(new Set([...fromFilters, ...commonSizes]))
  }, [])

  const { minPrice, maxPrice } = useMemo(() => getPriceRange(filters.price || []), [filters.price])

  const requestData = useMemo(() => {
    const selectedDiscounts = (filters.discount || []).map(Number).filter((v) => !Number.isNaN(v))
    const availability = filters.availability || []

    let stock = ''
    if (availability.length === 1) {
      stock = availability[0] === 'inStock' ? 'in_stock' : 'out_of_stock'
    }

    return {
      colors: ((filters.color && filters.color.length ? filters.color : defaultColors) || []).join(','),
      sizes: ((filters.size && filters.size.length ? filters.size : defaultSizes) || [])
        .map((size) => String(size).toUpperCase())
        .join(','),
      minPrice,
      maxPrice,
      minDiscount: selectedDiscounts.length ? Math.min(...selectedDiscounts) : 0,
      category: (levelThree || '').replace(/-/g, '_').trim(),
      stock,
      sort: selectedSort,
      pageNumber: currentPage,
      pageSize,
    }
  }, [filters, minPrice, maxPrice, levelThree, selectedSort, defaultColors, defaultSizes, currentPage, pageSize])

  useEffect(() => {
    dispatch(findProducts(requestData))
  }, [dispatch, requestData])

  useEffect(() => {
    const params = new URLSearchParams()
    Object.keys(filters).forEach((sectionId) => {
      filters[sectionId].forEach((val) => params.append(sectionId, val))
    })
    if (selectedSort) params.set('sort', selectedSort)
    params.set('pageNumber', String(currentPage + 1))
    params.set('pageSize', String(pageSize))
    setSearchParams(params)
  }, [filters, selectedSort, currentPage, pageSize, setSearchParams])

  const normalizedProducts = useMemo(() => {
    const list =
      (Array.isArray(products) && products) ||
      (Array.isArray(products?.content) && products.content) ||
      (Array.isArray(products?.products) && products.products) ||
      (Array.isArray(products?.data) && products.data) ||
      []

    return list.map(normalizeProduct)
  }, [products])

  const handleFilterChange = (sectionId, optionValue) => {
    setCurrentPage(0)
    setFilters((prev) => {
      const prevOptions = prev[sectionId] || []
      const newOptions = prevOptions.includes(optionValue)
        ? prevOptions.filter((v) => v !== optionValue)
        : [...prevOptions, optionValue]
      return { ...prev, [sectionId]: newOptions }
    })
  }

  const totalPages = Math.max(products?.totalPages || 1, 1)
  const pageIndex = Math.min(Math.max(products?.number ?? currentPage, 0), totalPages - 1)
  const canGoPrev = pageIndex > 0
  const canGoNext = pageIndex < totalPages - 1
  const visiblePages = Array.from({ length: totalPages }, (_, i) => i).filter(
    (p) => p === 0 || p === totalPages - 1 || Math.abs(p - pageIndex) <= 1
  )

  return (
    <div className="bg-white">
      <Dialog open={mobileFiltersOpen} onClose={setMobileFiltersOpen} className="relative z-40 lg:hidden">
        <DialogBackdrop className="fixed inset-0 bg-black/25" />
        <div className="fixed inset-0 z-40 flex">
          <DialogPanel className="relative ml-auto flex w-full max-w-xs flex-col overflow-y-auto bg-white pt-4 pb-6 shadow-xl">
            <Disclosure defaultOpen>
              <DisclosureButton className="group flex w-full items-center justify-between border-b border-gray-200 px-4 pb-3">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                <span className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200">
                  <FunnelIcon className="h-4 w-4" />
                </span>
              </DisclosureButton>
              <DisclosurePanel className="space-y-4 px-4 pt-4">
                {FilterData.map((section) => (
                  <Disclosure key={section.id} as="div" className="border-b border-gray-200 pb-3">
                    <DisclosureButton className="group flex w-full items-center justify-between py-2 text-sm font-medium text-gray-900">
                      {section.name}
                      <ChevronDownIcon className="h-4 w-4 text-gray-400 transition-transform group-data-open:rotate-180" />
                    </DisclosureButton>
                    <DisclosurePanel className="pt-2">
                      <div className="space-y-1">
                        {section.options.map((option, idx) => (
                          <label
                            key={idx}
                            className="flex cursor-pointer items-center gap-2 py-1 text-sm text-gray-600 hover:text-gray-900"
                          >
                            <input
                              type="checkbox"
                              checked={filters[section.id]?.includes(option.value) || false}
                              onChange={() => handleFilterChange(section.id, option.value)}
                              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            {option.label}
                          </label>
                        ))}
                      </div>
                    </DisclosurePanel>
                  </Disclosure>
                ))}
              </DisclosurePanel>
            </Disclosure>
            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </DialogPanel>
        </div>
      </Dialog>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between border-b border-gray-200 py-6">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">New Arrivals</h1>

          <div className="flex items-center gap-4">
            <Menu as="div" className="relative inline-block text-left">
              <MenuButton className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-gray-900">
                Sort
                <ChevronDownIcon className="ml-1 h-5 w-5 text-gray-400" />
              </MenuButton>
              <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-xl ring-1 ring-black/5">
                <div className="py-1">
                  {sortOptions.map((option) => (
                    <MenuItem key={option.name}>
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentPage(0)
                          setSelectedSort(option.value)
                        }}
                        className={classNames(
                          selectedSort === option.value ? 'font-medium text-gray-900' : 'text-gray-500',
                          'block w-full px-4 py-2 text-left text-sm'
                        )}
                      >
                        {option.name}
                      </button>
                    </MenuItem>
                  ))}
                </div>
              </MenuItems>
            </Menu>

            <button className="p-2 text-gray-400 hover:text-gray-500">
              <Squares2X2Icon className="h-5 w-5" />
            </button>

            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="p-2 text-gray-400 hover:text-gray-500 lg:hidden"
            >
              <FunnelIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        <section className="pt-6 pb-24">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
            <aside className="sticky top-24 hidden h-fit lg:block">
              <Disclosure defaultOpen>
                <DisclosureButton className="group mb-4 flex w-full items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                  <span className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200">
                    <FunnelIcon className="h-4 w-4" />
                  </span>
                </DisclosureButton>
                <DisclosurePanel className="space-y-4">
                  {FilterData.map((section) => (
                    <Disclosure key={section.id} as="div" className="border-b border-gray-200 pb-3">
                      <DisclosureButton className="group flex w-full items-center justify-between py-2 text-sm font-medium text-gray-900">
                        {section.name}
                        <ChevronDownIcon className="h-4 w-4 text-gray-400 transition-transform group-data-open:rotate-180" />
                      </DisclosureButton>
                      <DisclosurePanel className="pt-2">
                        <div className="space-y-1">
                          {section.options.map((option, idx) => (
                            <label
                              key={idx}
                              className="flex cursor-pointer items-center gap-2 py-1 text-sm text-gray-600 hover:text-gray-900"
                            >
                              <input
                                type="checkbox"
                                checked={filters[section.id]?.includes(option.value) || false}
                                onChange={() => handleFilterChange(section.id, option.value)}
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              />
                              {option.label}
                            </label>
                          ))}
                        </div>
                      </DisclosurePanel>
                    </Disclosure>
                  ))}
                </DisclosurePanel>
              </Disclosure>
            </aside>

            <div>
              {loading && <p className="mb-4 text-sm text-gray-500">Loading products...</p>}
              {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

              <div className="grid grid-cols-2 items-stretch gap-6 sm:grid-cols-3 md:grid-cols-4">
                {!loading && normalizedProducts.length > 0 ? (
                  normalizedProducts.map((item) => <ProductCard key={item.id} product={item} />)
                ) : !loading ? (
                  <p className="col-span-full text-center text-gray-500">No products found for selected filters.</p>
                ) : null}
              </div>

              {!loading && (
                <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-gradient-to-r from-white to-gray-50 px-4 py-3">
                  <div className="text-sm text-gray-600">
                    Page <span className="font-semibold text-gray-900">{pageIndex + 1}</span> of{' '}
                    <span className="font-semibold text-gray-900">{totalPages}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={!canGoPrev}
                      onClick={() => canGoPrev && setCurrentPage(pageIndex - 1)}
                      className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                        canGoPrev ? 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300' : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                      }`}
                    >
                      Prev
                    </button>

                    {visiblePages.map((p, idx) => {
                      const prev = visiblePages[idx - 1]
                      const needsGap = prev !== undefined && p - prev > 1
                      return (
                        <div key={p} className="flex items-center gap-2">
                          {needsGap && <span className="px-1 text-gray-400">...</span>}
                          <button
                            type="button"
                            onClick={() => setCurrentPage(p)}
                            className={`h-9 w-9 rounded-lg text-sm font-semibold transition ${
                              p === pageIndex
                                ? 'bg-indigo-600 text-white shadow'
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                            }`}
                          >
                            {p + 1}
                          </button>
                        </div>
                      )
                    })}

                    <button
                      type="button"
                      disabled={!canGoNext}
                      onClick={() => canGoNext && setCurrentPage(pageIndex + 1)}
                      className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                        canGoNext ? 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300' : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                      }`}
                    >
                      Next
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>Show</span>
                    <select
                      value={pageSize}
                      onChange={(e) => {
                        setCurrentPage(0)
                        setPageSize(Number(e.target.value))
                      }}
                      className="rounded-lg border border-gray-300 bg-white px-2 py-1 text-sm text-gray-700 outline-none focus:border-indigo-500"
                    >
                      {[8, 12, 16, 24].map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
