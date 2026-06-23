import { BadRequest } from 'http-errors';
import { Category, State } from '../../../generated/prisma/enums';

export type TCreatePostDto = {
  title: string;
  context?: string | undefined;
  image?: string | undefined;
  isPublic: State;
  category: Category;
};

export async function CreatePostDto({
  title,
  context,
  image,
  isPublic,
  category,
}: TCreatePostDto) {
  if (!title) {
    throw new BadRequest('게시글 제목을 입력해 주세요.');
  }

  if (isPublic) {
    if (!Object.values(State).includes(isPublic)) {
      throw new BadRequest(
        '공개, 비공개 여부가 올바르지 않은 값 입니다. 다시 입력해 주세요.',
      );
    }
  }

  if (category) {
    if (!Object.values(Category).includes(category)) {
      throw new BadRequest(
        '올바르지 않은 카테고리 값 입니다. 다시 입력해 주세요.',
      );
    }
  }

  if (title.trim().length < 1 || title.trim().length > 300) {
    throw new BadRequest('게시글 제목은 2자 이상 300자 이하로 입력해 주세요.');
  }

  return {
    title: title.trim(),
    context: context?.trim(),
    image: image?.trim(),
    isPublic: isPublic,
    category: category,
  };
}
