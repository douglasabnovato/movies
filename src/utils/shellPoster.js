/*
 * shellPoster.js · Espera o pôster do esqueleto (index.html) aparecer antes de o React trocar o esqueleto.
 * Se o React monta antes de a imagem pintar, ela sai da página sem contar para o LCP, e o LCP passa a ser
 * o pôster que o React desenha depois, com 2 a 3 s de atraso de renderização (#57). Com limite de tempo,
 * para nunca segurar a aplicação por causa de uma imagem lenta.
 */
export const SHELL_POSTER = "#shell-first img";
export const LIMITE_MS = 2500;

/* Duas voltas de quadro: a primeira agenda, a segunda garante que o quadro com a imagem foi pintado. */
function depoisDaPintura(win) {
  return new Promise((resolve) => {
    if (typeof win.requestAnimationFrame !== "function") {
      resolve();
      return;
    }
    win.requestAnimationFrame(() => win.requestAnimationFrame(() => resolve()));
  });
}

/* Resolve quando o pôster do esqueleto já pintou, falhou, não existe ou o limite passou. */
export function esperarPosterDoEsqueleto({
  doc = document,
  win = window,
  limite = LIMITE_MS,
} = {}) {
  const img = doc.querySelector(SHELL_POSTER);
  if (!img) return Promise.resolve("sem-poster");
  if (img.complete) return depoisDaPintura(win).then(() => "pintado");
  return new Promise((resolve) => {
    let feito = false;
    const fim = (motivo) => {
      if (feito) return;
      feito = true;
      win.clearTimeout(timer);
      if (motivo === "carregado") depoisDaPintura(win).then(() => resolve("pintado"));
      else resolve(motivo);
    };
    const timer = win.setTimeout(() => fim("limite"), limite);
    img.addEventListener("load", () => fim("carregado"), { once: true });
    img.addEventListener("error", () => fim("erro"), { once: true });
  });
}
/* fim de shellPoster.js */
