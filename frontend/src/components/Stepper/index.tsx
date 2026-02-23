import { StepCircle, StepLine, StepperContainer } from "./styled";

export function Stepper({ step, firstStep, secondStep, thirdStep }) {
  return (
    <>
      <StepperContainer>
        <StepCircle $active={step === 1} $completed={step > 1}>
          {firstStep}
        </StepCircle>

        <StepLine $active={step > 1} />

        <StepCircle $active={step === 2} $completed={step > 2}>
          {secondStep}
        </StepCircle>

        <StepLine $active={step > 2} />

        <StepCircle $active={step === 3} $completed={step === 3}>
          {thirdStep}
        </StepCircle>
      </StepperContainer>
    </>
  );
}
