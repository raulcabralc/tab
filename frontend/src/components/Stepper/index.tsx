import { MapPin, Store, User } from "lucide-react";
import { StepCircle, StepLine, StepperContainer } from "./styled";

export function Stepper({ step }) {
  return (
    <>
      <StepperContainer>
        <StepCircle $active={step === 1} $completed={step > 1}>
          <User size={20} />
        </StepCircle>

        <StepLine $active={step > 1} />

        <StepCircle $active={step === 2} $completed={step > 2}>
          <Store size={20} />
        </StepCircle>

        <StepLine $active={step > 2} />

        <StepCircle $active={step === 3} $completed={step === 3}>
          <MapPin size={20} />
        </StepCircle>
      </StepperContainer>
    </>
  );
}
