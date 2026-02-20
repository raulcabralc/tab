import styled from "styled-components";
import * as color from "@/styles/colors";
import { NavLink } from "react-router-dom";

export const LoginContainer = styled.div`
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
`;

export const LoginLogoContainer = styled.img`
  object-fit: cover;
  align-self: center;
  width: 100px;
  height: auto;
`;

export const LoginCard = styled.div`
  display: flex;
  flex-flow: column wrap;
  gap: 16px;
  padding: 30px;
  border-radius: 12px;
  border: 1px solid ${(props) => props.theme.sidebarEdge};
  background-color: ${(props) => props.theme.sidebarBackground};
  color: ${(props) => props.theme.text};
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease-in-out;
  width: 90%;
  max-width: 450px;
`;

export const LoginHeader = styled.h1`
  color: ${(props) => props.theme.primary};
  font-size: 3rem;
  text-align: center;
`;

export const LoginDescription = styled.p`
  color: ${(props) => props.theme.text};
  font-size: 1rem;
  text-align: center;
  filter: opacity(0.6);
`;

export const LoginFields = styled.div`
  padding: 25px 0;
  display: flex;
  flex-flow: column wrap;
  gap: 20px;
  align-content: center;
  align-items: center;
`;

export const InputGroup = styled.div`
  position: relative;
  width: 80%;
  margin-bottom: 5px;

  @media (max-width: 478px) {
    width: 100%;
  }
`;

export const FloatingLabel = styled.label<{
  $isFloating: boolean;
  $hasError: boolean;
  $isFocused: boolean;
}>`
  position: absolute;
  left: 12px;
  top: ${(props) => (props.$isFloating ? "-7px" : "15px")};
  font-size: ${(props) => (props.$isFloating ? "0.8rem" : "1rem")};
  color: ${(props) => {
    if (props.$hasError) return color.error;
    if (props.$isFocused) return props.theme.primary;
    return props.theme.text;
  }};
  background-color: ${(props) =>
    props.$isFocused ? props.theme.sidebarBackground : props.theme.background};
  padding: 0 5px;
  transition: all 0.2s ease-in-out;
  pointer-events: none;
  filter: ${(props) => (props.$isFloating ? "opacity(1)" : "opacity(0.6)")};
  border-radius: 100px;
`;

export const LoginInput = styled.input<{ $hasError?: boolean }>`
  width: 100%;
  background: ${(props) => props.theme.background};
  border: 1px solid ${(props) => props.theme.sidebarEdge};
  outline: none;
  color: ${(props) => props.theme.text};
  padding: 12px;
  border-radius: 10px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  font-family:
    "Poppins",
    "Montserrat",
    system-ui,
    -apple-system,
    sans-serif;
  font-size: 1rem;
  transition: all 0.15s ease-in-out;
  border-color: ${(props) =>
    props.$hasError ? "#ff4d4d" : props.theme.sidebarEdge};

  &:focus {
    border-color: ${(props) =>
      props.$hasError ? "#ff4d4d" : props.theme.primary};
    background: ${(props) => props.theme.sidebarBackground};
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  }
`;

export const ErrorMessage = styled.span<{ $isAppearing: boolean }>`
  opacity: ${(props) => (props.$isAppearing ? 1 : 0)};
  transform: ${(props) =>
    props.$isAppearing ? "translateY(0px)" : "translateY(-12px)"};
  color: #ff4d4d;
  font-size: 0.75rem;
  align-self: flex-start;
  margin-top: -15px;
  transition: all 0.3s ease-in-out;
`;

export const ForgotPasswordLink = styled(NavLink)`
  display: flex;
  gap: 3px;
  align-self: flex-end;
  font-size: 0.85rem;
  color: ${(props) => props.theme.primary};
  text-decoration: none;
  margin-top: -10px;
  filter: brightness(0.8);
  transition: filter 0.2s;

  &:hover {
    filter: brightness(1.2);
    text-decoration: underline;
  }
`;

export const LoginButton = styled.button`
  width: 70%;
  min-height: 48px;
  background: ${(props) => props.theme.primary};
  color: ${color.white.default};
  padding: 12px;
  border-radius: 10px;
  font-size: 1.2rem;
  box-shadow: 0 0 5px ${(props) => props.theme.primary};
  transition: all 0.1s ease-in-out;
  display: flex;
  align-self: center;
  text-align: center;
  justify-content: center;

  &:hover {
    box-shadow: 0 0 10px ${(props) => props.theme.primary};
    font-weight: 700;
    filter: brightness(1.1);
    transform: scale(1.05);
  }

  &:disabled {
    filter: brightness(0.6);
    cursor: not-allowed;
    box-shadow: none;

    &:hover {
      font-weight: 600;
      transform: scale(1);
    }
  }
`;

export const LoginThemeToggleContainer = styled.div`
  display: flex;
  flex-flow: row nowrap;
  cursor: default;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px 18px;
  font-size: 0.8rem;
  font-weight: 600;
  color: ${(props) => props.theme.sidebarCategory};
`;
