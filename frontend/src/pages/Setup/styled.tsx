import { motion } from "framer-motion";
import styled from "styled-components";

export const LoginTextArea = styled.textarea<{ $hasError?: boolean }>`
  width: 100%;
  min-height: 70px;
  background-color: ${(props) => props.theme.background};
  border: 1px solid
    ${(props) => (props.$hasError ? "#F25F4C" : props.theme.sidebarEdge)};
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  padding: 15px;
  color: ${(props) => props.theme.text};
  font-family: inherit;
  font-size: 1rem;
  resize: none;
  transition: all 0.2s ease-in-out;
  font-family:
    "Poppins",
    "Montserrat",
    system-ui,
    -apple-system,
    sans-serif;

  &::placeholder {
    opacity: 0.5;
  }

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.primary};
    background-color: transparent;
  }
`;

export const CharCounter = styled.span`
  align-self: flex-end;
  font-size: 0.75rem;
  opacity: 0.5;
  margin-top: -10px;
  margin-right: 5px;
`;

export const ReturnArrow = styled(motion.div)`
  position: sticky;
  cursor: pointer;
  background: ${(props) => props.theme.sidebarBackground};
  border-radius: 50%;
  display: flex;
  align-items: center;
  padding: 4px;
  z-index: 10;
  opacity: 0.9;

  svg {
    transition: all 0.1s ease-in-out;
  }

  &:hover svg {
    color: ${(props) => props.theme.primary};
  }
`;
