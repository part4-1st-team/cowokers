import { useRouter } from 'next/router';
import { useState } from 'react';
import AuthInput from '@/components/input/authInput';
import { useForm, SubmitHandler } from 'react-hook-form';
import Image from 'next/image';
import login from '@/services/Auth.API';
import { isAxiosError } from 'axios';
import useUserStore from '@/stores/userStore';
import Link from 'next/link';
import useModalStore from '@/stores/ModalStore';
import PasswordResetModal from '@/components/modal/PasswordResetModal';

type FormValues = {
  email: string;
  password: string;
};

const CLIENT_ID = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID; // 카카오 개발자 콘솔에서 발급받은 클라이언트 ID
const REDIRECT_URI = 'http://localhost:3000/oauth/kakao'; // 카카오 로그인 후 리디렉션 URI
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID; // 구글 클라우드 콘솔에서 발급받은 클라이언트 ID
const GOOGLE_REDIRECT_URI = 'http://localhost:3000/oauth/google'; // 구글 로그인 후 리디렉션 URI

function SignInPage() {
  const router = useRouter();
  const { control, handleSubmit } = useForm<FormValues>();
  const [error, setError] = useState<string | null>(null);
  const { setLogin } = useUserStore(); // 로그인 상태 저장
  const { setModalOpen } = useModalStore(); // 비밀번호 재설정 링크 모달 상태

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const { email, password } = data;

    try {
      // 로그인 API 요청
      const response = await login({ email, password });
      const { user, accessToken, refreshToken } = response;
      // 유저 정보 저장, 쿠키에 토큰 저장
      setLogin(user, accessToken, refreshToken);
      // 에러 메시지 초기화
      setError(null);
      // 로그인 성공 시 그룹 가입 페이지로 이동
      router.push('/group/join-group');
    } catch (err: unknown) {
      // 에러 처리
      if (isAxiosError(err)) {
        const errorMessage =
          err.response?.data?.message || '서버 통신 중 오류가 발생했습니다.';
        setError(errorMessage);
      } else if (err instanceof Error) {
        // 일반 에러 처리
        setError(err.message || '예기치 못한 오류 발생');
      } else {
        // 예상치 못한 예외 처리
        setError('알 수 없는 오류 발생');
      }
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

  // 비밀번호 재설정 모달 핸들러
  const handleOpenPasswordResetModal = () => {
    setModalOpen(<PasswordResetModal />);
  };

  return (
    <div className='flex justify-center items-center h-screen bg-transparent'>
      <div className='w-full max-w-md bg-transparent p-8 rounded-md shadow-md'>
        <h2 className='block text-40 text-text-primary text-center font-500 h-48 mb-80 leading-48'>
          로그인
        </h2>
        {error && <div className='text-text-primary mb-4'>{error}</div>}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='mb-24 text-text-primary'>
            이메일
            <AuthInput
              type='email'
              name='email'
              control={control}
              placeholder='이메일을 입력하세요.'
              className='mt-12 border-background-secondary'
            />
          </div>
          <div className='text-text-primary'>
            비밀번호
            <AuthInput
              type='password'
              name='password'
              control={control}
              placeholder='비밀번호를 입력하세요.'
              className='flex align-center mt-12 border-background-secondary'
            />
          </div>
          <button
            type='button'
            onClick={handleOpenPasswordResetModal}
            className='text-right w-full mt-12'
          >
            <span className='block text-interaction-focus underline decoration-interaction-focus'>
              비밀번호를 잊으셨나요?
            </span>
          </button>
          <button
            type='submit'
            className='w-full mt-40 bg-interaction-focus text-text-primary py-14 rounded-12'
          >
            로그인
          </button>
          <span className='flex justify-center gap-12 text-text-primary font-500 w-full mt-24'>
            <p>아직 계정이 없으신가요?</p>
            <Link
              href='/auth/signup'
              className='text-interaction-focus underline decoration-interaction-focus'
            >
              가입하기
            </Link>
          </span>
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

export default SignInPage;
