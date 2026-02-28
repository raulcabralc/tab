import styled from "styled-components";
import * as color from "../../styles/colors";
import { hexToRgb } from "@/helpers/hexToRgb";
import { SkeletonBase } from "../Dashboard/styled";

export const RestaurantContainer = styled.div`
  padding: 100px 150px;
  overflow-x: hidden;

  @media (max-width: 1300px) {
    padding: 30px 55px;
  }

  @media (max-width: 556px) {
    padding: 30px 15px;
  }

  @media (max-width: 476px) {
    padding: 30px 12px;
  }
`;

export const TitleContainer = styled.div`
  cursor: default;
  display: flex;
  flex-flow: row nowrap;
  gap: 28px;
  align-items: center;
  padding: 30px;
  margin-bottom: 50px;

  @media (max-width: 410px) {
    padding: 0 15px;
    padding-bottom: 35px;
    margin-bottom: 20px;
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
  color: ${(props) => props.theme.text};
  font-weight: 700;
  font-size: 4rem;
  font-family:
    "Poppins",
    "Montserrat",
    system-ui,
    -apple-system,
    sans-serif;
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

export const RestaurantContent = styled.div`
  display: flex;
  flex-flow: column nowrap;
`;

export const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 50px;
  padding: 20px;
  background: ${(props) => props.theme.sidebarBackground};
  border-radius: 0 0 10px 10px;
  border: 2px solid ${(props) => props.theme.primary};
  border-top: 0;
  margin-bottom: 20px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    padding-top: 20px;
    gap: 25px 50px;
  }

  @media (max-width: 478px) {
    display: flex;
    flex-flow: column wrap;
    gap: 25px 50px;
  }
`;

export const Detail = styled.div`
  display: flex;
  flex-flow: column wrap;
  gap: 10px;

  &.switch {
    gap: 5px;
    display: none;
  }

  @media (max-width: 586px) {
    &.switch {
      display: flex;
    }
  }
`;

export const DetailName = styled.span`
  cursor: default;
  display: flex;
  flex-flow: column wrap;
  font-size: 1rem;
  font-weight: 900;
  text-transform: uppercase;
  color: ${(props) => props.theme.primary};
  padding-bottom: 0px;
`;

export const DetailValue = styled.span`
  cursor: default;
  display: flex;
  flex-flow: column wrap;
  font-size: 1.1rem;
  color: ${(props) => props.theme.text};
`;

export const Category = styled.span`
  color: ${color.white.light};
  cursor: default;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  gap: 10px;
  font-size: 1.2rem;
  font-weight: 700;
  text-transform: uppercase;
  border: 2px solid ${(props) => props.theme.primary};
  padding: 10px;
  background-color: ${(props) => props.theme.primary};
  border-radius: 10px 10px 0 0;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
  z-index: 2;

  svg {
    color: ${color.white.light};
  }
`;

export const ModalButton = styled.div`
  cursor: pointer;
  width: max-content;
  padding: 10px;
  background: ${(props) => `rgba(${hexToRgb(props.theme.primary)}, 0.15)`};
  border: 2px dashed ${(props) => props.theme.primary};
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  color: ${(props) => props.theme.primary};

  @media (max-width: 410px) {
    font-size: 0.9rem;
  }
`;

export const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: 4fr 1fr;
  gap: 10px;

  .svg-wrapper {
    padding: 5px;
    background-color: ${(props) => props.theme.primary};
    width: max-content;
    border-radius: 4px;
    display: flex;
    transition: all 0.1s ease-in-out;

    svg {
      align-self: center;
      color: ${color.white.light};
    }

    &:hover {
      cursor: pointer;
      opacity: 0.8;
    }
  }
`;

export const SkeletonDescription = styled(SkeletonBase)`
  width: 280px;
  height: 26px;

  @media (max-width: 410px) {
    width: 200px;
    height: 80px;
  }
`;

export const SkeletonModalButton = styled(SkeletonBase)`
  padding: 10px;
  width: 250px;
  height: 45px;
  border-radius: 10px;

  @media (max-width: 410px) {
    width: 230px;
    height: 40px;
  }
`;
