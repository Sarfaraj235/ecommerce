import React, { useState } from "react";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
import HomeSectionCard from "../homeSectionCard/HomeSectionCard";

const HomeSectionCarousel = ({ data, sectionName }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    const safeData = Array.isArray(data) ? data : [];

    const items = safeData.map((item, idx) => (
        <div key={item?.id || `${sectionName}-${idx}`} className="flex justify-center">
            <HomeSectionCard product={item} />
        </div>
    ));

    const totalItems = items.length;
    const itemsPerSlide = 4;

    const responsive = {
        0: { items: 1 },
        568: { items: 2 },
        1024: { items: 4, itemsFit: "contain" },
    };

    return (
        <div className="rs-home-section-carousel relative">
            <div className="flex items-center gap-2 mb-2">
                <h2 className="text-xl font-semibold text-gray-900">
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
                            className="absolute left-0 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md transition hover:bg-gray-100 sm:flex"
                        >
                            <ChevronLeftIcon className="w-5 h-5" />
                        </button>
                    )
                }
                renderNextButton={() =>
                    activeIndex < totalItems - itemsPerSlide && (
                        <button
                            onClick={() => setActiveIndex(activeIndex + 1)}
                            className="absolute right-0 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md transition hover:bg-gray-100 sm:flex"
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
