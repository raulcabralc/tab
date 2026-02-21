import { X, MapPin } from "lucide-react";
import { ModalContainer, ModalHeader, ModalOverlay } from "../Sidebar/styled";
import {
  ModalContent,
  AddressDetails,
  AddressMain,
  XButton,
  Detail,
  DetailName,
  NoNumberInputGroup,
  NoNumberLabel,
  CustomCheck,
  HiddenCheckbox,
  NoNumberWrapper,
} from "./styled";
import { LoginInput, LoginButton, ErrorMessage } from "@/pages/Login/styled"; // Reaproveitando seus estilos
import { useState, useEffect } from "react";
import { modalVariants, overlayVariants } from "../UserModal";
import axios from "axios";
import { AnimatePresence } from "framer-motion";
import { StatusModal } from "../StatusModal";

interface Address {
  zip: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
}

interface AddressModalProps {
  onClose: () => void;
  onSave: (address: Address) => void;
  initialData: Address;
}

function AddressModal({ onClose, onSave, initialData }: AddressModalProps) {
  const [localAddress, setLocalAddress] = useState<Address>(initialData);
  const [loadingCep, setLoadingCep] = useState(false);
  const [errorFields, setErrorFields] = useState<string[]>([]);

  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    type: "success" | "error";
    title: string;
    message: string;
    isFirstLogin: boolean;
  } | null>(null);

  const [isSN, setIsSN] = useState(false);

  useEffect(() => {
    const checkSN = () => {
      if (localAddress.number === "S/N") {
        setIsSN(true);
      }
    };

    checkSN();

    const cleanCep = localAddress.zip.replace(/\D/g, "");

    if (cleanCep.length === 8 && !localAddress.street) {
      const fetchAddress = async () => {
        setLoadingCep(true);
        try {
          const { data } = await axios.get(
            `https://viacep.com.br/ws/${cleanCep}/json/`,
          );

          if (data.erro) {
            setModalConfig({
              isOpen: true,
              type: "error",
              title: "Erro ao buscar CEP",
              message: "Não foi possível preencher os campos automaticamente",
              isFirstLogin: false,
            });

            return;
          }

          setLocalAddress((prev) => ({
            ...prev,
            street: data.logradouro,
            neighborhood: data.bairro,
            city: data.localidade,
          }));

          removeFromErrors("street");
          removeFromErrors("neighborhood");
          removeFromErrors("city");

          setModalConfig({
            isOpen: true,
            type: "success",
            title: "CEP encontrado!",
            message: "Os demais campos foram preenchidos automaticamente",
            isFirstLogin: false,
          });
        } catch {
          setModalConfig({
            isOpen: true,
            type: "error",
            title: "Erro ao buscar CEP",
            message: "Não foi possível preencher os campos automaticamente",
            isFirstLogin: false,
          });
        } finally {
          setLoadingCep(false);
        }
      };

      fetchAddress();
    }
  }, [localAddress.zip]);

  const handleSave = () => {
    const newErrors: string[] = [];
    const cleanCep = localAddress.zip.replace(/\D/g, "");

    if (!cleanCep) newErrors.push("CEP");
    if (cleanCep.length < 8) newErrors.push("invalidZip");
    if (!localAddress.street.trim()) newErrors.push("street");
    if (!localAddress.number.trim() && !isSN) newErrors.push("number");
    if (!localAddress.neighborhood.trim()) newErrors.push("neighborhood");
    if (!localAddress.city.trim()) newErrors.push("city");

    if (newErrors.length > 0) {
      setErrorFields(newErrors);
      return;
    }

    onSave(localAddress);
  };

  const maskCEP = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/^(\d{5})(\d)/, "$1-$2")
      .substring(0, 9);
  };

  const maskNumber = (value: string) => {
    return value.replace(/\D/g, "").substring(0, 5);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    }
  };

  const removeFromErrors = (field: string) => {
    const index = errorFields.indexOf(field);

    if (index > -1) {
      errorFields.splice(index, 1);
    }
  };

  const toggleSN = () => {
    const nextValue = !isSN;

    setIsSN(nextValue);

    if (nextValue) {
      setLocalAddress((prev) => ({ ...prev, number: "S/N" }));
      removeFromErrors("number");
    } else {
      setLocalAddress((prev) => ({ ...prev, number: "" }));
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
        style={{ maxWidth: "500px" }}
        variants={modalVariants}
        onKeyDown={handleKeyDown}
      >
        <ModalHeader>
          <XButton onClick={onClose}>
            <X size={30} />
          </XButton>
        </ModalHeader>

        <ModalContent>
          <AddressMain>
            <MapPin size={32} color="#F25F4C" />
            <h1>Endereço do Estabelecimento</h1>
          </AddressMain>

          <AddressDetails>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "15px",
              }}
            >
              <Detail>
                <DetailName>CEP {loadingCep && "..."}</DetailName>
                <LoginInput
                  placeholder="00000-000"
                  value={localAddress.zip}
                  onChange={(e) => {
                    const maskedValue = maskCEP(e.target.value);
                    setLocalAddress({ ...localAddress, zip: maskedValue });
                    removeFromErrors("CEP");
                    removeFromErrors("invalidZip");
                  }}
                  $hasError={
                    errorFields.includes("CEP") ||
                    errorFields.includes("invalidZip")
                  }
                />
                <ErrorMessage
                  $isAppearing={
                    errorFields.includes("CEP") ||
                    errorFields.includes("invalidZip")
                  }
                  style={{ marginTop: "0px" }}
                >
                  {errorFields.includes("CEP")
                    ? "CEP é obrigatório"
                    : "CEP inválido"}
                </ErrorMessage>
              </Detail>

              <Detail>
                <DetailName>Número</DetailName>
                <NoNumberInputGroup>
                  <LoginInput
                    disabled={isSN}
                    placeholder="123"
                    value={localAddress.number}
                    onChange={(e) => {
                      const maskedValue = maskNumber(e.target.value);
                      setLocalAddress({ ...localAddress, number: maskedValue });
                      removeFromErrors("number");
                    }}
                    $hasError={errorFields.includes("number")}
                  />
                  <NoNumberWrapper>
                    <NoNumberLabel>S/N</NoNumberLabel>
                    <HiddenCheckbox
                      type="checkbox"
                      checked={isSN}
                      onChange={toggleSN}
                    />
                    <CustomCheck />
                  </NoNumberWrapper>
                </NoNumberInputGroup>
                <ErrorMessage
                  $isAppearing={errorFields.includes("number")}
                  style={{ marginTop: "0px" }}
                >
                  Número é obrigatório
                </ErrorMessage>
              </Detail>
            </div>

            <Detail>
              <DetailName>Rua / Logradouro</DetailName>
              <LoginInput
                value={localAddress.street}
                onChange={(e) => {
                  setLocalAddress({ ...localAddress, street: e.target.value });
                  removeFromErrors("street");
                }}
                $hasError={errorFields.includes("street")}
              />
              <ErrorMessage
                $isAppearing={errorFields.includes("street")}
                style={{ marginTop: "0px" }}
              >
                Logradouro é obrigatório
              </ErrorMessage>
            </Detail>

            <Detail>
              <DetailName>Bairro</DetailName>
              <LoginInput
                value={localAddress.neighborhood}
                onChange={(e) => {
                  setLocalAddress({
                    ...localAddress,
                    neighborhood: e.target.value,
                  });
                  removeFromErrors("neighborhood");
                }}
                $hasError={errorFields.includes("neighborhood")}
              />
              <ErrorMessage
                $isAppearing={errorFields.includes("neighborhood")}
                style={{ marginTop: "0px" }}
              >
                Bairro é obrigatório
              </ErrorMessage>
            </Detail>

            <Detail>
              <DetailName>Cidade</DetailName>
              <LoginInput
                value={localAddress.city}
                onChange={(e) => {
                  setLocalAddress({ ...localAddress, city: e.target.value });
                  removeFromErrors("city");
                }}
                $hasError={errorFields.includes("city")}
              />
              <ErrorMessage
                $isAppearing={errorFields.includes("city")}
                style={{ marginTop: "0px" }}
              >
                Cidade é obrigatório
              </ErrorMessage>
            </Detail>

            <LoginButton onClick={handleSave} style={{ marginTop: "20px" }}>
              Confirmar Endereço
            </LoginButton>
          </AddressDetails>
        </ModalContent>
      </ModalContainer>

      <AnimatePresence>
        {modalConfig?.isOpen && (
          <StatusModal
            type={modalConfig.type}
            title={modalConfig.title}
            message={modalConfig.message}
            onClose={() => {
              setModalConfig(null);
            }}
          />
        )}
      </AnimatePresence>
    </ModalOverlay>
  );
}

export default AddressModal;
