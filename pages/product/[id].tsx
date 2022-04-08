import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import useSWR from 'swr';
import Image from "next/image";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faCircleQuestion, faHeart, faShareNodes } from '@fortawesome/free-solid-svg-icons';
import { Product } from '@prisma/client';

type TPackageType = {
    [index: string]: string
    ROOM_PAPER: string,
    COOL_STYROFOAM: string,
    ICE_STYROFOAM: string
}
interface IProductDetail {
    product: Product
}
const ProductDetail: NextPage = () => {
    const { query: { id } } = useRouter();
    const { data } = useSWR<IProductDetail>(`/api/product/${id}`);
    const saledPrice = data ? (1 - (data.product.salePercentage * 0.01)) * data.product.originalPrice : 0;
    const className = {
        INFO_ROW_CLASS: 'py-[20px] w-full flex items-start border-b',
        LABEL: 'w-[22%] text-kurly-black'
    }
    const packageType: TPackageType = {
        ROOM_PAPER: '상온/종이포장',
        COOL_STYROFOAM: '냉장/스티로폼',
        ICE_STYROFOAM: '냉동/스티로폼'
    }
    return (
        data ? (
            <div className='w-full p-[var(--frame-padding)] my-[20px] text-sm'>
                <div className='w-full flex justify-start items-start'>
                    <div className="w-[41%] mr-[6%] aspect-[429/553] relative">
                        <Image src={data.product.image} layout="fill"></Image>
                    </div>
                    <div className='flex-1 flex flex-col items-start'>
                        <div className='w-full flex flex-col items-start'>
                            <div className='my-[10px] w-full flex justify-between items-start'>
                                <div className='flex flex-col items-start'>
                                    <span className='mb-[7px] text-2xl font-semibold'>{data.product.name}</span>
                                    <span className='text-kurly-grey '>{data.product.description}</span>
                                </div>
                                <span className='border-[1.5px] rounded-full w-[40px] h-[40px] flex justify-center items-center'><FontAwesomeIcon icon={faShareNodes} /></span>
                            </div>
                            <div className={`${className.INFO_ROW_CLASS} flex-col space-y-[5px]`}>
                                {data.product.salePercentage !== 0 && <span>회원할인가</span>}
                                <div className='mb-[10px] flex justify-start items-center text-3xl'>
                                    <span className='mr-[9px]'>{saledPrice.toLocaleString()}<span className='text-base'> 원</span></span>
                                    {data.product.salePercentage !== 0 && <span className='text-[#FA622F]'>{data.product.salePercentage}%</span>}
                                </div>
                                {data.product.salePercentage !== 0 && (
                                    <div className='flex justify-start items-center text-kurly-grey'>
                                        <span className='line-through mr-[5px]'>{data.product.originalPrice.toLocaleString()}원</span>
                                        <span><FontAwesomeIcon icon={faCircleQuestion} /></span>
                                    </div>
                                )}
                                <span className='text-kurly-purple'>로그인 후, 적립혜택이 제공됩니다.</span>
                            </div>
                            <div className={`${className.INFO_ROW_CLASS} flex-col`}>
                                <div className='mb-[20px] w-full flex justify-start items-center'>
                                    <span className={className.LABEL}>판매단위</span>
                                    <span className=''>{data.product.sellingUnit}</span>
                                </div>
                                <div className='w-full flex justify-start items-center'>
                                    <span className={className.LABEL}>중량/용량</span>
                                    <span className=''>{data.product.weight}</span>
                                </div>
                            </div>
                            <div className={`${className.INFO_ROW_CLASS} justify-start`}>
                                <span className={className.LABEL}>배송구분</span>
                                <span>샛별배송/택배배송</span>
                            </div>
                            <div className={`${className.INFO_ROW_CLASS} justify-start`}>
                                <span className={className.LABEL}>포장타입</span>
                                <div className='flex flex-col items-start'>
                                    <span className='mb-[5px]'>{packageType[data.product.packageType]}</span>
                                    <span className='text-xs text-kurly-grey'>택배배송은 에코포장이 스티로폼으로 대체됩니다.</span>
                                </div>
                            </div>
                            <div className={`${className.INFO_ROW_CLASS} justify-start`}>
                                <span className={className.LABEL}>구매수량</span>
                                <div className='w-[16%] px-[0.5rem] flex justify-between items-center border rounded-[0.2rem]'>
                                    <button className='text-xl'>-</button>
                                    <span>1</span>
                                    <button className='text-xl'>+</button>
                                </div>
                            </div>
                        </div>
                        <div className='pt-8 w-full flex flex-col items-start space-y-4'>
                            <div className='w-full flex justify-end items-center'>
                                <span className='text-[0.812rem]'>총 상품금액 : </span>
                                <div>
                                    <span className='ml-2 text-[2rem]'>{saledPrice.toLocaleString()}</span>
                                    <span className='ml-[0.25rem] text-xl'>원</span>
                                </div>
                            </div>
                            <div className='w-full flex justify-end items-center'>
                                <span className='px-[0.55rem] text-[0.69rem] rounded-full bg-[#FFBF00] text-white'>적립</span>
                                <span className='ml-1'>로그인 후, 회원할인가와 적립혜택 제공</span>
                            </div>
                            <div className='w-full h-14 flex justify-start items-center space-x-2'>
                                <button className='h-full aspect-square border rounded-md'><FontAwesomeIcon icon={faHeart} color='#999' size='2x' /></button>
                                <button className='h-full aspect-square border rounded-md'><FontAwesomeIcon icon={faBell} color='#999' size='2x' /></button>
                                <button className='h-full flex-1  bg-kurly-purple text-white text-base'>장바구니 담기</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
            : <></>
    )
}

export default ProductDetail;