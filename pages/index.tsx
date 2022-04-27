import type { NextPage } from 'next'
import AdContainer from 'components/AutoMoveCarousel/AutoMoveAdsContainer';
import ProductContainer from 'components/Product/ProductContainer';
import fetchRequest from '@libs/client/fetchRequest';
import { Product } from '@prisma/client';

interface IHomeProps {
  salePromoImages: string[] | null,
  recommendations: Product[]
}
const Home: NextPage<IHomeProps> = ({ salePromoImages, recommendations }) => {
  return (
    <>
      {salePromoImages && <AdContainer salePromoImages={salePromoImages} />}
      {recommendations && <ProductContainer title={"이 상품 어때요?"} recommendations={recommendations} />}
    </>
  )
}
export async function getServerSideProps() {
  const response_salePromoImages = await fetchRequest({ url: `${process.env.SERVER_BASEURL}/api/salePromoImages`, method: 'GET' })
    .then(response => response.json());
  const response_recommendations = await fetchRequest({ url: `${process.env.SERVER_BASEURL}/api/recommendations`, method: 'GET' })
    .then(response => response.json());

  return {
    props: {
      salePromoImages: response_salePromoImages?.filenames,
      recommendations: response_recommendations?.recommendations
    }
  }
}
export default Home;
