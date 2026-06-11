export type TPaginationDto = {
  page: string;
  pages: string;
};

export async function PaginationDto(
  query: TPaginationDto,
): Promise<TPaginationDto> {
  const { page, pages } = query;
  return {
    page: page ?? '1',
    pages: pages ?? '10',
  };
}
