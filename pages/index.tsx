import type { NextPage } from 'next'
import AdContainer from '../components/page-components/AutoMoveCarousel/AutoMoveAdsContainer';
import ProductContainer from '../components/universal/Product/ProductContainer';

const Home: NextPage = () => {
  return (
    <>
      <AdContainer />
      <ProductContainer title={"이 상품 어때요?"} />
    </>
  )
}
export default Home
