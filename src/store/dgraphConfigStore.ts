import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface State {
  clusterUrl: string;
  serverQueryTimeout: number;
  slashApiKey: string;
  authToken: string;
  aclToken: string;
  dialogState: boolean;
  isConfigured: boolean;
  setDialogState: (state: boolean) => void;
  setAclToken: (tokenACL: string) => void;
  setclusterUrl: (url: string) => void;
  setServerQueryTimeout: (timeout: number) => void;
  setSlashApiKey: (key: string) => void;
  setAuthToken: (token: string) => void;
  setIsConfigured: (state: boolean) => void;
}

export const useDgraphConfigStore = create<State>()(
  persist(
    (set) => ({
      clusterUrl: 'https://play.dgraph.io',
      serverQueryTimeout: 20,
      slashApiKey: '',
      authToken: '',
      aclToken: '',
      dialogState: false,
      isConfigured: false,
      setDialogState: (state) => set({ dialogState: state }),
      setAclToken: (tokenACL) => set({ aclToken: tokenACL }),
      setclusterUrl: (url) => set({ clusterUrl: url }),
      setServerQueryTimeout: (timeout) => set({ serverQueryTimeout: timeout }),
      setSlashApiKey: (key) => set({ slashApiKey: key }),
      setAuthToken: (token) => set({ authToken: token }),
      setIsConfigured: (state) => set({ isConfigured: state }),
    }),
    {
      name: 'dgraph-config-storage',
      partialize: (state) => ({
        clusterUrl: state.clusterUrl,
        serverQueryTimeout: state.serverQueryTimeout,
        slashApiKey: state.slashApiKey,
        authToken: state.authToken,
        aclToken: state.aclToken,
        isConfigured: state.isConfigured,
      }),
    }
  )
);
