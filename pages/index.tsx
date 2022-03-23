import type { NextPage } from 'next'
import Product from '../components/Product/Product'
import AdContainer from '../components/AutoMoveCarousel/AutoMoveAdsContainer';

const Home: NextPage = () => {


  return (
    <>
      <AdContainer />
      {/*
      <div className='p-[var(--frame-padding)] w-full grid grid-cols-productGrid gap-4 '>
        {[1, 1, 1, 1].map((_, i) => <Product key={i}></Product>)}
      </div>
              */}
    </>
  )
}
export default Home
