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

import styled from '@emotion/styled';
import * as Dialog from '@radix-ui/react-dialog';

export const AddTabButton = styled.button`
  background-color: #333;
  color: #d4d4d4;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  padding: 8px;
  padding: 10px 12px;
  cursor: pointer;
  transition: background-color 0.2s;
  transition: background-color 0.2s ease-in-out, transform 0.1s;

  &:hover {
    background-color: #444;
    transform: scale(1.05);
  }
`;

export const DialogOverlay = styled(Dialog.Overlay)`
  background-color: rgba(0, 0, 0, 0.6);
  position: fixed;
  inset: 0;
  animation: overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1);
  align-items: center;
  z-index: 10000;
`;

export const DialogContent = styled(Dialog.Content)`
  background-color: #1e1e1e;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 420px;
  max-height: 85vh;
  padding: 30px;
  animation: contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1);
  // margin-top: 100px;
  &:focus {
    outline: none;
  }
     z-index: 10000;
`;

export const DialogTitle = styled(Dialog.Title)`
  margin: 0;
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 18px;
`;


export const DialogClose = styled(Dialog.Close)`
  position: absolute;
  top: 12px;
  right: 12px;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 18px;
  color: #888;
  transition: color 0.2s;

  &:hover {
    color: #fff;
  }
`;
export const IconButton = styled.button`
  border: none;
  background: transparent;
  color: #888;
  cursor: pointer;
  padding: 6px;
  transition: color 0.2s, transform 0.1s;

  &:hover {
    color: #fff;
    transform: scale(1.1);
  }
`;

export const Flex = styled.div<{ direction?: string; gap?: string }>`
  display: flex;
  flex-direction: ${(props) => props.direction || 'row'};
  gap: ${(props) => props.gap || '10px'};
  max-height: 60vh;
  overflow-y: auto;
  justify-content: center;
  align-items: center;
  padding: 10px;
  padding-top: 20%;

   z-index: 10000;
`;
