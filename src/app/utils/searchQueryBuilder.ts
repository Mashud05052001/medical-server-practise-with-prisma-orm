import { Prisma } from "@prisma/client";
import { TPaginationOptions } from "../interface/pagination";
import { calculatePagination } from "../helpers/paginationHelpers";

type TQueryBuilderParams<TWhereInput> = {
  filters: Record<string, any>;
  searchableFields?: string[];
  additionalConditions?: TWhereInput[];
  pagination: TPaginationOptions;
};

type TReturnBuilderParams<TWhereInput> = {
  where: TWhereInput;
  orderBy: Record<string, string>;
  limit: number;
  page: number;
  skip: number;
};

export const searchQueryBuilder = <TWhereInput>({
  filters,
  searchableFields = [],
  additionalConditions = [],
  pagination,
}: TQueryBuilderParams<TWhereInput>): TReturnBuilderParams<TWhereInput> => {
  const { searchTerm, ...filterData } = filters;
  const { limit, page, skip, sortBy, sortOrder } =
    calculatePagination(pagination);

  // Initialize the conditions array with any additional conditions
  const andConditions: TWhereInput[] = [...additionalConditions];

  // Handle the search term
  if (searchTerm) {
    andConditions.push({
      OR: searchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    } as TWhereInput);
  }

  // Handle specific filter conditions
  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.keys(filterData).map((key) => ({
      [key]: {
        equals: filterData[key],
      },
    }));
    andConditions.push({ AND: filterConditions } as TWhereInput);
  }
  console.dir(andConditions, { depth: "Infinite" });
  return {
    where: (andConditions.length > 0
      ? { AND: andConditions }
      : {}) as TWhereInput,
    orderBy: { [sortBy]: sortOrder },
    skip,
    limit,
    page,
  };
};
