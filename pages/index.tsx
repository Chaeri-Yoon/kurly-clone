import type { NextPage } from 'next'
import AdContainer from 'components/AutoMoveCarousel/AutoMoveAdsContainer';
import ProductContainer from 'components/Product/ProductContainer';
import { Product } from '@prisma/client';
import { IDataResponse, loadData } from '@libs/client/useCallApi';
import { IPromos } from './api/promos';
import { IProducts } from './api/products';

interface IHomeProps {
  promos: string[] | null,
  products: Product[]
}
const Home: NextPage<IHomeProps> = ({ promos, products }) => {
  return (
    <>
      {promos && <AdContainer promos={promos} />}
      {products && <ProductContainer title={"이 상품 어때요?"} products={products} />}
    </>
  )
}

export async function getStaticProps() {
  const salePromoImages = await loadData<IPromos>({ url: `${process.env.SERVER_BASEURL}/api/promos` });
  const products = await loadData<IProducts>({ url: `${process.env.SERVER_BASEURL}/api/products` });
  return {
    props: {
      promos: salePromoImages.filenames,
      products: products.products
    }
  }
}
export default Home;
