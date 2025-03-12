import React, { useState, useEffect } from "react";
import styled from '@emotion/styled';
import EditDialog from "./EditDialog";
import { useTabsStore } from '../../store/tabsStore';

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
  overflow-x: auto; /* Scroll horizontal se necessário */
  margin-bottom: 10px;
`;

const StyledTable = styled.table`
  width: 100%;
  min-width: 600px; /* Evita colapsar */
  border-collapse: collapse;
  color: #fff;

  th, td {
    border: 1px solid #444;
    padding: 10px;
    text-align: left; /* Alinhamento padrão */
    max-width: 200px;
    word-wrap: break-word;
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
`;

const DataTable: React.FC<{ items: TableItem[], setItems: React.Dispatch<React.SetStateAction<TableItem[]>> }> = ({ items, setItems }) => {
  const [selectedItem, setSelectedItem] = useState<TableItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const handleEditClick = (item: TableItem) => {
    setSelectedItem(item);
  };

  const handleUpdate = (item: TableItem | null) => {
    if (item) {
      setItems(items.map(i => i === selectedItem ? item : i));
    }
    setSelectedItem(null);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(items.length / itemsPerPage);

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const goToPrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div>
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
          {currentItems.map((item, index) => (
            <tr key={index}>
              <td>{item.predicate}</td>
              <td>{item.type}</td>
              <td>{item.tokenizer?.join(", ")}</td>
              <td>
                <EditButton onClick={() => handleEditClick(item)}>Edit</EditButton>
              </td>
            </tr>
          ))}
        </tbody>
      </StyledTable>
      
      <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
        <EditButton onClick={goToPrevPage} disabled={currentPage === 1}>Previous</EditButton>
        <span>Page {currentPage} of {totalPages}</span>
        <EditButton onClick={goToNextPage} disabled={currentPage === totalPages}>Next</EditButton>
      </div>

      {selectedItem && (
        <EditDialog item={selectedItem} onUpdate={handleUpdate} />
      )}
    </div>
  );
};

interface SchemaEditorProps {
  content: response;
}

interface response {
  data: { schema: TableItem[] };
}

const SchemaEditor: React.FC<SchemaEditorProps> = ({ content }) => {
  const [items, setItems] = useState<TableItem[]>([]);

  useEffect(() => {
    if (content) {
      try {
        const schemaData = content.data?.schema;
        if (Array.isArray(schemaData)) {
          setItems(schemaData);
        } else {
          console.error("Schema data is not an array", schemaData);
        }
      } catch (error) {
        console.error("Failed to parse content", error);
      }
    }
  }, [content]);

  return (
    <>
      <DataTable items={items} setItems={setItems} />
    </>
  );
};

export default SchemaEditor;
