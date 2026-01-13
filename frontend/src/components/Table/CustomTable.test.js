import { render, screen } from '@testing-library/react';
import CustomTable from './CustomTable';

jest.mock('../../utils/formatters', () => ({
  __esModule: true,
  default: jest.fn((dateString) => {
    if (!dateString) return '—';
    return dateString;
  })
}));

jest.mock('./SortableHeader', () => () => <th>Header</th>);
jest.mock('../Pagination/SimplePagination', () => () => <div>Pagination</div>);

describe('CustomTable', () => {
  test('renders table with data', () => {
    const mockData = [
      { id: 1, date: '2023-12-31', name: 'Test', quantity: 1, distance: 100 },
    ];

    render(
      <CustomTable
        data={mockData}
        pagination={{ currentPage: 1, itemsPerPage: 15 }}
        setPagination={jest.fn()}
        onSortClick={jest.fn()}
        totalItems={1}
        sortConfig={null}
      />
    );

    expect(screen.getByText('Дата начала')).toBeInTheDocument();
    expect(screen.getByText('Test')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
  });
});