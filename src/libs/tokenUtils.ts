import jwt_decode from 'jwt-decode';
import axios from 'axios';

// Token 구조를 정의하여 사용할 수 있습니다.
interface DecodedToken {
  exp: number;
}

// 리프레시 토큰을 사용하여 액세스 토큰 갱신
export async function refreshAccessToken(): Promise<string> {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) throw new Error('리프레시 토큰이 없습니다.');

  try {
    const response = await axios.post('/auth/refresh', { refreshToken });
    const { accessToken, newRefreshToken } = response.data;

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', newRefreshToken);
    return accessToken;
  } catch (error) {
    console.error('리프레시 토큰 갱신 실패:', error);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    throw new Error('토큰 갱신 실패. 다시 로그인하세요.');
  }
}

// 토큰 만료 여부 확인
export function isTokenExpired(token: string): boolean {
  if (!token) return true;

  const decodedToken = jwt_decode<{ exp: number }>(token);
  const currentTime = Date.now() / 1000;
  return decodedToken.exp < currentTime;
}
