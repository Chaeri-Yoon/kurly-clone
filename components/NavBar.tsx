import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faMagnifyingGlass, faLocationDot, faHeart, faCartShopping } from '@fortawesome/free-solid-svg-icons';
export default function () {
    return (
        <nav className="py-2 w-full flex justify-between items-center p-[var(--frame-padding)] text-sm font-semibold">
            <ul className='w-7/12 flex justify-between items-center text-center'>
                <li>
                    <FontAwesomeIcon icon={faBars} />
                    <span className='inline-block ml-3'>전체 카테고리</span>
                </li>
                <li>신상품</li>
                <li>베스트</li>
                <li>알뜰쇼핑</li>
                <li>특가/혜택</li>
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
    )
}
