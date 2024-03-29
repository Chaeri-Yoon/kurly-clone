import SearchAddress from '@components/Address';
import CartProduct from '@components/Cart/CartProduct';
import { faCircleCheck, faLocationPin } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { mutateData, loadData, IDataResponse } from '@libs/client/useCallApi';
import { Cart, Product } from '@prisma/client';
import type { NextPage } from 'next';
import { ICartProductsResponse } from 'pages/api/cart';
import { useEffect, useState } from 'react';
import Popup from 'reactjs-popup';
import useSWR from 'swr';

interface IUserAddress extends IDataResponse {
    loggedUser: {
        id: string,
        address: string
    }
}
export interface ICartActions {
    action: 'selected' | 'quantity' | 'deleted',
    data: {
        id: number,
        [key: string]: any
    }
}
const Cart: NextPage = () => {
    // Cart에서 isSelected 관리하게해야 all/partial select 가능
    const { data: cartData, isValidating, mutate } = useSWR<ICartProductsResponse>('/api/cart');
    const [cartActions, setCartActions] = useState<ICartActions[]>([]);
    const [deleteCartProduct] = mutateData({ url: '/api/cart', method: 'DELETE' });
    const [modifyCartProduct] = mutateData({ url: '/api/cart', method: 'PATCH' });

    // Address
    const [shippingAddress, setShippingAddress] = useState('');
    const [isAddressPopupOpen, setIsAddressPopupOpen] = useState(false);
    const [setDBShippingAddress] = mutateData({ url: '/api/user', method: 'PATCH' });

    // Selected Product
    const [selectedProductSum, setSelectedProductSum] = useState(0);
    const [selectedSalesPriceSum, setSelectedSalesPriceSum] = useState(0);

    const handleCartActions = () => {
        cartActions.forEach(cartAction => {
            switch (cartAction.action) {
                case 'selected':
                    const data = cartAction.data;
                    const operator = cartAction.data.selected === true ? 1 : -1;
                    const selectUpdatedList = cartData?.products?.map(data => data.product.id === cartAction.data.id ? { ...data, isSelected: cartAction.data.selected } : { ...data }) || [];
                    mutate(cartData ? { ...cartData, products: [...selectUpdatedList] } : undefined, false);
                    setSelectedProductSum(prev => prev + (operator * data.originalPrice * data.quantity));
                    setSelectedSalesPriceSum(prev => prev + (operator * (data.originalPrice - data.saledPrice)));
                    return;
                case 'deleted':
                    const deleteUpdatedList = cartData?.products?.filter(data => data.product.id !== cartAction.data.id) || [];
                    mutate(cartData ? { ...cartData, products: [...deleteUpdatedList] } : undefined, false);
                    deleteCartProduct({ id: cartAction.data.id });
                    return;
                case 'quantity':
                    const quantity = cartAction.data.updatedQuantity;
                    const quantityUpdatedList = cartData?.products?.map(data => data.product.id === cartAction.data.id ? { ...data, quantity } : { ...data }) || [];
                    mutate(cartData ? { ...cartData, products: [...quantityUpdatedList] } : undefined, false);
                    modifyCartProduct({ id: cartAction.data.id, quantity });
                    return;
            }
        })
        setCartActions([]);
    }
    useEffect(() => {
        (async () => {
            const response = await loadData<IUserAddress>({ url: '/api/user?field=address' })
            setShippingAddress(response.loggedUser.address || '')
        })();
    }, [])
    useEffect(() => {
        if (!shippingAddress || shippingAddress === '') return;
        setIsAddressPopupOpen(false);
        setDBShippingAddress({ address: shippingAddress });
    }, [shippingAddress])
    useEffect(() => {
        if (!cartActions || cartActions.length === 0) return;
        handleCartActions();
    }, [cartActions])
    useEffect(() => {
        if (cartData?.ok) {
            setSelectedProductSum(0);
            cartData.products?.map(product => product.isSelected && setSelectedProductSum(prev => prev + product.product.originalPrice * product.quantity))

            setSelectedSalesPriceSum(0);
            cartData.products?.map(product => product.isSelected && setSelectedSalesPriceSum(prev => prev + (0.01 * product.product.salePercentage * product.product.originalPrice * product.quantity)))
        }
    }, [cartData])
    return (
        <div className='mt-12 w-full p-[var(--frame-padding)] flex flex-col items-center'>
            <h1 className='mb-[3.2rem] w-full text-center text-[1.75rem] font-semibold'>장바구니</h1>
            <ProductActionByAll />
            <div className='w-full flex justify-between items-start'>
                <div className='flex-1 mr-6 flex flex-col justify-center items-start'>
                    <div className='w-full min-h-[257px] flex flex-col justify-center items-start border-y border-black'>
                        {
                            isValidating
                                ? <span className='w-full text-center self-center text-base'>장바구니를 로드 중입니다.</span>
                                : (!cartData || cartData?.products?.length === 0 ? (
                                    <span className='w-full text-center self-center text-base'>장바구니에 담긴 상품이 없습니다</span>
                                ) : (
                                    <div className='my-3 w-full flex flex-col'>
                                        <div className='w-full flex flex-col space-y-12'>
                                            {cartData?.products?.map((element: { product: Product, quantity: number, isSelected: boolean }) => {
                                                return <CartProduct
                                                    key={element?.product?.id}
                                                    id={element?.product?.id}
                                                    name={element?.product?.name}
                                                    image={element?.product?.image}
                                                    quantity={element?.quantity}
                                                    salePercentage={element?.product?.salePercentage}
                                                    originalPrice={element?.product?.originalPrice}
                                                    isSelected={element?.isSelected}
                                                    setCartActions={setCartActions}
                                                />
                                            }
                                            )}
                                        </div>
                                    </div>
                                )
                                )
                        }
                    </div>
                    <ProductActionByAll />
                </div>
                <div className='w-[27.3%] flex flex-col items-start text-base'>
                    <div className='w-full flex flex-col items-center border'>
                        <div className='w-full p-5 flex flex-col items-start space-y-3'>
                            <span className='w-full flex justify-start items-center'>
                                <FontAwesomeIcon icon={faLocationPin} className='mr-[0.3rem]' />
                                <span>배송지</span>
                            </span>
                            <span>{shippingAddress}</span>
                            <span className='text-sm text-kurly-purple'>샛별배송</span>
                            <button onClick={() => setIsAddressPopupOpen(true)} className='w-full py-2 rounded-md text-xs text-kurly-purple border border-kurly-purple'>
                                배송지 {shippingAddress.length === 0 ? '등록' : '변경'}
                            </button>
                            <Popup open={isAddressPopupOpen}>
                                <SearchAddress setAddress={setShippingAddress} />
                            </Popup>
                        </div>
                        <div className='w-full p-5 flex justify-center items-center bg-[#FAFAFA]'>
                            <div className='w-1/2 flex flex-col items-start space-y-3'>
                                <span>상품금액</span>
                                <span>상품할인금액</span>
                                <span>배송비</span>
                                <span>결제예정금액</span>
                            </div>
                            <div className='w-1/2 flex flex-col items-end space-y-3'>
                                <span>${selectedProductSum.toFixed(2)}</span>
                                <span>${selectedSalesPriceSum.toFixed(2)}</span>
                                <span>${(selectedProductSum - selectedSalesPriceSum) >= 30 ? 0 : '5'}</span>
                                <span>$<span className='text-[1.38rem]'>{(selectedProductSum - selectedSalesPriceSum) >= 30 ? (selectedProductSum - selectedSalesPriceSum).toFixed(2) : (5 + (selectedProductSum - selectedSalesPriceSum)).toFixed(2)}</span></span>
                            </div>
                        </div>
                    </div>
                    <button className='mt-5 py-4 w-full rounded-md bg-[#DDDDDD] text-white'>상품을 담아주세요</button>
                    <ul className='mt-[1.4rem] w-full p-5 flex flex-col items-start list-disc text-xs'>
                        <li>쿠폰/적립금을 주문서에서 사용 가능합니다</li>
                        <li>[배송준바중] 이전까지 주문 취소 가능합니다.</li>
                        <li>{`[마이컬리>주문내역 상세페이지]에서 직접 취소하실 수 있습니다.`}</li>
                    </ul>
                </div>
            </div>
        </div>
    )
};
const ProductActionByAll = () => {
    return (
        <div className='my-4 w-full flex justify-start items-center space-x-5 text-sm'>
            <div className=' flex justify-start items-center'>
                <button>
                    <FontAwesomeIcon icon={faCircleCheck} className='mr-[0.6rem] text-2xl text-kurly-purple' />
                </button>
                <span>전체선택</span>
            </div>
            <span className='text-kurly-grey text-opacity-20'>|</span>
            <button>선택삭제</button>
        </div>
    )
}
export default Cart;