import { X, LayoutGrid, ArrowUp, ArrowDown } from "lucide-react";
import { ModalContainer, ModalHeader, ModalOverlay } from "../Sidebar/styled";
import {
  AnimatedNumber,
  ArrowsWrapper,
  ModalContent,
  NumberDisplayContainer,
  SubAddNumber,
  TableDetails,
  TableMain,
  XButton,
} from "./styled";
import { LoginButton } from "@/pages/Login/styled";
import { useState } from "react";
import { modalVariants, overlayVariants } from "../UserModal";
import { Spinner } from "../Spinner";
import { AnimatePresence } from "framer-motion";

interface TableModalProps {
  onClose: () => void;
  onSave: (Table: number) => Promise<void>;
  initialData: number;
}

const numberVariants = {
  initial: (direction: number) => ({
    y: direction > 0 ? -25 : 25,
    opacity: 0,
  }),
  animate: {
    y: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    y: direction > 0 ? 25 : -25,
    opacity: 0,
  }),
};

function TableModal({ onClose, onSave, initialData }: TableModalProps) {
  const [localTable, setLocalTable] = useState<number>(
    initialData > 0 ? initialData : 0,
  );

  const [direction, setDirection] = useState(0);

  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      if (initialData !== localTable) {
        await onSave(localTable);
      }
      setTimeout(() => {}, 100);
    } catch (e) {
      console.log(e);
    } finally {
      onClose();
      setIsLoading(false);
    }
  };

  const handleIncrement = () => {
    setLocalTable((prev) => (prev as number) + 1);
    setDirection(1);
  };

  const handleDecrement = () => {
    if (localTable <= 0) return;
    setLocalTable((prev) => (prev as number) - 1);
    setDirection(-1);
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
        className="Table"
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
          <TableMain>
            <LayoutGrid size={32} />
            <h1>Número de mesas do restaurante</h1>
          </TableMain>

          <TableDetails
            style={{
              maxHeight: "400px",
              overflowY: "auto",
              display: "flex",
              flexFlow: "row wrap",
              justifyContent: "center",
            }}
          >
            <NumberDisplayContainer>
              <AnimatePresence mode="popLayout" custom={direction}>
                <AnimatedNumber
                  key={localTable}
                  custom={direction}
                  variants={numberVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                >
                  {localTable}
                </AnimatedNumber>
              </AnimatePresence>
            </NumberDisplayContainer>

            <ArrowsWrapper>
              <SubAddNumber onClick={handleIncrement}>
                <ArrowUp size={18} />
              </SubAddNumber>

              <SubAddNumber onClick={handleDecrement}>
                <ArrowDown size={18} />
              </SubAddNumber>
            </ArrowsWrapper>
          </TableDetails>

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

export default TableModal;
