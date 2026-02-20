import styled, { keyframes } from "styled-components";
import * as color from "@/styles/colors";

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  } to {
    transform: rotate(360deg);
  }
`;

export const SpinnerEl = styled.div`
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: ${color.white.light};
  border-radius: 50%;
  animation: ${rotate} 0.8s linear infinite;
  align-self: center;
`;
