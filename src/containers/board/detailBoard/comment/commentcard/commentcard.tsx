import { useMutation } from '@tanstack/react-query';
import ProfileImage from '@/components/member/ProfileImage';
import BoardDropdownMenu from '@/components/board/boardDropdown';
import EditInput from '@/components/input/editCommentInput';
import ArticleEdit from '@/hooks/useArticleEdit';
import {
  patchArticleComment,
  deleteArticleComment,
} from '@/services/ArticleCommentAPI';
import useUser from '@/hooks/useUser';
import useToast from '@/components/toast/useToast';

interface CommentCardProps {
  comment: ArticleComment;
  onDeleteSuccess: () => void;
}

function CommentCard({ comment, onDeleteSuccess }: CommentCardProps) {
  const { writer, createdAt, id } = comment;

  // useUser 훅을 사용하여 로그인된 사용자 정보 가져오기
  const { user: currentUser, isLoading: isUserLoading } = useUser();
  const isCommentAuthor = currentUser?.id === writer.id; // 로그인한 사용자가 댓글 작성자인지 확인
  const { toast } = useToast();

  // ArticleEdit 훅 사용
  const {
    isEditing,
    content,
    toggleEditMode,
    handleContentChange,
    setContent,
  } = ArticleEdit(comment.content);

  // 댓글 수정을 위한 useMutation 훅 리팩터링
  const updateCommentMutation = useMutation({
    mutationFn: (newContent: string) => patchArticleComment(id, newContent),
    onSuccess: (updatedComment) => {
      // 수정된 댓글 내용으로 상태 업데이트
      setContent(updatedComment.content);
      toggleEditMode();
      toast('Success', '댓글이 성공적으로 수정되었습니다.');
    },
    onError: () => {
      toast('Error', '댓글 수정이 실패했습니다.');
    },
  });

  // 댓글 삭제를 위한 useMutation 훅 리팩터링
  const removeCommentMutation = useMutation({
    mutationFn: () => deleteArticleComment(id),
    onSuccess: () => {
      toast('Success', '댓글이 성공적으로 삭제되었습니다.');
      onDeleteSuccess();
    },
    onError: () => {
      toast('Error', '댓글 삭제가 실패했습니다.');
    },
  });

  // 수정 완료 함수
  const handleSave = () => {
    updateCommentMutation.mutate(content); // 객체의 mutate 메서드 사용
  };

  // 삭제 완료 함수
  const handleDelete = () => {
    removeCommentMutation.mutate(); // 객체의 mutate 메서드 사용
  };

  // 로딩 상태 처리
  if (isUserLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className='pt-24 pb-24 px-32 bg-background-secondary rounded-12 border border-background-tertiary'>
      <div className='flex flex-col justify-between h-full'>
        {!isEditing && (
          <div className='mt-10 flex justify-between'>
            <p className='w-auto text-lg text-text-secondary font-medium'>
              {content}
            </p>
            {isCommentAuthor && ( // 댓글 작성자만 수정/삭제 드롭다운 표시
              <BoardDropdownMenu
                onEdit={toggleEditMode}
                onDelete={handleDelete}
              />
            )}
          </div>
        )}

        {isEditing && (
          <EditInput
            value={content}
            onChange={handleContentChange}
            onCancel={toggleEditMode}
            onSave={handleSave} // 수정 버튼 클릭 시 handleSave 호출
          />
        )}

        {/* isEditing이 false일 때만 프로필 정보를 보여줌 */}
        {!isEditing && (
          <div className='mt-32 flex justify-between gap-16'>
            <div className='flex items-center gap-10'>
              <div className='w-32 h-32'>
                <ProfileImage userImage={writer.image} size={32} />
              </div>
              <p className='text-text-primary text-md font-medium'>
                {writer.nickname}
              </p>
              <div className='h-12 border border-background-tertiary' />
              <p className='text-md text-text-disabled'>
                {new Date(createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CommentCard;
