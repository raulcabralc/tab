import { hexToRgb } from "@/helpers/hexToRgb";
import { motion } from "framer-motion";
import styled from "styled-components";
import * as color from "../../styles/colors";

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
  gap: 15px;
`;

export const TextAndButton = styled.div`
  display: flex;
  gap: 10px;
`;

export const NoMenus = styled.span`
  align-self: center;
  opacity: 0.5;
  font-weight: 700;
  text-align: center;
`;

export const CategoriesSection = styled.div`
  display: flex;
  flex-flow: column wrap;
  gap: 15px;
`;

export const ItemsSection = styled.div`
  display: flex;
  flex-flow: column wrap;
  gap: 15px;
  margin-bottom: 20px;
`;

export const SectionTitle = styled.h1`
  font-size: 1.2rem;
  padding-bottom: 7px;
  border-bottom: 2px solid ${(props) => props.theme.primary};
`;

export const ItemsCategoriesGrid = styled.div`
  display: grid;
  gap: 15px;
`;

export const ItemsCategory = styled.div`
  padding: 20px;
`;

export const ItemsCategoryTitle = styled.h1`
  font-size: 1.1rem;
  font-weight: 500;
  width: max-content;
`;

export const ItemsCategoriesHeader = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
`;

export const MenuItems = styled.div`
  display: flex;
  flex-flow: column wrap;
  gap: 10px;
`;

export const Item = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 10px;
  background: ${(props) => props.theme.sidebarBackground};
  padding: 10px;
  border-radius: 8px;
  border: 1 px solid ${(props) => props.theme.sidebarEdge};
  margin: 0 10px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  padding-right: 30px;
  position: relative;

  &:last-child {
    margin-bottom: 10px;
  }

  @media (max-width: 556px) {
    grid-template-columns: 1fr;
  }
`;

export const ItemCategory = styled.div`
  position: relative;
  background: ${(props) => props.theme.background};
  border-radius: 10px;
  border: 1px solid ${(props) => props.theme.primary};
`;

export const AddItemButton = styled.div`
  cursor: pointer;
  display: flex;
  background: ${(props) => props.theme.primary};
  border-radius: 5px;
  height: 30px;
  width: 30px;
  align-items: center;
  justify-content: center;
  color: ${color.white.light};
  transition: all 0.15s ease-in-out;

  &:hover {
    opacity: 0.85;
  }
`;

export const ImageUploadContainer = styled.div`
  height: 100px;
  border: 2px dashed ${(props) => props.theme.sidebarEdge};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    border-color: ${(props) => props.theme.primary};
    background: ${(props) => `rgba(${hexToRgb(props.theme.primary)}, 0.05)`};
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const HiddenInput = styled.input`
  display: none;
`;
