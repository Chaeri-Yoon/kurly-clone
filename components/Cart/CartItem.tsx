import { faCircleCheck, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Image from "next/image";
import Link from "next/link";

interface ICartItem {
    id: number,
    name: string,
    image: string,
    salePercentage: number,
    originalPrice: number
}
export default function ({ id, name, image, salePercentage, originalPrice }: ICartItem) {
    const saledPrice = (1 - (salePercentage * 0.01)) * originalPrice;
    return (
        <div className="w-full flex justify-between items-center">
            <Link href={`/product/${id}`}>
                <div className="w-1/2 flex justify-start items-center cursor-pointer">
                    <FontAwesomeIcon icon={faCircleCheck} className='mr-8 text-2xl text-kurly-purple' />
                    <div className="flex-1 flex justify-center items-center">
                        <div className="w-[18%] aspect-[60/80] relative">
                            <Image src={image} layout="fill"></Image>
                        </div>
                        <span className="pl-5 flex-1">{name}</span>
                    </div>
                </div>
            </Link>
            <div className="w-1/2 flex justify-end items-center">
                <div className="px-3 py-[0.13rem] w-[24%] flex justify-between items-center border">
                    <span>-</span>
                    <span>1</span>
                    <span>+</span>
                </div>
                <div className="ml-[4.6rem] flex justify-end items-center">
                    <div className="flex flex-col items-end space-y-1">
                        <span>{saledPrice.toLocaleString()}원</span>
                        {salePercentage !== 0 && <span className="line-through text-sm text-kurly-grey">{originalPrice.toLocaleString()}원</span>}
                    </div>
                    <button className="pl-[1.4rem] pr-3 text-kurly-grey opacity-50"><FontAwesomeIcon icon={faX} /></button>
                </div>
            </div>
        </div>
    )
}