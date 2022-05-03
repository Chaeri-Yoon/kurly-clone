import { faCaretDown, faCaretLeft, faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Dispatch, SetStateAction, useState } from "react";
import DaumPostcode, { Address } from "react-daum-postcode"

interface IDispatchFuncs {
    funcGoBack: Dispatch<SetStateAction<boolean>>,
    funcSetAddress: Dispatch<SetStateAction<string>>
}
interface ISelectedAddress {
    address: string,
    zonecode: string
}
interface IDetailAddressProps {
    selectedAddress: ISelectedAddress,
    dispatchFuncs: IDispatchFuncs
}
const SearchAddress = ({ setAddress }: { setAddress: Dispatch<SetStateAction<string>> }) => {
    const [completeSearch, setCompleteSearch] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState<ISelectedAddress>();
    const handleComplete = (data: Address) => {
        if (!(data.address && data.zonecode)) return;
        setSelectedAddress({
            address: data.address,
            zonecode: data.zonecode
        })
        setCompleteSearch(true);
    }
    return (
        <div className="w-[30rem] aspect-[13/14] bg-white border">
            {completeSearch ? (
                <DetailAddress
                    selectedAddress={{ address: selectedAddress?.address || '', zonecode: selectedAddress?.zonecode || '' }}
                    dispatchFuncs={{ funcGoBack: setCompleteSearch, funcSetAddress: setAddress }}
                />
            ) : <DaumPostcode onComplete={handleComplete} style={{ width: '100%', height: '100%' }} />}
        </div>
    )
}
const DetailAddress = ({ selectedAddress, dispatchFuncs }: IDetailAddressProps) => {
    const [detailAddress, setDetailAddress] = useState('');
    const onChangeDetailAddress = (event: React.ChangeEvent<HTMLInputElement>) => setDetailAddress(event.target.value)
    const onCompleteAddress = () => {
        const fullAddress = `${selectedAddress.address} ${selectedAddress.zonecode} ${detailAddress}`;
        dispatchFuncs.funcSetAddress(fullAddress);
    }
    return (
        <div className="py-10 w-full flex flex-col items-start">
            <div className="px-5 pb-2 w-full flex justify-start items-center border-b font-bold">
                <button className="mr-4" onClick={() => dispatchFuncs.funcGoBack(false)}><FontAwesomeIcon icon={faCaretLeft} size={'lg'} /></button>
                <span>주소 재검색</span>
            </div>
            <div className="px-3 w-full flex flex-col">
                <div className="py-3 w-full flex flex-col items-start space-y-2">
                    <div className="px-4 py-3 border rounded-[0.2rem]">{selectedAddress.zonecode}</div>
                    <div className="px-4 py-3 w-full border rounded-[0.2rem]">{selectedAddress.address}</div>
                    <input className="px-4 py-3 w-full border rounded-[0.2rem] placeholder-gray-200" onChange={onChangeDetailAddress} placeholder="나머지 주소를 입력해주세요." />
                    <button className="py-3 w-full bg-kurly-purple rounded-[0.2rem] text-white" onClick={onCompleteAddress} type='button'>주소입력</button>
                </div>
                <div className="mt-4 py-6 w-full flex flex-col items-center text-xs rounded-[0.2rem] bg-gray-100">
                    <span className="mb-1 flex justify-center items-center text-red-800 font-bold">
                        <FontAwesomeIcon className="mr-1" icon={faCircleExclamation} />
                        <span>샛별배송 지역 중 배송 불가 장소 안내</span>
                    </span>
                    <span className="text-kurly-black mb-5">관공서/ 학교/ 병원/ 시장/ 공단 지역/ 산간 지역/ 백화점 등</span>
                    <span className="flex justify-center items-center text-kurly-grey">
                        <span className="mr-1">자세히 보기</span>
                        <FontAwesomeIcon icon={faCaretDown} />
                    </span>
                </div>
            </div>
        </div>
    )
}
export default SearchAddress;