import React from 'react';
import IconKebabSmall from '@/assets/icons/ic_kebab_small.svg';
import useModalStore from '@/stores/ModalStore';
import ProfileModal from '../modal/ProfileModal';
import ProfileImage from './ProfileImage';

function MemberInfo({ member }: { member: IMember }) {
  const { setModalOpen } = useModalStore();
  const { userName, userEmail, userImage } = member;

  return (
    <div className='flex justify-between items-center w-fill h-73 rounded-16 px-24 py-20 shadow-md before:bg-background-secondary dark:bg-background-secondary-dark'>
      <button
        type='button'
        onClick={() => setModalOpen(<ProfileModal member={member} />)}
        className='flex flex-start gap-12'
      >
        <ProfileImage userImage={userImage} size={32} />
        <div className='flex flex-col gap-2'>
          <b className='text-text-primary dark:text-text-primary-dark text-md'>
            {userName}
          </b>
          <p className='text-text-default dark:text-text-default-dark text-xs'>
            {userEmail}
          </p>
        </div>
      </button>
      <IconKebabSmall />
    </div>
  );
}

export default MemberInfo;
