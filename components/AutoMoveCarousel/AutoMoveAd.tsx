import Image from "next/image";

interface IAd {
    id: number,
    imageUrl: string,
    arrFilenames: string[]
}
export default function ({ id, imageUrl, arrFilenames }: IAd) {
    return (
        <>
            {id === 0 && (
                <li className='relative w-full h-full inline-block'>
                    <Image src={arrFilenames[arrFilenames.length - 1]} layout="fill"></Image>
                </li>
            )}
            <li className='relative w-full h-full inline-block'>
                <Image src={imageUrl} layout="fill"></Image>
            </li>
            {id === arrFilenames.length - 1 && (
                <li className='relative w-full h-full inline-block'>
                    <Image src={arrFilenames[0]} layout="fill"></Image>
                </li>
            )}
        </>
    )
}