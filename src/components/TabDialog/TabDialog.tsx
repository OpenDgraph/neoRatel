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

import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import { useTabsStore } from '../../store/tabsStore';
import { AddTabButton, DialogContent, DialogOverlay, DialogTitle, DialogClose, Flex, IconButton } from './styles';
import { SiDgraph, SiGraphql } from "react-icons/si";
import { VscJson } from "react-icons/vsc";

const AddTabDialog = () => {
    const addTab = useTabsStore((state) => state.addTab);

    const tabOptions = [
        { type: 'DQL', description: 'Write and execute DQL queries' },
        { type: 'GraphQL', description: 'Write and execute GraphQL queries' },
        { type: 'JSON View', description: 'View and edit JSON data' },
        { type: 'Schema DQL', description: 'View and edit DQL schema' },
        { type: 'Schema DQL Bulk', description: 'Bulk edit DQL schema' },
        { type: 'Schema GQL', description: 'View and edit GraphQL schema' },
        { type: 'Schema GQL Bulk', description: 'Bulk edit GraphQL schema' }
    ];

    return (
        <Dialog.Root>
            <Dialog.Trigger asChild>
                <AddTabButton className="add-tab-button">+</AddTabButton>
            </Dialog.Trigger>
            <Dialog.Portal>
                <DialogOverlay />
                <DialogContent>
                    <DialogTitle>Add New Tab</DialogTitle>
                    <Flex direction="column" gap="20px">
                        {tabOptions.map((option) => (
                            <button
                                key={option.type}
                                onClick={() => {
                                    addTab(option.type);
                                    document.querySelector<HTMLButtonElement>('.dialog-close-button')?.click();
                                }}
                                style={{
                                    padding: '10px',
                                    margin: '5px',
                                    border: '1px solid #444',
                                    borderRadius: '4px',
                                    backgroundColor: '#2d2d2d',
                                    color: '#fff',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    width: '90%'
                                }}
                            >
                                <div style={{ fontWeight: 'bold' }}>{option.type}</div>
                                <div style={{ fontSize: '0.9em', color: '#888' }}>{option.description}</div>
                            </button>
                        ))}
                    </Flex>
                    <DialogClose asChild>
                        <IconButton className="dialog-close-button" aria-label="Close">
                            <Cross2Icon />
                        </IconButton>
                    </DialogClose>
                </DialogContent>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export default AddTabDialog;
