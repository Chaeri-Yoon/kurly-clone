import type { NextPage } from 'next'

const Login: NextPage = () => {
    const className = {
        FORM_ELEMENT: 'w-full p-4 border rounded-[0.2rem]'
    }
    return (
        <div className='mt-[4.5rem] p-5 w-full flex flex-col items-center'>
            <h1 className='mb-[1.8rem] text-xl font-semibold'>로그인</h1>
            <form className='w-[27%] flex flex-col items-start space-y-2'>
                <input className={`${className.FORM_ELEMENT} text-sm`} placeholder='아이디를 입력해주세요' />
                <input className={`${className.FORM_ELEMENT}  text-sm`} type='password' placeholder='비밀번호를 입력해주세요' />
                <input className={`${className.FORM_ELEMENT} bg-kurly-purple text-white`} type='submit' value='로그인' />
                <button className={`${className.FORM_ELEMENT} text-kurly-purple border-kurly-purple`} type='button'>회원가입</button>
            </form>
        </div>
    )
}

export default Login;