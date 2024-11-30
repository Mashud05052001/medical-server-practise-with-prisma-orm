export const returnMetaData = (
  total: number,
  page: number,
  limit: number,
  data: any
) => ({
  meta: {
    total,
    page,
    limit,
  },
  data,
});
