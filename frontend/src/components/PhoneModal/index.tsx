import { X, Phone } from "lucide-react";
import { ModalContainer, ModalHeader, ModalOverlay } from "../Sidebar/styled";
import { ModalContent, PhoneDetails, PhoneMain, XButton } from "./styled";
import { LoginButton, LoginInput } from "@/pages/Login/styled";
import { useState } from "react";
import { modalVariants, overlayVariants } from "../UserModal";
import { Spinner } from "../Spinner";

interface PhoneModalProps {
  onClose: () => void;
  onSave: (Phone: string) => Promise<void>;
  initialData: string;
}

function PhoneModal({ onClose, onSave, initialData }: PhoneModalProps) {
  const [localPhone, setLocalPhone] = useState<string | null>(
    initialData.length > 0 ? initialData : null,
  );

  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      if (initialData !== localPhone) {
        await onSave((localPhone as string).replace(/\D/g, ""));
      }
      setTimeout(() => {}, 100);
    } catch (e) {
      console.log(e);
    } finally {
      onClose();
      setIsLoading(false);
    }
  };

  const maskPhone = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .replace(/(-\d{4})(\d+?)$/, "$1");
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
        className="Phone"
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
          <PhoneMain>
            <Phone size={32} />
            <h1>Telefone do restaurante</h1>
          </PhoneMain>

          <PhoneDetails style={{ maxHeight: "400px", overflowY: "auto" }}>
            <LoginInput
              onChange={(e) => setLocalPhone(maskPhone(e.target.value))}
              placeholder="(83) 99398-9159"
              type="text"
              value={maskPhone(localPhone as string)}
            />
          </PhoneDetails>

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

export default PhoneModal;
