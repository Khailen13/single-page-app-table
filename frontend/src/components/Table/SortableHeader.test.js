import { render, screen, fireEvent } from '@testing-library/react';
import SortableHeader from './SortableHeader';

describe('SortableHeader', () => {
  const mockOnSortClick = jest.fn();

  beforeEach(() => {
    mockOnSortClick.mockClear();
  });

  test('shows bi-arrows-vertical icon when not sorted', () => {
  render(
    <table>
      <thead>
        <tr>
          <SortableHeader
            field="name"
            label="Название"
            onSortClick={jest.fn()}
          />
        </tr>
      </thead>
    </table>
  );

  const icon = screen.getByText('Название').querySelector('i');

  expect(icon).toHaveClass('bi');
  expect(icon).toHaveClass('bi-arrows-vertical');

  expect(icon).not.toHaveClass('bi-sort-down-alt');
  expect(icon).not.toHaveClass('bi-sort-down');
});

test('shows bi-sort-down-alt icon when sorted ascending', () => {
    render(
      <table>
        <thead>
          <tr>
            <SortableHeader
              field="name"
              label="Название"
              sortConfig={{ field: 'name', direction: 'asc' }}
              onSortClick={mockOnSortClick}
            />
          </tr>
        </thead>
      </table>
    );

    const icon = screen.getByText('Название').querySelector('i');
    expect(icon).toHaveClass('bi-sort-down-alt');
    expect(icon).not.toHaveClass('bi-arrows-vertical');
  });

  test('shows bi-sort-down icon when sorted descending', () => {
    render(
      <table>
        <thead>
          <tr>
            <SortableHeader
              field="name"
              label="Название"
              sortConfig={{ field: 'name', direction: 'desc' }}
              onSortClick={mockOnSortClick}
            />
          </tr>
        </thead>
      </table>
    );

    const icon = screen.getByText('Название').querySelector('i');
    expect(icon).toHaveClass('bi-sort-down');
    expect(icon).not.toHaveClass('bi-arrows-vertical');
  });

  test('shows vertical arrows when different column is sorted', () => {
    render(
      <table>
        <thead>
          <tr>
            <SortableHeader
              field="name"
              label="Название"
              sortConfig={{ field: 'quantity', direction: 'asc' }}
              onSortClick={mockOnSortClick}
            />
          </tr>
        </thead>
      </table>
    );
    const icon = screen.getByText('Название').querySelector('i');
    expect(icon).toHaveClass('bi-arrows-vertical');
  });

  test('calls onSortClick when clicked', () => {
    render(
      <table>
        <thead>
          <tr>
            <SortableHeader
              field="name"
              label="Название"
              onSortClick={mockOnSortClick}
            />
          </tr>
        </thead>
      </table>
    );

    const header = screen.getByText('Название');
    fireEvent.click(header);

    expect(mockOnSortClick).toHaveBeenCalledWith('name');
  });

  test('has pointer cursor style', () => {
    render(
      <table>
        <thead>
          <tr>
            <SortableHeader
              field="name"
              label="Название"
              onSortClick={mockOnSortClick}
            />
          </tr>
        </thead>
      </table>
    );

    const header = screen.getByText('Название');
    expect(header).toHaveStyle('cursor: pointer');
  });
});