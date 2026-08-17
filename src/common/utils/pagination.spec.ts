import { Pagination } from './pagination';

describe('Pagination Utility', () => {
  it('should format paginated result correctly', () => {
    const items = [{ id: 1, name: 'Test' }];
    const result = Pagination.paginate(items, 10, {
      currentPage: 1,
      pageSize: 5,
    });

    expect(result.data).toEqual(items);
    expect(result.pagination).toEqual({
      total: 10,
      currentPage: 1,
      pageSize: 5,
      totalPages: 2,
      totalItems: 10,
      itemsPerPage: 5,
    });
  });

  it('should transform items with mapFunction if provided', () => {
    const items = [{ id: 1, name: 'item1' }];
    const result = Pagination.paginate(
      items,
      1,
      { currentPage: 1, pageSize: 10 },
      item => item.name.toUpperCase(),
    );

    expect(result.data).toEqual(['ITEM1']);
  });
});
