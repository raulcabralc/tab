import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";

export const LogoImage = styled.img`
  width: 60px;
  height: auto;
  object-fit: contain;
`;

export const UserImage = styled.img`
  width: 45px;
  min-height: 45px;
  height: auto;
  background-color: ${(props) => props.theme.sidebarEdge};
  align-content: center;
  object-fit: cover;
  border-radius: 100%;
  border: solid 2px ${(props) => props.theme.sidebarCategory};

  @media (max-width: 768px) {
    width: 40px;
    min-height: 40px;
  }
`;

export const SidebarContainer = styled.div`
  position: fixed;
  width: 240px;
  height: 100vh;
  background-color: ${(props) => props.theme.sidebarBackground};
  display: flex;
  flex-direction: column;
  border-right: 1px solid ${(props) => props.theme.sidebarEdge};
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.4);
  transition: all 0.2s ease-in-out;
  z-index: 50;

  @media (max-width: 768px) {
    width: 100%;
    height: 55px;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    border-right: none;
    border-top: 1px solid ${(props) => props.theme.sidebarEdge};
    bottom: 0;
  }
`;

export const SidebarLogo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-flow: column wrap;
  gap: 12px;
  padding: 25px 0;
  color: ${(props) => props.theme.text};
  font-weight: bold;
  font-size: 1.8rem;
  cursor: default;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const SidebarContent = styled.nav`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;

  @media (max-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
  }

  @media (max-width: 478px) {
    gap: 0;
  }
`;

export const SidebarCategory = styled.div`
  cursor: default;
  display: flex;
  flex-flow: column wrap;
  font-size: 0.7rem;
  font-weight: 900;
  text-transform: uppercase;
  color: ${(props) => props.theme.sidebarCategory};
  padding: 12px;
  padding-bottom: 0px;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const NavItem = styled(NavLink)`
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 16px 18px;
  width: 100%;
  color: ${(props) => props.theme.text};
  transition: all 0.1s ease-in-out;
  gap: 16px;

  span {
    @media (max-width: 768px) {
      display: none;
    }
  }

  &.active {
    color: ${(props) => props.theme.primary};
    background-color: ${(props) => props.theme.background};
    border-right: 2px solid ${(props) => props.theme.primary};
    font-weight: 600;
  }

  &:not(.active) {
    border-right: 2px solid transparent;
  }

  &:hover:not(.active) {
    background-color: ${(props) => props.theme.background};
    opacity: 0.8;
    font-weight: 600;
  }

  svg {
    stroke-width: 2px;
    color: ${(props) => props.theme.text};
    transition: all 0.1s ease-in-out;
  }

  &:hover svg {
    stroke-width: 3px;
  }

  &.active svg {
    stroke-width: 3px;
    color: ${(props) => props.theme.primary};
  }

  @media (max-width: 768px) {
    width: auto;
    border-right: none;

    &.active {
      border-right: none;
      border-top: 2px solid ${(props) => props.theme.primary};
    }

    &:not(.active) {
      border-right: none;
      border-top: 2px solid transparent;
    }
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }

  @media (max-width: 478px) {
    svg {
      size: 2px;
    }
  }
`;

export const SidebarFooter = styled.div`
  display: flex;
  justify-content: center;
  flex-flow: column wrap;
  padding: 8px;
  color: ${(props) => props.theme.text};
`;

export const UserCard = styled.div`
  cursor: pointer;
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  text-align: center;
  gap: 16px;
  padding: 12px 18px;
  border-radius: 10px;
  font-weight: 600;
  background-color: ${(props) => props.theme.background};
  transition: all 0.1s ease-in-out;

  span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 0.9rem;
    text-align: center;

    @media (max-width: 768px) {
      display: none;
    }
  }

  &:hover {
    background-color: ${(props) => props.theme.sidebarEdge};
  }

  @media (max-width: 768px) {
    display: flex;
    padding: 0;
    background-color: none;
  }
`;

export const ThemeToggleArea = styled.div`
  cursor: default;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 18px;
  font-size: 0.8rem;
  font-weight: 600;
  color: ${(props) => props.theme.sidebarCategory};

  @media (max-width: 768px) {
    gap: 8px;
  }

  @media (max-width: 586px) {
    display: none;
  }
`;

export const Switch = styled.label`
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

export const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(1px);
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ModalContainer = styled(motion.div)`
  background-color: ${(props) => props.theme.sidebarBackground};
  width: 700px;
  padding: 24px;
  border-radius: 12px;
  border: 1px solid ${(props) => props.theme.sidebarEdge};
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-flow: column wrap;
  gap: 16px;

  @media (max-width: 768px) {
    position: fixed;
    width: 100vw;
    height: max-content;
    top: 0;
    border-radius: 0;
  }
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: end;
  align-items: center;
  color: ${(props) => props.theme.text};
  font-weight: 700;
`;
