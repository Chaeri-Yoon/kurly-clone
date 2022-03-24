import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import carousel from "../../lib/carousel";
import Ad from "./AutoMoveAd";

export default function () {
    const [salePromoIndex, setSalePromoIndex] = useState(1);
    const [salePromoWidth, setSalePromoWidth] = useState(0);
    const [autoMoveTimeout, setAutoMoveTimeout] = useState<NodeJS.Timeout | null>(null);
    const salePromoFrame = useRef<HTMLUListElement | null>(null);
    const { data: salePromoImages } = useSWR('/api/getSalePromoImages');
    const defaultTransitionTime = 0.4;

    const { initialSetting, moveItem, onClickedBack, onClickedNext } = carousel({
        itemIndex: salePromoIndex,
        setItemIndex: setSalePromoIndex,
        itemWidth: salePromoWidth,
        setItemWidth: setSalePromoWidth,
        autoMoveTimeout,
        setAutoMoveTimeout,
        frame: salePromoFrame,
        itemImageFiles: salePromoImages?.filenames,
        defaultTransitionTime
    });
    useEffect(initialSetting, []);
    useEffect(moveItem, [salePromoWidth, salePromoIndex]);

    return (
        <div className='w-full aspect-[1511/294]'>
            <div className='w-full h-full' >
                <div className='relative w-full h-full overflow-hidden'>
                    <ul className='w-full h-full whitespace-nowrap list-none peer' ref={salePromoFrame}>
                        {salePromoImages?.filenames.map((imageUrl: string, i: number) => (
                            <Ad id={i} key={i} imageUrl={imageUrl} arrFilenames={salePromoImages?.filenames} />
                        ))}
                    </ul>
                    <button onClick={onClickedBack} className='absolute top-1/2 left-0 -translate-y-1/2 w-[4%] aspect-square rounded-full flex  justify-center items-center z-10 bg-kurly-black opacity-0 duration-300 peer-hover:opacity-30 hover:opacity-60'>
                        <FontAwesomeIcon icon={faChevronLeft} inverse className='text-xl' />
                    </button>
                    <button onClick={onClickedNext} className='absolute top-1/2 right-0 -translate-y-1/2 w-[4%] aspect-square rounded-full flex  justify-center items-center z-10 bg-kurly-black opacity-0 duration-300 peer-hover:opacity-30 hover:opacity-60'>
                        <FontAwesomeIcon icon={faChevronRight} inverse className='text-xl' />
                    </button>
                </div>
            </div>
        </div>
    )
}