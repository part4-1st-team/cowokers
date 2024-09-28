import Image from 'next/image';
import IconKaKao from '@/assets/images/img_kakaotalk.png';

function KakaoIcon({ size }: { size: number }) {
  return <Image src={IconKaKao} width={size} height={size} alt='구글' />;
}

export default KakaoIcon;
