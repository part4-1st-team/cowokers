import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import Image from 'next/image';
import AuthInput from '@/components/input/authInput';
import { signup } from '@/services/Auth.API';
import { yupResolver } from '@hookform/resolvers/yup';
import signUpSchema from '@/schema/signUpSchema';

interface SignUpFormValues {
  nickname: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

const CLIENT_ID = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID; // 카카오 개발자 콘솔에서 발급받은 클라이언트 ID
const REDIRECT_URI = 'http://localhost:3000/oauth/kakao'; // 카카오 로그인 후 리디렉션 URI
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID; // 구글 클라우드 콘솔에서 발급받은 클라이언트 ID
const GOOGLE_REDIRECT_URI = 'http://localhost:3000/oauth/google'; // 구글 로그인 후 리디렉션 URI

/** 테스트 계정
 * id : sin1234@test.com
 * password : Sin1234!
 * nickname : 짱구
 */

function SignUpPage() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: yupResolver(signUpSchema),
    mode: 'onChange',
  });

  const onSubmit: SubmitHandler<SignUpFormValues> = async (data) => {
    try {
      // eslint-disable-next-line no-console
      console.log('회원가입 요청 데이터:', data);
      const response = await signup(data); // API 호출 변경
      // eslint-disable-next-line no-console
      console.log('회원가입 성공:', response);
      // 성공 시 추가 처리
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('회원가입 실패:', error);
    }
  };

  // 카카오 로그인 요청 URL
  const handleKakaoLogin = () => {
    const loginUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
    window.location.href = loginUrl;
  };

  // 구글 로그인 요청 URL
  const handleGoogleLogin = () => {
    const loginUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(GOOGLE_REDIRECT_URI)}&scope=email%20profile`;
    window.location.href = loginUrl;
  };

  return (
    <div className='flex justify-center items-center h-screen'>
      <div className='w-480 h-516 text-text-primary'>
        <h1 className='block w-139 h-48 text-text-primary text-40 leading-48 font-500 mx-auto mb-80'>
          회원가입
        </h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='flex flex-col gap-24'
        >
          <div>
            이름
            <AuthInput
              name='nickname'
              type='text'
              placeholder='이름을 입력해주세요.'
              control={control}
              className='flex align-middle mt-12'
            />
            {errors.nickname && (
              <span className='text-status-danger text-sm'>
                {errors.nickname.message}
              </span>
            )}
          </div>
          <div>
            이메일
            <AuthInput
              name='email'
              type='email'
              placeholder='이메일을 입력해주세요.'
              control={control}
              className='flex align-middle mt-12'
            />
            {errors.email && (
              <span className='text-status-danger text-sm'>
                {errors.email.message}
              </span>
            )}
          </div>
          <div>
            비밀번호
            <AuthInput
              name='password'
              type='password'
              placeholder='비밀번호를 입력해주세요.'
              control={control}
              className='flex align-middle mt-12'
            />
            {errors.password && (
              <span className='text-status-danger text-sm'>
                {errors.password.message}
              </span>
            )}
          </div>
          <div>
            비밀번호 확인
            <AuthInput
              name='passwordConfirmation'
              type='password'
              placeholder='비밀번호를 다시 한 번 입력해주세요.'
              control={control}
              className='flex align-middle mt-12'
            />
            {errors.passwordConfirmation && (
              <span className='text-status-danger text-sm'>
                {errors.passwordConfirmation.message}
              </span>
            )}
          </div>
          <button
            type='submit'
            className='w-full h-47 rounded-12 px-14 py-auto bg-icon-brand mt-40 mb-48'
          >
            회원가입
          </button>
        </form>
        <div className='flex items-center'>
          <div className='flex-grow border-t border-border-primary' />
          <div className='border-white mx-24 text-white'>OR</div>
          <div className='flex-grow border-t border-border-primary' />
        </div>
        <div className='flex justify-between mt-16'>
          <span className='text-text-primary'>간편 로그인하기</span>
          <div className='flex gap-16'>
            <button type='button' onClick={handleKakaoLogin}>
              <Image
                src='/images/img_kakaotalk.png'
                alt='간편 로그인 카카오톡'
                width={42}
                height={42}
              />
            </button>
            <button type='button' onClick={handleGoogleLogin}>
              <Image
                src='/images/img_google.png'
                alt='간편 로그인 구글'
                width={42}
                height={42}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;
