import { mutateData } from '@libs/client/useCallApi';
import type { NextPage } from 'next'
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ILoginResponse } from 'pages/api/user/login';
import { useEffect } from 'react';
import { FieldErrors, useForm } from 'react-hook-form'
import { useSWRConfig } from 'swr';

interface IForm {
    [key: string]: any,
    userId: string,
    password: string
}
const Login: NextPage = () => {
    const { mutate: loggedMutate } = useSWRConfig();
    const router = useRouter();
    const { register, handleSubmit } = useForm<IForm>();
    const [login, { data }] = mutateData<ILoginResponse, null>({ url: '/api/user/login', method: 'POST' });

    const onSubmit = (data: IForm) => login(data);
    const onSubmitFailed = (error: FieldErrors<IForm>) => console.log(error);
    const className = {
        FORM_ELEMENT: 'w-full p-4 border rounded-[0.2rem]'
    }
    useEffect(() => {
        if (Object.keys(data).length === 0) return;
        if (!data.ok) alert(`${data.message || 'Something went wrong.'}`);
        else {
            loggedMutate('/api/user');
            router.push('/');
        }
    }, [data]);
    return (
        <div className='mt-[4.5rem] p-5 w-full flex flex-col items-center'>
            <h1 className='mb-[1.8rem] text-xl font-semibold'>로그인</h1>
            <form onSubmit={handleSubmit(onSubmit, onSubmitFailed)} className='w-[27%] flex flex-col items-start space-y-2'>
                <input className={`${className.FORM_ELEMENT} text-sm`} {...register('userId', { required: true })} placeholder='아이디를 입력해주세요' />
                <input className={`${className.FORM_ELEMENT}  text-sm`} type='password' {...register('password', { required: true })} placeholder='비밀번호를 입력해주세요' />
                <input className={`${className.FORM_ELEMENT} cursor-pointer bg-kurly-purple text-white`} type='submit' value='로그인' />
                <Link href={'/user/join'}><button className={`${className.FORM_ELEMENT} cursor-pointer text-kurly-purple border-kurly-purple`} type='button'>회원가입</button></Link>
            </form>
        </div>
    )
}

export default Login;