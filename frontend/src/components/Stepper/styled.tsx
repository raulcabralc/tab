import styled from "styled-components";

export const StepperContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 30px;
  position: relative;
`;

export const StepLine = styled.div<{ $active: boolean }>`
  height: 2px;
  flex: 1;
  background-color: ${(props) =>
    props.$active ? props.theme.primary : props.theme.sidebarEdge};
  transition: background-color 0.3s ease;
  margin: 0 10px;
`;

export const StepCircle = styled.div<{ $active: boolean; $completed: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) =>
    props.$active || props.$completed
      ? props.theme.primary
      : props.theme.sidebarEdge};
  color: white;
  border: 2px solid
    ${(props) =>
      props.$active || props.$completed ? props.theme.primary : "transparent"};
  transition: all 0.3s ease;
  z-index: 2;

  svg {
    stroke-width: 2.5px;
    opacity: ${(props) => (props.$active || props.$completed ? 1 : 0.5)};
  }
`;
