import {
  MouseEventHandler,
  ChangeEventHandler,
  FormEventHandler,
  useState,
  useEffect,
} from 'react';
import { useRouter } from 'next/router';
import useAutoComplete from '@hooks/useAutoComplete';
import {
  SearchResultListLayout,
  AutoCompleteFormLayout,
} from '@components/community';
import styles from '@sass/components/community/KeywordAdderLayout.module.scss';
import classnames from 'classnames/bind';
import useKeywordListQuery from '@hooks/useKeywordListQuery';
import checkIsExistKeyword from '@utils/checkIsExistKeyword';
import useAddKeywordMutation from '@hooks/useAddKeywordMutation';
import { MyKeywordData } from '#types/types';
import useJoinKeywordMutation from '@hooks/useJoinKeywordMutation';
const cx = classnames.bind(styles);

interface KeywordAdderProps {
  theme: string;
  addButtonValue: React.ReactNode | string;
  handleChangePrevKeyword: (prevKeyword: MyKeywordData) => void;
}

const KeywordAdder = ({
  theme,
  addButtonValue,
  handleChangePrevKeyword,
}: KeywordAdderProps) => {
  const router = useRouter();
  const communityId: string = router.query.id as string;

  const { data: communityKeywordData } = useKeywordListQuery(communityId);
  const { mutate: addKeywordMutate } = useAddKeywordMutation(
    handleChangePrevKeyword,
  );
  const { mutate: joinKeywordMutate, isError: isJoinError } =
    useJoinKeywordMutation(handleChangePrevKeyword);

  const { searchKeyword, searchResult, changeSearchKeyword } =
    useAutoComplete(communityKeywordData);
  const [isOpenDropdown, setIsOpenDropDown] = useState<boolean>(false);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    // 키워드가 커뮤니티에 존재하는지 확인하여 id 혹은 false를 반환하는 함수
    const keywordId = checkIsExistKeyword(searchKeyword, communityKeywordData);

    // 추상화 수준을 맞춰주기 위해서 join과 add 모두 mutation 내부에서 myKeywordList를 갱신함
    if (keywordId) {
      const joinKeywordData = {
        keywordId,
        communityId,
        keywordName: searchKeyword,
      };
      joinKeywordMutate(joinKeywordData);
    } else {
      const addKeywordData = {
        keywordName: searchKeyword,
        communityId,
      };
      addKeywordMutate(addKeywordData);
    }

    setIsOpenDropDown(false);
    changeSearchKeyword('');
  };

  const handleChangeSearchKeyword: ChangeEventHandler<HTMLInputElement> = (
    e,
  ) => {
    setIsOpenDropDown(true);
    changeSearchKeyword(e.target.value);
  };

  const handleMouseDownResultItem: MouseEventHandler<HTMLLIElement> = (e) => {
    e.preventDefault();
    const target = e.target as HTMLLIElement;
    changeSearchKeyword(target.innerText);
  };

  useEffect(() => {
    if (isJoinError) {
      alert('키워드 가입 중 문제가 발생했습니다.');
    }
  }, [isJoinError]);

  return (
    <div
      className={cx(theme)}
      onFocus={() => setIsOpenDropDown(true)}
      onBlur={() => setIsOpenDropDown(false)}
    >
      {isOpenDropdown && (
        <SearchResultListLayout layoutTheme={theme}>
          {searchResult.map((word, index) => (
            <li onMouseDown={handleMouseDownResultItem} key={index}>
              {word}
            </li>
          ))}
        </SearchResultListLayout>
      )}
      <AutoCompleteFormLayout layoutTheme={theme} handleSubmit={handleSubmit}>
        <input
          type='text'
          value={searchKeyword}
          onChange={handleChangeSearchKeyword}
          aria-label='관심사 키워드 입력 영역'
          placeholder='키워드를 입력해주세요.'
        />
        <button type='submit' aria-label='관심사 키워드 추가 버튼'>
          {addButtonValue}
        </button>
      </AutoCompleteFormLayout>
    </div>
  );
};

export default KeywordAdder;
