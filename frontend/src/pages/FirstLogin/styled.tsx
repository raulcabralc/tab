import styled from "styled-components";

export const PasswordRequirement = styled.span<{ $isCorrect: boolean }>`
  cursor: default;
  color: ${(props) =>
    props.$isCorrect ? props.theme.text : props.theme.primary};
  font-size: 0.75rem;
  align-self: flex-start;
  display: flex;
  margin-top: -15px;
  transition: all 0.2s ease-in-out;
`;
