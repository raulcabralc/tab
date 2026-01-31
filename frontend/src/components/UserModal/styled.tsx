import { NavLink } from "react-router-dom";
import styled from "styled-components";

import * as color from "../../styles/colors";

export const XButton = styled.button`
  cursor: pointer;
  background-color: transparent;
  border: none;
  color: ${(props) => props.theme.text};
  font-size: 1.5rem;
  transition: all 0.2s ease-in-out;

  &:hover {
    color: ${(props) => props.theme.primary};
  }
`;

export const ModalUserImage = styled.img`
  width: 120px;
  height: auto;
  min-height: 120px;
  border-radius: 50%;
  border: solid 2px ${(props) => props.theme.primary};
`;

export const ModalContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr;
  padding: 10px 20px;
  gap: 30px;
`;

export const UserMain = styled.div`
  display: flex;
  flex-flow: column wrap;
  font-weight: 600;
  gap: 16px;
  font-size: 1.3rem;
  align-items: center;
  text-align: center;
`;

export const UserDetails = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0 50px;
  padding: 0 0 0 30px;
  border-left: 1px solid ${(props) => props.theme.sidebarEdge};
`;

export const Detail = styled.div`
  display: flex;
  flex-flow: column wrap;
  gap: 10px;
`;

export const DetailName = styled.span`
  cursor: default;
  display: flex;
  flex-flow: column wrap;
  font-size: 0.7rem;
  font-weight: 900;
  text-transform: uppercase;
  color: ${(props) => props.theme.sidebarCategory};
  padding-bottom: 0px;
`;

export const DetailValue = styled.span`
  cursor: default;
  display: flex;
  flex-flow: column wrap;
  font-size: 0.9rem;
  font-weight: 500;
  color: ${(props) => props.theme.text};
`;

export const IsActive = styled.span`
  cursor: default;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  gap: 4px;
  font-size: 0.8rem;
  font-weight: 900;
  text-transform: uppercase;
  color: ${(props) => props.theme.primary};
  padding-bottom: 0px;

  svg {
    stroke-width: 3px;
  }
`;

export const ModalOptions = styled.div`
  display: flex;
  flex-flow: row wrap;
  gap: 10px;
  justify-content: end;
`;

export const ModalButton = styled(NavLink)`
  cursor: pointer;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  gap: 10px;
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 500;
  background-color: ${(props) => props.theme.primary};
  transition: all 0.15s ease-in-out;
  color: ${color.white.light};

  &:hover {
    filter: brightness(90%);
    font-weight: 700;
  }

  svg {
    stroke-width: 2px;
    transition: all 0.15s ease-in-out;
  }

  &:hover svg {
    stroke-width: 3px;
  }
`;
