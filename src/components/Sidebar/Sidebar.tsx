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
import { SidebarContainer, IconContainer, IconSpacing } from './styles';
import { FiFile, FiFolder } from 'react-icons/fi';
import { SiDgraph, SiGraphql } from "react-icons/si";
import { RiSettings5Fill } from "react-icons/ri";
import { useDgraphConfigStore } from '../../store/dgraphConfigStore';


const Sidebar: React.FC = () => {
    const {
        dialogState,
        setDialogState,
    } = useDgraphConfigStore();

    const handleSubmit = (event: { preventDefault: () => void; }) => {
        console.log('handleSubmit');
        event.preventDefault();
        setDialogState(!dialogState);
    };
    return (
        <SidebarContainer>
            <IconContainer>
                <IconSpacing onClick={handleSubmit} style={{ cursor: 'pointer' }}>
                    <SiDgraph size={80} style={{ filter: 'drop-shadow(4px 4px 4px rgba(0, 0, 0, 1.25))' }} />
                </IconSpacing>
                <IconSpacing>
                    <FiFolder size={35} />
                </IconSpacing>
                <IconSpacing>
                    <FiFile size={35} />
                </IconSpacing>
                <IconSpacing>
                    <SiGraphql size={35} />
                </IconSpacing>
                <IconSpacing>
                    <RiSettings5Fill size={35} />
                </IconSpacing>
            </IconContainer>
        </SidebarContainer>
    );
};

export default Sidebar;
