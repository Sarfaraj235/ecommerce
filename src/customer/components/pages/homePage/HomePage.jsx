import React from 'react'
import MainCarousel from '../../homeCaurosel/MainCarousel.jsx'
import HomeSectionCarousel from '../../homeSectionCarousel/HomeSectionCarousel.jsx'
import MensKurta from '../../../../data/mens/MensKurta.js'



const HomePage = () => {
  return (
    <>
      <div>
        <MainCarousel />
      </div>
     <div className="space-y-8 sm:space-y-10 flex flex-col justify-center px-3 sm:px-5 lg:px-10 py-4 sm:py-6">
       <HomeSectionCarousel data = { MensKurta} sectionName={"Men's Kurta"} />
       <HomeSectionCarousel data = { MensKurta} sectionName={"Men's Shoes"} />
       <HomeSectionCarousel data = { MensKurta} sectionName={"Men's Shirt"} />
       <HomeSectionCarousel data = { MensKurta} sectionName={"Women's Saree"} />
       <HomeSectionCarousel data = { MensKurta} sectionName={"Women's Kurta"} />
       
       
      </div>
    </>
  )
}

export default HomePage
