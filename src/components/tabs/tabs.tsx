// Copyright 2017-2023 Dgraph Labs, Inc. and Contributors
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import React, { useRef, useEffect, useState, useContext } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { editor, KeyCode, KeyMod } from 'monaco-editor';

import { useTabsStore } from '../../store/tabsStore';
import { TabList, TabTrigger, TabContent, EditorAreaStyled, TabListContainer } from './styles';
import { debounce } from 'lodash';

import FloatingControl from '../FloatingControl/index';

import WelcomePage from '../Welcome/WelcomePage';

import { SecondEditorTabs } from '../SecondEditor/SecondEditorTabs';
import CustomMonacoEditor from '../CustomMonacoEditor/index';

import Split from 'react-split';

import AddTabDialog from '../TabDialog/TabDialog';

import DgraphService from '../../services/dgraphService';
import { useDgraphConfigStore } from '../../store/dgraphConfigStore';

import '../../userWorker';
import '../../monaco-editor-languages';
import SchemaEditor from '../SchemaEditor';

import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';

interface Tab {
  tab: {
    id: number;
    title: string;
    content: string;
    type: string;
    language: string;
    Endpoint?: string;
    defaultOperations?: string;
    defaultVariables?: string;
  };
}


export const EditorArea = () => {

  // function toggleTheme() {
  //   const htmlElement = document.querySelector('html');
  //   const currentTheme = htmlElement.getAttribute('data-theme');

  //   if (currentTheme === 'dark') {
  //     htmlElement.setAttribute('data-theme', 'light');
  //   } else {
  //     htmlElement.setAttribute('data-theme', 'dark');
  //   }
  // }

  const htmlElement = document.querySelector('html');
  if (htmlElement) {
    htmlElement.setAttribute('data-theme', 'dark');
  }

  const tabs = useTabsStore((state) => state.tabs);
  const activeTabId = useTabsStore((state) => state.activeTabId);
  const activeTabItem = tabs.find(tab => tab.id === activeTabId);
  const editorLanguage = activeTabItem?.type === 'GraphQL' ? 'graphql' : 
                        activeTabItem?.type === 'JSON' ? 'json' : 
                        activeTabItem?.type === 'Schema' ? 'schema' : 'plaintext';

  const setActiveTab = useTabsStore((state) => state.switchTab);
  const updateTabContent = useTabsStore((state) => state.updateTabContent);
  const addTab = useTabsStore((state) => state.addTab);
  const removeTab = useTabsStore((state) => state.removeTab);
  const removeAllTabs = useTabsStore((state) => state.removeAllTabs);

  const aclTokenState = useDgraphConfigStore((state) => state.aclToken);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const [splitSizes, setSplitSizes] = useState<[number, number]>([50, 50]);

  const handleEditorChange = (newValue: string) => {
    if (activeTabId !== undefined) {
      updateTabContent(activeTabId, newValue);
    }
  };

  const handleQuery = async (query: string) => {
    try {
      if (activeTabId !== undefined) {
        await DgraphService.query(query, activeTabId);
      }
    } catch (error) {
      console.error("Error running query:", error);
    }
  };

  const handleClear = () => {
    if (editorRef.current) {
      editorRef.current.setValue('');
    }
  };

  const handleClone = () => {
    const tab = tabs.find(t => t.id === activeTabId);
    if (tab) {
      addTab(tab.type);
    }
  };

  const handlePlus = () => {
    document.querySelector<HTMLButtonElement>('.add-tab-button')?.click();
  };

  const handleSettings = () => {
    // Implementar abertura de configurações
    console.log('Open settings');
  };

  const _handleEditorChange = () => {
    if (editorRef.current) {
      const currentContent = editorRef.current.getValue();
      handleEditorChange(currentContent);
    }
  };

  // graphql

  // const graphqlEndpoint = activeTab?.graphqlEndpoint || 'https://api.spacex.land/graphql/';
  // const defaultOperations = activeTab?.defaultOperations || '';
  // const defaultVariables = activeTab?.defaultVariables || '';


  const togglePanel = () => {
    if (splitSizes[0] === 0) {
      setSplitSizes([50, 50]);
    } else {
      setSplitSizes([0, 100]);
    }
  };

  const handlePlay = () => {
    if (editorRef.current) {
      const currentContent = editorRef.current.getValue();
      if (activeTabItem?.type === 'Schema') {
        DgraphService.query('schema {}', activeTabId);
      } else {
        handleQuery(currentContent);
      }
    }
  };

  const RenderMonaco = (tab: Tab) => {
    const {
      id,
      title,
      content,
      type,
      language,
      Endpoint,
      defaultOperations,
      defaultVariables,
    } = tab.tab;

    switch (language) {
      case 'dql':
        return <Split
          className="split"
          sizes={splitSizes}
          minSize={10}
          gutterSize={10}
          onDoubleClick={() => {
            togglePanel();
            _handleEditorChange();
          }}
          onDragEnd={(newSizes) => {
            setSplitSizes(newSizes as [number, number]);
            _handleEditorChange();
          }}

          direction="horizontal"
        >
          <div className="split-pane">
            <FloatingControl
              onPlay={handlePlay}
              onClear={handleClear}
              onClone={handleClone}
              onPlus={handlePlus}
              onSettings={handleSettings}
            />
            <CustomMonacoEditor content={content} language={language} editorRef={editorRef} activeTab={activeTabId} 
            handleEditorChange={handleEditorChange} handleQuery={handleQuery} />;

          </div>
          <div className="split-pane">
            <SecondEditorTabs />
          </div>
        </Split>
      case 'graphql':
        return <CustomMonacoEditor content={content} language={language} editorRef={editorRef} activeTab={activeTabId} 
        handleEditorChange={handleEditorChange} handleQuery={handleQuery} />;
      case 'json':
        return <CustomMonacoEditor content={content} language={language} editorRef={editorRef} activeTab={activeTabId} 
        handleEditorChange={handleEditorChange} handleQuery={handleQuery} />;
      case 'schema':
        return <>
          <SchemaEditor content={content as any} />
        </>;
      case 'schemaBulk':
        return (
          <>
            <FloatingControl
              onPlay={handlePlay}
              onClear={handleClear}
              onClone={handleClone}
              onPlus={handlePlus}
              onSettings={handleSettings}
            />
            <CustomMonacoEditor 
              content={content} 
              language='dql' 
              editorRef={editorRef} 
              activeTab={activeTabId} 
              handleEditorChange={handleEditorChange} 
              handleQuery={handleQuery} 
            />
          </>
        );
      case 'gqlSchema':
        return <> Teste  gqlschema</>
      case 'gqlSchemaBulk':
        return <> Teste gqlSchemaBulk </>
      default:
        return <CustomMonacoEditor content={content} language={language} editorRef={editorRef} activeTab={activeTabId} 
        handleEditorChange={handleEditorChange} handleQuery={handleQuery} />;
    }
  };

  useEffect(() => {
    const handleResize = () => {
      editorRef.current?.layout();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useKeyboardShortcuts({
    onDelete: () => {
      console.log('Delete callback triggered'); // Debug log
      if (activeTabId) {
        removeTab(activeTabId);
      }
    },
    onSave: () => {
      console.log('Save callback triggered'); // Debug log
      if (editorRef.current) {
        const currentContent = editorRef.current.getValue();
        handleEditorChange(currentContent);
      }
    },
    onRun: () => {
      console.log('Run callback triggered'); // Debug log
      if (editorRef.current) {
        const currentContent = editorRef.current.getValue();
        handleQuery(currentContent);
      }
    },
    onRemoveAll: () => {
      console.log('Remove all callback triggered'); // Debug log
      removeAllTabs();
    }
  });

  return (
    <EditorAreaStyled>
      <Tabs.Root value={activeTabId.toString()} onValueChange={value => setActiveTab(Number(value))}>
        <>
          {tabs.length < 1 ? (
            <WelcomePage />
          ) : (
            tabs.map((tab) => (
              <TabContent key={tab.id} value={tab.id.toString()}>
                <React.StrictMode>
                  <RenderMonaco tab={tab} />
                </React.StrictMode>
              </TabContent>
            ))
          )}
          <TabListContainer>
            <TabList>
              {tabs.map((tab) => (
                <TabTrigger key={tab.id} value={tab.id.toString()}>
                  {tab.title}
                </TabTrigger>
              ))}
              <AddTabDialog />
            </TabList>
          </TabListContainer>
        </>
      </Tabs.Root>
    </EditorAreaStyled>
  );
};
