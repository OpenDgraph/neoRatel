import React, { useState, useEffect } from "react";
import styled from '@emotion/styled';
import EditDialog from "./EditDialog";
import DataTable from "./DataTable";
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

interface SchemaEditorProps {
  content: response;
}

interface response {
  data: { schema: TableItem[] };
}

const SchemaEditor: React.FC<SchemaEditorProps> = ({ content }) => {
  const [items, setItems] = useState<any>([]);

  useEffect(() => {
    if (content) {
      try {
        const schemaData = content.data?.schema;
        if (Array.isArray(schemaData)) {
          setItems(schemaData);
        } else {
          console.error("Schema data is not an array", schemaData);
          setItems([]);
        }
      } catch (error) {
        console.error("Failed to parse content", error);
        setItems([]);
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
