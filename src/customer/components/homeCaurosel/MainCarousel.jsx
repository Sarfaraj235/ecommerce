import React from 'react';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import { MainCarouselData } from './mainCarouselData';

function MainCarousel(){

const items = MainCarouselData.map((item, idx)=> (
  <img
    key={idx}
    className="rs-main-carousel-image h-[220px] w-full object-cover sm:h-[320px] md:h-[420px]"
    role='presentation'
    src={item.image}
    alt='hello'
  />
))

return <AliceCarousel  mouseTracking items={items} disableButtonsControls controlsStrategy='alternate' autoPlay autoPlayInterval={1500} infinite/>;

}
export default MainCarousel
