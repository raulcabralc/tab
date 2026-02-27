import { useEffect, useState } from "react";
import {
  Category,
  CategoryGrid,
  Detail,
  DetailName,
  DetailValue,
  ModalButton,
  RestaurantContainer,
  RestaurantContent,
  TitleContainer,
  TitleImage,
  TitleText,
} from "./styled";
import api from "@/services/api";
import { SkeletonTitleAvatar, SkeletonTitleText } from "../Dashboard/styled";
import { AnimatePresence } from "framer-motion";
import { StatusModal } from "@/components/StatusModal";
import { Phone, Settings2, Store } from "lucide-react";
import HoursModal, { DayHours } from "@/components/HoursModal";
import CuisineModal from "@/components/CuisineModal";

interface RestaurantInterface {
  _id: string;
  name: string;
  image: string;
  description: string;
  address: Object;
  phone: string;
  email: string;
  totalTables: number;
  cuisines: string[];
  openingHours: DayHours[];
  menu: string[];
}

function Restaurant() {
  useEffect(() => {
    document.title = "Tab • Restaurante";

    const loadDashboardData = async () => {
      setIsLoadingData(true);
      try {
        const { restaurant } = await getData();
        setRestaurant(restaurant);
      } catch (e) {
        setModalConfig({
          isOpen: true,
          type: "error",
          title: "Ops!",
          message: "Ocorreu um erro ao carregar os dados.",
        });
      } finally {
        setIsLoadingData(false);
      }
    };

    loadDashboardData();
  }, []);

  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    type: "success" | "error" | "warning";
    title: string;
    message: string;
  } | null>(null);

  const [isHoursModalOpen, setIsHoursModalOpen] = useState(false);
  const [isCuisineModalOpen, setIsCuisineModalOpen] = useState(false);

  const [restaurant, setRestaurant] = useState<RestaurantInterface | null>(
    null,
  );
  const [isLoadingData, setIsLoadingData] = useState(true);

  const getData = async () => {
    const userData = await api.get("/auth/me");
    const user = userData.data;

    const restaurantData = await api.get(`/restaurant/${user.restaurantId}`);
    const restaurant = restaurantData.data;

    return { restaurant };
  };

  const handleSaveHours = async (updatedHours: DayHours[]) => {
    try {
      const response = await api.patch(
        `/restaurant/update/${restaurant?._id}`,
        {
          openingHours: updatedHours,
        },
      );

      setRestaurant(response.data);

      setIsHoursModalOpen(false);
      setModalConfig({
        isOpen: true,
        type: "success",
        title: "Sucesso!",
        message: "Os horários de funcionamento foram atualizados.",
      });
    } catch (error) {
      setModalConfig({
        isOpen: true,
        type: "error",
        title: "Erro ao salvar",
        message: "Não foi possível atualizar os horários. Tente novamente.",
      });
    }
  };

  const handleSaveCuisine = async (cuisines: string[]) => {
    try {
      const response = await api.patch(
        `/restaurant/update/${restaurant?._id}`,
        {
          cuisines,
        },
      );

      setRestaurant(response.data);

      setIsHoursModalOpen(false);
      setModalConfig({
        isOpen: true,
        type: "success",
        title: "Sucesso!",
        message: "As culinárias foram atualizadas.",
      });
    } catch (error) {
      setModalConfig({
        isOpen: true,
        type: "error",
        title: "Erro ao salvar",
        message: "Não foi possível atualizar culinárias. Tente novamente.",
      });
    }
  };

  return (
    <>
      <RestaurantContainer>
        <TitleContainer>
          {isLoadingData ? (
            <SkeletonTitleAvatar />
          ) : (
            <TitleImage src={restaurant?.image} />
          )}
          <TitleText>
            {isLoadingData ? <SkeletonTitleText /> : restaurant?.name}
          </TitleText>
        </TitleContainer>

        <RestaurantContent>
          <Category>
            <Store size={24} /> Identidade
          </Category>
          <CategoryGrid>
            <Detail>
              <DetailName>Descrição</DetailName>
              <DetailValue>{restaurant?.description}</DetailValue>
            </Detail>

            <Detail
              onClick={() => {
                isLoadingData ? 0 : setIsCuisineModalOpen(true);
              }}
            >
              <DetailName>Culinárias</DetailName>
              <ModalButton>Clique para editar as culinárias</ModalButton>
            </Detail>

            <Detail
              onClick={() => {
                isLoadingData ? 0 : setIsHoursModalOpen(true);
              }}
            >
              <DetailName>Horários</DetailName>
              <ModalButton>Clique para editar os horários</ModalButton>
            </Detail>
          </CategoryGrid>

          <Category>
            <Phone size={24} /> Contato
          </Category>
          <CategoryGrid>
            <Detail>
              <DetailName>Telefone</DetailName>
              <DetailValue>{restaurant?.phone}</DetailValue>
            </Detail>

            <Detail>
              <DetailName>E-mail</DetailName>
              <DetailValue>{restaurant?.email}</DetailValue>
            </Detail>
          </CategoryGrid>

          <Category>
            <Settings2 size={24} /> Configurações
          </Category>
          <CategoryGrid>
            <Detail>
              <DetailName>Mesas</DetailName>
              <DetailValue>{restaurant?.totalTables || 0}</DetailValue>
            </Detail>

            <Detail>
              <DetailName>Cardápio</DetailName>
              <DetailValue>{restaurant?.menu.join(", ")}</DetailValue>
            </Detail>
          </CategoryGrid>
        </RestaurantContent>

        <AnimatePresence>
          {isHoursModalOpen && (
            <HoursModal
              initialData={restaurant?.openingHours as DayHours[]}
              onClose={() => setIsHoursModalOpen(false)}
              onSave={handleSaveHours}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isCuisineModalOpen && (
            <CuisineModal
              initialData={restaurant?.cuisines as string[]}
              onClose={() => setIsCuisineModalOpen(false)}
              onSave={handleSaveCuisine}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {modalConfig?.isOpen && (
            <StatusModal
              type={modalConfig.type}
              title={modalConfig.title}
              message={modalConfig.message}
              onClose={() => {
                setModalConfig(null);

                setTimeout(() => {}, 300);
              }}
            />
          )}
        </AnimatePresence>
      </RestaurantContainer>
    </>
  );
}

export default Restaurant;
