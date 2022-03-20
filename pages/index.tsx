import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { NextPage } from 'next'
import { useEffect, useRef, useState } from 'react';
import useSWR from 'swr';
import Product from '../components/Product'
import SalePromoBanner from '../components/SalePromoBanner';

const Home: NextPage = () => {
  const [salePromoIndex, setSalePromoIndex] = useState(1);
  const [salePromoWidth, setSalePromoWidth] = useState(0);
  const salePromoFrame = useRef<HTMLUListElement | null>(null);
  const { data: salePromoImages } = useSWR('/api/getSalePromoImages');
  const moveSalePromoFrame = (action = "all .3s ease-out") => salePromoFrame!.current!.style.transition = action;

  useEffect(() => {
    setSalePromoWidth(salePromoFrame?.current?.offsetWidth ? salePromoFrame?.current?.offsetWidth : window.innerWidth);
    moveSalePromoFrame("none");
    setTimeout(() => {
      moveSalePromoFrame();
    }, 300);
    window.addEventListener('resize', () => setSalePromoWidth(salePromoFrame?.current?.offsetWidth ? salePromoFrame?.current?.offsetWidth : window.innerWidth));
  }, [])

  useEffect(() => {
    const isStartImageClone = salePromoIndex === salePromoImages?.filenames?.length + 1;
    const isEndImageClone = salePromoIndex === 0;

    if (isStartImageClone || isEndImageClone) {
      setTimeout(() => {
        moveSalePromoFrame("none");
        setSalePromoIndex(isStartImageClone ? 1 : salePromoImages?.filenames?.length);
      }, 300);
    }
    salePromoFrame!.current!.style.transform = `translateX(-${salePromoIndex * salePromoWidth}px)`;
  }, [salePromoWidth, salePromoIndex]);

  const onClickedBackSalePromo = () => {
    if (salePromoIndex === 0) return;
    moveSalePromoFrame();
    setSalePromoIndex(prev => prev - 1);
  }
  const onClickedNextSalePromo = () => {
    if (salePromoIndex === salePromoImages?.filenames.length + 1) return;
    moveSalePromoFrame();
    setSalePromoIndex(prev => prev + 1);
  }

  return (
    <>
      <div className='w-full aspect-[1511/294]'>
        <div className='w-full h-full' >
          <div className='relative w-full h-full overflow-hidden'>
            <ul className='w-full h-full whitespace-nowrap list-none peer' ref={salePromoFrame}>
              {salePromoImages?.filenames.map((imageUrl: string, i: number) => (
                <SalePromoBanner id={i} key={i} imageUrl={imageUrl} arrFilenames={salePromoImages?.filenames} />
              ))}
            </ul>
            <button onClick={onClickedBackSalePromo} className='absolute top-1/2 left-0 -translate-y-1/2 w-[4%] aspect-square rounded-full flex  justify-center items-center z-10 bg-kurly-black opacity-0 duration-300 peer-hover:opacity-30 hover:opacity-60'>
              <FontAwesomeIcon icon={faChevronLeft} inverse className='text-xl' />
            </button>
            <button onClick={onClickedNextSalePromo} className='absolute top-1/2 right-0 -translate-y-1/2 w-[4%] aspect-square rounded-full flex  justify-center items-center z-10 bg-kurly-black opacity-0 duration-300 peer-hover:opacity-30 hover:opacity-60'>
              <FontAwesomeIcon icon={faChevronRight} inverse className='text-xl' />
            </button>
          </div>
        </div>
      </div>
      {/*
      <div className='p-[var(--frame-padding)] w-full grid grid-cols-productGrid gap-4 '>
        {[1, 1, 1, 1].map((_, i) => <Product key={i}></Product>)}
      </div>
              */}
    </>
  )
}
export default Home
