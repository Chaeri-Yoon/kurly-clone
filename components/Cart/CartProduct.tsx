import { faCircleCheck, faX } from "@fortawesome/free-solid-svg-icons";
import { faCircle } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Image from "next/image";
import Link from "next/link";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { mutateData } from "@libs/client/useCallApi";
import { useSWRConfig } from "swr";
import { ICartProductsResponse } from "pages/api/cart";

interface ICartProduct {
    id: number,
    name: string,
    image: string,
    quantity: number,
    salePercentage: number,
    originalPrice: number,
    setSelectedProductSum: Dispatch<SetStateAction<number>>,
    setSelectedSalesPriceSum: Dispatch<SetStateAction<number>>
}
export default function ({ id, name, image, quantity, salePercentage, originalPrice, setSelectedProductSum, setSelectedSalesPriceSum }: ICartProduct) {
    const [toggleSelect, setToggleSelect] = useState(true);
    const { mutate: cartProductsMutate } = useSWRConfig();
    const [deleteCartProduct] = mutateData({ url: `/api/cart/${id}`, method: 'DELETE' });
    const [modifyCartProduct] = mutateData({ url: `/api/cart/${id}`, method: 'PATCH' });
    const saledPrice = (1 - (salePercentage * 0.01)) * originalPrice;

    const onProductSelected = () => setToggleSelect(prev => !prev);
    const onProductDelete = () => {
        setToggleSelect(false);
        setTimeout(() => {
            cartProductsMutate('/api/cart', (prev: ICartProductsResponse) => {
                const newCartProductLists = prev?.products?.filter(data => data.product.id !== id);
                return { ...prev, products: newCartProductLists }
            }, false);
            deleteCartProduct()
        }, 1000);
    }
    const onProductChangeQuantity = (changeType: 'ADD' | 'MINUS') => {
        const newQuantity = quantity + ((changeType === 'MINUS' ? -1 : 1) * 1);
        cartProductsMutate('/api/cart', (prev: ICartProductsResponse) => {
            const cartList = prev.products;
            cartList?.some((_, index: number) => {
                const isSelected = cartList[index].product.id === id;
                if (isSelected) cartList[index].quantity = newQuantity;
                return isSelected;
            })
            return { ...prev, products: [...cartList!] };
        }, false);
        modifyCartProduct({ quantity });
    }
    useEffect(() => sumsUpdate(), [toggleSelect, quantity])
    const sumsUpdate = () => {
        setSelectedProductSum(prev => prev + (quantity * originalPrice) * (toggleSelect ? 1 : -1))
        setSelectedSalesPriceSum(prev => prev + (quantity * (originalPrice - saledPrice)) * (toggleSelect ? 1 : -1))
    }
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
            <div className="w-1/2 flex justify-between items-center">
                <div className="w-1/2 flex justify-end items-center">
                    <div className="px-3 py-[0.13rem] w-1/2 flex justify-between items-center border">
                        <button className="disabled:text-gray-300" onClick={() => onProductChangeQuantity('MINUS')} disabled={quantity === 1}><span>-</span></button>
                        <span>{quantity}</span>
                        <button onClick={() => onProductChangeQuantity('ADD')}><span>+</span></button>
                    </div>
                </div>
                <div className="w-1/2 flex justify-end items-center">
                    <div className="flex flex-col items-end space-y-1">
                        <span>${saledPrice.toFixed(2)}</span>
                        {salePercentage !== 0 && <span className="line-through text-sm text-kurly-grey">${originalPrice.toFixed(2)}</span>}
                    </div>
                    <button onClick={() => onProductDelete()} className="pl-[1.4rem] pr-3 text-kurly-grey opacity-50"><FontAwesomeIcon icon={faX} /></button>
                </div>
            </div>
        </div >
    )
}