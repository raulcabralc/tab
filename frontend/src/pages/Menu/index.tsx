import { useEffect } from "react";

function Menu() {
  useEffect(() => {
    document.title = "Tab • Cardápio";
  }, []);

  return <p>Menu</p>;
}

export default Menu;
