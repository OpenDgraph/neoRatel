import MonacoEditor from 'react-monaco-editor';
import { editor, KeyCode, KeyMod } from 'monaco-editor';
import React, { useRef, useEffect, useState, useContext } from 'react';
import { useTabsStore } from '../../store/tabsStore';
import DgraphService from '../../services/dgraphService';
import { debounce } from 'lodash';

interface CustomMonacoEditorProps {
    content: string;
    language: string;
    editorRef: React.RefObject<editor.IStandaloneCodeEditor>;
    activeTab: number;
    handleEditorChange: (newValue: string) => void;
    handleQuery: (query: string) => void;
  }

const CustomMonacoEditor = (e: CustomMonacoEditorProps) => {

    let { content, language, activeTab, handleEditorChange, handleQuery } = e;
    const { editorRef } = e;

    const removeTab = useTabsStore((state) => state.removeTab);

    const handleRemoveTab = (e: number) => {
      removeTab(e);
    };
  

    const handleEditorChangeED = debounce((newValue: string) => {
        if (editorRef) {
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
              DgraphService.query('schema {}', activeTab);
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
          run: function (ed: editor.IStandaloneCodeEditor) {
            handleRemoveTab(activeTab);
            console.log('DELETE!');
            return null;
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
          run: function (ed: editor.IStandaloneCodeEditor) {
            deleteAllTabs();
            console.log('REMOVE ALL!');
            return null;
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

    return (
      <MonacoEditor
        width="100%"
        height="100%"
        language={language}
        theme="vs-dark"
        value={content}
        onChange={handleEditorChangeED}
        editorDidMount={(editor) => {
          if (editorRef) {
            editorRef.current = null;
            editorRef.current = editor;
            editor.focus();
          }
        }
        }
        editorWillUnmount={() => {
          if (editorRef) {
            editorRef.current = null;
          }
        }}
      />
    );
  };

  export default CustomMonacoEditor;
 