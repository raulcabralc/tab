import { useEffect } from "react";

function Team() {
  useEffect(() => {
    document.title = "Tab • Equipe";
  }, []);

  return <p>Team</p>;
}

export default Team;
