/*
 * Medição de uso com GoatCounter (decisão D5 de 10/11/2026).
 * Sem cookie e sem dado pessoal: só a rota (do HashRouter) e o evento "abriu-filme".
 * Carrega só no build de produção, fora de localhost e fora de navegador automatizado.
 */
export const GOATCOUNTER_URL = "https://douglasabnovato.goatcounter.com/count";
export const EVENTO_ABRIU_FILME = "abriu-filme";

const LOCAIS = ["localhost", "127.0.0.1", "[::1]", ""];

/* Lê o ambiente atual; os testes passam um ambiente próprio. */
function ambienteAtual() {
  return {
    producao: process.env.NODE_ENV === "production",
    hostname: typeof window === "undefined" ? "" : window.location.hostname,
    automatizado: typeof navigator !== "undefined" && navigator.webdriver === true,
  };
}

export function deveMedir(amb = ambienteAtual()) {
  if (!amb.producao || amb.automatizado) return false;
  return !LOCAIS.includes(amb.hostname);
}

let iniciado = false;

/* Insere o script uma vez; a contagem das páginas é manual, porque as rotas ficam no hash. */
export function iniciarMedicao(amb = ambienteAtual()) {
  if (iniciado || !deveMedir(amb)) return false;
  iniciado = true;
  const script = document.createElement("script");
  script.async = true;
  script.src = "https://gc.zgo.at/count.js";
  script.dataset.goatcounter = GOATCOUNTER_URL;
  script.dataset.goatcounterSettings = JSON.stringify({ no_onload: true });
  document.head.appendChild(script);
  return true;
}

/* Conta a rota e, se for a ficha de um filme, o evento da métrica principal. */
export function registrarRota(rota) {
  const gc = typeof window === "undefined" ? undefined : window.goatcounter;
  if (!gc || !gc.count) return;
  gc.count({ path: rota });
  if (rota.startsWith("/movie/")) {
    gc.count({ path: EVENTO_ABRIU_FILME, title: EVENTO_ABRIU_FILME, event: true });
  }
}
