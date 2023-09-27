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

import { useTabsStore } from '../../store/tabsStore';
import styled from '@emotion/styled';
import { SiDgraph, SiGraphql } from "react-icons/si";
import { VscJson } from "react-icons/vsc";

const WelcomePage = () => {
  const addTab = useTabsStore((state) => state.addTab);

  const handleCreateTab = (type: string) => {
    addTab(type);
  };

  return (
    <WelcomeContainer>
      <Title>Welcome to Dgraph</Title>
      <Description>To get started, create a new tab in the format you desire:</Description>
      <ButtonsContainer>
        <Button onClick={() => handleCreateTab('DQL')}><SiDgraph /> Create DQL Tab </Button>
        <Button onClick={() => handleCreateTab('GraphQL')}><SiGraphql /> Create GraphQL Tab </Button>
        <Button onClick={() => handleCreateTab('JSON View')}><VscJson /> Create JSON Tab </Button>
        <Button onClick={() => handleCreateTab('RDF')}>Create RDF Tab </Button>
      </ButtonsContainer>
      <ButtonsContainer>
        <Button onClick={() => handleCreateTab('Schema DQL')}><SiDgraph /> DQL Schema Editor </Button>
        <Button onClick={() => handleCreateTab('Schema DQL Bulk')}><SiDgraph /> Bulk Edit DQL Schema </Button>
      </ButtonsContainer>
      <ButtonsContainer>
        <Button onClick={() => handleCreateTab('Schema GQL')}><SiGraphql /> GraphQL Schema Editor </Button>
        <Button onClick={() => handleCreateTab('Schema GQL Bulk')}><SiGraphql /> Bulk Edit GraphQL Schema </Button>
      </ButtonsContainer>
    </WelcomeContainer>
  );
};

export default WelcomePage;

const WelcomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const Description = styled.p`
  font-size: 1.2rem;
  margin-bottom: 2rem;
  text-align: center;
`;

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 1rem;
`;

const Button = styled.button`
  background-color: #29648f;
  border: none;
  color: white;
  padding: 12px 24px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 1rem;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 4px;
  transition-duration: 0.4s;

  &:hover {
    background-color: #45a049;
  }
`;
