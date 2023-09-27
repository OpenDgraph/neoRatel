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

import React, { useEffect, useRef } from 'react';
import { SecondTabList, SecondTabTrigger, SecondTabContent } from './styles';
import * as Tabs from '@radix-ui/react-tabs';
import { FiActivity, FiCode, FiMapPin , FiBarChart} from 'react-icons/fi';
import { editor } from 'monaco-editor';
import { useTabsStore } from '../../store/tabsStore';
import { ChartBar} from './Chart';

interface JsonEditorProps {
  value: any;
}

const JsonEditor: React.FC<JsonEditorProps> = ({ value }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  let codeEditor: editor.IStandaloneCodeEditor | null = null;

  useEffect(() => {
    if (containerRef.current) {
      codeEditor = editor.create(containerRef.current, {
        value: JSON.stringify(value, null, 2),
        language: 'json',
        theme: 'vs-dark',
        automaticLayout: true, // Add this line
      });

      return () => {
        if (codeEditor) {
          codeEditor.dispose();
        }
      };
    }
  }, [value]);

  return <div ref={containerRef} style={{ height: '100%', width: '100%' }} />; // Change size to 100%
};


export const SecondEditorTabs = () => {
  const activeTabId = useTabsStore((state) => state.activeTabId);
  const tab = useTabsStore.getState().tabs.find(tab => tab.id === activeTabId);

  const result = tab?.result;
  const defaultTab = tab?.defaultTab;
  const setDefaultTab = useTabsStore((state) => state.setDefaultTab);

  return (
    <Tabs.Root defaultValue={defaultTab} onValueChange={() => setDefaultTab}>
      <SecondTabList>
        <SecondTabTrigger value="graphView">
          <FiActivity /> Graph View
        </SecondTabTrigger>
        <SecondTabTrigger value="json">
          <FiCode /> JSON
        </SecondTabTrigger>
        <SecondTabTrigger value="geo">
          <FiMapPin /> Geo
        </SecondTabTrigger>
        <SecondTabTrigger value="chart">
          <FiBarChart /> Chart
        </SecondTabTrigger>
      </SecondTabList>
      <SecondTabContent value="graphView">Graph View Content</SecondTabContent>
      <SecondTabContent value="json">
      <JsonEditor value={result} />
      </SecondTabContent>
      <SecondTabContent value="geo">Geo Content</SecondTabContent>
      <SecondTabContent value="chart">
        <ChartBar data={result["data"]} />
        Chart Content</SecondTabContent>
    </Tabs.Root>
  );
};
