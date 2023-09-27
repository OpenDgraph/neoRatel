import styled from '@emotion/styled';

interface TabLinkProps {
  active: boolean;
  children: React.ReactNode;
}

export const StyledControl = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  justify-content: space-between;
  padding: 4px;
  background: linear-gradient(145deg, #333, #404040);
  box-shadow:  1px 1px 1px #202020,
               -1px -1px 1px #505050;
  z-index: 500;
  top: 90%;
  left: 70%;
`;


export const TabLink = styled.div<TabLinkProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  color: '#6c757d'
  cursor: pointer;

  &:hover {
    color: #007bff;
  }
`;

export const ControlButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background-color: transparent;
  color: inherit;
  cursor: pointer;
`;
