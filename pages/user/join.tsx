import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { NextPage } from 'next'
import { FieldError, FieldErrors, FieldValues, useForm, ValidateResult } from 'react-hook-form';
import React, { useEffect, useMemo, useState } from 'react';
import { loadData, mutateData } from '@libs/client/useCallApi';
import { useRouter } from 'next/router';
import SearchAddress from '@components/Address';
import { useSWRConfig } from 'swr';
import Popup from '@components/Popup';
import { IDataExistResponse } from 'pages/api/user/dataExist';
import classAppend from '@libs/client/classAppend';
import AgreeButton from '@components/Join/AgreeButton';
import DataValidationArea from '@components/Join/DataValidationArea';
import JoinInput from '@components/Join/JoinInput';

export interface IForm {
    [key: string]: any,
    userId: string,
    password: string,
    password_confirm: string,
    name: string,
    email: string,
    contact?: string,
    address?: string
}
interface IDataExist extends Omit<IDataExistResponse, 'ok'> { }
const Join: NextPage = () => {
    const { mutate: loggedMutate } = useSWRConfig();
    const router = useRouter();
    const [address, setAddress] = useState('');
    const [addressPopupOpen, setAddressPopupOpen] = useState(false);
    const { setValue, register, handleSubmit, formState: { errors }, watch, setError, clearErrors } = useForm<IForm>({ mode: 'onChange', criteriaMode: 'all' });
    const [dataExist, setDataExist] = useState<IDataExist>({ idCheckPass: false, emailCheckPass: false });
    const [createUser, { data: createUserData }] = mutateData({ url: '/api/user/join', method: 'POST' });

    const isPasswordMatchWithConfirm = (password1: string, password2: string) => {
        const isMatch = password1 === password2;
        if (isMatch) errors?.password_confirm && clearErrors('password_confirm');
        else !errors?.password_confirm && setError('password_confirm', { type: 'validate' });
        return isMatch;
    }
    // To detect any change in the value of certain fields.
    const userId = watch('userId', '');
    const name = watch('name', '');
    const password = watch('password', '');
    const passwordConfirm = watch('password_confirm', '');
    const email = watch('email', '');
    const agree_all = watch('agree_all', '');

    // Handle events involving fetching data and some work related to its response.
    const onCheckExist = async ({ userId, email }: { userId?: string, email?: string }) => {
        if (errors.userId?.types?.required || errors.userId?.types?.minLength) return;
        const response = await loadData<IDataExistResponse>({ url: `/api/user/dataExist?${userId ? `userId=${userId}` : (email ? `email=${email}` : '')}` });
        if (!response.ok) return;

        if (!response.idCheckPass || !response.emailCheckPass) alert(`이미 등록된 ${response?.idCheckPass ? '아이디' : '이메일'}입니다`);
        else alert('사용이 가능합니다');
        setDataExist(prev => ({ ...prev, idCheckPass: response.idCheckPass, emailCheckPass: response.emailCheckPass }))
    }
    const onSubmit = (data: IForm) => createUser(data);
    const onSubmitError = (error: FieldErrors<IForm>) => window.scrollTo(0, 0);
    useEffect(() => {
        !dataExist.idCheckPass ? setError('userId', { type: 'existCheck' }) : clearErrors('userId');
        !dataExist.emailCheckPass ? setError('email', { type: 'existCheck' }) : clearErrors('email');
    }, [dataExist]);
    useEffect(() => setAddressPopupOpen(false), [address])
    useEffect(() => {
        if (!createUserData.ok) return;
        loggedMutate('/api/user?field=name');
        router.push('/');
    }, [createUserData]);
    return (
        <div className='p-5 pt-1 w-full flex justify-center items-center'>
            <div className='w-full flex flex-col items-center'>
                <span className='pt-11 text-[1.75rem] font-semibold'>회원가입</span>
                <div className='w-[55%] max-w-[640px] flex flex-col items-center'>
                    <span className='mb-[0.6rem] self-end text-xs'><span className={`${className.REQUIRED} !-left-0.5`}>*</span>필수입력사항</span>
                    <form onSubmit={handleSubmit(onSubmit, onSubmitError)} className='w-full flex flex-col items-center'>
                        <div className='p-5 w-full flex flex-col items-center text-sm space-y-3 border-y-2 border-black '>
                            <JoinInput input={{
                                label: '아이디', required: true, validations: [
                                    { error: errors.userId, validationCheck: errors?.userId?.types?.minLength, message: '6자 이상의 영문 혹은 영문과 숫자를 조합', noValue: userId.length === 0 },
                                    { error: errors.userId, validationCheck: !(dataExist.idCheckPass), message: '아이디 중복확인', noValue: userId.length === 0 }
                                ],
                                sub_child: <button type={'button'} onClick={() => onCheckExist({ userId })} className={`${className.DATA_AREA_CHILD} ${className.DATA_CONFIRM_BUTTON}`}>중복확인</button>
                            }}>
                                <input {...register("userId", { required: true, minLength: 6 })} placeholder='6자 이상의 영문 혹은 영문과 숫자를 조합' className={`${className.DATA_AREA_CHILD} ${className.INPUT}`} />
                            </JoinInput>
                            <JoinInput input={{
                                label: '비밀번호', required: true, validations: [
                                    { error: errors.password, validationCheck: errors?.password?.types?.pattern, message: 'Password should contain at least 1 uppercase, 1 lowercase, 1 number.', noValue: password.length === 0 },
                                    { error: errors.password, validationCheck: errors?.password?.types?.minLength, message: 'Password should be longer than 8.', noValue: password.length === 0 },
                                    { error: errors.password_confirm, validationCheck: errors?.password_confirm?.type === 'validate', message: 'Password does not match.', noValue: password.length === 0 || passwordConfirm.length === 0 }
                                ]
                            }}>
                                <input {...register("password", {
                                    required: true,
                                    pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])./g,
                                    minLength: 8, validate: (value) => isPasswordMatchWithConfirm(value, passwordConfirm)
                                })} placeholder='비밀번호를 입력해주세요' type='password' className={`${className.DATA_AREA_CHILD} ${className.INPUT}`} />
                            </JoinInput>
                            <JoinInput input={{ label: '비밀번호확인', required: true }}>
                                <input {...register("password_confirm", {
                                    required: true, validate: (value) => isPasswordMatchWithConfirm(value, password)
                                })} placeholder='비밀번호를 한번 더 입력해주세요' type='password' className={`${className.DATA_AREA_CHILD} ${className.INPUT}`} />
                            </JoinInput>
                            <JoinInput input={{
                                label: '이름', required: true, validations: [
                                    { error: errors.name, validationCheck: errors?.name, message: 'Enter name', noValue: name.length === 0 }
                                ]
                            }}>
                                <input {...register("name", { required: true })} placeholder='이름을 입력해주세요' className={`${className.DATA_AREA_CHILD} ${className.INPUT}`} />
                            </JoinInput>
                            <JoinInput input={{
                                label: '이메일', required: true, validations: [
                                    { error: errors.email, validationCheck: errors?.email?.types?.required, message: 'Enter email', noValue: email.length === 0 },
                                    { error: errors.email, validationCheck: !(dataExist.emailCheckPass), message: '이메일 중복확인', noValue: email.length === 0 }
                                ], sub_child: <button type={'button'} onClick={() => onCheckExist({ email })} className={`${className.DATA_AREA_CHILD} ${className.DATA_CONFIRM_BUTTON}`}>중복확인</button>
                            }}>
                                <input type='email' {...register("email", { required: true })} placeholder='예: marketkurly@kurly.com' className={`${className.DATA_AREA_CHILD} ${className.INPUT}`} />
                            </JoinInput>
                            <JoinInput input={{ label: '휴대폰', required: false, sub_child: <button type={'button'} className={`${className.DATA_AREA_CHILD} ${className.DATA_CONFIRM_BUTTON}`}>인증번호 받기</button> }}>
                                <input type='tel' {...register("contact")} placeholder='숫자만 입력해주세요' className={`${className.DATA_AREA_CHILD} ${className.INPUT}`} />
                            </JoinInput>
                            <JoinInput input={{
                                label: '주소', required: false, sub_child: (
                                    <>
                                        {address.length !== 0 && (
                                            <button type={'button'} onClick={() => setAddressPopupOpen(true)} className={`${className.DATA_AREA_CHILD} ${className.DATA_CONFIRM_BUTTON}`}>
                                                <FontAwesomeIcon icon={faMagnifyingGlass} className='mr-1' />
                                                <span>재검색</span>
                                            </button>
                                        )}
                                        {addressPopupOpen && <Popup setPopupOpen={setAddressPopupOpen}><SearchAddress setAddress={setAddress} /></Popup>}
                                    </>)
                            }} >
                                {
                                    address.length === 0 ? (
                                        <button type={'button'} onClick={() => setAddressPopupOpen(true)} className={`${className.DATA_AREA_CHILD} ${className.DATA_CONFIRM_BUTTON} ml-0 !w-full`}>
                                            <FontAwesomeIcon icon={faMagnifyingGlass} className='mr-1' />
                                            <span>검색</span>
                                        </button>
                                    ) : (
                                        <input className={`${className.DATA_AREA_CHILD} ${className.INPUT}`} readOnly value={address} {...register("address")} />
                                    )
                                }
                            </JoinInput>
                        </div>
                        <div className='p-5 w-full flex justify-center items-start text-sm border-b'>
                            <span className={`${className.LABEL}`}>이용약관동의<span className={`${className.REQUIRED}`}>*</span></span>
                            <div className={`flex-1 flex flex-col items-start space-y-3`}>
                                <div className='w-full flex flex-col items-start'>
                                    <div className={`${className.ROW} !justify-start mb-1`}>
                                        <AgreeButton id="agree_all" required={true} agree_allChecked={agree_all} setFormValue={setValue} {...{ 'register': { ...register('agree_0') } }} />
                                        <span className='text-lg font-semibold'>전체 동의합니다.</span>
                                    </div>
                                    <span className='ml-[1.6rem] text-xs'>선택항목에 동의하지 않은 경우도 회원가입 및 일반적인 서비스를 이용할 수 있습니다.</span>
                                </div>
                                <div className={`${className.ROW}`}>
                                    <AgreeButton id="agree_1" required={true} agree_allChecked={agree_all} setFormValue={setValue} {...{ 'register': { ...register('agree_1', { validate: value => value === true }) } }} />
                                    <div className={`${className.CHECK_AREA_CHILD}`}>
                                        <span>이용약관 동의 <span className='text-kurly-grey'>(필수)</span></span>
                                        <button type={'button'} className='text-kurly-purple'>{'약관보기 >'}</button>
                                    </div>
                                </div>
                                <div className={`${className.ROW}`}>
                                    <AgreeButton id="agree_2" required={true} agree_allChecked={agree_all} setFormValue={setValue} {...{ 'register': { ...register('agree_2', { validate: value => value === true }) } }} />
                                    <div className={`${className.CHECK_AREA_CHILD}`}>
                                        <span >개인정보 수집·이용 동의 <span className='text-kurly-grey'>(필수)</span></span>
                                        <button type={'button'} className='text-kurly-purple'>{'약관보기 >'}</button>
                                    </div>
                                </div>
                                <div className={`${className.ROW}`}>
                                    <AgreeButton id='agree_option' required={false} agree_allChecked={agree_all} setFormValue={setValue} {...{ 'register': { ...register('agree_option') } }} />
                                    <div className={`${className.CHECK_AREA_CHILD}`}>
                                        <span >개인정보 수집·이용 동의 <span className='text-kurly-grey'>(선택)</span></span>
                                        <button type={'button'} className='text-kurly-purple'>{'약관보기 >'}</button>
                                    </div>
                                </div>
                                <div className={`${className.ROW}`}>
                                    <AgreeButton id="agree_3" required={true} agree_allChecked={agree_all} setFormValue={setValue} {...{ 'register': { ...register('agree_3', { validate: value => value === true }) } }} />
                                    <div className={`${className.CHECK_AREA_CHILD}`}>
                                        <span> 본인은 만 14세 이상입니다. <span className='text-kurly-grey'>(필수)</span></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <input type='submit' value='가입하기' className='mt-10 px-[5.7rem] py-[1.1rem] rounded-[0.2rem] bg-kurly-purple text-white cursor-pointer' />
                    </form>
                </div>
            </div >
        </div >
    )
}

// To make it easier for common styles to access to classNames.
export const className = {
    ROW: 'w-full flex justify-between items-center',
    LABEL: 'w-[23%] font-semibold',
    DATA_AREA: 'flex-1 flex justify-between items-center',
    DATA_AREA_CHILD: 'py-[0.65rem] rounded-[0.2rem] border',
    INPUT_CONTAINER: 'w-full flex justify-start items-center',
    INPUT: 'px-4 w-full',
    DATA_CONFIRM_BUTTON: 'ml-2 w-1/4 border-kurly-purple text-kurly-purple font-semibold',
    CHECK_AREA_CHILD: 'flex-1 flex justify-between items-center',
    REQUIRED: 'text-red-500 text-[0.6rem] font-thin relative -top-1 left-0.5',
    DATA_VALIDATION_AREA: 'ml-[8.7rem] self-start flex flex-col items-start text-xs'
}
export default Join;