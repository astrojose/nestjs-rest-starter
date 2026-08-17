export interface PaginationMeta {
  total: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: PaginationMeta;
}

export abstract class Pagination {
  /**
   * Creates a standardized paginated response object
   */
  static paginate<T, R = T>(
    items: T[],
    totalCount: number,
    queryOptions: { currentPage?: number | string; pageSize?: number | string },
    mapFunction?: (item: T) => R,
  ): PaginatedResult<R> {
    const currentPage = Math.max(1, Number(queryOptions.currentPage) || 1);
    const pageSize = Math.max(
      1,
      Math.min(100, Number(queryOptions.pageSize) || 10),
    );
    const mappedItems = mapFunction
      ? items.map(mapFunction)
      : (items as unknown as R[]);

    return {
      data: mappedItems,
      pagination: {
        total: totalCount,
        currentPage,
        pageSize,
        totalPages: Math.ceil(totalCount / pageSize) || 1,
        totalItems: totalCount,
        itemsPerPage: pageSize,
      },
    };
  }
}
