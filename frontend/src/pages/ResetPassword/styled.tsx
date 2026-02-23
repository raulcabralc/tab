import styled from "styled-components";

export const OtpContainer = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  width: 100%;
  margin: 20px 0;
`;

export const OtpInput = styled.input<{ $hasError?: boolean }>`
  width: 45px;
  height: 55px;
  text-align: center;
  font-size: 1.5rem;
  font-weight: 700;
  background: ${(props) => props.theme.background};
  border: 1px solid
    ${(props) => (props.$hasError ? "#ff4d4d" : props.theme.sidebarEdge)};
  border-radius: 10px;
  color: ${(props) => props.theme.text};
  outline: none;
  transition: all 0.2s;
  font-family:
    "Poppins",
    "Montserrat",
    system-ui,
    -apple-system,
    sans-serif;
  caret-color: ${(props) => props.theme.background};

  &:focus {
    border-color: ${(props) => props.theme.primary};
    box-shadow: 0 0 10px ${(props) => props.theme.primary}44;
    transform: scale(1.05);
    background: ${(props) => props.theme.sidebarBackground};
    caret-color: ${(props) => props.theme.sidebarBackground};
  }
`;
