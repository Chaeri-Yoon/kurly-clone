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
    isSelected: boolean,
    isDelete: boolean,
    setProductState: Dispatch<SetStateAction<{ id: number, isSelected: boolean, isDelete: boolean }[]>>,
    setSelectedProductSum: Dispatch<SetStateAction<number>>,
    setSelectedSalesPriceSum: Dispatch<SetStateAction<number>>
}
export default function ({ id, name, image, quantity, salePercentage, originalPrice, isSelected, isDelete, setProductState, setSelectedProductSum, setSelectedSalesPriceSum }: ICartProduct) {
    const { mutate: cartProductsMutate } = useSWRConfig();
    const [deleteCartProduct] = mutateData({ url: `/api/cart/${id}`, method: 'DELETE' });
    const [modifyCartProduct] = mutateData({ url: `/api/cart/${id}`, method: 'PATCH' });
    const saledPrice = (1 - (salePercentage * 0.01)) * originalPrice;

    const handleChangeSelectionState = () => setProductState(prev => prev.map(stateData => stateData.id === id ? { ...stateData, isSelected: !stateData.isSelected } : { ...stateData }));
    const onProductDeleteClicked = () => setProductState(prev => prev.map(stateData => stateData.id === id ? { ...stateData, isDelete: true } : { ...stateData }));
    const handleProductDelete = () => {
        cartProductsMutate('/api/cart', (prev: ICartProductsResponse) => {
            const newCartProductLists = prev?.products?.filter(data => data.product.id !== id);
            return { ...prev, products: newCartProductLists }
        }, false);
        deleteCartProduct();
    }
    const handleProductChangeQuantity = (changeType: 'ADD' | 'MINUS') => {
        const newQuantity = quantity + ((changeType === 'MINUS' ? -1 : 1) * 1);
        cartProductsMutate('/api/cart', (prev: ICartProductsResponse) => {
            const newProducts = prev.products?.map(data => data.product.id === id ? { ...data, quantity: newQuantity } : { ...data })
            return { ...prev, products: [...newProducts!] };
        }, false)
        modifyCartProduct({ quantity: newQuantity });
        sumsUpdate({ type: changeType })
    }
    useEffect(() => {
        return () => {
            setSelectedProductSum(prev => prev - (quantity * originalPrice));
            setSelectedSalesPriceSum(prev => prev - (quantity * (originalPrice - saledPrice)));
            setProductState(prev => ([...prev.filter(stateData => stateData.id !== id)]));
        }
    }, [])
    useEffect(() => { isSelected !== undefined && sumsUpdate({ type: 'toggle' }) }, [isSelected])
    useEffect(() => { isDelete && handleProductDelete() }, [isDelete])
    const sumsUpdate = ({ type }: { type: 'MINUS' | 'ADD' | 'toggle' }) => {
        const operator = type === 'toggle' ? (isSelected ? quantity : -quantity) : (isSelected ? (type === 'ADD' ? 1 : -1) : 0);
        if (operator === 0) return;
        setSelectedProductSum(prev => Math.abs(prev + originalPrice * operator))
        setSelectedSalesPriceSum(prev => Math.abs(prev + (originalPrice - saledPrice) * operator))
    }
    return (
        <div className="w-full flex justify-between items-center">
            <div className="w-1/2 flex justify-start items-center cursor-pointer">
                <button onClick={() => handleChangeSelectionState()}><FontAwesomeIcon icon={isSelected ? faCircleCheck : faCircle} className='mr-8 text-2xl text-kurly-purple' /></button>
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
                        <button className="disabled:text-gray-300" onClick={() => handleProductChangeQuantity('MINUS')} disabled={quantity === 1}><span>-</span></button>
                        <span>{quantity}</span>
                        <button onClick={() => handleProductChangeQuantity('ADD')}><span>+</span></button>
                    </div>
                </div>
                <div className="w-1/2 flex justify-end items-center">
                    <div className="flex flex-col items-end space-y-1">
                        <span>${saledPrice.toFixed(2)}</span>
                        {salePercentage !== 0 && <span className="line-through text-sm text-kurly-grey">${originalPrice.toFixed(2)}</span>}
                    </div>
                    <button onClick={onProductDeleteClicked} className="pl-[1.4rem] pr-3 text-kurly-grey opacity-50"><FontAwesomeIcon icon={faX} /></button>
                </div>
            </div>
        </div >
    )
}