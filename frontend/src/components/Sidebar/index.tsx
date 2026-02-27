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
import { useEffect, useState } from "react";
import UserModal from "../UserModal";
import {
  BarChart3,
  LayoutDashboard,
  Store,
  Users,
  UtensilsCrossed,
} from "lucide-react";

import { AnimatePresence } from "framer-motion";
import api from "@/services/api";
import { StatusModal } from "../StatusModal";
import {
  SkeletonSidebarAvatar,
  SkeletonUserCardName,
} from "@/pages/Dashboard/styled";

function Sidebar() {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoadingData(true);
      try {
        const { user } = await getData();
        setUser(user);
      } catch (e) {
        setModalConfig({
          isOpen: true,
          type: "error",
          title: "Ops!",
          message: "Ocorreu um erro ao carregar os dados.",
        });
      } finally {
        setIsLoadingData(false);
      }
    };

    loadDashboardData();
  }, []);

  const [user, setUser] = useState<any>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    type: "success" | "error" | "warning";
    title: string;
    message: string;
  } | null>(null);

  const getData = async () => {
    const userData = await api.get("/auth/me");
    const user = userData.data;

    return { user };
  };

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
        <NavItem to="/restaurant">
          <Store size={20} />
          <span>Restaurante</span>
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
        <UserCard
          onClick={() => (isLoadingData ? null : setIsProfileModalOpen(true))}
        >
          {isLoadingData ? (
            <SkeletonSidebarAvatar />
          ) : user?.avatar ? (
            <UserImage src={user?.avatar} alt="User" />
          ) : (
            <UserImage alt={user?.displayName.split("")[0].toUpperCase()} />
          )}

          {isLoadingData ? (
            <SkeletonUserCardName />
          ) : (
            <span>{user?.displayName}</span>
          )}
        </UserCard>
      </SidebarFooter>

      <AnimatePresence>
        {isProfileModalOpen && (
          <UserModal data={user} onClose={() => setIsProfileModalOpen(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {modalConfig?.isOpen && (
          <StatusModal
            type={modalConfig.type}
            title={modalConfig.title}
            message={modalConfig.message}
            onClose={() => {
              setModalConfig(null);

              setTimeout(() => {}, 300);
            }}
          />
        )}
      </AnimatePresence>
    </SidebarContainer>
  );
}

export default Sidebar;
