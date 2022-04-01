import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Image from "next/image";
import Link from "next/link";

interface IProduct {
    id: number
    imgUrl: string
    name: string
    salePercentage: number
    originalPrice: number
}
export default function ({ id, imgUrl, name, salePercentage, originalPrice }: IProduct) {
    return (
        <Link href={`/product/${id}`}>
            <div className="w-[calc(25%-0.8rem)] inline-block cursor-pointer ">
                <div className="w-full aspect-[250/315] relative">
                    <Image src={imgUrl} layout="fill"></Image>
                    <button className="absolute bottom-4 right-4 flex justify-center items-center w-1/6 aspect-square rounded-full z-10 bg-kurly-purple opacity-60"><FontAwesomeIcon icon={faCartShopping} inverse /></button>
                </div>
                <div className="w-full flex flex-col justify-center items-start">
                    <span className="w-full whitespace-normal mt-3 mb-2">{name}</span>
                    <div>
                        <div className="flex justify-start items-start font-semibold">
                            {salePercentage !== 0 && <span className="mr-1 text-[#FA622F] tracking-wide">{salePercentage}%</span>}
                            <span className="tracking-wide">{((1 - salePercentage * 0.01) * originalPrice).toLocaleString()}원</span>
                        </div>
                        <span className="text-[#A2A2A2] text-[15px] line-through">{salePercentage !== 0 && `${originalPrice.toLocaleString()}원`}</span>
                    </div>
                </div>
            </div>
        </Link>
    )
}