import { faCircleCheck, faX } from "@fortawesome/free-solid-svg-icons";
import { faCircle } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Image from "next/image";
import Link from "next/link";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { actionDataRequest } from "@libs/client/useCallApi";
import { useSWRConfig } from "swr";

interface ICartProduct {
    id: number,
    name: string,
    image: string,
    salePercentage: number,
    originalPrice: number,
    setSelectedProductSum: Dispatch<SetStateAction<number>>,
    setSelectedSalesPriceSum: Dispatch<SetStateAction<number>>
}
export default function ({ id, name, image, salePercentage, originalPrice, setSelectedProductSum, setSelectedSalesPriceSum }: ICartProduct) {
    const [toggleSelect, setToggleSelect] = useState(true);
    const { mutate: cartProductsMutate } = useSWRConfig();
    const [deleteCartProduct, { data: deleteCartProductData }] = actionDataRequest({ url: '/api/cart/deleteCartProduct', method: 'POST' });
    const saledPrice = (1 - (salePercentage * 0.01)) * originalPrice;
    const onProductSelected = () => setToggleSelect(prev => !prev);
    const onProductDelete = () => deleteCartProduct({ productId: id });
    const sumsUpdate = (isSelected = toggleSelect) => {
        setSelectedProductSum(prev => isSelected ? prev + saledPrice : prev - saledPrice);
        setSelectedSalesPriceSum(prev => isSelected ? prev + (originalPrice - saledPrice) : prev - (originalPrice - saledPrice));
    }
    useEffect(() => {
        sumsUpdate();
    }, [toggleSelect])
    useEffect(() => {
        if (!deleteCartProductData?.ok) return;
        cartProductsMutate('/api/cart/loadCartProducts', (prev: any) => {
            const newCartProductLists = prev?.cartProducts?.filter((data: any) => data.id !== id);
            return { ...prev, cartProducts: newCartProductLists }
        }, false);
    }, [deleteCartProductData])
    useEffect(() => {
        return () => sumsUpdate(false)
    }, [])
    return (
        <div className="w-full flex justify-between items-center">
            <div className="w-1/2 flex justify-start items-center cursor-pointer">
                <button onClick={() => onProductSelected()}><FontAwesomeIcon icon={toggleSelect ? faCircleCheck : faCircle} className='mr-8 text-2xl text-kurly-purple' /></button>
                <Link href={`/product/${id}`}>
                    <div className="flex-1 flex justify-center items-center">
                        <div className="w-[18%] aspect-[60/80] relative">
                            <Image src={image} layout="fill"></Image>
                        </div>
                        <span className="pl-5 flex-1">{name}</span>
                    </div>
                </Link>
            </div>
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
                    <button onClick={() => onProductDelete()} className="pl-[1.4rem] pr-3 text-kurly-grey opacity-50"><FontAwesomeIcon icon={faX} /></button>
                </div>
            </div>
        </div >
    )
}