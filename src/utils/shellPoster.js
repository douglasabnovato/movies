/*
 * shellPoster.js · Espera o pôster do esqueleto (index.html) contar para o LCP antes de o React trocar o esqueleto.
 * Se o React monta antes, a imagem sai da página sem virar LCP, e o LCP passa a ser o pôster que o React
 * desenha depois (#57). Esperar só o "load" não basta: a pintura da imagem decodificada vem alguns quadros
 * depois. Por isso a espera acaba quando o navegador registra o LCP da própria imagem.
 * Nunca segura a aplicação: desiste no limite, pouco depois do "load" (o pôster pode não ser o maior
 * elemento, como no desktop), na primeira interação, com a aba em segundo plano ou se a imagem falhar.
 */
export const SHELL_POSTER = "#shell-first img";
export const LIMITE_MS = 2500;
/* Depois do "load", tempo suficiente para decodificar e pintar; sem entrada de LCP até lá, não haverá. */
export const FOLGA_APOS_LOAD_MS = 400;

const INTERACOES = ["pointerdown", "keydown", "wheel", "touchstart"];

/* Resolve com o motivo: "lcp", "sem-poster", "sem-suporte", "oculta", "erro", "interacao", "apos-load" ou "limite". */
export function esperarPosterDoEsqueleto({
  doc = document,
  win = window,
  limite = LIMITE_MS,
  folga = FOLGA_APOS_LOAD_MS,
} = {}) {
  const img = doc.querySelector(SHELL_POSTER);
  if (!img) return Promise.resolve("sem-poster");
  const Observer = win.PerformanceObserver;
  const suportaLcp =
    typeof Observer === "function" &&
    Array.isArray(Observer.supportedEntryTypes) &&
    Observer.supportedEntryTypes.includes("largest-contentful-paint");
  if (!suportaLcp) return Promise.resolve("sem-suporte");
  if (doc.visibilityState === "hidden") return Promise.resolve("oculta");
  if (img.complete && img.naturalWidth === 0) return Promise.resolve("erro");

  return new Promise((resolve) => {
    let feito = false;
    let observer;
    const timers = [];
    const aoInteragir = () => fim("interacao");
    const fim = (motivo) => {
      if (feito) return;
      feito = true;
      timers.forEach((id) => win.clearTimeout(id));
      if (observer) observer.disconnect();
      INTERACOES.forEach((tipo) => doc.removeEventListener(tipo, aoInteragir, true));
      resolve(motivo);
    };
    /* A folga conta a partir do primeiro quadro depois do "load": com a CPU ocupada, o quadro atrasa e a folga junto. */
    const depoisDoQuadro = (fn) =>
      typeof win.requestAnimationFrame === "function"
        ? win.requestAnimationFrame(() => win.requestAnimationFrame(fn))
        : fn();
    const aposLoad = () =>
      depoisDoQuadro(() => {
        if (!feito) timers.push(win.setTimeout(() => fim("apos-load"), folga));
      });
    try {
      timers.push(win.setTimeout(() => fim("limite"), limite));
      img.addEventListener("error", () => fim("erro"), { once: true });
      if (img.complete) aposLoad();
      else img.addEventListener("load", aposLoad, { once: true });
      INTERACOES.forEach((tipo) => doc.addEventListener(tipo, aoInteragir, true));
      observer = new Observer((lista) => {
        if (lista.getEntries().some((entrada) => entrada.element === img)) fim("lcp");
      });
      observer.observe({ type: "largest-contentful-paint", buffered: true });
    } catch (erro) {
      fim("erro");
    }
  });
}
/* fim de shellPoster.js */
