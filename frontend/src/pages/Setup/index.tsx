import { ThemeSwitch } from "@/components/ThemeSwitch";
import {
  ErrorMessage,
  FloatingLabel,
  ForgotPasswordLink,
  InputGroup,
  LoginButton,
  LoginCard,
  LoginContainer,
  LoginDescription,
  LoginFields,
  LoginHeader,
  LoginInput,
  LoginLogoContainer,
  LoginThemeToggleContainer,
  RegisterText,
} from "../Login/styled";

import Logo from "@/assets/logo.png";
import { ArrowLeft, Camera, Moon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import AddressModal from "@/components/AddressModal";
import { Stepper } from "@/components/Stepper";
import axios from "axios";
import {
  HiddenInput,
  ImageCircle,
  ImagePreview,
  UploadContainer,
} from "@/components/UploadImage/styled";
import api from "@/services/api";
import { CharCounter, LoginTextArea, ReturnArrow } from "@/pages/Setup/styled";
import { StatusModal } from "@/components/StatusModal";
import { Spinner } from "@/components/Spinner";

interface Address {
  zip: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
}

export function Setup() {
  useEffect(() => {
    document.title = "Tab • Cadastro";
  }, []);

  // User
  const [fullName, setFullName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Restaurant
  const [restaurantName, setRestaurantName] = useState("");
  const [restaurantDescription, setRestaurantDescription] = useState("");
  const [restaurantImage, setRestaurantImage] = useState("");
  const [restaurantEmail, setRestaurantEmail] = useState("");
  const [restaurantPhone, setRestaurantPhone] = useState("");
  const [restaurantAddress, setRestaurantAddress] = useState<Address>({
    zip: "",
    street: "",
    number: "",
    neighborhood: "",
    city: "",
  });

  const [fullNameError, setFullNameError] = useState(false);
  const [displayNameError, setDisplayNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [emailErrorReason, setEmailErrorReason] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  const [restaurantNameError, setRestaurantNameError] = useState(false);
  const [restaurantDescriptionError, setRestaurantDescriptionError] =
    useState(false);
  const [restaurantEmailError, setRestaurantEmailError] = useState(false);
  const [restaurantEmailErrorReason, setRestaurantEmailErrorReason] =
    useState("");
  const [restaurantPhoneError, setRestaurantPhoneError] = useState(false);
  const [restaurantPhoneErrorReason, setRestaurantPhoneErrorReason] =
    useState("");
  const [restaurantAddressError, setRestaurantAddressError] = useState(false);

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addressPreview, setAddressPreview] = useState("");

  const [focusedField, setFocusedField] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const [step, setStep] = useState(1);

  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    type: "success" | "error";
    title: string;
    message: string;
    isFirstLogin: boolean;
  } | null>(null);

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleSaveAddress = (addressData: Address) => {
    setRestaurantAddress(addressData);

    if (addressData.street && addressData.number && addressData.neighborhood) {
      const preview = `${addressData.street}, ${addressData.number}, ${addressData.neighborhood}`;
      setAddressPreview(preview);
    } else {
      setAddressPreview("");
    }

    setRestaurantAddressError(false);
    setIsAddressModalOpen(false);
  };

  const handleNextStep = async () => {
    if (step === 1) {
      const isFullNameValid = fullName.length > 2;
      const isDisplayNameValid = displayName.length > 2;
      const isEmailValid = validateEmail(email);
      const isPasswordValid = password.length >= 4;

      setFullNameError(!isFullNameValid);
      setDisplayNameError(!isDisplayNameValid);
      setEmailError(!isEmailValid);
      setPasswordError(!isPasswordValid);

      const isStep1Valid =
        isFullNameValid &&
        isDisplayNameValid &&
        isEmailValid &&
        isPasswordValid;

      if (isStep1Valid) {
        setStep(2);
      }
    } else if (step === 2) {
      const isRestaurantNameValid = restaurantName.length > 2;
      const isRestaurantDescriptionValid = restaurantDescription.length > 2;

      if (!restaurantImage || restaurantImage.length === 0) {
        setRestaurantImage(restaurantName.split("")[0]);
      }

      setRestaurantNameError(!isRestaurantNameValid);
      setRestaurantDescriptionError(!isRestaurantDescriptionValid);

      if (isRestaurantNameValid && isRestaurantDescriptionValid) {
        setStep(3);
      }
    } else if (step === 3) {
      const isRestaurantEmailValid = validateEmail(restaurantEmail);
      const isRestaurantPhoneValid = validatePhone(restaurantPhone);
      const isRestaurantAddressValid = validateAddress(restaurantAddress);

      setRestaurantEmailError(!isRestaurantEmailValid);
      setRestaurantPhoneError(!isRestaurantPhoneValid);
      setRestaurantAddressError(!isRestaurantAddressValid);

      if (
        isRestaurantEmailValid &&
        isRestaurantPhoneValid &&
        isRestaurantAddressValid
      ) {
        await createSetup();
      }
    }
  };

  const createSetup = async () => {
    try {
      setIsLoading(true);

      const setupData = {
        user: {
          fullName,
          displayName,
          email,
          pin: password,
        },
        restaurant: {
          name: restaurantName,
          image: restaurantImage,
          description: restaurantDescription,
          address: restaurantAddress,
          phone: restaurantPhone,
          email: restaurantEmail,
        },
      };

      const response = await api.post("/restaurant/setup", setupData);

      if (response.data) {
        setModalConfig({
          isOpen: true,
          type: "success",
          title: "Sucesso!",
          message: `O restaurante ${restaurantName} e o usuário ${displayName} foram criados.`,
          isFirstLogin: true,
        });
      }
    } catch (e: any) {
      const translatedError = (message: string) => {
        if (message === "Restaurant phone is already registered.") {
          setRestaurantPhoneError(true);
          setRestaurantPhoneErrorReason("Telefone já cadastrado");
          return "O número de telefone do restaurante já está cadastrado";
        } else if (message === `Email ${email} is already registered.`) {
          setEmailError(true);
          setEmailErrorReason("E-mail já cadastrado");
          return "O e-mail de usuário já está cadastrado";
        } else if (message === "Restaurant email is already registered.") {
          setRestaurantEmailError(true);
          setRestaurantEmailErrorReason("E-mail já cadastrado");
          return "O e-mail do restaurante já está cadastrado";
        }
      };

      const errorMessage =
        translatedError(e.response?.data?.message) ||
        "Revise os campos e tente novamente.";

      setModalConfig({
        isOpen: true,
        type: "error",
        title: "Ocorreu um erro!",
        message: errorMessage,
        isFirstLogin: false,
      });

      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone: string) => {
    const digitsOnly = phone.replace(/\D/g, "");

    const isInvalidPattern = /^(\d)\1+$/.test(digitsOnly);

    return (
      digitsOnly.length >= 10 && digitsOnly.length <= 11 && !isInvalidPattern
    );
  };

  const validateAddress = (address: Address) => {
    return Object.values(address).every((value) => value.trim().length > 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleNextStep();
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCircleClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };

    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
    );

    try {
      setIsLoading(true);
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData,
      );

      console.log(response.data);

      setRestaurantImage(response.data.secure_url);
    } catch (e) {
      console.log("Erro:", e);
    } finally {
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

  const returnStep = () => {
    setStep(step - 1);
  };

  const returnableSteps = step === 2 || step === 3;

  return (
    <LoginContainer>
      <LoginCard onKeyDown={handleKeyDown}>
        {returnableSteps && (
          <ReturnArrow onClick={returnStep}>
            <ArrowLeft size={32} />
          </ReturnArrow>
        )}
        <LoginLogoContainer src={Logo} />

        <Stepper step={step} />

        <LoginHeader>
          {step === 1
            ? "Crie sua conta"
            : step === 2
              ? "Sobre o Restaurante"
              : "Contato e Localização"}
        </LoginHeader>
        <LoginDescription>
          {step === 1
            ? "Primeiro, configure seu perfil de administrador"
            : step === 2
              ? "Agora, conte-nos sobre o seu estabelecimento"
              : "Por fim, como os clientes e fornecedores podem encontrar o seu estabelecimento?"}
        </LoginDescription>

        <LoginFields>
          {step === 1 ? (
            <>
              <InputGroup>
                <FloatingLabel
                  $isFocused={focusedField === "fullName"}
                  $isFloating={
                    focusedField === "fullName" || fullName.length > 0
                  }
                  $hasError={fullNameError}
                >
                  Nome Completo
                </FloatingLabel>
                <LoginInput
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    setFullNameError(false);
                  }}
                  onFocus={() => setFocusedField("fullName")}
                  onBlur={() => setFocusedField(null)}
                  $hasError={fullNameError}
                />
              </InputGroup>
              <ErrorMessage $isAppearing={fullNameError}>
                Nome completo deve ter pelo menos 3 caracteres
              </ErrorMessage>

              <InputGroup>
                <FloatingLabel
                  $isFocused={focusedField === "displayName"}
                  $isFloating={
                    focusedField === "displayName" || displayName.length > 0
                  }
                  $hasError={displayNameError}
                >
                  Nome de Exibição
                </FloatingLabel>
                <LoginInput
                  value={displayName}
                  onChange={(e) => {
                    setDisplayName(e.target.value);
                    setDisplayNameError(false);
                  }}
                  onFocus={() => setFocusedField("displayName")}
                  onBlur={() => setFocusedField(null)}
                  $hasError={displayNameError}
                />
              </InputGroup>
              <ErrorMessage $isAppearing={displayNameError}>
                Nome de exibição deve ter pelo menos 3 caracteres
              </ErrorMessage>

              <InputGroup>
                <FloatingLabel
                  $isFocused={focusedField === "email"}
                  $isFloating={focusedField === "email" || email.length > 0}
                  $hasError={emailError}
                >
                  E-mail
                </FloatingLabel>
                <LoginInput
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError(false);
                  }}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  $hasError={emailError}
                />
              </InputGroup>
              <ErrorMessage $isAppearing={emailError}>
                {emailErrorReason || "E-mail inválido"}
              </ErrorMessage>

              <InputGroup>
                <FloatingLabel
                  $isFocused={focusedField === "pass"}
                  $isFloating={focusedField === "pass" || password.length > 0}
                  $hasError={passwordError}
                >
                  Senha
                </FloatingLabel>
                <LoginInput
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError(false);
                  }}
                  onFocus={() => setFocusedField("pass")}
                  onBlur={() => setFocusedField(null)}
                  $hasError={passwordError}
                />
              </InputGroup>
              <ErrorMessage $isAppearing={passwordError}>
                Senha deve ter pelo menos 4 caracteres
              </ErrorMessage>
            </>
          ) : step === 2 ? (
            <>
              <InputGroup>
                <FloatingLabel
                  $isFocused={focusedField === "restaurantName"}
                  $isFloating={
                    focusedField === "restaurantName" ||
                    restaurantName.length > 0
                  }
                  $hasError={restaurantNameError}
                >
                  Nome do Restaurante
                </FloatingLabel>
                <LoginInput
                  value={restaurantName}
                  onChange={(e) => {
                    setRestaurantName(e.target.value);
                    setRestaurantNameError(false);
                  }}
                  onFocus={() => setFocusedField("restaurantName")}
                  onBlur={() => setFocusedField(null)}
                  $hasError={restaurantNameError}
                />
              </InputGroup>
              <ErrorMessage $isAppearing={restaurantNameError}>
                Nome do restaurante deve ter pelo menos 3 caracteres
              </ErrorMessage>

              <InputGroup>
                <FloatingLabel
                  $isFocused={focusedField === "restaurantDescription"}
                  $isFloating={
                    focusedField === "restaurantDescription" ||
                    restaurantDescription.length > 0
                  }
                  $hasError={restaurantEmailError}
                >
                  Descrição do Restaurante
                </FloatingLabel>
                <LoginTextArea
                  value={restaurantDescription}
                  onChange={(e) => {
                    setRestaurantDescription(e.target.value);
                    setRestaurantDescriptionError(false);
                  }}
                  onFocus={() => setFocusedField("restaurantDescription")}
                  onBlur={() => setFocusedField(null)}
                  $hasError={restaurantDescriptionError}
                  maxLength={200}
                />
              </InputGroup>
              <CharCounter>{restaurantDescription.length}/200</CharCounter>

              <ErrorMessage $isAppearing={restaurantDescriptionError}>
                Descrição deve ter pelo menos 3 caracteres
              </ErrorMessage>

              <UploadContainer>
                <HiddenInput
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <ImageCircle onClick={handleCircleClick}>
                  <ImagePreview $url={previewImage}>
                    {!previewImage && <Camera size={32} opacity={0.5} />}
                  </ImagePreview>
                </ImageCircle>
              </UploadContainer>
            </>
          ) : (
            <>
              <InputGroup>
                <FloatingLabel
                  $isFocused={focusedField === "restaurantEmail"}
                  $isFloating={
                    focusedField === "restaurantEmail" ||
                    restaurantEmail.length > 0
                  }
                  $hasError={restaurantEmailError}
                >
                  E-mail do Restaurante
                </FloatingLabel>
                <LoginInput
                  value={restaurantEmail}
                  onChange={(e) => {
                    setRestaurantEmail(e.target.value);
                    setRestaurantEmailError(false);
                  }}
                  onFocus={() => setFocusedField("restaurantEmail")}
                  onBlur={() => setFocusedField(null)}
                  $hasError={restaurantEmailError}
                />
              </InputGroup>
              <ErrorMessage $isAppearing={restaurantEmailError}>
                {restaurantEmailErrorReason || "E-mail inválido"}
              </ErrorMessage>

              <InputGroup>
                <FloatingLabel
                  $isFocused={focusedField === "restaurantPhone"}
                  $isFloating={
                    focusedField === "restaurantPhone" ||
                    restaurantPhone.length > 0
                  }
                  $hasError={restaurantPhoneError}
                >
                  Telefone do Restaurante
                </FloatingLabel>
                <LoginInput
                  value={restaurantPhone}
                  onChange={(e) => {
                    const maskedValue = maskPhone(e.target.value);
                    setRestaurantPhone(maskedValue);
                    setRestaurantPhoneError(false);
                  }}
                  onFocus={() => setFocusedField("restaurantPhone")}
                  onBlur={() => setFocusedField(null)}
                  maxLength={15}
                  $hasError={restaurantPhoneError}
                />
              </InputGroup>
              <ErrorMessage $isAppearing={restaurantPhoneError}>
                {restaurantPhoneErrorReason || "Número de telefone inválido"}
              </ErrorMessage>

              <InputGroup
                onClick={() => {
                  setIsAddressModalOpen(true);
                }}
              >
                <FloatingLabel
                  $isFocused={focusedField === "address"}
                  $isFloating={
                    addressPreview.length > 0 || focusedField === "address"
                  }
                  $hasError={restaurantAddressError}
                >
                  {addressPreview.length > 0
                    ? "Endereço do Estabelecimento"
                    : "Clique para configurar o endereço"}
                </FloatingLabel>
                <LoginInput
                  readOnly
                  value={addressPreview}
                  $hasError={restaurantAddressError}
                  style={{ cursor: "pointer" }}
                  $isDotted={true}
                />
              </InputGroup>
              <ErrorMessage $isAppearing={restaurantAddressError}>
                Endereço inválido
              </ErrorMessage>
            </>
          )}
        </LoginFields>

        <LoginButton onClick={handleNextStep} disabled={isLoading}>
          {step === 1 || step === 2 ? (
            "Próximo passo"
          ) : isLoading ? (
            <Spinner />
          ) : (
            "Finalizar Cadastro"
          )}
        </LoginButton>

        <LoginThemeToggleContainer>
          <Moon size={20} />
          <ThemeSwitch />
        </LoginThemeToggleContainer>

        {step === 1 && (
          <>
            <RegisterText>Já possui uma conta?</RegisterText>
            <ForgotPasswordLink $register={true} to="/login">
              Fazer login
            </ForgotPasswordLink>
          </>
        )}
      </LoginCard>

      <AnimatePresence>
        {isAddressModalOpen && (
          <AddressModal
            initialData={restaurantAddress}
            onClose={() => setIsAddressModalOpen(false)}
            onSave={handleSaveAddress}
          />
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
              if (modalConfig.type === "success") {
                navigate("/");
              }
            }}
          />
        )}
      </AnimatePresence>
    </LoginContainer>
  );
}
