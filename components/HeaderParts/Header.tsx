import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons"
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import NavBar from "./NavBar";
import Link from "next/link";
import { ILoggedUser } from 'pages/api/user';
import useCallApi from "@libs/client/useCallApi";
import { useEffect } from "react";
import { useSWRConfig } from "swr";
import { useRouter } from "next/router";

export default function ({ loggedUser }: { loggedUser?: ILoggedUser }) {
    const router = useRouter();
    const { mutate: loggedMutate } = useSWRConfig();
    const [logout, { data }] = useCallApi({ url: '/api/user/logout', method: 'GET' });
    const onLogout = () => logout();
    useEffect(() => {
        if (!data?.ok) return;
        loggedMutate('/api/user');
        router.push('/');
    }, [data]);
    return (
        <header className="text-kurly-black">
            <div className="relative w-full py-3 px-[6.3rem] flex justify-center items-center space-x-2 bg-kurly-purple  ">
                <a className="flex justify-center items-center flex-1 text-[0.82rem]">
                    <span className="font-medium mr-5 text-white">지금 가입하고 인기상품 100원에 받아가세요!</span>
                    <span className="opacity-70"><FontAwesomeIcon icon={faChevronRight} color="white" /></span>
                </a>
                <button className="absolute right-[6.5rem] opacity-70 text-xl"><FontAwesomeIcon icon={faXmark} color="white" /></button>
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
                        <Link href='/'><a><Image src='/kurly-logo.webp' layout="fill"></Image></a></Link>
                    </div>
                </div>
                <div className="w-1/3 flex justify-end items-center">
                    {loggedUser ? (
                        <>
                            <a className="flex flex-col items-center relative group">
                                <div className="flex justify-start items-center">
                                    <span className="px-2 text-kurly-purple border border-kurly-purple rounded-full text-[10px]">일반</span>
                                    <div className="flex justify-center items-center">
                                        <span className="px-[0.1rem]">{loggedUser.name}</span>
                                        <span>님</span>
                                    </div>
                                    <button><FontAwesomeIcon icon={faCaretDown} className="ml-1" /></button>
                                </div>
                                <div className="pl-2 w-full h-full top-full absolute hidden justify-start items-center group-hover:flex hover:flex">
                                    <ul className="p-2 top-2 absolute w-full flex flex-col items-start border border-solid">
                                        <button onClick={() => onLogout()}><li>로그아웃</li></button>
                                    </ul>
                                </div>
                            </a>
                        </>
                    ) : (
                        <>
                            <Link href='/user/join'>회원가입</Link>
                            <span className="px-2 text-kurly-grey opacity-30">|</span>
                            <Link href='/user/login'>로그인</Link>
                        </>
                    )}
                    <a className="flex justify-center items-center">
                        <span className="px-2 text-kurly-grey opacity-30">|</span>
                        <span>고객센터</span>
                        <button><FontAwesomeIcon icon={faCaretDown} className="ml-1" /></button>
                    </a>
                </div>
            </div>
            <NavBar />
        </header>
    )
}