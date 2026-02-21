import {
  ChefHat,
  ClipboardPlus,
  DollarSign,
  LayoutGrid,
  ReceiptText,
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
  TitleContainer,
  TitleImage,
  TitleText,
} from "./styled";

import { WorkerRole } from "../../../../backend/src/worker/types/enums/role.enum";
import { restaurantMock } from "@/restaurant-mock";
import { ordersMock } from "@/orders-mock";
import { userMock } from "@/user-mock";
import { useEffect } from "react";

function Dashboard() {
  useEffect(() => {
    document.title = "Tab • Dashboard";
  }, []);

  const preparingOrders = ordersMock.filter(
    (order) => order.status === "PREPARING",
  );
  const lateOrders = ordersMock.filter((order) => order.priority === "HIGH");

  const totalTables = restaurantMock.totalTables;
  const occupiedTables = 12;
  const occupancyPercent = (occupiedTables / totalTables) * 100;

  const visibleTo = (roles: WorkerRole[] = []) => {
    const currentRole = userMock.role as WorkerRole;
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
          <TitleImage src={restaurantMock.image} alt="Logo" />
          <TitleText>{restaurantMock.name}</TitleText>
        </TitleContainer>

        <DashboardGrid>
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
            <Card to="">
              <CardHeader>
                <LayoutGrid size={20} /> Ocupação de Mesas
              </CardHeader>
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
                <ReceiptText size={20} /> Fechar conta
              </CardHeader>
              <span>Encerrar atendimento e emitir conta.</span>
            </Card>
          )}
        </DashboardGrid>
      </DashboardContainer>
    </>
  );
}

export default Dashboard;
