import {
  LogoImage,
  NavItem,
  SidebarCategory,
  SidebarContainer,
  SidebarContent,
  SidebarFooter,
  SidebarLogo,
  ThemeToggleArea,
  UserCard,
  UserImage,
} from "./styled";
import { ThemeSwitch } from "../ThemeSwitch";

import logo from "../../assets/logo.png";
import { useState } from "react";
import UserModal from "../UserModal";
import {
  BarChart3,
  BookOpen,
  LayoutDashboard,
  Users,
  UtensilsCrossed,
} from "lucide-react";

import { AnimatePresence } from "framer-motion";

import { userMock } from "@/user-mock";

function Sidebar() {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  return (
    <SidebarContainer>
      <SidebarLogo>
        <LogoImage src={logo} alt="Logo" />
        <span>TAB</span>
      </SidebarLogo>

      <SidebarContent>
        <SidebarCategory>Operação</SidebarCategory>
        <NavItem to="/">
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavItem>
        <NavItem to="/orders">
          <UtensilsCrossed size={20} />
          <span>Pedidos</span>
        </NavItem>
        <SidebarCategory>Gestão</SidebarCategory>
        <NavItem to="/users">
          <Users size={20} />
          <span>Equipe</span>
        </NavItem>
        <NavItem to="/menu">
          <BookOpen size={20} />
          <span>Cardápio</span>
        </NavItem>
        <SidebarCategory>Estratégia</SidebarCategory>
        <NavItem to="/analysis">
          <BarChart3 size={20} />
          <span>Análise</span>
        </NavItem>
      </SidebarContent>

      <ThemeToggleArea>
        <span>Modo Escuro</span>
        <ThemeSwitch />
      </ThemeToggleArea>

      <SidebarFooter>
        <UserCard onClick={() => setIsProfileModalOpen(true)}>
          {userMock.avatar ? (
            <UserImage src={userMock.avatar} />
          ) : (
            <UserImage alt={userMock.displayName.split("")[0].toUpperCase()} />
          )}
          <span>{userMock.displayName}</span>
        </UserCard>
      </SidebarFooter>

      <AnimatePresence>
        {isProfileModalOpen && (
          <UserModal onClose={() => setIsProfileModalOpen(false)} />
        )}
      </AnimatePresence>
    </SidebarContainer>
  );
}

export default Sidebar;
