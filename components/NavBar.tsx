import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faMagnifyingGlass, faLocationDot, faHeart, faCartShopping, faCarrot, faAppleWhole, faFish, faDrumstickBite, faBowlingBall, faBreadSlice, faSeedling, faWineBottle, faOilCan, faMugHot, faMugSaucer, faCookieBite } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import classMerge from '../utils/classMerge';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

const styleNavList = 'py-1 border-b border-transparent hover:text-kurly-purple cursor-pointer cursor-pointer text-kurly-black ';
const WholeMenuList = ({ icon, text }: { icon: IconProp, text: string }) => {
    return (
        <li className='px-5 w-full flex justify-between items-center text-xs text-kurly-black'>
            <FontAwesomeIcon icon={icon} />
            <span className='w-[90%]'>{text}</span>
        </li>
    )
}
export default function () {
    const [openWholeCategory, setOpenWholeCategory] = useState(false);
    return (
        <div>
            <div className='border-b border-b-gray-400 border-opacity-20'>
                <nav className="p-[var(--frame-padding)] py-2 w-full flex justify-between items-center text-sm font-semibold">
                    <ul className='w-7/12 flex justify-between items-start text-center'>
                        <li className={styleNavList} onMouseEnter={() => setOpenWholeCategory(true)} onMouseLeave={() => setOpenWholeCategory(false)}>
                            <FontAwesomeIcon icon={faBars} />
                            <span className='inline-block ml-3 text-inherit'>전체 카테고리</span>
                        </li>

                        {["신상품", "베스트", "알뜰쇼핑", "특가/혜택"].map((text, i) => (
                            <li className={`${styleNavList} hover:border-b-kurly-purple`}>
                                {text}
                            </li>
                        ))}
                    </ul>
                    <form className='w-1/4 flex justify-center items-center relative'>
                        <input type="text" placeholder='검색어를 입력해주세요.' className='w-[90%] py-2 px-4 border-gray-50 bg-gray-100 rounded-full text-xs placeholder:text-gray-300 placeholder:font-semibold focus:bg-white focus:outline-gray-50' />
                        <FontAwesomeIcon icon={faMagnifyingGlass} className='absolute right-7 text-lg' />
                    </form>
                    <ul className='flex justify-end items-center space-x-5 text-3xl'>
                        <li className='flex justify-center items-center'><FontAwesomeIcon icon={faLocationDot} /></li>
                        <li className='flex justify-center items-center'><FontAwesomeIcon icon={faHeart} /></li>
                        <li className='flex justify-center items-center'><FontAwesomeIcon icon={faCartShopping} /></li>
                    </ul>
                </nav>
            </div>
            <div className={classMerge(openWholeCategory ? "flex justify-center" : "hidden", "w-1/6 border border-t-0 m-[var(--frame-padding)]")}>
                <ul className='py-1 w-full flex flex-col items-start space-y-3 '>
                    <WholeMenuList icon={faCarrot} text="채소" />
                    <WholeMenuList icon={faAppleWhole} text="과일·견과·쌀" />
                    <WholeMenuList icon={faFish} text="수산·해산·건어물" />
                    <WholeMenuList icon={faDrumstickBite} text="정육·계란" />
                    <WholeMenuList icon={faBowlingBall} text="국·반찬·메인요리" />
                    <WholeMenuList icon={faSeedling} text="샐러드·간편식" />
                    <WholeMenuList icon={faOilCan} text="면·양념·오일" />
                    <WholeMenuList icon={faBowlingBall} text="국·반찬·메인요리" />
                    <WholeMenuList icon={faMugHot} text="생수·음료·우유·커피" />
                    <WholeMenuList icon={faCookieBite} text="간식·과자·떡" />
                    <WholeMenuList icon={faBreadSlice} text="베이커리·치즈·델리" />
                </ul>
            </div>
        </div>
    )
}
