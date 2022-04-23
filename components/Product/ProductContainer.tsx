import { Product as ProductData } from "@prisma/client";
import { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import carousel from "@libs/client/carousel";
import classAppend from "@libs/client/classAppend";
import MoveCarouselButton from "../MoveCarouselButton"
import Product from "./Product"

interface IProductsResponse {
    recommendations: ProductData[]
}
export default function ({ title }: { title: string }) {
    const { data } = useSWR<IProductsResponse>('/api/recommendations');
    const [pageIndex, setPageIndex] = useState(0);
    const [pageWidth, setPageWidth] = useState(0);
    const pageFrame = useRef<HTMLDivElement | null>(null);
    const pageLength = 2;
    const { initialSetting, moveItem, onClickedBack, onClickedNext } = carousel({
        itemIndex: pageIndex,
        setItemIndex: setPageIndex,
        itemWidth: pageWidth,
        setItemWidth: setPageWidth,
        itemsLength: pageLength,
        frame: pageFrame,
        defaultTransitionTime: 0.4
    })
    useEffect(initialSetting, []);
    useEffect(moveItem, [pageWidth, pageIndex]);
    return (
        <div className="p-[var(--frame-padding)] mt-20 w-full flex flex-col items-center">
            <div className="mb-9 w-full flex justify-center items-center"><h1 className="text-2xl  font-semibold text-kurly-black">{title}</h1></div>
            <div className="w-full relative ">
                <div className="w-full overflow-hidden">
                    <div className='w-full whitespace-nowrap' ref={pageFrame}>
                        {data?.recommendations && [1, 1].map((_, i) =>
                            <div key={i} className="w-full inline-block space-x-[1rem]">
                                {data.recommendations.slice(4 * i, 4 * (i + 1)).map((product, j) => <Product key={4 * i + j} id={product.id} imgUrl={product.image} name={product.name} originalPrice={product.originalPrice} salePercentage={product.salePercentage} />)}
                            </div>
                        )}
                    </div>
                </div>
                <MoveCarouselButton isLeft={true} onClick={onClickedBack} containerStyle={classAppend('-translate-y-[135%] -left-[2.5%] w-[5%]', pageIndex === 0 ? 'hidden' : 'inline-block')} />
                <MoveCarouselButton isLeft={false} onClick={onClickedNext} containerStyle={classAppend('-translate-y-[135%] -right-[2.5%] w-[5%]', pageIndex === pageLength - 1 ? 'hidden' : 'inline-block')} />
            </div>
        </div>
    )
}