import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faCircle } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { NextPage } from 'next'
import { FieldErrors, SubmitHandler, useForm } from 'react-hook-form';
import React from 'react';

interface IForm {
    [key: string]: any,
    id: string,
    password: string,
    password_confirm: string,
    name: string,
    email?: string,
    contact: string,
    address?: string
}
const Join: NextPage = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<IForm>({ mode: 'onChange' });
    const onSubmit = (data: SubmitHandler<IForm>) => {
        console.log(data);
    }
    const onSubmitFailed = (error: FieldErrors<IForm>) => {
        console.log(error);
    }
    const className = {
        ROW: 'w-full flex justify-between items-center',
        LABEL: 'w-[23%] font-semibold',
        DATA_AREA: 'flex-1 flex justify-between items-center',
        DATA_AREA_CHILD: 'py-[0.65rem] rounded-[0.2rem] border',
        INPUT_CONTAINER: 'w-[70%] flex justify-start items-center',
        INPUT: 'px-4 w-full',
        DATA_CONFIRM_BUTTON: 'ml-2 flex-1 border-kurly-purple text-kurly-purple font-semibold',
        CHECK_AREA_CHILD: 'flex-1 flex justify-between items-center',
        CHECK_BUTTON: 'mr-3 text-2xl',
        REQUIRED: 'text-red-500 text-[0.6rem] font-thin relative -top-1 left-0.5',
        DEFAULT_ERROR_MESSAGE: `${!errors || !errors.id && '!text-black'}`
    }
    return (
        <div className='w-full flex justify-center items-center'>
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
                                        <input {...register("id", { required: true, minLength: 6 })} placeholder='6자 이상의 영문 혹은 영문과 숫자를 조합' className={`${className.DATA_AREA_CHILD} ${className.INPUT}`} />
                                    </div>
                                    <button className={`${className.DATA_AREA_CHILD} ${className.DATA_CONFIRM_BUTTON}`}>중복확인</button>
                                </div>
                            </div>
                            {/*
                            <div className='ml-[8.7rem] self-start flex flex-col items-start text-xs'>
                                <span className={`${className.DEFAULT_ERROR_MESSAGE} ${errors?.id?.type === 'minLength' ? 'text-red-500' : (errors?.id?.type === 'required' ? 'text-red-500' : 'text-green-500')}`}>6자 이상의 영문 혹은 영문과 숫자를 조합</span>
                                <span className={`${className.DEFAULT_ERROR_MESSAGE} ${errors?.id?.type === 'required' ? 'text-red-500' : 'text-green-500'}`}>아이디 중복확인</span>
                            </div>
                            */}
                            <div className={`${className.ROW}`}>
                                <span className={`${className.LABEL}`}>비밀번호<span className={`${className.REQUIRED}`}>*</span></span>
                                <div className={`${className.DATA_AREA}`}>
                                    <div className={`${className.INPUT_CONTAINER}`}><input type='password' {...register("password", { required: true, minLength: 10 })} placeholder='비밀번호를 입력해주세요' className={`${className.DATA_AREA_CHILD} ${className.INPUT}`} /></div>
                                </div>
                            </div>
                            <div className={`${className.ROW}`}>
                                <span className={`${className.LABEL}`}>비밀번호확인<span className={`${className.REQUIRED}`}>*</span></span>
                                <div className={`${className.DATA_AREA}`}>
                                    <div className={`${className.INPUT_CONTAINER}`}><input type='password' {...register("password_confirm", { required: true, minLength: 10 })} placeholder='비밀번호를 한번 더 입력해주세요' className={`${className.DATA_AREA_CHILD} ${className.INPUT}`} /></div>
                                </div>
                            </div>
                            <div className={`${className.ROW}`}>
                                <span className={`${className.LABEL}`}>이름<span className={`${className.REQUIRED}`}>*</span></span>
                                <div className={`${className.DATA_AREA}`}>
                                    <div className={`${className.INPUT_CONTAINER}`}><input {...register("name", { required: true })} placeholder='이름을 입력해주세요' className={`${className.DATA_AREA_CHILD} ${className.INPUT}`} /></div>
                                </div>
                            </div>
                            <div className={`${className.ROW}`}>
                                <span className={`${className.LABEL}`}>이메일</span>
                                <div className={`${className.DATA_AREA}`}>
                                    <div className={`${className.INPUT_CONTAINER}`}>
                                        <input type='email' {...register("email")} placeholder='예: marketkurly@kurly.com' className={`${className.DATA_AREA_CHILD} ${className.INPUT}`} />
                                    </div>
                                    <button className={`${className.DATA_AREA_CHILD} ${className.DATA_CONFIRM_BUTTON}`}>중복확인</button>
                                </div>
                            </div>
                            <div className={`${className.ROW}`}>
                                <span className={`${className.LABEL}`}>휴대폰</span>
                                <div className={`${className.DATA_AREA}`}>
                                    <div className={`${className.INPUT_CONTAINER}`}>
                                        <input type='number' {...register("contact", { required: true })} placeholder='숫자만 입력해주세요' className={`${className.DATA_AREA_CHILD} ${className.INPUT}`} />
                                    </div>

                                    <button className={`${className.DATA_AREA_CHILD} ${className.DATA_CONFIRM_BUTTON}`}>인증번호 받기</button>
                                </div>
                            </div>
                            <div className={`${className.ROW}`}>
                                <span className={`${className.LABEL}`}>주소</span>
                                <div className={`${className.DATA_AREA}`}>
                                    <div className={`${className.INPUT_CONTAINER}`}>
                                        <button className={`${className.DATA_AREA_CHILD} ${className.INPUT} flex justify-center items-center border-kurly-purple text-kurly-purple font-semibold`}>
                                            <FontAwesomeIcon icon={faMagnifyingGlass} className='mr-1' />
                                            <span>주소 검색</span>
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className='p-5 w-full flex justify-center items-start text-sm border-b'>
                            <span className={`${className.LABEL}`}>이용약관동의<span className={`${className.REQUIRED}`}>*</span></span>
                            <div className={`flex-1 flex flex-col items-start space-y-3`}>
                                <div className='w-full flex flex-col items-start'>
                                    <div className={`${className.ROW} !justify-start mb-1`}>
                                        <span className={`${className.CHECK_BUTTON}`}><FontAwesomeIcon icon={faCircle} /></span>
                                        <span className='text-lg font-semibold'>전체 동의합니다.</span>
                                    </div>
                                    <span className='ml-9 text-xs'>선택항목에 동의하지 않은 경우도 회원가입 및 일반적인 서비스를 이용할 수 있습니다.</span>
                                </div>
                                <div className={`${className.ROW}`}>
                                    <span className={`${className.CHECK_BUTTON}`}><FontAwesomeIcon icon={faCircle} /></span>
                                    <div className={`${className.CHECK_AREA_CHILD}`}>
                                        <span>이용약관 동의 <span className='text-kurly-grey'>(필수)</span></span>
                                        <button className='text-kurly-purple'>{'약관보기 >'}</button>
                                    </div>
                                </div>
                                <div className={`${className.ROW}`}>
                                    <span className={`${className.CHECK_BUTTON}`}><FontAwesomeIcon icon={faCircle} /></span>
                                    <div className={`${className.CHECK_AREA_CHILD}`}>
                                        <span >개인정보 수집·이용 동의 <span className='text-kurly-grey'>(필수)</span></span>
                                        <button className='text-kurly-purple'>{'약관보기 >'}</button>
                                    </div>
                                </div>
                                <div className={`${className.ROW}`}>
                                    <span className={`${className.CHECK_BUTTON}`}><FontAwesomeIcon icon={faCircle} /></span>
                                    <div className={`${className.CHECK_AREA_CHILD}`}>
                                        <span >개인정보 수집·이용 동의 <span className='text-kurly-grey'>(선택)</span></span>
                                        <button className='text-kurly-purple'>{'약관보기 >'}</button>
                                    </div>
                                </div>
                                <div className={`${className.ROW}`}>
                                    <span className={`${className.CHECK_BUTTON}`}><FontAwesomeIcon icon={faCircle} /></span>
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

export default Join;