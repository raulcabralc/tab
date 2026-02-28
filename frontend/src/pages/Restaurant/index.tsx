import { useEffect, useState } from "react";
import {
  Category,
  CategoryGrid,
  Detail,
  DetailGrid,
  DetailName,
  DetailValue,
  ModalButton,
  RestaurantContainer,
  RestaurantContent,
  SkeletonDescription,
  SkeletonEmail,
  SkeletonModalButton,
  SkeletonPhone,
  TitleContainer,
  TitleImage,
  TitleText,
} from "./styled";
import api from "@/services/api";
import { SkeletonTitleAvatar, SkeletonTitleText } from "../Dashboard/styled";
import { AnimatePresence } from "framer-motion";
import { StatusModal } from "@/components/StatusModal";
import { Pen, Phone, Settings2, Store } from "lucide-react";
import HoursModal, { DayHours } from "@/components/HoursModal";
import CuisineModal from "@/components/CuisineModal";
import DescriptionModal from "@/components/DescriptionModal";
import PhoneModal from "@/components/PhoneModal";
import EmailModal from "@/components/EmailModal";

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
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

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

  const handleSaveDescription = async (description: string) => {
    try {
      const response = await api.patch(
        `/restaurant/update/${restaurant?._id}`,
        {
          description,
        },
      );

      setRestaurant(response.data);

      setIsHoursModalOpen(false);
      setModalConfig({
        isOpen: true,
        type: "success",
        title: "Sucesso!",
        message: "A descrição foi atualizada.",
      });
    } catch (error) {
      setModalConfig({
        isOpen: true,
        type: "error",
        title: "Erro ao salvar",
        message: "Não foi possível atualizar a descrição. Tente novamente.",
      });
    }
  };

  const handleSavePhone = async (phone: string) => {
    try {
      const phoneMasked = phone.replace(/\D/g, "");

      const response = await api.patch(
        `/restaurant/update/${restaurant?._id}`,
        {
          phone: phoneMasked,
        },
      );

      setRestaurant(response.data);

      setIsHoursModalOpen(false);
      setModalConfig({
        isOpen: true,
        type: "success",
        title: "Sucesso!",
        message: "O telefone foi atualizado.",
      });
    } catch (error) {
      setModalConfig({
        isOpen: true,
        type: "error",
        title: "Erro ao salvar",
        message: "Não foi possível atualizar o telefone. Tente novamente.",
      });
    }
  };

  const handleSaveEmail = async (email: string) => {
    try {
      const response = await api.patch(
        `/restaurant/update/${restaurant?._id}`,
        {
          email,
        },
      );

      setRestaurant(response.data);

      setIsHoursModalOpen(false);
      setModalConfig({
        isOpen: true,
        type: "success",
        title: "Sucesso!",
        message: "O e-mail foi atualizado.",
      });
    } catch (error) {
      setModalConfig({
        isOpen: true,
        type: "error",
        title: "Erro ao salvar",
        message: "Não foi possível atualizar o e-mail. Tente novamente.",
      });
    }
  };

  const maskPhone = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .replace(/(-\d{4})(\d+?)$/, "$1");
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
              {isLoadingData ? (
                <SkeletonDescription />
              ) : (
                <DetailGrid>
                  <DetailValue>{restaurant?.description}</DetailValue>
                  <div
                    className="svg-wrapper"
                    onClick={() => setIsDescriptionModalOpen(true)}
                  >
                    <Pen size={18} />
                  </div>
                </DetailGrid>
              )}
            </Detail>

            <Detail
              onClick={() => {
                isLoadingData ? 0 : setIsCuisineModalOpen(true);
              }}
            >
              <DetailName>Culinárias</DetailName>
              {isLoadingData ? (
                <SkeletonModalButton />
              ) : (
                <ModalButton>Clique para editar as culinárias</ModalButton>
              )}
            </Detail>

            <Detail
              onClick={() => {
                isLoadingData ? 0 : setIsHoursModalOpen(true);
              }}
            >
              <DetailName>Horários</DetailName>
              {isLoadingData ? (
                <SkeletonModalButton />
              ) : (
                <ModalButton>Clique para editar os horários</ModalButton>
              )}
            </Detail>
          </CategoryGrid>

          <Category>
            <Phone size={24} /> Contato
          </Category>
          <CategoryGrid>
            <Detail>
              <DetailName>Telefone</DetailName>
              <DetailValue>
                {isLoadingData ? (
                  <SkeletonPhone />
                ) : (
                  <DetailGrid>
                    <DetailValue>
                      {maskPhone(restaurant?.phone as string)}
                    </DetailValue>
                    <div
                      className="svg-wrapper"
                      onClick={() => setIsPhoneModalOpen(true)}
                    >
                      <Pen size={18} />
                    </div>
                  </DetailGrid>
                )}
              </DetailValue>
            </Detail>

            <Detail>
              <DetailName>E-mail</DetailName>
              {isLoadingData ? (
                <SkeletonEmail />
              ) : (
                <DetailGrid>
                  <DetailValue>{restaurant?.email}</DetailValue>
                  <div
                    className="svg-wrapper"
                    onClick={() => setIsEmailModalOpen(true)}
                  >
                    <Pen size={18} />
                  </div>
                </DetailGrid>
              )}
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
          {isDescriptionModalOpen && (
            <DescriptionModal
              initialData={restaurant?.description as string}
              onClose={() => setIsDescriptionModalOpen(false)}
              onSave={handleSaveDescription}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isPhoneModalOpen && (
            <PhoneModal
              initialData={restaurant?.phone as string}
              onClose={() => setIsPhoneModalOpen(false)}
              onSave={handleSavePhone}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isEmailModalOpen && (
            <EmailModal
              initialData={restaurant?.email as string}
              onClose={() => setIsEmailModalOpen(false)}
              onSave={handleSaveEmail}
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
