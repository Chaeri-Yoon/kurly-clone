import SearchAddress from '@components/Address';
import CartProduct from '@components/Cart/CartProduct';
import { faCircleCheck, faLocationPin } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { actionDataRequest, loadDataRequest } from '@libs/client/useCallApi';
import { withGetSessionSsr } from '@libs/server/withSession';
import { Cart, Product } from '@prisma/client';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import Popup from 'reactjs-popup';
import useSWR from 'swr';

interface ICartProps {
    address?: string
}
const Cart: NextPage<ICartProps> = ({ address }) => {
    const { data: cartProductsData } = useSWR('/api/cart/loadCartProducts');
    const [shippingAddress, setShippingAddress] = useState(`${address || ''}`);
    const [isAddressPopupOpen, setIsAddressPopupOpen] = useState(false);
    const [setDBShippingAddress] = actionDataRequest({ url: '/api/user/address', method: 'POST' });
    const [selectedProductSum, setSelectedProductSum] = useState(0);
    const [selectedSalesPriceSum, setSelectedSalesPriceSum] = useState(0);
    useEffect(() => {
        if (!shippingAddress || shippingAddress === '') return;
        setIsAddressPopupOpen(false);
        setDBShippingAddress({ address: shippingAddress });
    }, [shippingAddress])
    return (
        <div className='mt-12 w-full p-[var(--frame-padding)] flex flex-col items-center'>
            <h1 className='mb-[3.2rem] w-full text-center text-[1.75rem] font-semibold'>장바구니</h1>
            <SelectDeleteProduct />
            <div className='w-full flex justify-between items-start'>
                <div className='flex-1 mr-6 flex flex-col justify-center items-start'>
                    <div className='w-full min-h-[257px] flex flex-col justify-center items-start border-y border-black'>
                        {!cartProductsData || cartProductsData?.cartProducts?.length === 0 ? (
                            <span className='w-full text-center self-center text-base'>장바구니에 담긴 상품이 없습니다</span>
                        ) : (
                            <div className='w-full flex flex-col'>
                                <span className='text-lg'>냉장 상품</span>
                                <div className='w-full flex flex-col space-y-12'>
                                    {cartProductsData?.cartProducts?.map((product: Product) =>
                                        <CartProduct
                                            key={product?.id}
                                            id={product?.id}
                                            name={product?.name}
                                            image={product?.image}
                                            salePercentage={product?.salePercentage}
                                            originalPrice={product?.originalPrice}
                                            setSelectedProductSum={setSelectedProductSum}
                                            setSelectedSalesPriceSum={setSelectedSalesPriceSum}
                                        />)}
                                </div>
                            </div>
                        )
                        }
                    </div>
                    <SelectDeleteProduct />
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
                                <span>{selectedProductSum.toLocaleString()}원</span>
                                <span>{selectedSalesPriceSum.toLocaleString()}원</span>
                                <span>{selectedProductSum >= 30000 ? 0 : '3,000'}원</span>
                                <span><span className='text-[1.38rem]'>{selectedProductSum.toLocaleString()}</span>원</span>
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
const SelectDeleteProduct = () => {
    return (
        <div className='my-4 w-full flex justify-start items-center space-x-5 text-sm'>
            <div className=' flex justify-start items-center'>
                <FontAwesomeIcon icon={faCircleCheck} className='mr-[0.6rem] text-2xl text-kurly-purple' />
                <span>전체선택 (0/0)</span>
            </div>
            <span className='text-kurly-grey text-opacity-20'>|</span>
            <span>선택삭제</span>
        </div>
    )
}
export const getServerSideProps = withGetSessionSsr(
    async function getServerSideProps({ req }) {
        const { session: { user: loggedUser } } = req;
        if (!loggedUser) {
            return { props: {} }
        }
        const response = await loadDataRequest({ url: `${process.env.SERVER_BASEURL}/api/user/userInfo`, method: 'POST', data: { id: loggedUser.id } });
        return {
            props: {
                address: response?.address
            }
        };
    },
);
export default Cart;