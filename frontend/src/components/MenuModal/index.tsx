import { X, Plus, BookOpen, Camera } from "lucide-react";
import { ModalContainer, ModalHeader, ModalOverlay } from "../Sidebar/styled";
import { LoginInput, LoginButton } from "@/pages/Login/styled";
import { useEffect, useState } from "react";
import { modalVariants, overlayVariants } from "../UserModal";
import { Spinner } from "../Spinner";
import {
  TagContainer,
  Tag,
  ModalDescription,
  ModalContent,
  TextAndButton,
  NoMenus,
  CategoriesSection,
  SectionTitle,
  ItemsSection,
  ItemsCategoriesGrid,
  ItemsCategory,
  ItemsCategoryTitle,
  ItemsCategoriesHeader,
  MenuItems,
  Item,
  ItemCategory,
  AddItemButton,
  ImageUploadContainer,
  HiddenInput,
} from "./styled";
import { HoursMain, XButton } from "../HoursModal/styled";
import { AnimatePresence } from "framer-motion";
import { MenuItem } from "@/pages/Restaurant";
import { LoginTextArea } from "@/pages/Setup/styled";
import axios from "axios";

interface MenuModalProps {
  onClose: () => void;
  onSave: (menuItems: MenuItem[], menuCategories: string[]) => Promise<void>;
  initialData: { menuItems: MenuItem[]; menuCategories: string[] };
}

const tagVariants = {
  initial: {
    opacity: 0,
    scale: 0.8,
    y: 10,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 500,
      damping: 30,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: -10,
    transition: {
      duration: 0.2,
    },
  },
};

