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
        <div>
            <div>
                <button onClick={() => dispatchFuncs.funcGoBack(false)}><FontAwesomeIcon icon={faCaretLeft} /></button>
                <span>주소 재검색</span>
            </div>
            <div>
                <div>{selectedAddress.zonecode}</div>
                <div>{selectedAddress.address}</div>
                <input onChange={onChangeDetailAddress} placeholder="나머지 주소를 입력해주세요." />
                <button onClick={onCompleteAddress} type='button'>주소입력</button>
            </div>
            <div>
                <span>
                    <FontAwesomeIcon icon={faCircleExclamation} />
                    <span>샛별배송 지역 중 배송 불가 장소 안내</span>
                </span>
                <span>관공서/ 학교/ 병원/ 시장/ 공단 지역/ 산간 지역/ 백화점 등</span>
                <span>
                    <span>자세히 보기</span>
                    <FontAwesomeIcon icon={faCaretDown} />
                </span>
            </div>
        </div>
    )
}
export default SearchAddress;