import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classAppend from "../../lib/classAppend";

interface IMoveCarouselButton {
    isLeft: boolean;
    inverseIconColor?: boolean;
    opacityStyle?: boolean;
    onClick: () => void;
    containerStyle?: string;
    buttonStyle?: string;
}
export default function ({ isLeft, inverseIconColor = false, opacityStyle = false, onClick, containerStyle = "", buttonStyle = "" }: IMoveCarouselButton) {
    return (
        <span className={classAppend('inline-block absolute top-1/2 -translate-y-1/2 w-[4%] z-10', opacityStyle ? 'opacity-0 duration-300 group-hover:opacity-50' : '', containerStyle)}>
            <button onClick={onClick} className={classAppend('w-full h-full aspect-square rounded-full flex justify-center items-center', inverseIconColor ? 'bg-kurly-black' : 'bg-white', opacityStyle ? 'opacity-50 duration-300 hover:opacity-100' : '', buttonStyle)}>
                <FontAwesomeIcon icon={isLeft ? faChevronLeft : faChevronRight} inverse={inverseIconColor} className='text-xl' />
            </button>
        </span>
    )
}

