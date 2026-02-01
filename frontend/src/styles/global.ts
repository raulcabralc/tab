import styled, { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    background-color: ${(props) => props.theme.background};
    color: ${(props) => props.theme.text};
    font-family: "Montserrat", "Poppins", system-ui, -apple-system, sans-serif;
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  button {
    cursor: pointer;
    border: none;
    background: none;
    font-family: inherit;
  }

  a {
    text-decoration: none;
    color: inherit;
  }
`;

export const SidebarRespect = styled.div`
  margin-left: 240px;
  padding: 18px 24px;

  @media (max-width: 768px) {
    margin-left: 0;
    margin-bottom: 55px;
  }
`;
