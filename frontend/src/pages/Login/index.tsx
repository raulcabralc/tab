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
} from "./styled";
import { Spinner } from "@/components/Spinner";
import Logo from "@/assets/logo.png";
import { ArrowUpRight, Moon } from "lucide-react";
import React, { useEffect, useState } from "react";
import api from "@/services/api";
import { StatusModal } from "@/components/StatusModal";
import { AnimatePresence } from "framer-motion";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    zIndex: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 100 : -100,
    opacity: 0,
    zIndex: 0,
  }),
};

export function Login() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    document.title = "Tab • Login";

    if (location.state?.showNoUserLoggedAlert) {
      setModalConfig({
        isOpen: true,
        type: "warning",
        title: "Login necessário",
        message: "É preciso fazer login para usar o TAB.",
      });

      window.history.replaceState({}, document.title);
    }

    if (location.state?.showUnexpectedLoginAlert) {
      setModalConfig({
        isOpen: true,
        type: "error",
        title: "Ops!",
        message: "Aconteceu um erro inesperado.",
      });

      window.history.replaceState({}, document.title);
    }

    if (searchParams.get("loggedOut") === "true") {
      setModalConfig({
        isOpen: true,
        type: "success",
        title: "Sucesso!",
        message: "Usuário deslogado com sucesso.",
      });

      window.history.replaceState({}, document.title);
    }

    if (searchParams.get("sessionExpired") === "true") {
      setModalConfig({
        isOpen: true,
        type: "warning",
        title: "Sessão Expirada",
        message: "Seu acesso expirou, por favor, faça login novamente.",
      });

      window.history.replaceState({}, document.title);
    }
  }, [searchParams, setSearchParams]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    type: "success" | "error" | "warning";
    title: string;
    message: string;
    isFirstLogin?: boolean;
  } | null>(null);

  const [buttonDisabled, setButtonDisabled] = useState(false);

  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleLogin = async () => {
    const isEmailValid = validateEmail(email);
    const isPasswordValid = password.length >= 6;

    setEmailError(!isEmailValid);
    setPasswordError(!isPasswordValid);

    if (isEmailValid && isPasswordValid) {
      setIsLoading(true);
      try {
        setButtonDisabled(true);

        const response = await api.post("/auth/login", {
          email,
          pass: password,
        });

        const { access_token, isFirstLogin } = response.data;

        localStorage.setItem("@TAB:token", access_token);
        localStorage.setItem("@TAB:user", JSON.stringify(response.data));

        setModalConfig({
          isOpen: true,
          type: "success",
          title: "Bem-vindo ao TAB!",
          message: "Seu login foi efetuado com sucesso.",
          isFirstLogin,
        });
      } catch (error) {
        setModalConfig({
          isOpen: true,
          type: "error",
          title: "Ops!",
          message: "Credenciais inválidas inseridas.",
          isFirstLogin: false,
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!buttonDisabled && e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <AnimatePresence mode="wait" custom={1}>
          <motion.div
            className="motion-div login"
            key={1}
            custom={1}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 500, damping: 40 },
              opacity: { duration: 0.2 },
            }}
            style={{ width: "100%" }}
          >
            <LoginLogoContainer src={Logo} />
            <LoginHeader>Login</LoginHeader>
            <LoginDescription>
              Entre no sistema com seu email e senha
            </LoginDescription>
            <LoginFields>
              <InputGroup>
                <FloatingLabel
                  $isFloating={isEmailFocused || email.length > 0}
                  $hasError={emailError}
                  $isFocused={isEmailFocused}
                >
                  E-mail
                </FloatingLabel>

                <LoginInput
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError(false);
                  }}
                  onFocus={() => setIsEmailFocused(true)}
                  onBlur={() => setIsEmailFocused(false)}
                  onKeyDown={handleKeyDown}
                  $hasError={emailError}
                />
              </InputGroup>
              <ErrorMessage $isAppearing={emailError}>
                E-mail inválido
              </ErrorMessage>

              <InputGroup>
                <FloatingLabel
                  $isFloating={isPasswordFocused || password.length > 0}
                  $hasError={passwordError}
                  $isFocused={isPasswordFocused}
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
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                  onKeyDown={handleKeyDown}
                  $hasError={passwordError}
                />
              </InputGroup>
              <ErrorMessage $isAppearing={passwordError}>
                Senha deve ter pelo menos 6 caracteres
              </ErrorMessage>

              <ForgotPasswordLink to="/reset-password">
                Esqueci minha senha <ArrowUpRight size={15} />
              </ForgotPasswordLink>
            </LoginFields>
            <LoginButton
              onClick={handleLogin}
              disabled={isLoading || buttonDisabled}
            >
              {isLoading ? <Spinner /> : "Entrar"}
            </LoginButton>
            <LoginThemeToggleContainer>
              <Moon size={20} />
              <ThemeSwitch />
            </LoginThemeToggleContainer>

            <RegisterText>Deseja usar o TAB no seu restaurante?</RegisterText>
            <ForgotPasswordLink $register={true} to="/setup">
              Cadastre seu estabelecimento
            </ForgotPasswordLink>
          </motion.div>
        </AnimatePresence>
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
                if (
                  modalConfig.type === "success" &&
                  modalConfig.message !== "Usuário deslogado com sucesso."
                ) {
                  navigate("/");
                } else if (modalConfig.type === "error") {
                  setButtonDisabled(false);
                }
              }, 300);
            }}
          />
        )}
      </AnimatePresence>
    </LoginContainer>
  );
}
