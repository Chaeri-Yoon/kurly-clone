import { Dispatch, MutableRefObject, SetStateAction } from "react";

interface ICarousel {
    itemIndex: number;
    setItemIndex: Dispatch<SetStateAction<number>>;
    itemWidth: number;
    setItemWidth: Dispatch<SetStateAction<number>>;
    autoMoveTimeout?: NodeJS.Timeout | null;
    setAutoMoveTimeout?: Dispatch<SetStateAction<NodeJS.Timeout | null>> | null;
    frame: MutableRefObject<HTMLUListElement | null>;
    itemImageFiles: string[];
    defaultTransitionTime: number;
}

export default function ({
    itemIndex, setItemIndex, itemWidth, setItemWidth,
    autoMoveTimeout = null, setAutoMoveTimeout = null,
    frame, itemImageFiles, defaultTransitionTime }: ICarousel) {
    const moveTransitionEffect = (action = `all ${defaultTransitionTime}s ease-out`) => frame && frame.current && (frame.current.style.transition = action);
    const initialSetting = () => {
        setItemWidth(frame?.current?.offsetWidth ? frame?.current?.offsetWidth : window.innerWidth);
        moveTransitionEffect("none");
        setTimeout(() => {
            moveTransitionEffect();
        }, 300);
        window.addEventListener('resize', () => setItemWidth(frame?.current?.offsetWidth ? frame?.current?.offsetWidth : window.innerWidth));
    };
    const moveItem = () => {
        const isStartImageClone = itemIndex === itemImageFiles?.length + 1;
        const isEndImageClone = itemIndex === 0;

        if (isStartImageClone || isEndImageClone) {
            setTimeout(() => {
                moveTransitionEffect("none");
                setItemIndex(isStartImageClone ? 1 : itemImageFiles?.length);
                return;
            }, defaultTransitionTime * 1000);
        }
        else {
            if (setAutoMoveTimeout !== null) {
                if (autoMoveTimeout) {
                    clearTimeout(autoMoveTimeout);
                    setAutoMoveTimeout(null);
                }
                setAutoMoveTimeout(setTimeout(() => {
                    moveTransitionEffect(`all ${defaultTransitionTime - 0.1}s ease-out`);
                    setItemIndex(itemIndex + 1);
                }, 5000));
            }
        }
        frame && frame.current && (frame.current.style.transform = `translateX(-${itemIndex * itemWidth}px)`);
    };

    const onClickedBack = () => {
        if (itemIndex === 0) return;
        moveTransitionEffect();
        setItemIndex(prev => prev - 1);
    }
    const onClickedNext = () => {
        if (itemIndex === itemImageFiles?.length + 1) return;
        moveTransitionEffect();
        setItemIndex(prev => prev + 1);
    }
    return { initialSetting, moveItem, onClickedBack, onClickedNext };
}