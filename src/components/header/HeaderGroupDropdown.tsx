import { IconCheck } from '@/assets/IconList';
import Button from '@/components/button/button';
import Dropdown from '@/components/dropdown/Dropdown';
import useDropdown from '@/hooks/useDropdown';
import useGroups from '@/hooks/useGroups';
import useMemberships from '@/hooks/useMemberships';
import { useRouter } from 'next/router';
import SideTabList from './SideTabList';

function HeaderGroupDropdown() {
  const { handleOffDropdown, handleToggleDropdown, isOpen } = useDropdown();

  const { memberships } = useMemberships();
  const { groups, isGroupsLoading } = useGroups();

  const router = useRouter();
  const { groupId } = router.query;

  let currentGroup: ResponseGroup | undefined;
  if (router.pathname === '/group/[groupId]') {
    const filterGroup = groups.filter((group) => group.id === Number(groupId));
    [currentGroup] = filterGroup;
  }

  const getGroupName = () => {
    if (router.pathname !== '/group/[groupId]') {
      return '팀 선택하기';
    }
    if (currentGroup) {
      return currentGroup.name;
    }
    return '팀 선택하기';
  };

  if (isGroupsLoading) return null;

  return (
    <Dropdown onClose={handleOffDropdown}>
      <Dropdown.Trigger onClick={handleToggleDropdown}>
        <div className='flex items-center gap-11'>
          <p className='text-lg font-medium text-text-primary dark:text-text-primary-dark truncate max-w-110'>
            {getGroupName()}
          </p>
          <IconCheck className='fill-text-inverse' />
        </div>
      </Dropdown.Trigger>
      <Dropdown.Menu isOpen={isOpen}>
        {memberships.map((membership: Membership) => (
          <SideTabList
            onClick={handleOffDropdown}
            key={membership.group.id}
            membership={membership}
          />
        ))}

        <Button
          color='white'
          type='button'
          className='w-full'
          onClick={() => {
            handleOffDropdown();
            router.push('/group/create-group');
          }}
        >
          팀 추가하기
        </Button>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default HeaderGroupDropdown;
