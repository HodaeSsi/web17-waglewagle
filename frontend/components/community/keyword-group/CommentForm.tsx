import { useAddCommentMutation } from '@hooks/thread';
import styles from '@sass/components/community/keyword/CommentForm.module.scss';
import classnames from 'classnames/bind';
import { ChangeEventHandler, FormEventHandler, useState } from 'react';
const cx = classnames.bind(styles);

interface CommentFormProps {
  threadId: string;
  keywordId: string;
}

const CommentForm = ({ threadId, keywordId }: CommentFormProps) => {
  const [contentInputData, setContentInputData] = useState('');

  const { mutate: addComment } = useAddCommentMutation(
    keywordId,
    contentInputData,
    threadId,
  );

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setContentInputData(e.target.value);
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    addComment();
    setContentInputData('');
  };

  return (
    <form className={cx('form')} onSubmit={handleSubmit}>
      <input
        type='text'
        placeholder='내용을 입력하세요.'
        className={cx('input')}
        value={contentInputData}
        onChange={handleChange}
      />
      <button className={cx('button')}>글쓰기</button>
    </form>
  );
};

export default CommentForm;
