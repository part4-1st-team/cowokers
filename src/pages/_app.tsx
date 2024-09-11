import Header from '@/components/header/Header';
import Modal from '@/components/modal/Modal';
import HalfPage from '@/containers/group/groupId/tasklist/HalfPage';
import ReactQueryProviders from '@/hooks/useReactQuery';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import '../components/calendar/calendar.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ReactQueryProviders>
      <Header />
      <Modal />
      <HalfPage />
      <Component {...pageProps} />
    </ReactQueryProviders>
  );
}
