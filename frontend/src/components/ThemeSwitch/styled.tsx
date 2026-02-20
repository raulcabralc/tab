import styled from "styled-components";

export const SwitchEl = styled.label`
  position: relative;
  display: inline-block;
  width: 40px;
  height: 20px;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  span {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${(props) => props.theme.background};
    transition: 0.4s;
    border-radius: 20px;
    border: 1px solid ${(props) => props.theme.sidebarEdge};

    &:before {
      position: absolute;
      content: "";
      height: 14px;
      width: 14px;
      left: 3px;
      bottom: 2px;
      background-color: ${(props) => props.theme.primary};
      transition: 0.4s;
      border-radius: 50%;
    }
  }

  input:checked + span:before {
    transform: translateX(19px);
  }
`;
