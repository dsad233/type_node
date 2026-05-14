import { BadRequest } from 'http-errors';
import { Category, State } from '../../../generated/prisma/enums';

export type ICreatePostDto = {
  title: string;
  context: string | null;
  image: string | null;
  isPublic: State;
  category: Category;
};

export async function CreatePostDto(body: ICreatePostDto) {
  const { title, context, image, isPublic, category } = body;

  if (!title) {
    throw new BadRequest('게시글 제목을 입력해 주세요.');
  }

  if (isPublic) {
    const result = [];
    for (let prop in State) {
      result.push(prop);
    }

    if (!result.includes(isPublic)) {
      throw new BadRequest(
        '공개, 비공개 여부가 올바르지 않은 값 입니다. 다시 입력해 주세요.',
      );
    }
  }

  if (category) {
    const result = [];
    for (let prop in Category) {
      result.push(prop);
    }

    if (!result.includes(category)) {
      throw new BadRequest(
        '올바르지 않은 카테고리 값 입니다. 다시 입력해 주세요.',
      );
    }
  }

  if (title.trim().length < 1 && title.trim().length > 300) {
    throw new BadRequest('게시글 제목은 2자 이상 300자 이하로 입력해 주세요.');
  }

  return {
    title: title.trim(),
    context: context || null,
    image: image ? image?.trim() : null,
    isPublic: isPublic ?? State.TRUE,
    category: category ?? Category.FREE,
  };
}
