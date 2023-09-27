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

import create from 'zustand';
import { mountStoreDevtool } from 'simple-zustand-devtools';
import DgraphService from '../services/dgraphService';

interface Tab {
  id: number;
  title: string;
  content: string;
  result?: any;
  type: string;
  language: string;
  Endpoint: string;
  defaultOperations: string;
  defaultVariables: string;
  defaultTab: string;
}

type TabsStore = {
  tabs: Tab[];
  activeTabId: number;
  addTab: (type: string) => void;
  removeAllTabs: () => void;
  removeTab: (id: number) => void;
  switchTab: (id: number) => void;
  updateTabContent: (id: number, content: string, result?: any) => void;
  setDefaultTab: (id: number, tab: string) => void;
};

export const useTabsStore = create<TabsStore>((set, get) => ({
  tabs: [],
  activeTabId: 1,
  removeAllTabs: () =>
    set((state) => ({
      ...state,
      tabs: [],
    })),
  setDefaultTab: (id: number, tab: string) => set((state) => {
    const updatedTabs = state.tabs.map((tabItem) => {
      if (tabItem.id === id) {
        return {
          ...tabItem,
          defaultTab: tab,
        };
      }
      return tabItem;
    });
    return {
      ...state,
      tabs: updatedTabs,
    };
  }),
  addTab: async (type) => {
    const tabs = get().tabs;
    const newId = tabs.length > 0 ? Math.max(...tabs.map((tab) => tab.id)) + 1 : 1;
    const formattedString = `schema {} \n\n{\n\tq(func: Type(User)) {\n \t expand(_all_)\n\t}\n}`;

    let language;
    let content = '';
    let Endpoint = 'http://localhost:8080';
    let defaultOperations = '';
    let defaultVariables = '';

    if (type === 'GraphQL') {
      language = 'graphql';
      Endpoint = 'https://api.spacex.land/graphql/';
      content = ' query {\n\tlaunchesPast(limit: 5) {\n\t\tmission_name\n\t\tlaunch_date_local\n\t\tlaunch_site {\n\t\t\tsite_name_long\n\t\t}\n\t\tlinks {\n\t\t\tvideo_link\n\t\t}\n\t\trocket {\n\t\t\trocket_name\n\t\t}\n\t}\n}';
    } else if (type === 'JSON View') {
      language = 'json';
      content = '{\n\t"set": [{}]\n}';
    } else if (type === 'DQL') {
      language = 'dql';
      content = `# ${newId} Write your DQL query here \n\n${formattedString}`
    } else if (type === 'Schema DQL') {
      type = 'SchemaBulk';
      language = 'schema';
      content = '# This should not be monaco\n\n';
    } else if (type === 'Schema DQL Bulk') {
      type = 'SchemaBulk';
      language = 'schemaBulk';
      let query = `schema {}`
      const response = await DgraphService.query(query, newId);
      content = '# Write your schema here\n\n' + response;
    } else if (type === 'Schema GQL') {
      language = 'gqlSchema';
      content = '# This should not be monaco\n\n';
    } else if (type === 'Schema GQL Bulk') {
      language = 'gqlSchemaBulk';
      content = '# Write your GraphQL schema here\n\n';
    } else {
      language = 'plaintext';
    }

    set({
      tabs: [
        ...tabs,
        {
          id: newId,
          title: `${type} ${newId}`,
          type,
          content,
          language,
          Endpoint,
          defaultOperations,
          defaultVariables,
          defaultTab: "json",
          result: {}
        },
      ],
      activeTabId: newId,
    });

  },
  removeTab: (id: number) => set((state) => {
    const tabIndex = state.tabs.findIndex((tab) => tab.id === id);
    if (tabIndex === -1) return state;  // return current state if tab is not found
    const newTabs = state.tabs.filter((tab) => tab.id !== id);
    const newActiveTab = state.activeTabId === id
      ? newTabs[tabIndex] ? newTabs[tabIndex].id : newTabs[tabIndex - 1]?.id
      : state.activeTabId;
    return { tabs: newTabs, activeTabId: newActiveTab };
  }),


  switchTab: (id: number) => {
    set({ activeTabId: id });
  },
  updateTabContent: (id: number, content: string, result: any = undefined) => {
    console.log('updateTabContent', id, content);
    set((state) => {
      const updatedTabs = state.tabs.map((tab) => {
        if (tab.id === id) {
          return {
            ...tab,
            content: content,
            result: result !== undefined ? result : tab.result
          };
        }
        return tab;
      });
      return {
        ...state,
        tabs: updatedTabs
      };
    });
  },

}));


if (process.env.NODE_ENV === 'development') {
  mountStoreDevtool('Store', useTabsStore);
}