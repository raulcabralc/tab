import { Switch } from "@/components/Sidebar/styled";
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
} from "./styled";
import { Spinner } from "@/components/Spinner";
import { useTheme } from "@/contexts/ThemeContext";
import Logo from "@/assets/logo.png";
import { ArrowUpRight, Moon } from "lucide-react";
import React, { useState } from "react";
import api from "@/services/api";
import { StatusModal } from "@/components/StatusModal";
import { AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

export function Login() {
  const { theme, toggleTheme } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    type: "success" | "error";
    title: string;
    message: string;
    isFirstLogin: boolean;
  } | null>(null);

  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleLogin = async () => {
    const isEmailValid = validateEmail(email);
    const isPasswordValid = password.length >= 4;

    setEmailError(!isEmailValid);
    setPasswordError(!isPasswordValid);

    if (isEmailValid && isPasswordValid) {
      setIsLoading(true);
      try {
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
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
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
          <ErrorMessage $isAppearing={emailError}>E-mail inválido</ErrorMessage>

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
            Senha deve ter pelo menos 4 caracteres
          </ErrorMessage>

          <ForgotPasswordLink to="/forgot-password">
            Esqueci minha senha <ArrowUpRight size={15} />
          </ForgotPasswordLink>
        </LoginFields>

        <LoginButton onClick={handleLogin} disabled={isLoading}>
          {isLoading ? <Spinner /> : "Entrar"}
        </LoginButton>

        <LoginThemeToggleContainer>
          <Moon size={20} />
          <Switch>
            <input
              type="checkbox"
              onChange={toggleTheme}
              checked={theme === "dark"}
            />
            <span />
          </Switch>
        </LoginThemeToggleContainer>
      </LoginCard>

      <AnimatePresence>
        {modalConfig?.isOpen && (
          <StatusModal
            type={modalConfig.type}
            title={modalConfig.title}
            message={modalConfig.message}
            onClose={() => {
              const isFirst = modalConfig.isFirstLogin;
              setModalConfig(null);

              setTimeout(() => {
                if (modalConfig.type === "success") {
                  if (isFirst) {
                    navigate("/update-password");
                  } else {
                    navigate("/");
                  }
                }
              }, 300);
            }}
          />
        )}
      </AnimatePresence>
    </LoginContainer>
  );
}
