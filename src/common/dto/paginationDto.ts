export type TPaginationDto = {
  page: string;
  pages: string;
};

export async function PaginationDto({
  page,
  pages,
}: TPaginationDto): Promise<TPaginationDto> {
  return {
    page: page ?? '1',
    pages: pages ?? '10',
  };
}
