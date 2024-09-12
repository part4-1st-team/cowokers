import Button from '@/components/button/button';
import { deleteTaskComment, patchTaskComment } from '@/services/TaskCommentAPI';
import getDate from '@/utils/getDate';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import KebabDropdown from './KebabDropdown';

function Comment({ comment }: { comment: Comment }) {
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const {
    id: commentId,
    user,
    createdAt,
    updatedAt,
    content,
    taskId,
    userId,
  } = comment;

  const { nickname } = user;

  const queryClient = useQueryClient();

  const handleEditing = () => {
    setIsEditing(true);
  };

  const patchTaskCommentMutation = useMutation({
    mutationFn: (newContent: string) =>
      patchTaskComment(taskId, commentId, newContent),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getTaskCommentList', taskId],
      });
      setIsEditing(false);
    },
    onError: () => {},
  });

  const deleteTaskCommentMutation = useMutation({
    mutationFn: () => deleteTaskComment(taskId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getTaskCommentList', taskId],
      });
    },
    onError: () => {},
  });

  const handlePatchTaskComment: SubmitHandler<CommentState> = (data) => {
    const { content } = data;
    patchTaskCommentMutation.mutate(content);
  };

  const { handleSubmit, register } = useForm<CommentState>({
    mode: 'onSubmit',
    defaultValues: {
      content: content,
    },
  });

  if (isEditing)
    return (
      <div className='w-full pb-16 border-b border-background-tertiary border-opacity-10'>
        <form
          className='flex flex-col gap-8'
          onSubmit={handleSubmit(handlePatchTaskComment)}
        >
          <textarea
            className='bg-background-secondary w-full h-fit resize-none text-md font-normal text-text-primary outline-none'
            placeholder='댓글을 입력해주세요'
            {...register('content')}
          />

          <div className='flex justify-end'>
            <div className='flex gap-8 items-center'>
              <button
                type='button'
                onClick={() => setIsEditing(false)}
                className='text-text-default text-md font-semibold w-48 h-32'
              >
                취소
              </button>
              <Button type='submit' color='outline' className='w-74 h-32'>
                수정하기
              </Button>
            </div>
          </div>
        </form>
      </div>
    );

  return (
    <div className='w-full flex flex-col gap-16 border-b border-background-tertiary pb-16 border-opacity-10'>
      <div className='flex justify-between items-center'>
        <span className='text-md font-normal text-text-primary'>{content}</span>
        <KebabDropdown
          handleEdit={handleEditing}
          handleDelete={deleteTaskCommentMutation.mutate}
        />
      </div>
      <div className='flex justify-between items-center'>
        <div className='flex gap-12 items-center'>
          <div className='w-32 h-32 rounded-[9999px] bg-white' />
          <span className='text-md font-medium text-text-primary'>
            {nickname}
          </span>
        </div>
        <span className='text-md font-normal text-text-secondary'>
          {getDate(updatedAt)}
        </span>
      </div>
    </div>
  );
}
export default Comment;
