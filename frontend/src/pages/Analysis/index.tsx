import { useEffect } from "react";

function Analysis() {
  useEffect(() => {
    document.title = "Tab • Análise";
  }, []);

  return <p>Analysis</p>;
}

export default Analysis;
