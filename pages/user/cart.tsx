import { faCircleCheck, faLocationPin } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { NextPage } from 'next'
const Cart: NextPage = () => {
    return (
        <div className='mt-12 w-full p-[var(--frame-padding)] flex flex-col items-center'>
            <h1 className='mb-[3.2rem] w-full text-center text-[1.75rem] font-semibold'>장바구니</h1>
            <SelectDeleteProduct />
            <div className='w-full flex justify-between items-start'>
                <div className='flex-1 mr-6 flex flex-col justify-center items-start'>
                    <div className='w-full min-h-[257px] flex justify-center items-center border-y border-black'>
                        {// If there is any product added to the cart, display the list of them
                            //
                        }
                        <span className='w-full text-center text-base'>장바구니에 담긴 상품이 없습니다</span>
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
                            <span>등록한 주소</span>
                            <span className='text-sm text-kurly-purple'>샛별배송</span>
                            <button className='w-full py-2 rounded-md text-xs text-kurly-purple border border-kurly-purple'>배송지 변경</button>
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
                <FontAwesomeIcon icon={faCircleCheck} className='mr-[0.6rem] text-2xl' />
                <span>전체선택 (0/0)</span>
            </div>
            <span className='text-kurly-grey text-opacity-20'>|</span>
            <span>선택삭제</span>
        </div>
    )
}
export default Cart;

// ***** To be dealt with *****
// - If there is data inside req.session.user, display the list of products added by the logged user.
// - Find data on the shipping address registered when the logged user signed up.