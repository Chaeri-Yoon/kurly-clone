import { faCircleCheck, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { faCircle } from "@fortawesome/free-regular-svg-icons";
import { ICartActions } from "pages/user/cart";

interface ICartProduct {
    id: number,
    name: string,
    image: string,
    quantity: number,
    salePercentage: number,
    originalPrice: number,
    isSelected: boolean,
    setCartActions: Dispatch<SetStateAction<ICartActions[]>>
}
export default function ({ id, name, image, quantity, salePercentage, originalPrice, isSelected, setCartActions }: ICartProduct) {
    const [selectedState, setSelectedState] = useState(isSelected);
    const handleProductSelected = () => setSelectedState(prev => !prev);
    const handleProductDeleted = () => setCartActions(prev => ([...prev, { action: "deleted", data: { id } }]));
    const handleProductUpdated = ({ action, updatedQuantity }: { action: 'quantity', updatedQuantity: number }) => setCartActions(prev => ([...prev, { action, data: { id, updatedQuantity } }]));
    const saledPrice = (1 - (salePercentage * 0.01)) * originalPrice;
    useEffect(() => setCartActions(prev => ([...prev, { action: "selected", data: { id, selected: selectedState, originalPrice, saledPrice, quantity } }])), [selectedState]);
    useEffect(() => { if (selectedState !== isSelected) setSelectedState(isSelected) }, [isSelected]);
    return (
        <div className="w-full flex justify-between items-center">
            <div className="w-1/2 flex justify-start items-center cursor-pointer">
                <button onClick={handleProductSelected}><FontAwesomeIcon icon={selectedState ? faCircleCheck : faCircle} className='mr-8 text-2xl text-kurly-purple' /></button>
                <Link href={`/product/${id}`}>
                    <div className="flex-1 flex justify-center items-center">
                        <div className="w-[18%] aspect-[60/80] relative">
                            <Image src={image} layout="fill"></Image>
                        </div>
                        <span className="pl-5 flex-1">{name}</span>
                    </div>
                </Link>
            </div>
            <div className="w-1/2 flex justify-between items-center">
                <div className="w-1/2 flex justify-end items-center">
                    <div className="px-3 py-[0.13rem] w-1/2 flex justify-between items-center border">
                        <button className="disabled:text-gray-300" onClick={() => handleProductUpdated({ action: "quantity", updatedQuantity: quantity - 1 })} disabled={quantity === 1}><span>-</span></button>
                        <span>{quantity}</span>
                        <button onClick={() => handleProductUpdated({ action: "quantity", updatedQuantity: quantity + 1 })}><span>+</span></button>
                    </div>
                </div>
                <div className="w-1/2 flex justify-end items-center">
                    <div className="flex flex-col items-end space-y-1">
                        <span>${saledPrice.toFixed(2)}</span>
                        {salePercentage !== 0 && <span className="line-through text-sm text-kurly-grey">${originalPrice.toFixed(2)}</span>}
                    </div>
                    <button onClick={handleProductDeleted} className="pl-[1.4rem] pr-3 text-kurly-grey opacity-50"><FontAwesomeIcon icon={faX} /></button>
                </div>
            </div>
        </div >
    )
}