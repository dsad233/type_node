import { BadRequest } from 'http-errors';

export type TRequestPostDto = {
  search?: string | null;
  category?: string | null;
  isPublic?: string | null;
  orderby: string;
};

export async function RequestPostDto({
  search,
  category,
  isPublic,
  orderby,
}: TRequestPostDto): Promise<TRequestPostDto> {
  if (!isPublic) {
    throw new BadRequest(
      'isPublic 파라미터 값이 존재하지 않습니다. 다시 요청해 주세요.',
    );
  }

  if (!orderby) {
    throw new BadRequest(
      'orderby 파라미터 값이 존재하지 않습니다. 다시 요청해 주세요.',
    );
  }

  return {
    search: search ? search.trim() : null,
    category: category && category.trim() !== 'ALL' ? category : null,
    isPublic: isPublic ? isPublic.trim() : null,
    orderby: orderby.trim(),
  };
}
