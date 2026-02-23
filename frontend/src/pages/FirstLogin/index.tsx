import { ThemeSwitch } from "@/components/ThemeSwitch";
import {
  ErrorMessage,
  FloatingLabel,
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
} from "../Login/styled";
import { Spinner } from "@/components/Spinner";
import Logo from "@/assets/logo.png";
import { Check, Moon, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import api from "@/services/api";
import { StatusModal } from "@/components/StatusModal";
import { AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { PasswordRequirement } from "./styled";

export function FirstLogin() {
  const location = useLocation();

  useEffect(() => {
    document.title = "Tab • Primeiro Acesso";

    if (location.state?.showNoUserLoggedAlert) {
      setModalConfig({
        isOpen: true,
        type: "warning",
        title: "",
        message: ".",
      });

      window.history.replaceState({}, document.title);
    }

    if (location.state?.showFirstLoginAlert) {
      setModalConfig({
        isOpen: true,
        type: "warning",
        title: "Primeiro Acesso",
        message:
          "Por segurança, você precisa definir uma nova senha antes de continuar.",
      });

      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] =
    useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    type: "success" | "error" | "warning";
    title: string;
    message: string;
  } | null>(null);

  const navigate = useNavigate();

  const handleUpdatePin = async () => {
    if (!isButtonDisabled) {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("@TAB:token");

        await api.patch(
          "/worker/update-pin",
          { pin: password },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const storageUser = localStorage.getItem("@TAB:user");

        if (storageUser) {
          const userParsed = JSON.parse(storageUser);

          const updatedUser = {
            ...userParsed,
            isFirstLogin: false,
          };

          localStorage.setItem("@TAB:user", JSON.stringify(updatedUser));
        }

        setModalConfig({
          isOpen: true,
          type: "success",
          title: "Senha atualizada!",
          message: "Agora você pode usar a aplicação livremente.",
        });
      } catch (error) {
        console.error(error);
        setModalConfig({
          isOpen: true,
          type: "error",
          title: "Ops!",
          message: "Erro inesperado ao atualizar sua senha. Tente novamente.",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleUpdatePin();
    }
  };

  const hasMinChars = password.length >= 6;
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  const isButtonDisabled = !hasMinChars || !passwordsMatch || isLoading;

  return (
    <LoginContainer>
      <LoginCard>
        <LoginLogoContainer src={Logo} />
        <LoginHeader>Primeiro Acesso</LoginHeader>
        <LoginDescription>
          Atualize sua senha para começar a utilizar o TAB
        </LoginDescription>
        <LoginFields>
          <InputGroup>
            <FloatingLabel
              $isFloating={isPasswordFocused || password.length > 0}
              $hasError={false}
              $isFocused={isPasswordFocused}
            >
              Nova Senha
            </FloatingLabel>

            <LoginInput
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={() => setIsPasswordFocused(false)}
              onKeyDown={handleKeyDown}
              $hasError={false}
            />
          </InputGroup>

          <PasswordRequirement $isCorrect={hasMinChars}>
            {hasMinChars ? <Check size={16} /> : <X size={16} />}
            Mínimo de 6 caracteres
          </PasswordRequirement>

          <InputGroup>
            <FloatingLabel
              $isFloating={
                isConfirmPasswordFocused || confirmPassword.length > 0
              }
              $hasError={false}
              $isFocused={isConfirmPasswordFocused}
            >
              Confirmar Senha
            </FloatingLabel>

            <LoginInput
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
              onFocus={() => setIsConfirmPasswordFocused(true)}
              onBlur={() => setIsConfirmPasswordFocused(false)}
              onKeyDown={handleKeyDown}
              $hasError={false}
            />
          </InputGroup>
          <ErrorMessage $isAppearing={!passwordsMatch}>
            As senhas não coincidem
          </ErrorMessage>
        </LoginFields>
        <LoginButton onClick={handleUpdatePin} disabled={isButtonDisabled}>
          {isLoading ? <Spinner /> : "Atualizar"}
        </LoginButton>
        <LoginThemeToggleContainer>
          <Moon size={20} />
          <ThemeSwitch />
        </LoginThemeToggleContainer>
      </LoginCard>

      <AnimatePresence>
        {modalConfig?.isOpen && (
          <StatusModal
            type={modalConfig.type}
            title={modalConfig.title}
            message={modalConfig.message}
            onClose={() => {
              setModalConfig(null);

              setTimeout(() => {
                if (modalConfig.type === "success") {
                  navigate("/");
                }
              }, 300);
            }}
          />
        )}
      </AnimatePresence>
    </LoginContainer>
  );
}
