import {
  ChefHat,
  ClipboardPlus,
  DollarSign,
  LayoutGrid,
  ReceiptText,
  Settings,
  TrendingUp,
} from "lucide-react";
import {
  BoldSpan,
  Card,
  CardHeader,
  DashboardContainer,
  DashboardGrid,
  Number,
  ProgressBar,
  ProgressTrack,
  SkeletonCard,
  SkeletonTitleAvatar,
  SkeletonTitleText,
  TitleContainer,
  TitleImage,
  TitleText,
} from "./styled";

import { WorkerRole } from "../../../../backend/src/worker/types/enums/role.enum";
import { ordersMock } from "@/orders-mock";
import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { StatusModal } from "@/components/StatusModal";
import { useLocation } from "react-router-dom";
import api from "@/services/api";

function Dashboard() {
  const location = useLocation();

  useEffect(() => {
    document.title = "Tab • Dashboard";

    if (location.state?.showNotFirstLoginAnymoreAlert) {
      setModalConfig({
        isOpen: true,
        type: "warning",
        title: "Senha já atualizada!",
        message: "Você já atualizou a senha da sua conta.",
      });

      window.history.replaceState({}, document.title);
    }

    if (location.state?.showAlreadyLoggedInAlert) {
      setModalConfig({
        isOpen: true,
        type: "warning",
        title: "Usuário já logado!",
        message: "Você já está logado no sistema.",
      });

      window.history.replaceState({}, document.title);
    }

    const loadDashboardData = async () => {
      setIsLoadingData(true);
      try {
        const { user, restaurant } = await getData();
        setUser(user);
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

  const [user, setUser] = useState<any>(null);
  const [restaurant, setRestaurant] = useState<any>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const getData = async () => {
    const userData = await api.get("/auth/me");
    const user = userData.data;

    const restaurantData = await api.get(`/restaurant/${user.restaurantId}`);
    const restaurant = restaurantData.data;

    return { user, restaurant };
  };

  const preparingOrders = ordersMock.filter(
    (order) => order.status === "PREPARING",
  );
  const lateOrders = ordersMock.filter((order) => order.priority === "HIGH");

  const totalTables = restaurant?.totalTables;
  const occupiedTables = 12;
  const occupancyPercent = (occupiedTables / totalTables) * 100;

  const visibleTo = (roles: WorkerRole[] = []) => {
    const currentRole = user?.role as WorkerRole;
    const allowed = [WorkerRole.ADMIN, WorkerRole.MANAGER, ...roles];
    return allowed.includes(currentRole);
  };

  const totalOrdersToday = ordersMock.reduce(
    (acc, order) =>
      acc + (order.status === "DONE" || order.status === "DELIVERED" ? 1 : 0),
    0,
  );
  const totalSalesToday = ordersMock.reduce(
    (acc, order) =>
      acc + (order.status === "DELIVERED" || order.status === "DONE" ? 1 : 0),
    0,
  );
  const canceledSalesToday = ordersMock.reduce(
    (acc, order) => acc + (order.status === "CANCELED" ? 1 : 0),
    0,
  );
  const totalMoneySalesToday = ordersMock.reduce(
    (acc, order) =>
      acc +
      (order.status === "DELIVERED" || order.status === "DONE"
        ? order.total
        : 0),
    0,
  );
  const averageTicketToday =
    totalOrdersToday > 0 ? totalMoneySalesToday / totalOrdersToday : 0;

  return (
    <>
      <DashboardContainer>
        <TitleContainer>
          {isLoadingData ? (
            <SkeletonTitleAvatar />
          ) : (
            <TitleImage src={restaurant?.image} alt="Logo" />
          )}

          {isLoadingData ? (
            <SkeletonTitleText />
          ) : (
            <TitleText>{restaurant?.name}</TitleText>
          )}
        </TitleContainer>

        <DashboardGrid>
          {isLoadingData ? (
            Array.from({ length: 4 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))
          ) : (
            <>
              <Card to="/orders">
                <CardHeader>
                  <ChefHat size={20} /> Status da Cozinha
                </CardHeader>
                <span>
                  <Number>{preparingOrders.length}</Number> pedidos em{" "}
                  <BoldSpan>produção</BoldSpan>.
                </span>
                <span>
                  {lateOrders.length > 0 ? (
                    <Number>{lateOrders.length}</Number>
                  ) : (
                    <BoldSpan>0</BoldSpan>
                  )}{" "}
                  pedidos <BoldSpan>atrasados</BoldSpan>.
                </span>
              </Card>

              {visibleTo([WorkerRole.WAITER]) && (
                <Card $deactivated={!restaurant.totalTables} to="">
                  <CardHeader>
                    <LayoutGrid size={20} /> Ocupação de Mesas
                  </CardHeader>
                  {restaurant.totalTables ? (
                    <>
                      <span>
                        {occupiedTables < totalTables ? (
                          <BoldSpan>{occupiedTables}</BoldSpan>
                        ) : (
                          <Number>{occupiedTables}</Number>
                        )}{" "}
                        / <Number>{totalTables}</Number> mesas ocupadas.
                      </span>
                      <ProgressTrack>
                        <ProgressBar $percent={occupancyPercent} />
                      </ProgressTrack>
                    </>
                  ) : (
                    <>
                      <span className="config">
                        Mesas devem ser configuradas nas configurações do{" "}
                        restaurante
                        <Settings size={80} />
                      </span>
                    </>
                  )}
                </Card>
              )}

              {visibleTo() && (
                <Card to="/analysis">
                  <CardHeader>
                    <DollarSign size={20} /> Faturamento Hoje
                  </CardHeader>
                  <span>
                    {totalMoneySalesToday > 0 ? (
                      <Number>R$ {totalMoneySalesToday.toFixed(2)}</Number>
                    ) : (
                      <BoldSpan>0</BoldSpan>
                    )}{" "}
                    faturado hoje.
                  </span>
                  <span>
                    {canceledSalesToday > 0 ? (
                      <Number>{canceledSalesToday}</Number>
                    ) : (
                      <BoldSpan>0</BoldSpan>
                    )}{" "}
                    pedidos cancelados hoje.
                  </span>
                </Card>
              )}

              {visibleTo() && (
                <Card to="/analysis">
                  <CardHeader>
                    <TrendingUp size={20} /> Ticket Médio
                  </CardHeader>
                  <span>
                    {averageTicketToday > 0 ? (
                      <Number>R$ {averageTicketToday.toFixed(2)}</Number>
                    ) : (
                      <BoldSpan>0</BoldSpan>
                    )}{" "}
                    por pedido realizado.
                  </span>
                  <span>
                    {totalSalesToday > 0 ? (
                      <Number>{totalSalesToday}</Number>
                    ) : (
                      <BoldSpan>0</BoldSpan>
                    )}{" "}
                    pedidos realizados hoje.
                  </span>
                </Card>
              )}

              {visibleTo([WorkerRole.WAITER]) && (
                <Card className="dotted" to="/orders/create">
                  <CardHeader>
                    <ClipboardPlus size={20} /> Novo Pedido
                  </CardHeader>
                  <span>Lançar novo pedido para mesa.</span>
                </Card>
              )}

              {visibleTo([WorkerRole.WAITER]) && (
                <Card className="dotted" to="/orders/close">
                  <CardHeader>
                    <ReceiptText size={20} /> Fechar Conta
                  </CardHeader>
                  <span>Encerrar atendimento e emitir conta.</span>
                </Card>
              )}
            </>
          )}
        </DashboardGrid>

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
      </DashboardContainer>
    </>
  );
}

export default Dashboard;
