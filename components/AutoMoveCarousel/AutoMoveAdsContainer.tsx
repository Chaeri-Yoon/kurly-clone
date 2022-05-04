import { useEffect, useRef, useState } from "react";
import carousel from "@libs/client/carousel";
import MoveCarouselButton from "../MoveCarouselButton";
import Ad from "./AutoMoveAd";

interface IAdContainerProps {
    salePromoImages: string[]
}
export default function AdContainer({ salePromoImages }: IAdContainerProps) {
    const [salePromoIndex, setSalePromoIndex] = useState(1);
    const [salePromoWidth, setSalePromoWidth] = useState(0);
    const [autoMoveTimeout, setAutoMoveTimeout] = useState<NodeJS.Timeout | null>(null);
    const salePromoFrame = useRef<HTMLUListElement | null>(null);

    const { initialSetting, rotateItem, onClickedBack, onClickedNext } = carousel({
        itemIndex: salePromoIndex,
        setItemIndex: setSalePromoIndex,
        itemWidth: salePromoWidth,
        setItemWidth: setSalePromoWidth,
        autoMoveTimeout,
        setAutoMoveTimeout,
        frame: salePromoFrame,
        itemsLength: salePromoImages.length,
        defaultTransitionTime: 0.4
    });
    useEffect(initialSetting, []);
    useEffect(() => {
        rotateItem();
        return () => {
            if (autoMoveTimeout) {
                clearTimeout(autoMoveTimeout);
                setAutoMoveTimeout(null);
            }
        }
    }, [salePromoWidth, salePromoIndex]);

    return (
        <div className='w-full aspect-[1511/294]'>
            <div className='w-full h-full' >
                <div className='relative w-full h-full overflow-hidden group'>
                    <ul className='w-full h-full whitespace-nowrap list-none' ref={salePromoFrame}>
                        {salePromoImages?.map((imageUrl: string, i: number) => (
                            <Ad id={i} key={i} imageUrl={imageUrl} arrFilenames={salePromoImages} />
                        ))}
                    </ul>
                    <MoveCarouselButton isLeft={true} inverseIconColor={true} opacityStyle={true} onClick={onClickedBack} containerStyle={'left-4'} />
                    <MoveCarouselButton isLeft={false} inverseIconColor={true} opacityStyle={true} onClick={onClickedNext} containerStyle={'right-5'} />
                </div>
            </div>
        </div>
    )
}