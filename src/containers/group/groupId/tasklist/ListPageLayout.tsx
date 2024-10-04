import IconLeftArrowColor from '@/assets/IconLeftArrowColor';
import useQueryParameter from '@/hooks/useQueryParameter';
import { useTheme } from '@/hooks/useThemeContext';
import Link from 'next/link';
import { ReactNode } from 'react';
import DateNavigate from './DateNavigate';
import TaskListMenu from './TaskList/TaskListMenu';
import TaskListAddPlusButton from './TaskListAddPlusButton';
import TodoAddButton from './TodoAddButton';
import useCurrentTaskListName from './useCurrentTaskListName';

function ListPageLayout({ children }: { children: ReactNode }) {
  const { groupId } = useQueryParameter();
  const { currentName } = useCurrentTaskListName();
  const { theme } = useTheme();

  return (
    <main className='main-container relative h-[80vh]'>
      <div className='flex flex-col tablet:flex-row tablet:justify-between  tablet:items-center gap-20 tablet:gap-0'>
        <div className='flex items-center gap-6 tablet:gap-10'>
          <Link href={`/group/${groupId}`}>
            <IconLeftArrowColor
              strokeColor={
                theme === 'dark'
                  ? 'var(--background-secondary-light)'
                  : 'var(--background-secondary)'
              }
              width={32}
              height={32}
            />
          </Link>
          <h2 className='text-md tablet:text-2lg desktop:text-xl font-bold text-text-primary dark:text-text-primary-dark'>
            &apos;{currentName}&apos; 목록의 할 일
          </h2>
        </div>

        <div className='flex justify-center'>
          <DateNavigate />
        </div>
      </div>
      <article className='relative flex w-full h-full gap-10 tablet:gap-20 mt-15 tablet:mt-25'>
        <div className='flex flex-col gap-10'>
          <TaskListMenu />
          <TaskListAddPlusButton />
        </div>
        {children}
        <TodoAddButton />
      </article>
    </main>
  );
}
export default ListPageLayout;
