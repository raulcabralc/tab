import { Check, DoorOpen, Pen, X } from "lucide-react";
import { ModalContainer, ModalHeader, ModalOverlay } from "../Sidebar/styled";
import { ThemeSwitch } from "../ThemeSwitch";
import {
  Detail,
  DetailName,
  DetailValue,
  IsActive,
  ModalButton,
  ModalContent,
  ModalOptions,
  ModalUserImage,
  UserDetails,
  UserMain,
  XButton,
} from "./styled";
import { roleConversion } from "@/helpers/roleConversion";
import { formatDate } from "@/helpers/formatDate";
import { useEffect, useState } from "react";
import { StatusModal } from "../StatusModal";
import { AnimatePresence } from "framer-motion";

export const overlayVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.2,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
      delay: 0.1,
    },
  },
};

export const modalVariants = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      damping: 25,
      stiffness: 500,
    },
  },
  exit: {
    opacity: 0,
    y: 20,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
};

interface UserModalData {
  _id: string;
  createdAt: string;
  displayName: string;
  email: string;
  fullName: string;
  hireDate: string;
  isActive: boolean;
  isFirstLogin: boolean;
  resetPasswordCode: string;
  resetPasswordExpires: string;
  restaurantId: string;
  role: string;
  updatedAt: string;
}

function UserModal({
  onClose,
  data,
}: {
  onClose: () => void;
  data: UserModalData;
}) {
  useEffect(() => {
    setUser(data);
  }, []);

  const [user, setUser] = useState<any>(null);

  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    type: "success" | "error" | "warning";
    title: string;
    message: string;
  } | null>(null);

  const handleLogout = () => {
    localStorage.removeItem("@TAB:token");
    localStorage.removeItem("@TAB:user");
  };

  return (
    <ModalOverlay
      onClick={onClose}
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <ModalContainer
        onClick={(e) => e.stopPropagation()}
        variants={modalVariants}
      >
        <ModalHeader>
          <XButton onClick={onClose}>
            <X size={30} />
          </XButton>
        </ModalHeader>

        <ModalContent>
          <UserMain>
            {user?.avatar ? (
              <ModalUserImage src={user?.avatar} alt="User" />
            ) : (
              <ModalUserImage
                alt={user?.displayName.split("")[0].toUpperCase()}
              />
            )}

            <p>{user?.displayName}</p>
          </UserMain>

          <UserDetails>
            <Detail>
              <DetailName>Nome Completo</DetailName>
              <DetailValue>{user?.fullName}</DetailValue>
            </Detail>
            <Detail>
              <DetailName>Cargo</DetailName>
              <DetailValue>{roleConversion(user?.role)}</DetailValue>
            </Detail>
            <Detail>
              <DetailName>Email</DetailName>
              <DetailValue>{user?.email}</DetailValue>
            </Detail>
            <Detail>
              <DetailName>Contratação</DetailName>
              <DetailValue>{formatDate(user?.hireDate)}</DetailValue>
            </Detail>
            <Detail className="switch">
              <DetailName>Modo Escuro</DetailName>
              <ThemeSwitch />
            </Detail>
            <Detail>
              <IsActive>
                {user?.isActive ? (
                  <>
                    <Check size={20} />
                    <span>Ativo</span>
                  </>
                ) : (
                  <>
                    <X size={20} />
                    <span>Inativo</span>
                  </>
                )}
              </IsActive>
            </Detail>
          </UserDetails>
        </ModalContent>

        <ModalOptions>
          <ModalButton to={`/users/edit/${user?.id}`} onClick={onClose}>
            <Pen size={20} />
            <span>Editar</span>
          </ModalButton>

          <ModalButton
            to="/login?loggedOut=true"
            onClick={handleLogout}
            className="logout"
          >
            <DoorOpen size={20} />
            <span>Sair</span>
          </ModalButton>
        </ModalOptions>
      </ModalContainer>

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
    </ModalOverlay>
  );
}

export default UserModal;
