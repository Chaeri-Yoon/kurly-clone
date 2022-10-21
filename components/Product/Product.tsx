import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { actionDataRequest } from "@libs/client/useCallApi";

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
    const [addProductToCart] = actionDataRequest({ url: '/api/cart/addCartProduct', method: 'POST' });
    const onAddToCartClicked = () => addProductToCart({ productId: id, quantity: 1 })
    return (
        <div className="w-[calc(25%-0.8rem)] inline-block cursor-pointer relative">
            <div className="w-full aspect-[250/315] relative">
                <Link href={`/product/${id}`}>
                    <a>
                        <Image src={imgUrl} layout="fill"></Image>
                    </a>
                </Link>
                <button onClick={() => onAddToCartClicked()} className="absolute bottom-2 right-2 flex justify-center items-center w-1/6 aspect-square rounded-full z-10 bg-kurly-purple opacity-50 active:opacity-100">
                    <FontAwesomeIcon icon={faCartShopping} inverse />
                </button>
            </div>
            <Link href={`/product/${id}`}>
                <div className="w-full flex flex-col justify-center items-start">
                    <span className="w-full whitespace-normal mt-3 mb-2">{name}</span>
                    <div>
                        <div className="flex justify-start items-start font-semibold">
                            {salePercentage !== 0 && <span className="mr-1 text-[#FA622F] tracking-wide">{salePercentage}%</span>}
                            <span className="tracking-wide">${((1 - salePercentage * 0.01) * originalPrice).toFixed(2)}</span>
                        </div>
                        <span className="text-[#A2A2A2] text-[15px] line-through">{salePercentage !== 0 && `$${originalPrice}`}</span>
                    </div>
                </div>
            </Link>
        </div>
    )
}