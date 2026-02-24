import { NavLink } from "react-router-dom";
import styled, { keyframes } from "styled-components";

export const DashboardContainer = styled.div`
  padding: 100px 150px;
  overflow-x: hidden;

  @media (max-width: 1300px) {
    padding: 30px 55px;
  }

  @media (max-width: 556px) {
    padding: 30px 15px;
  }

  @media (max-width: 476px) {
    padding: 30px 0px;
  }
`;

export const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 25px;
  padding: 30px;

  @media (max-width: 1060px) {
    grid-template-columns: 1fr;
    gap: 50px;
  }

  @media (max-width: 556px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  @media (max-width: 476px) {
    padding: 0;
  }
`;

export const TitleContainer = styled.div`
  cursor: default;
  display: flex;
  flex-flow: row nowrap;
  gap: 28px;
  align-items: center;
  padding: 30px;

  @media (max-width: 410px) {
    padding: 0 15px;
    padding-bottom: 35px;
  }
`;

export const TitleImage = styled.img`
  width: 100px;
  height: auto;
  min-height: 100px;
  border-radius: 100%;
  object-fit: cover;
  border: solid 2px ${(props) => props.theme.primary};

  @media (max-width: 556px) {
    width: 80px;
    min-height: 80px;
  }

  @media (max-width: 476px) {
    width: 70px;
    min-height: 70px;
  }

  @media (max-width: 410px) {
    width: 60px;
    min-height: 60px;
  }
`;

export const TitleText = styled.span`
  color: ${(props) => props.theme.background};
  font-weight: 700;
  font-size: 4rem;
  font-family:
    "Poppins",
    "Montserrat",
    system-ui,
    -apple-system,
    sans-serif;
  -webkit-text-stroke: 2px ${(props) => props.theme.primary};
  text-overflow: ellipsis;

  @media (max-width: 830px) {
    font-size: 3rem;
  }

  @media (max-width: 556px) {
    font-size: 2.5rem;
  }

  @media (max-width: 476px) {
    font-size: 2.25rem;
  }

  @media (max-width: 410px) {
    font-size: 2rem;
  }
`;

export const Card = styled(NavLink)`
  cursor: pointer;
  display: flex;
  flex-flow: column wrap;
  gap: 16px;
  padding: 24px;
  border-radius: 12px;
  border: 1px solid ${(props) => props.theme.sidebarEdge};
  background-color: ${(props) => props.theme.sidebarBackground};
  color: ${(props) => props.theme.text};
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease-in-out;

  span {
    justify-content: center;
  }

  &:hover {
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
    transform: scale(1.05);
  }

  &.dotted {
    border: 2px dashed ${(props) => props.theme.primary};
    background-color: ${(props) => props.theme.primary}10;
    align-content: center;

    svg {
      stroke-width: 3px;
    }
  }

  &:last-child:nth-child(odd) {
    grid-column: 1 / -1;
  }
`;

export const CardHeader = styled.span`
  display: flex;
  flex-flow: row nowrap;
  gap: 8px;
  color: ${(props) => props.theme.text};
  font-weight: 700;
  font-size: 1.2rem;
  align-items: center;

  svg {
    stroke-width: 2px;
  }
`;

export const Number = styled.span`
  color: ${(props) => props.theme.primary};
  font-weight: 700;
`;

export const BoldSpan = styled.span`
  font-weight: 700;
`;

export const ProgressTrack = styled.div`
  width: 100%;
  height: 12px;
  background-color: ${(props) => props.theme.background};
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid ${(props) => props.theme.sidebarEdge};
  margin: 10px 0;
`;

export const ProgressBar = styled.div<{ $percent: number }>`
  height: 100%;
  width: ${(props) => props.$percent}%;
  background-color: ${(props) => props.theme.primary};
  border-radius: 10px;
  transition: all 0.5 ease-in-out;
  box-shadow: 0 0 15px 3px ${(props) => props.theme.primary};
`;

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  } 100% {
    background-position: 200% 0;
  }
`;

export const SkeletonBase = styled.div`
  background: linear-gradient(
    90deg,
    ${(props) => props.theme.sidebarBackground} 25%,
    ${(props) => props.theme.sidebarEdge} 50%,
    ${(props) => props.theme.sidebarBackground} 75%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite linear;
  border-radius: 8px;
`;

export const SkeletonCard = styled(SkeletonBase)`
  width: 100%;
  height: 140px;
  margin-bottom: 16px;
`;

// TEXT

export const SkeletonTitleText = styled(SkeletonBase)`
  width: 500px;
  height: 95px;

  @media (max-width: 830px) {
    width: 240px;
    height: 65px;
  }

  @media (max-width: 556px) {
    width: 200px;
    height: 55px;
  }

  @media (max-width: 476px) {
    width: 180px;
    height: 50px;
  }

  @media (max-width: 410px) {
    width: 160px;
    height: 45px;
  }
`;

export const SkeletonUserCardName = styled(SkeletonBase)`
  width: 120px;
  height: 18px;
  border-radius: 4px;

  @media (max-width: 768px) {
    display: none;
  }
`;

// AVATAR

export const SkeletonAvatar = styled(SkeletonBase)`
  border-radius: 50%;
`;

export const SkeletonSidebarAvatar = styled(SkeletonAvatar)`
  width: 45px;
  min-height: 45px;
  height: auto;

  @media (max-width: 768px) {
    width: 40px;
    min-height: 40px;
  }
`;

export const SkeletonTitleAvatar = styled(SkeletonAvatar)`
  width: 100px;
  min-height: 100px;
  height: auto;

  @media (max-width: 556px) {
    width: 80px;
    min-height: 80px;
  }

  @media (max-width: 476px) {
    width: 70px;
    min-height: 70px;
  }

  @media (max-width: 410px) {
    width: 60px;
    min-height: 60px;
  }
`;
