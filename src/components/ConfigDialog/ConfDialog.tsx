import React, { useState, useEffect } from 'react';
import { useDgraphConfigStore } from '../../store/dgraphConfigStore';
import * as Dialog from '@radix-ui/react-dialog';
import * as Tabs from '@radix-ui/react-tabs';
import { Cross2Icon } from '@radix-ui/react-icons';
import DgraphAdminService from '../../services/dgraphAdmin';

const DgraphConfigDialog = () => {
  const {
    clusterUrl: defaultclusterUrl,
    serverQueryTimeout: defaultServerQueryTimeout,
    slashApiKey: defaultSlashApiKey,
    authToken: defaultAuthToken,
    aclToken: defaultAclToken,
    dialogState,
    setclusterUrl,
    setServerQueryTimeout,
    setSlashApiKey,
    setAuthToken,
    setAclToken,
    setDialogState,
  } = useDgraphConfigStore();

  const [open, setOpen] = useState(dialogState);

  const [clusterUrl, setclusterUrlState] = useState(defaultclusterUrl);
  const [serverQueryTimeout, setServerQueryTimeoutState] = useState(defaultServerQueryTimeout);
  const [slashApiKey, setSlashApiKeyState] = useState(defaultSlashApiKey);
  const [authToken, setAuthTokenState] = useState(defaultAuthToken);
  const [aclTokenState, setAclTokenState] = useState(defaultAclToken);

  const [userId, setUserId] = useState('groot');
  const [password, setPassword] = useState('password');
  const [namespace, setNamespace] = useState('0');

  const handleSubmit = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    setclusterUrl(clusterUrl);
    setServerQueryTimeout(serverQueryTimeout);
    setSlashApiKey(slashApiKey);
    setAuthToken(authToken);
    setDialogState(false);
  };

  const handleClose = () => {
    setDialogState(false);
  };

  const handleAclLogin = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();

    try {
      const response = await DgraphAdminService.login(userId, password, Number(namespace), clusterUrl);
      console.log('Login response:', response.data.login.response);
      if (response && response.data) {
        setAclToken(response.data.login.response.accessJWT);
        setIsLogged(true);
        console.log('Login successful', aclTokenState);
      } else {
        alert('Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('Login failed due to an error. Check the console for more details.');
    }
  };

  const [isLogged, setIsLogged] = useState(false);

  return (
    <Dialog.Root open={dialogState} onOpenChange={setDialogState}>
      <Dialog.Trigger />
      <Dialog.Portal>
        <Dialog.Overlay className="DialogOverlay" />
        <Dialog.Content className="DialogContent">
          <Dialog.Title className="DialogTitle">
            Dgraph Configuration
          </Dialog.Title>
          <Dialog.Description className="DialogDescription">
            Please enter your Dgraph configuration:
          </Dialog.Description>

          <Tabs.Root defaultValue="general">
            <Tabs.List>
              <Tabs.Trigger className="Button" value="general">General</Tabs.Trigger>
              <Tabs.Trigger className="Button" value="acl">ACL Login</Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="general">
              {/* Formulário de configuração geral */}
              <form id='1' onSubmit={handleSubmit}>
                <label>
                  Server URL:
                  <input
                    className="Input"
                    type="text"
                    value={clusterUrl}
                    onChange={(e) => setclusterUrlState(e.target.value)}
                  />
                </label>
                <label>
                  Server Query Timeout:
                  <input
                    className="Input"
                    type="number"
                    value={serverQueryTimeout}
                    onChange={(e) =>
                      setServerQueryTimeoutState(Number(e.target.value))
                    }
                  />
                </label>
                <label>
                  Slash API Key:
                  <input
                    className="Input"
                    type="text"
                    value={slashApiKey}
                    onChange={(e) => setSlashApiKeyState(e.target.value)}
                  />
                </label>
                <label>
                  Auth Token:
                  <input
                    className="Input"
                    type="text"
                    value={authToken}
                    onChange={(e) => setAuthTokenState(e.target.value)}
                  />
                </label>
                <input className="Button" type="submit" value="Submit" />
              </form>
            </Tabs.Content>

            <Tabs.Content value="acl">
              {
                isLogged ?
                  <p>Logged in</p> :
                  <form id='2' onSubmit={handleAclLogin}>
                    <label>
                      User ID:
                      <input
                        type="text"
                        value={userId}
                        className="Input"
                        onChange={(e) => setUserId(e.target.value)}
                      />
                    </label>
                    <label>
                      Password:
                      <input
                        type="password"
                        value={password}
                        className="Input"
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </label>
                    <label>
                      Namespace:
                      <input
                        type="text"
                        value={namespace}
                        className="Input"
                        onChange={(e) => setNamespace(e.target.value)}
                      />
                    </label>
                    <input className="Button" type="submit" value="Login" />
                  </form>
              }

            </Tabs.Content>
          </Tabs.Root>



          <Dialog.Close asChild>
            <button
              className="IconButton"
              aria-label="Close"
              onClick={handleClose}
            >
              <Cross2Icon />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>

  );
};

export default DgraphConfigDialog;
