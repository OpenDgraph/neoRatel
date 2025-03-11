import React from 'react';
import styled from '@emotion/styled';

const ShortcutsContainer = styled.div`
  position: fixed;
  bottom: 10%;
  right: 2%;
  background: #1e1e1e;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #444;
  color: #d4d4d4;
  font-size: 12px;
`;

const ShortcutItem = styled.div`
  margin: 5px 0;
  kbd {
    background: #333;
    padding: 2px 5px;
    border-radius: 3px;
    margin: 0 3px;
  }
`;

export const KeyboardShortcuts = () => (
  <ShortcutsContainer>
    <ShortcutItem><kbd>F10</kbd> Run Query</ShortcutItem>
    <ShortcutItem><kbd>Ctrl</kbd>+<kbd>S</kbd> Save</ShortcutItem>
    <ShortcutItem><kbd>Shift</kbd>+<kbd>Del</kbd> Delete Tab</ShortcutItem>
    <ShortcutItem><kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Del</kbd> Remove All</ShortcutItem>
  </ShortcutsContainer>
); 