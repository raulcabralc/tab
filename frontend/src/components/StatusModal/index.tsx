import { Check, X, AlertCircle } from "lucide-react";
import { ModalOverlay, ModalContainer, ModalHeader } from "../Sidebar/styled";
import { XButton } from "../UserModal/styled";
import {
  StatusModalContent,
  StatusIconContainer,
  StatusTitle,
  StatusMessage,
  ActionButton,
} from "./styled";
import { modalVariants, overlayVariants } from "../UserModal";

interface StatusModalProps {
  type: "success" | "error";
  title: string;
  message: string;
  onClose: () => void;
}

export function StatusModal({
  type,
  title,
  message,
  onClose,
}: StatusModalProps) {
  return (
    <ModalOverlay
      onClick={onClose}
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={overlayVariants}
    >
      <ModalContainer
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "400px" }}
        variants={modalVariants}
      >
        <ModalHeader>
          <XButton onClick={onClose}>
            <X size={24} />
          </XButton>
        </ModalHeader>

        <StatusModalContent>
          <StatusIconContainer $type={type}>
            {type === "success" ? (
              <Check size={40} />
            ) : (
              <AlertCircle size={40} />
            )}
          </StatusIconContainer>

          <StatusTitle>{title}</StatusTitle>
          <StatusMessage>{message}</StatusMessage>

          <ActionButton onClick={onClose}>
            {type === "success" ? "Continuar" : "Tentar novamente"}
          </ActionButton>
        </StatusModalContent>
      </ModalContainer>
    </ModalOverlay>
  );
}
