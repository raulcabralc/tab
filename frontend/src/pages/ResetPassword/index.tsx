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
import { ArrowLeft, AsteriskSquare, Check, Mail, Moon, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Stepper } from "@/components/Stepper";
import api from "@/services/api";
import { ReturnArrow } from "@/pages/Setup/styled";
import { StatusModal } from "@/components/StatusModal";
import { Spinner } from "@/components/Spinner";
import { motion } from "framer-motion";
import { OtpContainer, OtpInput } from "./styled";
import { PasswordRequirement } from "../FirstLogin/styled";

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

export function ResetPassword() {
  const [step, setStep] = useState(1);
  const [code, setCode] = useState<string[]>(new Array(6).fill(""));

  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const codeComplete =
    step === 2 && code.every((num) => num !== "" && !isNaN(Number(num)));

  useEffect(() => {
    document.title = "Tab • Redefinir senha";

    if (step === 2 && codeComplete) {
      handleNextStep();
    }

    let interval: any;

    if (step === 2 && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }

    return () => clearInterval(interval);
  }, [codeComplete, step, timer]);

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [emailError, setEmailError] = useState(false);
  const [newPasswordError, setNewPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);

  const [numbersError, setNumbersError] = useState(false);

  const [focusedField, setFocusedField] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    type: "success" | "error" | "warning";
    title: string;
    message: string;
    isFirstLogin: boolean;
  } | null>(null);

  const [direction, setDirection] = useState(0);

  const [buttonDisabled, setButtonDisabled] = useState(false);

  const [user, setUser] = useState<any>({});

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const navigate = useNavigate();

  const handleCodeChange = (value: string, index: number) => {
    if (isNaN(Number(value))) return;

    setNumbersError(false);

    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleNextStep = async () => {
    if (step === 1) {
      const isEmailValid = validateEmail(email);
      setEmailError(!isEmailValid);

      if (isEmailValid) {
        const userData = await createCode(); // Recebe os dados diretamente aqui

        if (userData) {
          setUser(userData); // Atualiza o estado para os próximos passos
          setDirection(1);
          setStep(2); // Avança para as "casinhas" do código
        }
      }
    } else if (step === 2) {
      let validCode = true;

      const userCode = user.resetPasswordCode;
      const userExpires = new Date(user.resetPasswordExpires);

      const now = new Date();

      if (now > userExpires) {
        validCode = false;

        setModalConfig({
          isOpen: true,
          type: "error",
          title: "Código expirado!",
          message: "O código expirou, tente novamente.",
          isFirstLogin: true,
        });

        setCode(new Array(6).fill(""));

        setDirection(-1);
        setStep(step - 1);
      } else if (code.join("") !== userCode) {
        validCode = false;

        setModalConfig({
          isOpen: true,
          type: "error",
          title: "Código incorreto",
          message:
            "Os números digitados não coincidem. Verifique o e-mail e tente novamente.",
          isFirstLogin: true,
        });

        setCode(new Array(6).fill(""));

        setNumbersError(true);
      }

      const isStep2Valid = validCode;

      if (isStep2Valid) {
        setDirection(1);
        setStep(3);
      }
    } else if (step === 3) {
      const isNewPasswordValid = newPassword.length >= 6;
      const isConfirmPasswordValid = confirmPassword === newPassword;

      setNewPasswordError(!isNewPasswordValid);
      setConfirmPasswordError(!isConfirmPasswordValid);

      const isStep3Valid = isNewPasswordValid && isConfirmPasswordValid;

      if (isStep3Valid) {
        await resetPassword();
      }
    }
  };

  const createCode = async () => {
    setIsLoading(true);
    try {
      setButtonDisabled(true);

      // Chamada para o seu backend NestJS
      const response = await api.post("/auth/forgot-password", { email });

      // Se o backend retornou sucesso
      if (response.data && response.data.resetPasswordCode) {
        setModalConfig({
          isOpen: true,
          type: "warning",
          title: "Código enviado!",
          message:
            "Verifique sua caixa de entrada. O código é válido por 15 minutos.",
          isFirstLogin: true,
        });

        return response.data; // Retornamos os dados para uso imediato
      }

      // Tratamento de erro caso o sucesso seja falso (ex: e-mail não encontrado)
      if (response.data.success === false) {
        const errorMessage =
          response.data.message === `User with email ${email} not found.`
            ? "Não encontramos nenhuma conta vinculada a este e-mail no sistema do TAB."
            : "Erro ao gerar código. Tente novamente.";

        setModalConfig({
          isOpen: true,
          type: "error",
          title: "Ops!",
          message: errorMessage,
          isFirstLogin: false,
        });
        return null;
      }
    } catch (e: any) {
      setModalConfig({
        isOpen: true,
        type: "error",
        title: "Ops!",
        message:
          "Ocorreu um erro inesperado. Verifique sua conexão e tente novamente.",
        isFirstLogin: false,
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async () => {
    setIsLoading(true);
    try {
      await api.post("/auth/reset-password", {
        code: code.join(""),
        pin: newPassword,
      });

      const response = await api.post("/auth/login", {
        email,
        pass: newPassword,
      });

      const { access_token } = response.data;

      localStorage.setItem("@TAB:token", access_token);
      localStorage.setItem("@TAB:user", JSON.stringify(response.data));

      setModalConfig({
        isOpen: true,
        type: "success",
        title: "Sucesso!",
        message: "Sua senha foi atualizada com sucesso.",
        isFirstLogin: true,
      });
    } catch (e) {
      setModalConfig({
        isOpen: true,
        type: "error",
        title: "Ops!",
        message: "Aconteceu um erro inesperado, tente novamente.",
        isFirstLogin: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasteData = e.clipboardData.getData("text").slice(0, 6).split("");

    if (pasteData.every((char) => !isNaN(Number(char)))) {
      const newCode = [...code];

      pasteData.forEach((char, index) => {
        newCode[index] = char;

        if (inputRefs.current[index]) inputRefs.current[index].value = char;
      });

      setCode(newCode);
      inputRefs.current[Math.min(pasteData.length, 5)]?.focus();
    }
  };

  const returnStep = () => {
    setDirection(-1);

    setCode(new Array(6).fill(""));

    setStep(step - 1);
  };

  const handleResendCode = async () => {
    if (!canResend) return;

    setCanResend(false);
    setTimer(60);
    await createCode();
  };

  const hasMinChars = newPassword.length >= 6;
  const passwordsMatch =
    newPassword.length > 0 && newPassword === confirmPassword;

  return (
    <LoginContainer>
      <LoginCard>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            className="motion-div forgot"
            key={step}
            custom={direction}
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
            {step > 1 && (
              <AnimatePresence>
                <ReturnArrow
                  onClick={returnStep}
                  initial={{ opacity: 0, scale: 0.8, x: -10 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.8, x: -10 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                  <ArrowLeft size={32} />
                </ReturnArrow>
              </AnimatePresence>
            )}
            <LoginLogoContainer src={Logo} />

            <Stepper
              step={step}
              firstStep={<Mail size={20} />}
              secondStep={<AsteriskSquare size={20} />}
              thirdStep={<Check size={20} />}
            />

            <LoginHeader>
              {step === 1
                ? "Esqueci minha senha"
                : step === 2
                  ? "Confirmar código"
                  : "Redefinir senha"}
            </LoginHeader>

            <LoginDescription>
              {step === 1
                ? "Informe seu e-mail abaixo. Enviaremos um código de 6 dígitos para recuperar seu acesso."
                : step === 2
                  ? `Enviamos um código para o email ${email}. Não esqueça de conferir a pasta de spam.`
                  : "Tudo pronto! Escolha uma senha forte para proteger seu acesso."}
            </LoginDescription>

            <LoginFields>
              {step === 1 ? (
                <>
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
                    "E-mail inválido"
                  </ErrorMessage>
                </>
              ) : step === 2 ? (
                <>
                  <OtpContainer onPaste={handlePaste}>
                    {code.map((digit, index) => (
                      <OtpInput
                        key={index}
                        ref={(el) => {
                          inputRefs.current[index] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) =>
                          handleCodeChange(e.target.value, index)
                        }
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        $hasError={numbersError}
                        autoFocus={index === 0}
                      />
                    ))}
                  </OtpContainer>

                  <RegisterText style={{ marginTop: "20px" }}>
                    Não recebeu o código?{" "}
                    {canResend ? (
                      <ForgotPasswordLink
                        style={{
                          cursor: "pointer",
                          display: "inline",
                          opacity: 1,
                        }}
                        onClick={handleResendCode}
                        to="#"
                      >
                        Reenviar e-mail
                      </ForgotPasswordLink>
                    ) : (
                      <span style={{ opacity: 0.5 }}>Reenviar em {timer}s</span>
                    )}
                  </RegisterText>
                </>
              ) : (
                <>
                  <InputGroup>
                    <FloatingLabel
                      $isFloating={
                        focusedField === "newPassword" || newPassword.length > 0
                      }
                      $hasError={newPasswordError}
                      $isFocused={focusedField === "newPassword"}
                    >
                      Nova Senha
                    </FloatingLabel>

                    <LoginInput
                      type="password"
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                      }}
                      onFocus={() => setFocusedField("newPassword")}
                      onBlur={() => setFocusedField(null)}
                      $hasError={newPasswordError}
                    />
                  </InputGroup>

                  <PasswordRequirement $isCorrect={hasMinChars}>
                    {hasMinChars ? <Check size={16} /> : <X size={16} />}
                    Mínimo de 6 caracteres
                  </PasswordRequirement>

                  <InputGroup>
                    <FloatingLabel
                      $isFloating={
                        focusedField === "confirmPassword" ||
                        confirmPassword.length > 0
                      }
                      $hasError={confirmPasswordError}
                      $isFocused={focusedField === "confirmPassword"}
                    >
                      Confirmar Senha
                    </FloatingLabel>

                    <LoginInput
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                      }}
                      onFocus={() => setFocusedField("confirmPassword")}
                      onBlur={() => setFocusedField(null)}
                      $hasError={confirmPasswordError}
                    />
                  </InputGroup>
                  <ErrorMessage
                    $isAppearing={!passwordsMatch && newPassword.length >= 6}
                  >
                    As senhas não coincidem
                  </ErrorMessage>
                </>
              )}
            </LoginFields>

            <LoginButton
              onClick={handleNextStep}
              disabled={
                isLoading ||
                (step === 1 && !email) ||
                emailError ||
                (step === 2 && (buttonDisabled || !codeComplete))
              }
            >
              {isLoading ? (
                <Spinner />
              ) : step === 1 ? (
                "Enviar código de acesso"
              ) : step === 2 ? (
                "Verificar código"
              ) : (
                "Salvar e Entrar no TAB"
              )}
            </LoginButton>

            <LoginThemeToggleContainer>
              <Moon size={20} />
              <ThemeSwitch />
            </LoginThemeToggleContainer>

            {step === 1 && (
              <>
                <RegisterText>Voltar para a página de Login?</RegisterText>
                <ForgotPasswordLink $register={true} to="/login">
                  Ir para Login
                </ForgotPasswordLink>
              </>
            )}
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
                if (modalConfig.type === "success") {
                  navigate("/");
                } else {
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
