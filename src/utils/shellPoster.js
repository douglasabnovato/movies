/*
 * shellPoster.js · Espera o pôster do esqueleto (index.html) contar para o LCP antes de o React trocar o esqueleto.
 * Se o React monta antes, a imagem sai da página sem virar LCP, e o LCP passa a ser o pôster que o React
 * desenha depois (#57). Esperar só o "load" não basta: a pintura da imagem decodificada vem alguns quadros
 * depois. Por isso a espera acaba quando o navegador registra o LCP da própria imagem, com limite de tempo
 * para nunca segurar a aplicação.
 */
export const SHELL_POSTER = "#shell-first img";
export const LIMITE_MS = 2500;

/* Resolve com o motivo: "lcp", "sem-poster", "sem-suporte", "erro" ou "limite". */
export function esperarPosterDoEsqueleto({
  doc = document,
  win = window,
  limite = LIMITE_MS,
} = {}) {
  const img = doc.querySelector(SHELL_POSTER);
  if (!img) return Promise.resolve("sem-poster");
  const Observer = win.PerformanceObserver;
  const suportaLcp =
    typeof Observer === "function" &&
    Array.isArray(Observer.supportedEntryTypes) &&
    Observer.supportedEntryTypes.includes("largest-contentful-paint");
  if (!suportaLcp) return Promise.resolve("sem-suporte");

  return new Promise((resolve) => {
    let feito = false;
    let observer;
    const fim = (motivo) => {
      if (feito) return;
      feito = true;
      win.clearTimeout(timer);
      if (observer) observer.disconnect();
      resolve(motivo);
    };
    const timer = win.setTimeout(() => fim("limite"), limite);
    img.addEventListener("error", () => fim("erro"), { once: true });
    observer = new Observer((lista) => {
      if (lista.getEntries().some((entrada) => entrada.element === img)) fim("lcp");
    });
    observer.observe({ type: "largest-contentful-paint", buffered: true });
  });
}
/* fim de shellPoster.js */
