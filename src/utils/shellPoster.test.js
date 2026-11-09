/* Testes da espera pelo pôster do esqueleto (#57) */
import { esperarPosterDoEsqueleto } from "./shellPoster";

function montarEsqueleto(comPoster = true) {
  document.body.innerHTML = comPoster
    ? '<div id="shell-first"><img src="https://image.tmdb.org/t/p/w342/a.jpg" alt="" /></div>'
    : '<div id="shell-first"><div class="skeleton-poster"></div></div>';
  return document.querySelector("#shell-first img");
}

const winComQuadro = {
  requestAnimationFrame: (cb) => setTimeout(cb, 0),
  setTimeout: (cb, ms) => setTimeout(cb, ms),
  clearTimeout: (id) => clearTimeout(id),
};

afterEach(() => {
  document.body.innerHTML = "";
});

test("sem pôster no esqueleto, não espera", async () => {
  montarEsqueleto(false);
  await expect(esperarPosterDoEsqueleto({ win: winComQuadro })).resolves.toBe("sem-poster");
});

test("pôster já carregado: resolve depois da pintura", async () => {
  const img = montarEsqueleto();
  Object.defineProperty(img, "complete", { value: true });
  await expect(esperarPosterDoEsqueleto({ win: winComQuadro })).resolves.toBe("pintado");
});

test("pôster carregando: resolve quando a imagem carrega", async () => {
  const img = montarEsqueleto();
  Object.defineProperty(img, "complete", { value: false });
  const espera = esperarPosterDoEsqueleto({ win: winComQuadro, limite: 5000 });
  img.dispatchEvent(new Event("load"));
  await expect(espera).resolves.toBe("pintado");
});

test("imagem com erro não segura a aplicação", async () => {
  const img = montarEsqueleto();
  Object.defineProperty(img, "complete", { value: false });
  const espera = esperarPosterDoEsqueleto({ win: winComQuadro, limite: 5000 });
  img.dispatchEvent(new Event("error"));
  await expect(espera).resolves.toBe("erro");
});

test("imagem lenta: desiste no limite", async () => {
  const img = montarEsqueleto();
  Object.defineProperty(img, "complete", { value: false });
  await expect(esperarPosterDoEsqueleto({ win: winComQuadro, limite: 10 })).resolves.toBe("limite");
});
/* fim de shellPoster.test.js */
