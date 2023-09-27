import create from 'zustand';

type State = {
  clusterUrl: string,
  serverQueryTimeout: number,
  slashApiKey: string,
  authToken: string,
  aclToken: string,
  dialogState: boolean,
  setDialogState: (state: boolean) => void,
  setAclToken: (tokenACL: string) => void,
  setclusterUrl: (url: string) => void,
  setServerQueryTimeout: (timeout: number) => void,
  setSlashApiKey: (key: string) => void,
  setAuthToken: (token: string) => void,
};

export const useDgraphConfigStore = create<State> ((set) =>  ({
  clusterUrl: 'https://play.dgraph.io',
  serverQueryTimeout: 20,
  slashApiKey: '', 
  authToken: '',
  aclToken: '',
  dialogState: true,
  setDialogState: (state) => set({ dialogState: state }),
  setAclToken: (tokenACL) => set({ aclToken: tokenACL }),
  setclusterUrl: (url) => set({ clusterUrl: url }),
  setServerQueryTimeout: (timeout) => set({ serverQueryTimeout: timeout }),
  setSlashApiKey: (key) => set({ slashApiKey: key }),
  setAuthToken: (token) => set({ authToken: token }),
}));
