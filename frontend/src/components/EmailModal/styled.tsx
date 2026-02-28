import styled from "styled-components";
import * as color from "../../styles/colors";

export const XButton = styled.button`
  cursor: pointer;
  background-color: transparent;
  border: none;
  color: ${(props) => props.theme.text};
  transition: all 0.2s ease-in-out;

  &:hover {
    color: ${(props) => props.theme.primary};
  }
`;

export const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px 30px 30px 30px;
  gap: 20px;
`;

export const EmailMain = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
  margin-bottom: 10px;

  h1 {
    font-size: 1.5rem;
    font-weight: 700;
    color: ${(props) => props.theme.text};
  }

  svg {
    color: ${color.rebound.default};
  }
`;

export const EmailDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  max-height: 450px;
  overflow-y: auto;
  padding-right: 10px;
`;

export const DetailWrapper = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr;
  gap: 15px;
  align-items: end;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid ${(props) => props.theme.sidebarEdge};

  &:last-child {
    border-bottom-color: ${(props) => props.theme.sidebarBackground};
  }
`;

export const Detail = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  &.row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
  }
`;

export const DetailName = styled.span`
  cursor: default;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  color: ${(props) => props.theme.sidebarCategory};
  margin-left: 4px;
`;

export const NoNumberInputGroup = styled.div`
  display: flex;
  flex-flow: row nowrap;
  position: relative;
  align-items: center;
  justify-content: center;
`;

export const NoNumberWrapper = styled.label`
  display: flex;
  position: absolute;
  right: 12px;
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 8px;
  user-select: none;
  align-content: center;
  justify-content: center;
`;

export const NoNumberLabel = styled.label`
  cursor: default;
  margin-right: 0px;
  align-self: center;
  user-select: none;
  color: ${(props) => props.theme.text};
  opacity: 0.8;
  font-weight: 600;
  font-size: 0.9rem;
`;

export const HiddenCheckbox = styled.input`
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
`;

export const CustomCheck = styled.span`
  height: 18px;
  width: 18px;
  background-color: transparent;
  border: 2px solid ${(props) => props.theme.sidebarCategory};
  border-radius: 50%;
  position: relative;
  transition: all 0.2s ease-in-out;
  align-self: center;

  ${HiddenCheckbox}:checked + & {
    background-color: ${(props) => props.theme.primary};
    border-color: ${(props) => props.theme.primary};
  }

  &:after {
    content: "";
    position: absolute;
    display: none;
    left: 4px;
    top: 2px;
    width: 4px;
    height: 7px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }

  ${HiddenCheckbox}:checked + &:after {
    display: block;
  }
`;

export const ModalInputGroup = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const CopyToAll = styled.span`
  cursor: pointer;
  display: flex;
  gap: 3px;
  font-size: 0.85rem;
  color: ${(props) => props.theme.primary};
  filter: brightness(0.8);
  transition: filter 0.2s;
  margin-top: -5px;

  &:hover {
    filter: brightness(1.2);
    text-decoration: underline;
  }

  svg {
    margin-right: 5px;
  }
`;

export const WeekDay = styled.span`
  color: ${(props) => props.theme.text};
  font-weight: 600;
  text-transform: capitalize;
`;

export const EmailSelect = styled.select`
  background: ${(props) => props.theme.sidebarBackground};
  border: 1px solid ${(props) => props.theme.sidebarEdge};
  color: ${(props) => props.theme.text};
  padding: 10px;
  border-radius: 7px;
  font-family:
    "Poppins",
    "Montserrat",
    system-ui,
    -apple-system,
    sans-serif;
  transition: all 0.1s ease-in-out;
  appearance: none;

  &:focus {
    border-color: ${(props) => props.theme.primary};
  }
`;
