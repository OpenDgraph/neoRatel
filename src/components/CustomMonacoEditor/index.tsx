import React, { useEffect, useCallback } from 'react';
import MonacoEditor from 'react-monaco-editor';
import { editor, KeyCode, KeyMod } from 'monaco-editor';
import { useTabsStore } from '../../store/tabsStore';
import DgraphService from '../../services/dgraphService';
import { debounce } from 'lodash';

interface CustomMonacoEditorProps {
  content?: string;
  language?: string;
  editorRef?: React.MutableRefObject<editor.IStandaloneCodeEditor | null>;
  activeTab?: number;
  handleEditorChange?: (value: string) => void;
  handleQuery?: (query: string) => void;
}

const CustomMonacoEditor: React.FC<CustomMonacoEditorProps> = ({
  content = '',
  language = 'dql',
  editorRef,
  activeTab,
  handleEditorChange = () => {},
  handleQuery = () => {},
}) => {
  const options: editor.IStandaloneEditorConstructionOptions = {
    selectOnLineNumbers: true,
    roundedSelection: false,
    readOnly: false,
    cursorStyle: 'line',
    automaticLayout: true,
    theme: 'vs-dark',
    minimap: {
      enabled: false,
    },
  };

  const removeTab = useTabsStore((state) => state.removeTab);

  const handleRemoveTab = (e: number) => {
    removeTab(e);
  };

  const handleEditorChangeED = debounce((newValue: string) => {
    if (editorRef?.current) {
      const currentContent = editorRef.current.getValue();
      handleEditorChange(currentContent);
    }
  }, 17000);

  const removeAllTabs = useTabsStore((state) => state.removeAllTabs);

  function deleteAllTabs() {
    removeAllTabs();
  }

  useEffect(() => {
    if (editorRef) {
      const runDQL = {
        id: 'my-unique-id',
        label: 'Run Query',
        keybindings: [
          KeyCode.F10
        ],
        contextMenuGroupId: 'navigation',
        contextMenuOrder: 1.5,
        run: async function (ed: editor.IStandaloneCodeEditor) {
          const query = ed.getValue();
          if (language === 'schema') {
            DgraphService.query('schema {}', activeTab ?? -1);
            return;
          }
          handleQuery(query);
        },
      };
      const save = {
        id: 'my-save-command',
        label: 'Save',
        keybindings: [KeyMod.CtrlCmd | KeyCode.KeyS],
        contextMenuGroupId: 'navigation',
        contextMenuOrder: 1.5,
        run: function (ed: editor.IStandaloneCodeEditor) {
          console.log("Save command triggered");
          console.log(ed.getValue());
          handleEditorChange(ed.getValue());
        }
      }
      const del = {
        id: 'del-my-unique-id',
        label: 'Delete Tab',
        keybindings: [
          KeyMod.Shift | KeyCode.Delete,
        ],
        contextMenuGroupId: 'navigation',
        contextMenuOrder: 2.5,
        run: function (ed: editor.IStandaloneCodeEditor): void {
          handleRemoveTab(activeTab ?? -1);
          console.log('DELETE!');
        },
      };
      const removeAll = {
        id: 'rw-my-unique-id',
        label: 'Remove All Tabs',
        keybindings: [
          KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.Delete,
        ],
        contextMenuGroupId: 'navigation',
        contextMenuOrder: 3.5,
        run: function (ed: editor.IStandaloneCodeEditor): void {
          deleteAllTabs();
          console.log('REMOVE ALL!');
        },
      };
      if (editorRef.current) {
        editorRef.current.addAction(runDQL);
        editorRef.current.addAction(save);
        editorRef.current.addAction(del);
        editorRef.current.addAction(removeAll);
      }
    }
  }, [editorRef]);

  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor) => {
    if (editorRef) {
      editorRef.current = editor;
    }

    editor.addCommand(
      // Monaco.KeyMod.CtrlCmd | Monaco.KeyCode.Enter
      2048 | 3,
      () => {
        const value = editor.getValue();
        handleQuery(value);
      }
    );
  };

  const debouncedChange = useCallback(
    debounce((value: string) => {
      if (handleEditorChange) {
        handleEditorChange(value);
      }
    }, 1000),
    [handleEditorChange]
  );

  return (
    <MonacoEditor
      width="100%"
      height="100%"
      language={language}
      theme="vs-dark"
      value={content}
      options={options}
      onChange={debouncedChange}
      editorDidMount={handleEditorDidMount}
    />
  );
};

export default CustomMonacoEditor;
 