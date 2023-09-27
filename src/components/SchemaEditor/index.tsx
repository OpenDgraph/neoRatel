import React, { useState } from "react";
import styled from '@emotion/styled';
import { Dialog, DialogContent, DialogTrigger } from '@radix-ui/react-dialog';
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

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  color: #fff;

  th, td {
    border: 1px solid #444;
    padding: 10px;
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

const DataTable: React.FC = () => {
  const [items, setItems] = useState<TableItem[]>([
    {
      predicate: "pre_production",
      type: "uid",
      list: true,
    },
    { predicate: "pass", type: "password" },
    { predicate: "nickname", type: "default", list: true },
    { predicate: "genre", type: "uid", reverse: true, count: true, list: true },
    { predicate: "zoo", type: "default" },
    { predicate: "regnbr", type: "string", index: true, tokenizer: ["exact"] },
    { predicate: "wife", type: "uid", reverse: true },
    {
      predicate: "公司",
      type: "string",
      index: true,
      tokenizer: ["fulltext"],
      lang: true,
    },
    {
      predicate: "initial_release_date",
      type: "datetime",
      index: true,
      tokenizer: ["year"],
    },
    { predicate: "loc", type: "geo", index: true, tokenizer: ["geo"] },
    {
      predicate: "name",
      type: "string",
      index: true,
      tokenizer: ["hash", "term", "trigram", "fulltext"],
      lang: true,
    },
  ]);
  const [selectedItem, setSelectedItem] = useState<TableItem | null>(null);

  const handleEditClick = (item: TableItem) => {
    setSelectedItem(item);
  };

  const handleUpdate = (item: TableItem | null) => {
    if (item) {
      setItems(items.map(i => i === selectedItem ? item : i));
    }
    setSelectedItem(null);
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
          {items.map((item, index) => (
            <tr key={index}>
              <td>{item.predicate}</td>
              <td>{item.type}</td>
              <td>{item.tokenizer && item.tokenizer.join(", ")}</td>
              <td>
                <EditButton onClick={() => handleEditClick(item)}>Edit</EditButton>
              </td>
            </tr>
          ))}
        </tbody>
      </StyledTable>
      {selectedItem && (
        <EditDialog item={selectedItem} onUpdate={handleUpdate} />
      )}
    </div>
  );
};

const SchemaEditor: React.FC = () => {
  return (
    <>
    <DataTable />
    </>
  );
};

export default SchemaEditor;
