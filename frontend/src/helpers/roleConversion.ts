export const roleConversion = (role: string): string => {
  switch (role) {
    case "WAITER":
      return "Garçom";
    case "BARTENDER":
      return "Bartender";
    case "CHEF":
      return "Chef";
    case "MANAGER":
      return "Gerente";
    case "DELIVERY":
      return "Entregador";
    case "ADMIN":
      return "Administrador";
    default:
      return "Desconhecido";
  }
};
