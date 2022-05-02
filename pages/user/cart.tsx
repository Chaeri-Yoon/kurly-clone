import SearchAddress from '@components/Address';
import CartItem from '@components/Cart/CartItem';
import { faCircleCheck, faLocationPin } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import fetchRequest from '@libs/client/fetchRequest';
import useCallApi from '@libs/client/useCallApi';
import { withGetSessionSsr } from '@libs/server/withSession';
import { Cart, Product } from '@prisma/client';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import Popup from 'reactjs-popup';

interface ICartProps {
    address?: string,
    cartProducts?: Product[]
}
const Cart: NextPage<ICartProps> = ({ address, cartProducts }) => {
    const [shippingAddress, setShippingAddress] = useState(`${address || ''}`);
    const [setDBShippingAddress, { data: addressData }] = useCallApi({ url: `/api/user/address`, method: 'POST' });
    useEffect(() => {
        if (!shippingAddress || shippingAddress === '') return;
        setDBShippingAddress({ address: shippingAddress });
    }, [shippingAddress])
    return (
        <div className='mt-12 w-full p-[var(--frame-padding)] flex flex-col items-center'>
            <h1 className='mb-[3.2rem] w-full text-center text-[1.75rem] font-semibold'>장바구니</h1>
            <SelectDeleteProduct />
            <div className='w-full flex justify-between items-start'>
                <div className='flex-1 mr-6 flex flex-col justify-center items-start'>
                    <div className='w-full min-h-[257px] flex flex-col justify-center items-start border-y border-black'>
                        {!cartProducts || cartProducts.length === 0 ? (
                            <span className='w-full text-center self-center text-base'>장바구니에 담긴 상품이 없습니다</span>
                        ) : (
                            <div className='w-full flex flex-col'>
                                <span className='text-lg'>냉장 상품</span>
                                <div className='w-full flex flex-col space-y-12'>
                                    {cartProducts?.map((product) =>
                                        <CartItem
                                            id={product?.id}
                                            name={product?.name}
                                            image={product?.image}
                                            salePercentage={product?.salePercentage}
                                            originalPrice={product?.originalPrice}
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
                            {shippingAddress && <span>{shippingAddress}</span>}
                            <span className='text-sm text-kurly-purple'>샛별배송</span>
                            {shippingAddress === '' && (
                                <Popup trigger={
                                    <button className='w-full py-2 rounded-md text-xs text-kurly-purple border border-kurly-purple'>
                                        배송지 등록
                                    </button>} modal>
                                    <SearchAddress setAddress={setShippingAddress} />
                                </Popup>
                            )}
                        </div>
                        <div className='w-full p-5 flex justify-center items-center bg-[#FAFAFA]'>
                            <div className='w-1/2 flex flex-col items-start space-y-3'>
                                <span>상품금액</span>
                                <span>상품할인금액</span>
                                <span>배송비</span>
                                <span>결제예정금액</span>
                            </div>
                            <div className='w-1/2 flex flex-col items-end space-y-3'>
                                <span>0원</span>
                                <span>0원</span>
                                <span>0원</span>
                                <span><span className='text-[1.38rem]'>0</span>원</span>
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
        const response = await fetchRequest({ url: `${process.env.SERVER_BASEURL}/api/user/userInfo`, method: 'POST', data: { id: loggedUser.id } })
            .then(response => response.json());
        const findCartProducts = response?.cartProducts
            && await fetchRequest(
                {
                    url: `${process.env.SERVER_BASEURL}/api/cart/loadCart`
                    , method: 'POST'
                    , data: { productIds: response.cartProducts.map((product: Cart) => product.productId) }
                }
            ).then(response => response.json());
        return {
            props: {
                address: response?.address,
                cartProducts: findCartProducts?.cartProducts
            },
        };
    },
);
export default Cart;
// ***** To be dealt with *****
// - If there is data inside req.session.user, display the list of products added by the logged user.
// - If there isn't any data on the shipping address, display the button to put one.