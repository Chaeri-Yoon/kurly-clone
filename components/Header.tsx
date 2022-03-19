import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons"
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import NavBar from "./NavBar";

export default function () {
    return (
        <header className="text-kurly-black">
            <div className="w-full flex py-2 px-[6.3rem] justify-end items-center space-x-2 bg-kurly-purple  ">
                <a className="flex justify-center items-center flex-1 text-[0.82rem]">
                    <span className="font-medium mr-4 text-white">지금 가입하고 인기상품 100원에 받아가세요!</span>
                    <span className="opacity-70"><FontAwesomeIcon icon={faChevronRight} /></span>
                </a>
                <button className="px-2 opacity-70"><FontAwesomeIcon icon={faXmark} /></button>
            </div>
            <div className="my-2 flex justify-between items-start p-[var(--frame-padding)] text-xs ">
                <div className="w-1/3 flex justify-start items-center font-semibold">
                    <a className="py-0.5 px-2 flex justify-center items-center border-[1.4px] border-gray-200 rounded-2xl text-[#818282]">
                        <span className="mr-0.5 text-kurly-purple">샛별·택배</span><span>배송안내</span>
                        <FontAwesomeIcon icon={faChevronRight} className="ml-1 text-[0.6rem]" />
                    </a>
                </div>
                <div className="w-1/3 flex justify-center items-start">
                    <div className="my-1 w-[30%] aspect-[206/158] relative">
                        <Image src='/kurly-logo.webp' layout="fill"></Image>
                    </div>
                </div>
                <div className="w-1/3 flex justify-end items-center divide-x ">
                    <a className="px-2">회원가입</a>
                    <a className="px-2">로그인</a>
                    <a className="px-2">
                        <span>고객센터</span>
                        <button><FontAwesomeIcon icon={faCaretDown} className="ml-1" /></button>
                    </a>
                </div>
            </div>
            <NavBar />
        </header>
    )
}