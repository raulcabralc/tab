import { useEffect } from "react";

function Orders() {
  useEffect(() => {
    document.title = "Tab • Pedidos";
  }, []);

  return <p>Orders</p>;
}

export default Orders;
