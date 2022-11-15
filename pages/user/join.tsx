import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faCircle, faCircleCheck } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { NextPage } from 'next'
import { FieldErrors, useForm } from 'react-hook-form';
import React, { useEffect, useRef, useState } from 'react';
import { loadData, mutateData } from '@libs/client/useCallApi';
import { useRouter } from 'next/router';
import SearchAddress from '@components/Address';
import { useSWRConfig } from 'swr';
import Popup from '@components/Popup';
import { IDataExistResponse } from 'pages/api/user/dataExist';

interface IForm {
    [key: string]: any,
    userId: string,
    password: string,
    password_confirm: string,
    name: string,
    email: string,
    contact?: string,
    address?: string,
}
interface IDataExist extends Omit<IDataExistResponse, 'ok'> { }
const Join: NextPage = () => {
    const { mutate: loggedMutate } = useSWRConfig();
    const router = useRouter();
    const [address, setAddress] = useState('');
    const [addressPopupOpen, setAddressPopupOpen] = useState(false);
    const { setValue, register, handleSubmit, formState: { errors }, watch } = useForm<IForm>({ mode: 'onChange' });
    const [dataExist, setDataExist] = useState<IDataExist | null>(null);

    const [createUser, { data: createUserData }] = mutateData({ url: '/api/user/join', method: 'POST' });

    // To open validation.
    const idValidateArea: React.MutableRefObject<any> = useRef();
    const passwordValidateArea: React.MutableRefObject<any> = useRef(null);

    const openValidateArea = (openArea: string) => {
        if (openArea === 'id') idValidateArea.current.style.display = 'flex';
        else passwordValidateArea.current.style.display = 'flex';
    }

    // To detect any change in the value of certain fields.
    const userId: React.MutableRefObject<any> = useRef({});
    const password: React.MutableRefObject<any> = useRef({});
    const passwordConfirm: React.MutableRefObject<any> = useRef({});
    const email: React.MutableRefObject<any> = useRef({});
    const agreeAll: React.MutableRefObject<any> = useRef({});
    userId.current = watch('userId', '');
    password.current = watch('password', '');
    passwordConfirm.current = watch('password_confirm', '');
    email.current = watch('email', '');
    agreeAll.current = watch('agree_all');

    useEffect(() => setAddressPopupOpen(false), [address])

    // Handle events involving fetching data and some work related to its response.
    const onCheckExist = async ({ userId, email }: { userId?: string, email?: string }) => {
        const response = await loadData<IDataExistResponse>({ url: `/api/user/dataExist?${userId ? `userId=${userId}` : (email ? `email=${email}` : '')}` });
        if (!response.ok) return;
        if (!response?.isIdExist && !response?.isEmailExist) {
            alert('사용이 가능합니다');
            setDataExist(null);
        }
        else {
            alert(`이미 등록된 ${response?.isIdExist ? '아이디' : '이메일'}입니다`);
            setDataExist(prev => ({ ...prev, isIdExist: response.isIdExist, isEmailExist: response.isEmailExist }))
        }
    }
    const onSubmit = (data: IForm) => createUser(data);
    const onSubmitFailed = (error: FieldErrors<IForm>) => console.log(error);
    useEffect(() => {
        if (!createUserData.ok) return;
        loggedMutate('/api/user?field=name');
        router.push('/');
    }, [createUserData]);

    // To make it easier for common styles to access to classNames.
    const className = {
        ROW: 'w-full flex justify-between items-center',
        LABEL: 'w-[23%] font-semibold',
        DATA_AREA: 'flex-1 flex justify-between items-center',
        DATA_AREA_CHILD: 'py-[0.65rem] rounded-[0.2rem] border',
        INPUT_CONTAINER: 'w-[70%] flex justify-start items-center',
        INPUT: 'px-4 w-full',
        DATA_CONFIRM_BUTTON: 'ml-2 flex-1 border-kurly-purple text-kurly-purple font-semibold',
        CHECK_AREA_CHILD: 'flex-1 flex justify-between items-center',
        REQUIRED: 'text-red-500 text-[0.6rem] font-thin relative -top-1 left-0.5'
    }
    return (
        <div className='p-5 pt-1 w-full flex justify-center items-center'>
            <div className='w-full flex flex-col items-center'>
                <span className='pt-11 text-[1.75rem] font-semibold'>회원가입</span>
                <div className='w-[55%] max-w-[640px] flex flex-col items-center'>
                    <span className='mb-[0.6rem] self-end text-xs'><span className={`${className.REQUIRED} !-left-0.5`}>*</span>필수입력사항</span>
                    <form onSubmit={handleSubmit(onSubmit, onSubmitFailed)} className='w-full flex flex-col items-center'>
                        <div className='p-5 w-full flex flex-col items-center text-sm space-y-5 border-y-2 border-black '>
                            <div className={`${className.ROW}`}>
                                <span className={`${className.LABEL}`}>아이디<span className={`${className.REQUIRED}`}>*</span></span>
                                <div className={`${className.DATA_AREA} w-full`}>
                                    <div className={`${className.INPUT_CONTAINER}`}>
                                        <input onClick={() => openValidateArea('id')} {...register("userId", { required: true, minLength: 6 })} placeholder='6자 이상의 영문 혹은 영문과 숫자를 조합' className={`${className.DATA_AREA_CHILD} ${className.INPUT}`} />
                                    </div>
                                    <button type={'button'} onClick={() => onCheckExist({ userId: userId.current })} className={`${className.DATA_AREA_CHILD} ${className.DATA_CONFIRM_BUTTON}`}>중복확인</button>
                                </div>
                            </div>
                            <div className='ml-[8.7rem] self-start hidden flex-col items-start text-xs' ref={idValidateArea}>
                                <span className={`${(errors?.userId?.type === 'minLength' || userId.current.toString().length === 0) ? 'text-red-500' : 'text-green-500'}`}>6자 이상의 영문 혹은 영문과 숫자를 조합</span>
                                <span className={`${!dataExist ? 'text-black' : ((dataExist?.isIdExist) ? 'text-red-500' : 'text-green-500')}`}>아이디 중복확인</span>
                            </div>
                            <div className={`${className.ROW}`}>
                                <span className={`${className.LABEL}`}>비밀번호<span className={`${className.REQUIRED}`}>*</span></span>
                                <div className={`${className.DATA_AREA}`}>
                                    <div className={`${className.INPUT_CONTAINER}`}><input type='password' {...register("password", { required: true, minLength: 10, validate: value => value === passwordConfirm.current })} placeholder='비밀번호를 입력해주세요' className={`${className.DATA_AREA_CHILD} ${className.INPUT}`} /></div>
                                </div>
                            </div>
                            <div className={`${className.ROW}`}>
                                <span className={`${className.LABEL}`}>비밀번호확인<span className={`${className.REQUIRED}`}>*</span></span>
                                <div className={`${className.DATA_AREA}`}>
                                    <div className={`${className.INPUT_CONTAINER}`}><input onClick={() => openValidateArea('password')} onFocus={() => openValidateArea('password')} type='password' {...register("password_confirm", { required: true, minLength: 10, validate: value => value === password.current })} placeholder='비밀번호를 한번 더 입력해주세요' className={`${className.DATA_AREA_CHILD} ${className.INPUT}`} /></div>
                                </div>
                            </div>
                            <div className='ml-[8.7rem] self-start hidden flex-col items-start text-xs' ref={passwordValidateArea}>
                                <span className={
                                    `${(
                                        passwordConfirm.current.toString().length === 0
                                        || errors?.password?.type === 'minLength'
                                        || errors?.password_confirm?.type === 'minLength'
                                        || (password.current !== passwordConfirm.current)
                                    ) ? 'text-red-500' : 'text-green-500'
                                    }`
                                }>동일한 비밀번호를 입력해주세요.</span>
                            </div>
                            <div className={`${className.ROW}`}>
                                <span className={`${className.LABEL}`}>이름<span className={`${className.REQUIRED}`}>*</span></span>
                                <div className={`${className.DATA_AREA}`}>
                                    <div className={`${className.INPUT_CONTAINER}`}><input {...register("name", { required: true })} placeholder='이름을 입력해주세요' className={`${className.DATA_AREA_CHILD} ${className.INPUT}`} /></div>
                                </div>
                            </div>
                            <div className={`${className.ROW}`}>
                                <span className={`${className.LABEL}`}>이메일<span className={`${className.REQUIRED}`}>*</span></span>
                                <div className={`${className.DATA_AREA}`}>
                                    <div className={`${className.INPUT_CONTAINER}`}>
                                        <input type='email' {...register("email")} placeholder='예: marketkurly@kurly.com' className={`${className.DATA_AREA_CHILD} ${className.INPUT}`} />
                                    </div>
                                    <button type={'button'} onClick={() => onCheckExist({ email: email.current })} className={`${className.DATA_AREA_CHILD} ${className.DATA_CONFIRM_BUTTON}`}>중복확인</button>
                                </div>
                            </div>
                            <div className={`${className.ROW}`}>
                                <span className={`${className.LABEL}`}>휴대폰</span>
                                <div className={`${className.DATA_AREA}`}>
                                    <div className={`${className.INPUT_CONTAINER}`}>
                                        <input type='tel' {...register("contact")} placeholder='숫자만 입력해주세요' className={`${className.DATA_AREA_CHILD} ${className.INPUT}`} />
                                    </div>
                                    <button type={'button'} className={`${className.DATA_AREA_CHILD} ${className.DATA_CONFIRM_BUTTON}`}>인증번호 받기</button>
                                </div>
                            </div>
                            <div className={`${className.ROW}`}>
                                <span className={`${className.LABEL}`}>주소</span>
                                <div className={`${className.DATA_AREA}`}>
                                    <div className={`${className.INPUT_CONTAINER}`}>
                                        {address.length === 0 ? (
                                            <button type={'button'} onClick={() => setAddressPopupOpen(true)} className={`${className.DATA_AREA_CHILD} ${className.DATA_CONFIRM_BUTTON} ml-0`}>
                                                <FontAwesomeIcon icon={faMagnifyingGlass} className='mr-1' />
                                                <span>검색</span>
                                            </button>
                                        ) : (
                                            <input className={`${className.DATA_AREA_CHILD} ${className.INPUT}`} readOnly value={address} {...register("address")} />
                                        )}
                                    </div>
                                    {address.length !== 0 && (
                                        <button type={'button'} onClick={() => setAddressPopupOpen(true)} className={`${className.DATA_AREA_CHILD} ${className.DATA_CONFIRM_BUTTON}`}>
                                            <FontAwesomeIcon icon={faMagnifyingGlass} className='mr-1' />
                                            <span>재검색</span>
                                        </button>
                                    )}
                                    {addressPopupOpen && <Popup setPopupOpen={setAddressPopupOpen}><SearchAddress setAddress={setAddress} /></Popup>}
                                </div>
                            </div>
                        </div>
                        <div className='p-5 w-full flex justify-center items-start text-sm border-b'>
                            <span className={`${className.LABEL}`}>이용약관동의<span className={`${className.REQUIRED}`}>*</span></span>
                            <div className={`flex-1 flex flex-col items-start space-y-3`}>
                                <div className='w-full flex flex-col items-start'>
                                    <div className={`${className.ROW} !justify-start mb-1`}>
                                        <AgreeButton fieldName='agree_all' {...{ 'register': { ...register('agree_all', { validate: value => value === true }) } }} />
                                        <span className='text-lg font-semibold'>전체 동의합니다.</span>
                                    </div>
                                    <span className='ml-[1.6rem] text-xs'>선택항목에 동의하지 않은 경우도 회원가입 및 일반적인 서비스를 이용할 수 있습니다.</span>
                                </div>
                                <div className={`${className.ROW}`}>
                                    <AgreeButton fieldName='agree_1' {...{ 'register': { ...register('agree_1', { validate: value => value === true }) }, setValue, agreeAll }} />
                                    <div className={`${className.CHECK_AREA_CHILD}`}>
                                        <span>이용약관 동의 <span className='text-kurly-grey'>(필수)</span></span>
                                        <button type={'button'} className='text-kurly-purple'>{'약관보기 >'}</button>
                                    </div>
                                </div>
                                <div className={`${className.ROW}`}>
                                    <AgreeButton fieldName='agree_2' {...{ 'register': { ...register('agree_2', { validate: value => value === true }) }, setValue, agreeAll }} />
                                    <div className={`${className.CHECK_AREA_CHILD}`}>
                                        <span >개인정보 수집·이용 동의 <span className='text-kurly-grey'>(필수)</span></span>
                                        <button type={'button'} className='text-kurly-purple'>{'약관보기 >'}</button>
                                    </div>
                                </div>
                                <div className={`${className.ROW}`}>
                                    <AgreeButton fieldName='agree_option' {...{ 'register': { ...register('agree_option') }, setValue }} />
                                    <div className={`${className.CHECK_AREA_CHILD}`}>
                                        <span >개인정보 수집·이용 동의 <span className='text-kurly-grey'>(선택)</span></span>
                                        <button type={'button'} className='text-kurly-purple'>{'약관보기 >'}</button>
                                    </div>
                                </div>
                                <div className={`${className.ROW}`}>
                                    <AgreeButton fieldName='agree_3' {...{ 'register': { ...register('agree_3', { validate: value => value === true }) }, setValue, agreeAll }} />
                                    <div className={`${className.CHECK_AREA_CHILD}`}>
                                        <span> 본인은 만 14세 이상입니다. <span className='text-kurly-grey'>(필수)</span></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <input type='submit' value='가입하기' className='mt-10 px-[5.7rem] py-[1.1rem] rounded-[0.2rem] bg-kurly-purple text-white cursor-pointer' />
                    </form>
                </div>
            </div>
        </div>
    )
}

const AgreeButton = (props: { [key: string]: any, fieldName: string }) => {
    const { fieldName, ...rest } = props;
    const { setValue, agreeAll } = rest;
    const [isAgreed, setIsAgreed] = useState(false);
    const changeAgreeState = (changedByAgreeAll = false) => changedByAgreeAll ? setIsAgreed(agreeAll?.current) : setIsAgreed(prev => !prev);
    useEffect(() => {
        if (fieldName === 'agree_all') return;
        changeAgreeState(true);
        setValue(fieldName, agreeAll?.current);
    }, [agreeAll?.current])

    return (
        <>
            <input type='checkbox' id={fieldName} onClick={() => changeAgreeState()} {...rest.register} className='mr-3 relative text-2xl' />
            <label htmlFor={fieldName} className='absolute bg-white'>
                <FontAwesomeIcon icon={isAgreed ? faCircleCheck : faCircle} className='' />
            </label>
        </>
    )
}

export default Join;