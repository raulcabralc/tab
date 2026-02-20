import styled from "styled-components";
import * as color from "@/styles/colors";

export const StatusModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 20px;
  gap: 20px;
`;

export const StatusIconContainer = styled.div<{ $type: "success" | "error" }>`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) =>
    props.$type === "success"
      ? "rgba(76, 175, 80, 0.1)"
      : "rgba(242, 95, 76, 0.1)"};
  color: ${(props) =>
    props.$type === "success" ? color.success : props.theme.primary};
  border: 2px solid
    ${(props) =>
      props.$type === "success" ? color.success : props.theme.primary};
  svg {
    stroke-width: 3px;
  }
`;

export const StatusTitle = styled.h2`
  font-size: 1.8rem;
  color: ${(props) => props.theme.text};
`;

export const StatusMessage = styled.p`
  font-size: 1rem;
  color: ${(props) => props.theme.text};
  opacity: 0.7;
  line-height: 1.5;
`;

export const ActionButton = styled.button`
  cursor: pointer;
  padding: 12px 40px;
  border-radius: 10px;
  font-weight: 600;
  background-color: ${(props) => props.theme.primary};
  color: white;
  transition: all 0.2s;
  border: none;

  &:hover {
    filter: brightness(1.1);
    transform: scale(1.05);
  }
`;
