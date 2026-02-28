import { X, Mail } from "lucide-react";
import { ModalContainer, ModalHeader, ModalOverlay } from "../Sidebar/styled";
import { ModalContent, EmailDetails, EmailMain, XButton } from "./styled";
import { LoginButton, LoginInput } from "@/pages/Login/styled";
import { useState } from "react";
import { modalVariants, overlayVariants } from "../UserModal";
import { Spinner } from "../Spinner";

interface EmailModalProps {
  onClose: () => void;
  onSave: (Email: string) => Promise<void>;
  initialData: string;
}

function EmailModal({ onClose, onSave, initialData }: EmailModalProps) {
  const [localEmail, setLocalEmail] = useState<string | null>(
    initialData.length > 0 ? initialData : null,
  );

  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      if (initialData !== localEmail) {
        await onSave(localEmail as string);
      }
      setTimeout(() => {}, 100);
    } catch (e) {
      console.log(e);
    } finally {
      onClose();
      setIsLoading(false);
    }
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
        className="Email"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "650px" }}
        variants={modalVariants}
      >
        <ModalHeader>
          <XButton onClick={onClose}>
            <X size={30} />
          </XButton>
        </ModalHeader>

        <ModalContent>
          <EmailMain>
            <Mail size={32} />
            <h1>E-mail do restaurante</h1>
          </EmailMain>

          <EmailDetails style={{ maxHeight: "400px", overflowY: "auto" }}>
            <LoginInput
              onChange={(e) => setLocalEmail(e.target.value)}
              placeholder="tab@gmail.com"
              value={localEmail as string}
            />
          </EmailDetails>

          <LoginButton
            onClick={handleSave}
            disabled={isLoading}
            style={{ marginTop: "10px" }}
          >
            {isLoading ? <Spinner /> : "Salvar"}
          </LoginButton>
        </ModalContent>
      </ModalContainer>
    </ModalOverlay>
  );
}

export default EmailModal;
