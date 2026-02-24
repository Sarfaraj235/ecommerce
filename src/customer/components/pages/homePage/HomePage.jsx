import React, { useEffect, useState } from "react";
import MainCarousel from "../../homeCaurosel/MainCarousel.jsx";
import HomeSectionCarousel from "../../homeSectionCarousel/HomeSectionCarousel.jsx";
import { api } from "../../../../state/config/ApiConfig";

const ITEMS_PER_SECTION = 12;
const PRODUCT_PLACEHOLDER = "https://via.placeholder.com/320x420?text=Product";
const HOME_DEFAULT_COLORS = [];
const HOME_DEFAULT_SIZES = [];
const HOME_SECTIONS = [
  {
    sectionName: "Men's Kurta",
    categories: ["mens_kurta", "men_kurta", "mens kurta", "men kurta"],
  },
  {
    sectionName: "Men's Jackets",
    categories: [
      "mens_jackets",
      "mens_jacket",
      "men_jackets",
      "men_jacket",
      "mens jacket",
      "men jacket",
      "jackets",
      "jacket",
    ],
  },
  {
    sectionName: "Men's Watches",
    categories: [
      "mens_watches",
      "men_watches",
      "mens_watch",
      "men_watch",
      "mens watches",
      "men watches",
      "mens watch",
      "men watch",
      "watches",
      "watch",
      "mens_watchs",
      "men_watchs",
      "mens watchs",
      "men watchs",
    ],
  },
  {
    sectionName: "Women's Tops",
    categories: [
      "womens_top",
      "women_top",
      "womens_tops",
      "women_tops",
      "womens top",
      "women top",
      "womens tops",
      "women tops",
      "top",
      "tops",
    ],
  },
  {
    sectionName: "Women's Dresses",
    categories: [
      "womens_dress",
      "women_dress",
      "womens_dresses",
      "women_dresses",
      "womens dress",
      "women dress",
      "womens dresses",
      "women dresses",
      "dress",
      "dresses",
    ],
  },
  {
    sectionName: "Women's Pants",
    categories: [
      "womens_pant",
      "women_pant",
      "womens_pants",
      "women_pants",
      "womens pant",
      "women pant",
      "womens pants",
      "women pants",
      "pant",
      "pants",
      "trouser",
      "trousers",
    ],
  },
];

const normalizeProduct = (item, idx) => ({
  ...item,
  id: item?.id || item?._id || item?.productId || `home-${idx}`,
  image: item?.image || item?.imageUrl || item?.images?.[0] || item?.imageUrls?.[0] || PRODUCT_PLACEHOLDER,
  title: item?.title || item?.name || "Untitled Product",
});

const parseProductList = (responseData) =>
  (Array.isArray(responseData) && responseData) ||
  (Array.isArray(responseData?.content) && responseData.content) ||
  (Array.isArray(responseData?.products) && responseData.products) ||
  (Array.isArray(responseData?.data) && responseData.data) ||
  [];

const buildParams = (category) => {
  const params = new URLSearchParams();
  HOME_DEFAULT_COLORS.filter(Boolean).forEach((color) => params.append("color", color));
  HOME_DEFAULT_SIZES.filter(Boolean).forEach((size) => params.append("size", size));
  params.append("category", category);
  params.append("minPrice", "0");
  params.append("maxPrice", "100000");
  params.append("minDiscount", "0");
  params.append("sort", "newest");
  params.append("stock", "");
  params.append("pageNumber", "0");
  params.append("pageSize", "100");
  return params;
};

const HomePage = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchSectionProducts = async (section) => {
      for (const category of section.categories) {
        try {
          const { data } = await api.get(`/api/products?${buildParams(category).toString()}`);
          const items = parseProductList(data).map(normalizeProduct).slice(0, ITEMS_PER_SECTION);
          if (items.length > 0) {
            return { sectionName: section.sectionName, items };
          }
        } catch {
          // Keep trying fallback category aliases for this section.
        }
      }

      return { sectionName: section.sectionName, items: [] };
    };

    const loadHomeSections = async () => {
      setLoading(true);
      setError("");
      try {
        const sectionResults = await Promise.all(HOME_SECTIONS.map(fetchSectionProducts));
        if (!cancelled) {
          setSections(sectionResults);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err?.response?.data?.message || err?.message || "Unable to load homepage products.");
          setSections(HOME_SECTIONS.map((section) => ({ sectionName: section.sectionName, items: [] })));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadHomeSections();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <div>
        <MainCarousel />
      </div>

      <div className="flex flex-col justify-center space-y-2 px-5 lg:px-10">
        {loading && <p className="text-sm text-gray-500">Loading homepage products...</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}

        {!loading &&
          sections.map((section) =>
            section.items.length > 0 ? (
              <HomeSectionCarousel
                key={section.sectionName}
                data={section.items}
                sectionName={section.sectionName}
              />
            ) : (
              <div key={section.sectionName} className="space-y-2">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold text-gray-900">{section.sectionName}</h2>
                  <span className="h-[1px] flex-1 bg-gray-200"></span>
                </div>
                <p className="text-sm text-gray-500">No products available in this section right now.</p>
              </div>
            )
          )}
      </div>
    </>
  );
};

export default HomePage;
