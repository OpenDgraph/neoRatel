import React, { useState } from "react";
import styled from '@emotion/styled';
import EditDialog from "./EditDialog";

interface TableItem {
  predicate: string;
  type: string;
  tokenizer?: string[];
  list?: boolean;
  reverse?: boolean;
  index?: boolean;
  count?: boolean;
  lang?: boolean;
}

const StyledTableWrapper = styled.div`
  width: 100%;
  overflow-x: auto; /* Horizontal scroll if needed */
  margin-bottom: 10px;
`;

const StyledTable = styled.table`
  width: 100%;
  min-width: 600px; /* Prevent collapsing */
  border-collapse: collapse;
  color: #fff;

  th, td {
    border: 1px solid #444;
    padding: 10px;
    text-align: left;
    max-width: 200px;
    white-space: nowrap;
  }

  th {
    background-color: #333;
  }

  tr:nth-of-type(even) {
    background-color: #222;
  }
`;

const EditButton = styled.button`
  color: #fff;
  background-color: #333;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #555;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const FilterInput = styled.input`
  padding: 5px;
  margin-right: 10px;
`;

const Select = styled.select`
  padding: 5px;
  margin-right: 10px;
`;

const PaginationWrapper = styled.div`
  margin-top: 10px;
  display: flex;
  justify-content: center;
  gap: 10px;
`;

const DataTable: React.FC<{ items: TableItem[], setItems: React.Dispatch<React.SetStateAction<TableItem[]>> }> = ({ items, setItems }) => {
  const [selectedItem, setSelectedItem] = useState<TableItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Number of items per page, now dynamic
  const [filterText, setFilterText] = useState("");
  const [filterType, setFilterType] = useState("");

  // Handle edit button click
  const handleEditClick = (item: TableItem) => {
    setSelectedItem(item);
  };

  // Handle update from dialog
  const handleUpdate = (updatedItem: TableItem | null) => {
    if (updatedItem) {
      setItems(prevItems =>
        prevItems.map(item => item.predicate === updatedItem.predicate ? updatedItem : item)
      );
    }
    setSelectedItem(null);
  };

  // Handle filtering items based on predicate and type
  const filteredItems = items.filter(item => {
    let regex: RegExp;
    try {
      regex = new RegExp(filterText, "i");
    } catch {
      return false; // Invalid regex, skip all items temporarily
    }
    const matchesText = regex.test(item.predicate);
    const matchesType = filterType ? item.type === filterType : true;
    return matchesText && matchesType;
  });

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / itemsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const indexOfLastItem = safeCurrentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  // Pagination navigation
  const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);

  // Reset page when filter changes
  const handleFilterChange = (value: string) => {
    setFilterText(value);
    setCurrentPage(1);
  };

  const handleTypeFilterChange = (value: string) => {
    setFilterType(value);
    setCurrentPage(1);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value || 10); // fallback to 10 if value is NaN or 0
    setCurrentPage(1);
  };

  // Collect all types for dropdown
  const uniqueTypes = Array.from(new Set(items.map(i => i.type)));

  return (
    <div>
      {/* Filter controls */}
      <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <FilterInput
          type="text"
          placeholder="Filter by predicate..."
          value={filterText}
          onChange={(e) => handleFilterChange(e.target.value)}
          className="FilterInput"
        />
        <Select value={filterType} onChange={(e) => handleTypeFilterChange(e.target.value)}>
          <option value="">All Types</option>
          {uniqueTypes.map((type, idx) => (
            <option key={idx} value={type}>{type}</option>
          ))}
        </Select>
        {/* Items per page selector */}
        <Select value={itemsPerPage} onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}>
          {[5, 10, 20, 50, 100].map((num) => (
            <option key={num} value={num}>{num} per page</option>
          ))}
        </Select>
      </div>

      {/* Table */}
      <StyledTableWrapper>
        <StyledTable>
          <thead>
            <tr>
              <th>Predicate</th>
              <th>Type</th>
              <th>Indices</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center' }}>No results found</td>
              </tr>
            ) : (
              currentItems.map((item, index) => (
                <tr key={index}>
                  <td>{item.predicate}</td>
                  <td>{item.type}</td>
                  <td>{item.tokenizer?.join(", ")}</td>
                  <td>
                    <EditButton onClick={() => handleEditClick(item)}>Edit</EditButton>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </StyledTable>
      </StyledTableWrapper>

      {/* Pagination controls */}
      <PaginationWrapper>
        <EditButton onClick={goToFirstPage} disabled={safeCurrentPage === 1}>First</EditButton>
        <EditButton onClick={goToPrevPage} disabled={safeCurrentPage === 1}>Previous</EditButton>
        <span>Page {safeCurrentPage} of {totalPages}</span>
        <EditButton onClick={goToNextPage} disabled={safeCurrentPage === totalPages}>Next</EditButton>
        <EditButton onClick={goToLastPage} disabled={safeCurrentPage === totalPages}>Last</EditButton>
      </PaginationWrapper>

      {/* Edit dialog */}
      {selectedItem && (
        <EditDialog item={selectedItem} onUpdate={handleUpdate} />
      )}
    </div>
  );
};

export default DataTable;