function MenuModal({ onClose, onSave, initialData }: MenuModalProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(
    initialData.menuItems || [],
  );
  const [categories, setCategories] = useState<string[]>(
    initialData.menuCategories || [],
  );

  useEffect(() => {
    if (initialData.menuItems) setMenuItems(initialData.menuItems);
    if (initialData.menuCategories) setCategories(initialData.menuCategories);
  }, [initialData]);

  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAddCategory = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !categories.includes(trimmed)) {
      setCategories([...categories, trimmed]);
      setInputValue("");
    }
  };

  const handleRemoveCategory = (index: number) => {
    const categoryToRemove = categories[index];

    setCategories(categories.filter((_, i) => i !== index));
    setMenuItems(
      menuItems.filter((item) => item.category !== categoryToRemove),
    );
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      if (
        menuItems !== initialData.menuItems ||
        categories !== initialData.menuCategories
      ) {
        await onSave(menuItems, categories);
        // TIRAR O "R$" DO PRICE DOS ITENS
      }
    } catch (e) {
      console.error(e);
    } finally {
      onClose();
      setIsLoading(false);
    }
  };

  const handleAddItem = (category: string) => {
    const newItem: MenuItem = {
      name: "",
      description: "",
      category,
      price: null as any,
    };

    setMenuItems([...menuItems, newItem]);
  };

  const handleRemoveItem = (index: number) => {
    setMenuItems(menuItems.filter((_, i) => i !== index));
  };

  const handleUpdateItem = (
    index: number,
    field: keyof MenuItem,
    value: any,
  ) => {
    const updatedItems = [...menuItems];

    updatedItems[index] = { ...updatedItems[index], [field]: value };

    setMenuItems(updatedItems);
  };

  const handleImageChange = (index: number, file: File | null) => {
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);

    const updatedItems = [...menuItems];

    updatedItems[index] = {
      ...updatedItems[index],
      image: previewUrl,
      // file,
    };

    setMenuItems(updatedItems);
  };

  // const uploadToCloudinary = async (file: File): Promise<string> => {
  //   const formData = new FormData();
  //   formData.append("file", file);
  //   formData.append(
  //     "upload_preset",
  //     import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
  //   );

  //   try {
  //     setIsLoading(true);
  //     const response = await axios.post(
  //       `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
  //       formData,
  //     );

  //     return response.data.secure_url as string;
  //   } catch (e) {}
  // };

  const maskNumber = (value: string) => {
    return `R$ ${value.replace(/[^0-9.,]/g, "").replace(/,/g, ".")}`;
  };

  return (
    <ModalOverlay
      onClick={onClose}
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      style={{ overflowY: "auto" }}
    >
      <ModalContainer
        onClick={(e) => e.stopPropagation()}
        variants={modalVariants}
      >
        <ModalHeader>
          <XButton onClick={onClose}>
            <X size={30} />
          </XButton>
        </ModalHeader>

        <ModalContent>
          <HoursMain>
            <BookOpen size={32} />
            <h1>Cardápio</h1>
          </HoursMain>

          <SectionTitle>Categorias</SectionTitle>
          <CategoriesSection>
            <ModalDescription>
              Crie as categorias nas quais os itens serão adicionados.
            </ModalDescription>

            <TextAndButton>
              <LoginInput
                placeholder="Digite a categoria"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
              />
              <LoginButton
                onClick={handleAddCategory}
                style={{ width: "60px", alignItems: "center" }}
              >
                <Plus size={25} />
              </LoginButton>
            </TextAndButton>

            <TagContainer>
              <AnimatePresence mode="popLayout">
                {categories.length > 0 ? (
                  categories.map((c, index) => (
                    <Tag
                      key={c}
                      variants={tagVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      layout
                      transition={{
                        layout: { type: "spring", stiffness: 400, damping: 35 },
                        scale: { duration: 0.2 },
                        opacity: { duration: 0.2 },
                      }}
                      whileHover={{ scale: 1.05, rotate: -2 }}
                      onClick={() => handleRemoveCategory(index)}
                    >
                      {c}
                      <X size={14} />
                    </Tag>
                  ))
                ) : (
                  <NoMenus>Nenhuma categoria registrada</NoMenus>
                )}
              </AnimatePresence>
            </TagContainer>
          </CategoriesSection>

          <SectionTitle>Itens</SectionTitle>
          <ItemsSection>
            <ModalDescription>
              Adicione os itens do cardápio e atribua-os a uma categoria.
            </ModalDescription>

            <ItemsCategoriesGrid>
              {categories.length > 0 ? (
                categories.map((c) => (
                  <ItemCategory key={c} style={{ marginBottom: "20px" }}>
                    <ItemsCategoriesHeader>
                      <ItemsCategory>
                        <ItemsCategoryTitle>{c}</ItemsCategoryTitle>
                      </ItemsCategory>
                      <AddItemButton onClick={() => handleAddItem(c)}>
                        <Plus size={18} />
                      </AddItemButton>
                    </ItemsCategoriesHeader>

                    <MenuItems>
                      {menuItems
                        .map((item, index) => ({ item, index }))
                        .filter(({ item }) => item.category === c)
                        .map(({ item, index }) => (
                          <Item key={index}>
                            <LoginInput
                              placeholder="Nome do prato"
                              value={item.name}
                              onChange={(e) =>
                                handleUpdateItem(index, "name", e.target.value)
                              }
                            />

                            <LoginInput
                              placeholder="Preço (R$ 15.99)"
                              type="text"
                              value={item.price}
                              onChange={(e) =>
                                handleUpdateItem(
                                  index,
                                  "price",
                                  maskNumber(e.target.value),
                                )
                              }
                            />

                            <LoginTextArea
                              placeholder="Descrição do prato"
                              value={item.description}
                              onChange={(e) =>
                                handleUpdateItem(
                                  index,
                                  "description",
                                  e.target.value,
                                )
                              }
                            />

                            <ImageUploadContainer
                              onClick={() =>
                                document
                                  .getElementById(`file-${index}`)
                                  ?.click()
                              }
                            >
                              {item.image ? (
                                <img src={item.image} alt="Preview" />
                              ) : (
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    opacity: 0.5,
                                  }}
                                >
                                  <Camera size={24} />
                                  <span
                                    style={{
                                      fontSize: "12px",
                                      marginTop: "5px",
                                    }}
                                  >
                                    Adicionar Foto
                                  </span>
                                </div>
                              )}
                              <HiddenInput
                                id={`file-${index}`}
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                  handleImageChange(
                                    index,
                                    e.target.files?.[0] || null,
                                  )
                                }
                              />
                            </ImageUploadContainer>

                            <XButton
                              onClick={() => handleRemoveItem(index)}
                              style={{
                                padding: 0,
                                position: "absolute",
                                right: 3,
                                top: 3,
                              }}
                            >
                              <X size={18} />
                            </XButton>
                          </Item>
                        ))}
                    </MenuItems>
                  </ItemCategory>
                ))
              ) : (
                <NoMenus>As categorias vão aparecer aqui</NoMenus>
              )}
            </ItemsCategoriesGrid>
          </ItemsSection>

          <LoginButton onClick={handleSave} disabled={isLoading}>
            {isLoading ? <Spinner /> : "Salvar"}
          </LoginButton>
        </ModalContent>
      </ModalContainer>
    </ModalOverlay>
  );
}

export default MenuModal;
