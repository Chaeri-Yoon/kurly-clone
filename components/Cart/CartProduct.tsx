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
    quantity: number,
    salePercentage: number,
    originalPrice: number,
    setSelectedProductSum: Dispatch<SetStateAction<number>>,
    setSelectedSalesPriceSum: Dispatch<SetStateAction<number>>
}
export default function ({ id, name, image, quantity, salePercentage, originalPrice, setSelectedProductSum, setSelectedSalesPriceSum }: ICartProduct) {
    const [toggleSelect, setToggleSelect] = useState(true);
    const [changedQuantity, setChangedQuantity] = useState<{ type: 'ADD' | 'MINUS' | null, value: number, prev: number }>({ type: null, value: quantity, prev: quantity - 1 });
    const { mutate: cartProductsMutate } = useSWRConfig();
    const [deleteCartProduct] = actionDataRequest({ url: '/api/cart/deleteCartProduct', method: 'POST' });
    const [modifyCartProduct] = actionDataRequest({ url: '/api/cart/modifyCartProduct', method: 'POST' });
    const saledPrice = (1 - (salePercentage * 0.01)) * originalPrice;

    const onProductSelected = () => setToggleSelect(prev => !prev);
    const onProductDelete = () => {
        cartProductsMutate('/api/cart/loadCartProducts', (prev: any) => {
            const newCartProductLists = prev?.products?.filter((data: any) => data.product.id !== id);
            return { ...prev, products: newCartProductLists }
        }, false);
        deleteCartProduct({ productId: id })
    }
    const onProductChangeQuantity = (changeType: 'ADD' | 'MINUS') => {
        setChangedQuantity(prevData => { return { type: changeType, value: changeType === 'ADD' ? prevData.value + 1 : prevData.value - 1, prev: prevData.value } });
    }
    const sumsUpdate = (isSelected: boolean, isQuantityUpdated = false) => {
        if (!isSelected && isQuantityUpdated) return;
        const quantityDiff = isQuantityUpdated ? Math.abs(changedQuantity.value - changedQuantity.prev) : changedQuantity.value;
        setSelectedProductSum(prev => (isQuantityUpdated ? changedQuantity.type === 'ADD' : isSelected) ? prev + (quantityDiff * saledPrice) : prev - (quantityDiff * saledPrice));
        setSelectedSalesPriceSum(prev => (isQuantityUpdated ? changedQuantity.type === 'ADD' : isSelected) ? prev + (quantityDiff * (originalPrice - saledPrice)) : prev - (quantityDiff * (originalPrice - saledPrice)));
    }
    useEffect(() => {
        sumsUpdate(toggleSelect);
    }, [toggleSelect]);
    useEffect(() => {
        if (changedQuantity.type === null) return;
        sumsUpdate(toggleSelect, true);
        modifyCartProduct({ productId: id, quantity: changedQuantity.value });
    }, [changedQuantity])
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
            <div className="w-1/2 flex justify-between items-center">
                <div className="w-1/2 flex justify-end items-center">
                    <div className="px-3 py-[0.13rem] w-1/2 flex justify-between items-center border">
                        <button className="disabled:text-gray-300" onClick={() => onProductChangeQuantity('MINUS')} disabled={changedQuantity.value === 1}><span>-</span></button>
                        <span>{changedQuantity.value}</span>
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