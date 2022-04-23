import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faMagnifyingGlass, faLocationDot, faHeart, faCartShopping, faCarrot, faAppleWhole, faFish, faDrumstickBite, faBowlingBall, faBreadSlice, faSeedling, faWineBottle, faOilCan, faMugHot, faMugSaucer, faCookieBite } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import Link from 'next/link';

const styleNavList = 'py-1 border-b border-transparent hover:text-kurly-purple cursor-pointer cursor-pointer text-kurly-black ';
const DropdownList = ({ icon, text }: { icon: IconProp, text: string }) => {
    return (
        <li className='px-5 w-full flex justify-between items-center text-xs text-kurly-black'>
            <FontAwesomeIcon icon={icon} />
            <span className='w-[90%] ml-3 -tracking-[0.3px]'>{text}</span>
        </li>
    )
}
export default function () {

    return (
        <div>
            <div className='border-b border-b-gray-400 border-opacity-20'>
                <nav className="p-[var(--frame-padding)] w-full flex justify-between items-center text-base ">
                    <ul className='relative w-7/12 h-full flex justify-between items-center text-center'>
                        <li className={`${styleNavList} text-left py-3 group`}>
                            <FontAwesomeIcon icon={faBars} />
                            <span className='inline-block ml-3 text-inherit'>전체 카테고리</span>
                            <div className="hidden absolute justify-center top-full h-[276px]  w-1/3 z-[100] group-hover:flex hover:flex">
                                <ul className='top-2 absolute py-2 w-full flex flex-col items-start space-y-5 overflow-y-scroll border border-t-0 bg-white  '>
                                    <DropdownList icon={faCarrot} text="채소" />
                                    <DropdownList icon={faAppleWhole} text="과일·견과·쌀" />
                                    <DropdownList icon={faFish} text="수산·해산·건어물" />
                                    <DropdownList icon={faDrumstickBite} text="정육·계란" />
                                    <DropdownList icon={faBowlingBall} text="국·반찬·메인요리" />
                                    <DropdownList icon={faSeedling} text="샐러드·간편식" />
                                    <DropdownList icon={faOilCan} text="면·양념·오일" />
                                    <DropdownList icon={faBowlingBall} text="국·반찬·메인요리" />
                                    <DropdownList icon={faMugHot} text="생수·음료·우유·커피" />
                                    <DropdownList icon={faCookieBite} text="간식·과자·떡" />
                                    <DropdownList icon={faBreadSlice} text="베이커리·치즈·델리" />
                                </ul>
                            </div>
                        </li>

                        {["신상품", "베스트", "알뜰쇼핑", "특가/혜택"].map((text, i) => (
                            <li className={`${styleNavList} hover:border-b-kurly-purple`} key={i}>
                                {text}
                            </li>
                        ))}
                    </ul>
                    <form className='py-2 w-1/4 flex justify-center items-center relative'>
                        <input type="text" placeholder='검색어를 입력해주세요.' className='w-[90%] py-2 px-4 border-gray-50 bg-gray-100 rounded-full text-xs placeholder:text-gray-300 placeholder:font-semibold focus:bg-white focus:outline-gray-50' />
                        <FontAwesomeIcon icon={faMagnifyingGlass} className='absolute right-7 text-lg' />
                    </form>
                    <ul className='py-2 flex justify-end items-center space-x-5 text-3xl'>
                        <li className='flex justify-center items-center'><FontAwesomeIcon icon={faLocationDot} className='cursor-pointer' /></li>
                        <li className='flex justify-center items-center'><FontAwesomeIcon icon={faHeart} className='cursor-pointer' /></li>
                        <Link href={'/user/cart'}><li className='flex justify-center items-center'><FontAwesomeIcon icon={faCartShopping} className='cursor-pointer' /></li></Link>
                    </ul>
                </nav>
            </div>
        </div >
    )
}
