import { hexToRgb } from "@/helpers/hexToRgb";
import { motion } from "framer-motion";
import styled from "styled-components";

export const TagContainer = styled.div`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 20px 0;
`;

export const Tag = styled(motion.span)`
  cursor: pointer;
  background: ${(props) => `rgba(${hexToRgb(props.theme.primary)}, 0.2)`};
  color: ${(props) => props.theme.primary};
  border: 1px solid ${(props) => props.theme.primary};
  padding: 5px 12px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);

  svg {
    cursor: pointer;
  }

  &:hover {
    box-shadow: 0 0 15px
      ${(props) => `rgba(${hexToRgb(props.theme.primary)}, 0.5)`};
  }
`;

export const ModalDescription = styled.p`
  color: ${(props) => props.theme.text};
  opacity: 0.5;
`;

export const ModalContent = styled.div`
  display: flex;
  flex-flow: column wrap;
  padding: 10px 20px;
  gap: 30px;
`;

export const TextAndButton = styled.div`
  display: flex;
  gap: 10px;
`;

export const NoCuisines = styled.span`
  align-self: center;
  opacity: 0.5;
  font-weight: 700;
  text-align: center;
`;
