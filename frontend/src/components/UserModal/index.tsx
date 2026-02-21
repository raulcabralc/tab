import { Check, Pen, X } from "lucide-react";
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
import { userMock } from "@/user-mock";
import { roleConversion } from "@/helpers/roleConversion";
import { formatDate } from "@/helpers/formatDate";

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

function UserModal({ onClose }: { onClose: () => void }) {
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
            {userMock.avatar ? (
              <ModalUserImage src={userMock.avatar} alt="User" />
            ) : (
              <ModalUserImage
                alt={userMock.displayName.split("")[0].toUpperCase()}
              />
            )}
            <p>{userMock.displayName}</p>
          </UserMain>

          <UserDetails>
            <Detail>
              <DetailName>Nome Completo</DetailName>
              <DetailValue>{userMock.fullName}</DetailValue>
            </Detail>
            <Detail>
              <DetailName>Cargo</DetailName>
              <DetailValue>{roleConversion(userMock.role)}</DetailValue>
            </Detail>
            <Detail>
              <DetailName>Email</DetailName>
              <DetailValue>{userMock.email}</DetailValue>
            </Detail>
            <Detail>
              <DetailName>Contratação</DetailName>
              <DetailValue>{formatDate(userMock.hireDate)}</DetailValue>
            </Detail>
            <Detail className="switch">
              <DetailName>Modo Escuro</DetailName>
              <ThemeSwitch />
            </Detail>
            <Detail>
              <IsActive>
                {userMock.isActive ? (
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
          <ModalButton to={`/users/edit/${userMock.id}`} onClick={onClose}>
            <Pen size={20} />
            <span>Editar</span>
          </ModalButton>
        </ModalOptions>
      </ModalContainer>
    </ModalOverlay>
  );
}

export default UserModal;
