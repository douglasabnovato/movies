/* Medicao · conta cada rota no GoatCounter, só no site publicado (decisão D5). */
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { iniciarMedicao, registrarRota } from "../utils/medicao";

function Medicao() {
  const { pathname } = useLocation();

  useEffect(() => {
    iniciarMedicao();
  }, []);

  useEffect(() => {
    /* Na primeira rota o script pode ainda estar a caminho; tenta de novo no load. */
    if (window.goatcounter) {
      registrarRota(pathname);
      return undefined;
    }
    const script = document.querySelector("script[data-goatcounter]");
    if (!script) return undefined;
    const contar = () => registrarRota(pathname);
    script.addEventListener("load", contar);
    return () => script.removeEventListener("load", contar);
  }, [pathname]);

  return null;
}

export default Medicao;
