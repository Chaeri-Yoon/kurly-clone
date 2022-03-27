import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Image from "next/image";

export default function () {
    return (
        /* The data in this code will be replaced with the one getting data through api */
        /* The whole div will be wrapped inside Link */
        <div className="w-[calc(25%-0.8rem)] inline-block cursor-pointer ">
            <div className="w-full aspect-[250/315] relative">
                <Image src='/product-img.jpg' layout="fill"></Image>
                <button className="absolute bottom-4 right-4 flex justify-center items-center w-1/6 aspect-square rounded-full z-10 bg-kurly-purple opacity-60"><FontAwesomeIcon icon={faCartShopping} inverse /></button>
            </div>
            <div className="flex flex-col justify-center items-start">
                <span className="mt-3 mb-2">저탄소 GAP 성주참외 1.1kg (4입)</span>
                <div>
                    <div className="flex justify-start items-start font-semibold ">
                        <span className="mr-1 text-[#FA622F] tracking-wide">10%</span>
                        <span className="tracking-wide">11,420원</span>
                    </div>
                    <span className="text-[#A2A2A2] text-[15px] line-through">12,800원</span>
                </div>
            </div>
        </div>
    )
}