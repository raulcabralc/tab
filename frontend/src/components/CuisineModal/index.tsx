import { X, Utensils, Plus } from "lucide-react";
import { ModalContainer, ModalHeader, ModalOverlay } from "../Sidebar/styled";
import { LoginInput, LoginButton } from "@/pages/Login/styled";
import { useState } from "react";
import { modalVariants, overlayVariants } from "../UserModal";
import { Spinner } from "../Spinner";
import {
  TagContainer,
  Tag,
  ModalDescription,
  ModalContent,
  TextAndButton,
  NoCuisines,
} from "./styled";
import { HoursMain, XButton } from "../HoursModal/styled";
import { AnimatePresence } from "framer-motion";

interface CuisineModalProps {
  onClose: () => void;
  onSave: (cuisines: string[]) => Promise<void>;
  initialData: string[];
}

const tagVariants = {
  initial: {
    opacity: 0,
    scale: 0.8,
    y: 10,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 500,
      damping: 30,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: -10,
    transition: {
      duration: 0.2,
    },
  },
};

function CuisineModal({ onClose, onSave, initialData }: CuisineModalProps) {
  const [cuisines, setCuisines] = useState<string[]>(initialData || []);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAddCuisine = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !cuisines.includes(trimmed)) {
      setCuisines([...cuisines, trimmed]);
      setInputValue("");
    }
  };

  const handleRemoveCuisine = (index: number) => {
    setCuisines(cuisines.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      if (cuisines !== initialData) {
        await onSave(cuisines);
      }
    } catch (e) {
      console.error(e);
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
        onClick={(e) => e.stopPropagation()}
        variants={modalVariants}
      >
        <ModalHeader>
          <XButton onClick={onClose}>
            <X size={30} />
          </XButton>
        </ModalHeader>

        <ModalContent>
          <HoursMain>
            <Utensils size={32} />
            <h1>Tipos de Culinária</h1>
          </HoursMain>

          <ModalDescription>
            Adicione as especialidades do seu restaurante (ex: Japonesa, Pizza,
            Vegana).
          </ModalDescription>

          <TextAndButton>
            <LoginInput
              placeholder="Digite a culinária"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddCuisine()}
            />
            <LoginButton
              onClick={handleAddCuisine}
              style={{ width: "60px", alignItems: "center" }}
            >
              <Plus size={25} />
            </LoginButton>
          </TextAndButton>

          <TagContainer>
            <AnimatePresence mode="popLayout">
              {cuisines.length > 0 ? (
                cuisines.map((c, index) => (
                  <Tag
                    key={c}
                    variants={tagVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    layout
                    transition={{
                      layout: { type: "spring", stiffness: 400, damping: 35 },
                      scale: { duration: 0.2 },
                      opacity: { duration: 0.2 },
                    }}
                    whileHover={{ scale: 1.05, rotate: -2 }}
                    onClick={() => handleRemoveCuisine(index)}
                  >
                    {c}
                    <X size={14} />
                  </Tag>
                ))
              ) : (
                <NoCuisines>No cuisines for this restaurant yet</NoCuisines>
              )}
            </AnimatePresence>
          </TagContainer>

          <LoginButton onClick={handleSave} disabled={isLoading}>
            {isLoading ? <Spinner /> : "Salvar"}
          </LoginButton>
        </ModalContent>
      </ModalContainer>
    </ModalOverlay>
  );
}

export default CuisineModal;
