import React from 'react';

interface SortableHeaderProps {
  label: string;
  field: string;
  sortBy: string;
  sortOrder: 'ASC' | 'DESC';
  onSort: (field: string) => void;
}

const SortableHeader: React.FC<SortableHeaderProps> = ({ label, field, sortBy, sortOrder, onSort }) => {
  const isActive = sortBy === field;
  return (
    <th onClick={() => onSort(field)}>
      {label}
      <span className="sort-icon">
        {isActive ? (sortOrder === 'ASC' ? ' ↑' : ' ↓') : ' ↕'}
      </span>
    </th>
  );
};

export default SortableHeader;
