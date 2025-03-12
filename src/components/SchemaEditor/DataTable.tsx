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
  const itemsPerPage = 10; // Number of items per page
  const [filterText, setFilterText] = useState("");
  const [filterType, setFilterType] = useState("");

  // Handle edit button click
  const handleEditClick = (item: TableItem) => {
    setSelectedItem(item);
  };

  // Handle update from dialog
  const handleUpdate = (item: TableItem | null) => {
    if (item) {
      setItems(items.map(i => i === selectedItem ? item : i));
    }
    setSelectedItem(null);
  };

  // Handle filtering items based on predicate and type
  const filteredItems = items.filter(item => {
    const regex = new RegExp(filterText, "i");
    const matchesText = regex.test(item.predicate);
    const matchesType = filterType ? item.type === filterType : true;
    return matchesText && matchesType;
  });

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / itemsPerPage)); // Ensure at least 1 page
  const safeCurrentPage = Math.min(currentPage, totalPages); // Adjust current page if it's out of bounds
  const indexOfLastItem = safeCurrentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  // Pagination navigation
  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
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

  const uniqueTypes = Array.from(new Set(items.map(i => i.type)));

  return (
    <div>
      <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'center' }}>
        <FilterInput
          type="text"
          placeholder="Filter by name..."
          value={filterText}
          onChange={(e) => handleFilterChange(e.target.value)}
        />
        <Select value={filterType} onChange={(e) => handleTypeFilterChange(e.target.value)}>
          <option value="">All Types</option>
          {uniqueTypes.map((type, idx) => (
            <option key={idx} value={type}>{type}</option>
          ))}
        </Select>
      </div>

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

      <PaginationWrapper>
        <EditButton onClick={goToFirstPage} disabled={currentPage === 1}>First</EditButton>
        <EditButton onClick={goToPrevPage} disabled={currentPage === 1}>Previous</EditButton>
        <span>Page {currentPage} of {totalPages}</span>
        <EditButton onClick={goToNextPage} disabled={currentPage === totalPages}>Next</EditButton>
        <EditButton onClick={goToLastPage} disabled={currentPage === totalPages}>Last</EditButton>
      </PaginationWrapper>

      {/* Edit dialog */}
      {selectedItem && (
        <EditDialog item={selectedItem} onUpdate={handleUpdate} />
      )}
    </div>
  );
};

export default DataTable;
