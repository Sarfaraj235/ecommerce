import React, { useState } from "react";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
import HomeSectionCard from "../homeSectionCard/HomeSectionCard";

const HomeSectionCarousel = ({ data, sectionName }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    const items = data.map((item) => (
        <div className="flex justify-center px-1 sm:px-2">
            <HomeSectionCard key={item?.id || item?.title} product={item} />
        </div>
    ));

    const totalItems = items.length;
    const itemsPerSlide =
        typeof window !== "undefined"
            ? window.innerWidth >= 1024
                ? 4
                : window.innerWidth >= 568
                    ? 2
                    : 1
            : 1;

    const responsive = {
        0: { items: 1 },
        568: { items: 2 },
        1024: { items: 4, itemsFit: "contain" },
    };

    return (
        <div className="relative">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                    {sectionName}
                </h2>
                <span className="flex-1 h-[1px] bg-gray-200"></span>
            </div>

            <AliceCarousel
                mouseTracking
                items={items}
                responsive={responsive}
                activeIndex={activeIndex}
                onSlideChanged={(e) => setActiveIndex(e.item)}
                disableDotsControls
                renderPrevButton={() =>
                    activeIndex > 0 && (
                        <button
                            onClick={() => setActiveIndex(activeIndex - 1)}
                            className="absolute left-1 sm:left-0 top-1/2 -translate-y-1/2 bg-white shadow-md w-10 h-10 rounded-full hidden sm:flex items-center justify-center hover:bg-gray-100 transition z-10"
                        >
                            <ChevronLeftIcon className="w-5 h-5" />
                        </button>
                    )
                }
                renderNextButton={() =>
                    activeIndex < totalItems - itemsPerSlide && (
                        <button
                            onClick={() => setActiveIndex(activeIndex + 1)}
                            className="absolute right-1 sm:right-0 top-1/2 -translate-y-1/2 bg-white shadow-md w-10 h-10 rounded-full hidden sm:flex items-center justify-center hover:bg-gray-100 transition z-10"
                        >
                            <ChevronRightIcon className="w-5 h-5" />
                        </button>
                    )
                }
            />
        </div>
    );
};

export default HomeSectionCarousel;
