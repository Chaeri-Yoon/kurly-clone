import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import Ad from "./AutoMoveAd";

export default function () {
    const [salePromoIndex, setSalePromoIndex] = useState(1);
    const [salePromoWidth, setSalePromoWidth] = useState(0);
    const [autoMoveTimeout, setAutoMoveTimeout] = useState<NodeJS.Timeout | null>(null);
    const salePromoFrame = useRef<HTMLUListElement | null>(null);
    const { data: salePromoImages } = useSWR('/api/getSalePromoImages');
    const defaultTransitionTime = 0.4;
    const moveTransitionEffect = (action = `all ${defaultTransitionTime}s ease-out`) => salePromoFrame!.current!.style.transition = action;

    useEffect(() => {
        setSalePromoWidth(salePromoFrame?.current?.offsetWidth ? salePromoFrame?.current?.offsetWidth : window.innerWidth);
        moveTransitionEffect("none");
        setTimeout(() => {
            moveTransitionEffect();
        }, 300);
        window.addEventListener('resize', () => setSalePromoWidth(salePromoFrame?.current?.offsetWidth ? salePromoFrame?.current?.offsetWidth : window.innerWidth));
    }, [])

    useEffect(() => {
        const isStartImageClone = salePromoIndex === salePromoImages?.filenames?.length + 1;
        const isEndImageClone = salePromoIndex === 0;

        if (isStartImageClone || isEndImageClone) {
            setTimeout(() => {
                moveTransitionEffect("none");
                setSalePromoIndex(isStartImageClone ? 1 : salePromoImages?.filenames?.length);
                return;
            }, defaultTransitionTime * 1000);
        }
        else {
            if (autoMoveTimeout) {
                clearTimeout(autoMoveTimeout);
                setAutoMoveTimeout(null);
            }
            setAutoMoveTimeout(setTimeout(() => {
                moveTransitionEffect(`all ${defaultTransitionTime - 0.1}s ease-out`);
                setSalePromoIndex(salePromoIndex + 1);
            }, 5000));
        }

        salePromoFrame!.current!.style.transform = `translateX(-${salePromoIndex * salePromoWidth}px)`;
    }, [salePromoWidth, salePromoIndex]);

    const onClickedBackSalePromo = () => {
        if (salePromoIndex === 0) return;
        moveTransitionEffect();
        setSalePromoIndex(prev => prev - 1);
    }
    const onClickedNextSalePromo = () => {
        if (salePromoIndex === salePromoImages?.filenames.length + 1) return;
        moveTransitionEffect();
        setSalePromoIndex(prev => prev + 1);
    }

    return (
        <div className='w-full aspect-[1511/294]'>
            <div className='w-full h-full' >
                <div className='relative w-full h-full overflow-hidden'>
                    <ul className='w-full h-full whitespace-nowrap list-none peer' ref={salePromoFrame}>
                        {salePromoImages?.filenames.map((imageUrl: string, i: number) => (
                            <Ad id={i} key={i} imageUrl={imageUrl} arrFilenames={salePromoImages?.filenames} />
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
    )
}