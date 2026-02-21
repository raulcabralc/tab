import styled from "styled-components";

export const UploadContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const ImageCircle = styled.div<{ $preview?: string | null }>`
  width: 125px;
  height: 125px;
  border-radius: 50%;
  border: 2px dashed ${(props) => props.theme.sidebarEdge};
  background-image: url(${(props) => props.$preview});
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
  overflow: hidden;

  &:hover {
    border-color: ${(props) => props.theme.primary};
    background-color: rgba(0, 0, 0, 0.05);
  }

  &::after {
    content: "Trocar Foto";
    position: absolute;
    bottom: 0;
    width: 100%;
    background: rgba(0, 0, 0, 0.6);
    color: white;
    font-size: 0.7rem;
    padding: 10px 0;
    text-align: center;
    font-weight: 700;
    height: 20px;
    opacity: 0;
    transition: opacity 0.3s;
  }

  &:hover::after {
    opacity: 1;
  }
`;

export const ImagePreview = styled.div<{ $url?: string | null }>`
  width: 110px;
  height: 110px;
  border-radius: 50%;
  background-color: ${(props) => props.theme.background};
  background-image: ${(props) => (props.$url ? `url(${props.$url})` : "none")};
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: all 0.3s ease;
`;

export const HiddenInput = styled.input`
  display: none;
`;
