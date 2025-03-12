import React, { useState } from "react";
import { Cross2Icon } from "@radix-ui/react-icons";
import * as Dialog from "@radix-ui/react-dialog";

interface TableItem {
  predicate: string;
  type: string;
  tokenizer?: string[];
  list?: boolean;
  reverse?: boolean;
  count?: boolean;
  lang?: boolean;
}

interface EditDialogProps {
  item: TableItem;
  onUpdate: (item: TableItem | null) => void;
}

const types = [
  "default",
  "bool",
  "datetime",
  "float",
  "geo",
  "int",
  "password",
  "string",
  "uid",
];

const indexOptions: { [type: string]: string[] } = {
  default: ["upsert"],
  bool: ["index"],
  datetime: ["upsert", "year", "month", "day", "hour"],
  float: ["index", "upsert"],
  geo: ["index", "upsert"],
  int: ["index", "upsert"],
  string: ["upsert", "exact", "hash", "term", "fulltext", "trigram"],
  uid: ["count", "reverse"],
};

const EditDialog: React.FC<EditDialogProps> = ({ item, onUpdate }) => {
  const [predicate, setPredicate] = useState(item.predicate);
  const [type, setType] = useState(item.type);
  const [tokenizer, setTokenizer] = useState(item.tokenizer || []);
  const [list, setList] = useState(item.list || false);
  const [reverse, setReverse] = useState(item.reverse || false);
  const [count, setCount] = useState(item.count || false);
  const [lang, setLang] = useState(item.lang || false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onUpdate({
      ...item,
      predicate,
      type,
      tokenizer,
      list,
      reverse,
      count,
      lang,
    });
  };

  const handleCheckboxChange = (index: string) => {
    if (tokenizer.includes(index)) {
      setTokenizer(tokenizer.filter((i) => i !== index));
    } else {
      setTokenizer([...tokenizer, index]);
    }
  };

  const handleClose = () => onUpdate(null);

  const handleTypeChange = (type: string) => {
    setType(type);
    setTokenizer([]);
    switch (type) {
      case "password":
        setList(false);
        setReverse(false);
        setCount(false);
        setLang(false);
        break;
      case "default":
        setReverse(false);
        setCount(false);
        break;
      case "geo":
      case "datetime":
        setReverse(false);
        break;
    }
  };

  const isOptionDisabled = (type: string, option: string) => {
    switch (type) {
      case "password":
        return true;
      case "default":
        return option !== "upsert";
      case "geo":
      case "datetime":
        return option === "reverse";
      default:
        return false;
    }
  };

  return (
    <Dialog.Root open={true} onOpenChange={() => {}}>
      <Dialog.Overlay className="DialogOverlay" />
      <Dialog.Content className="DialogContent">
        <Dialog.Close className="DialogClose" onClick={handleClose}>
          <Cross2Icon />
        </Dialog.Close>
        <Dialog.Title className="DialogTitle">Edit Predicate</Dialog.Title>
        <form onSubmit={handleSubmit} className="DialogForm">
          
          <div className="FormRow">
            <label className="FormLabel">Predicate</label>
            <input type="text" value={predicate} onChange={(e) => setPredicate(e.target.value)} className="Input" />
          </div>

          <div className="FormRow">
            <label className="FormLabel">Type</label>
            <select value={type} onChange={(e) => handleTypeChange(e.target.value)} className="Input">
              {types.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="FormRow">
            <label className="FormLabel">Is List?</label>
            <input type="checkbox" checked={list} disabled={type === "password"} onChange={(e) => setList(e.target.checked)} />
          </div>

          <div className="FormRow">
            <label className="FormLabel">Is Reverse?</label>
            <input type="checkbox" checked={reverse} disabled={["password", "default", "geo", "datetime"].includes(type)} onChange={(e) => setReverse(e.target.checked)} />
          </div>

          <div className="FormRow">
            <label className="FormLabel">Count</label>
            <input type="checkbox" checked={count} disabled={["password", "default"].includes(type)} onChange={(e) => setCount(e.target.checked)} />
          </div>

          {type === "string" && (
            <div className="FormRow">
              <label className="FormLabel">Lang Support</label>
              <input type="checkbox" checked={lang} onChange={(e) => setLang(e.target.checked)} />
            </div>
          )}

          {indexOptions[type] && (
            <div className="FormRow">
              <label className="FormLabel">Indices</label>
              <div className="PredicateBox" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {indexOptions[type].map((option) => (
                  <label key={option} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <input
                      type="checkbox"
                      checked={tokenizer.includes(option)}
                      disabled={isOptionDisabled(type, option)}
                      onChange={() => handleCheckboxChange(option)}
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="FormRow" style={{ justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" className="Button violet" onClick={handleClose}>Cancel</button>
            <button type="submit" className="Button green">Save</button>
          </div>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default EditDialog;
