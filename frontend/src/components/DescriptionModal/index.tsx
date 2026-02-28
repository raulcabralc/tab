import { X, LucideTextAlignStart } from "lucide-react";
import { ModalContainer, ModalHeader, ModalOverlay } from "../Sidebar/styled";
import { ModalContent, HoursDetails, HoursMain, XButton } from "./styled";
import { LoginButton } from "@/pages/Login/styled";
import { useState } from "react";
import { modalVariants, overlayVariants } from "../UserModal";
import { Spinner } from "../Spinner";
import { LoginTextArea } from "@/pages/Setup/styled";

interface DescriptionModalProps {
  onClose: () => void;
  onSave: (description: string) => Promise<void>;
  initialData: string;
}

function DescriptionModal({
  onClose,
  onSave,
  initialData,
}: DescriptionModalProps) {
  const [localDesc, setLocalDesc] = useState<string | null>(
    initialData.length > 0 ? initialData : null,
  );

  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      if (initialData !== localDesc) {
        await onSave(localDesc as string);
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
        className="hours"
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
          <HoursMain>
            <LucideTextAlignStart size={32} />
            <h1>Descrição do restaurante</h1>
          </HoursMain>

          <HoursDetails style={{ maxHeight: "400px", overflowY: "auto" }}>
            <LoginTextArea
              onChange={(e) => setLocalDesc(e.target.value)}
              placeholder="Descrição do restaurante (ex: Melhor restaurante de mariscos de toda João Pessoa)"
            >
              {initialData || null}
            </LoginTextArea>
          </HoursDetails>

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

export default DescriptionModal;
