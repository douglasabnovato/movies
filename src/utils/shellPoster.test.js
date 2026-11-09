/* Testes da espera pelo pôster do esqueleto (#57) */
import { esperarPosterDoEsqueleto } from "./shellPoster";

/* PerformanceObserver falso: o teste dispara as entradas de LCP com emitir(). */
function criarWin({ suporta = true } = {}) {
  const observadores = [];
  function FakeObserver(callback) {
    this.callback = callback;
    this.desligado = false;
    observadores.push(this);
  }
  FakeObserver.prototype.observe = function observe() {};
  FakeObserver.prototype.disconnect = function disconnect() {
    this.desligado = true;
  };
  FakeObserver.supportedEntryTypes = suporta ? ["paint", "largest-contentful-paint"] : ["paint"];
  return {
    PerformanceObserver: FakeObserver,
    setTimeout: (cb, ms) => setTimeout(cb, ms),
    clearTimeout: (id) => clearTimeout(id),
    observadores,
    emitir: (element) =>
      observadores.forEach((o) => o.callback({ getEntries: () => [{ element }] })),
  };
}

function montarEsqueleto(comPoster = true) {
  document.body.innerHTML = comPoster
    ? '<p>slogan</p><div id="shell-first"><img src="https://image.tmdb.org/t/p/w342/a.jpg" alt="" /></div>'
    : '<div id="shell-first"><div class="skeleton-poster"></div></div>';
  const img = document.querySelector("#shell-first img");
  /* O jsdom não baixa imagens: o padrão aqui é "ainda carregando". */
  if (img) Object.defineProperty(img, "complete", { value: false, configurable: true });
  return img;
}

afterEach(() => {
  document.body.innerHTML = "";
});

test("sem pôster no esqueleto, não espera", async () => {
  montarEsqueleto(false);
  await expect(esperarPosterDoEsqueleto({ win: criarWin() })).resolves.toBe("sem-poster");
});

test("navegador sem LCP: não espera", async () => {
  montarEsqueleto();
  await expect(esperarPosterDoEsqueleto({ win: criarWin({ suporta: false }) })).resolves.toBe(
    "sem-suporte",
  );
});

test("resolve quando o LCP registra o próprio pôster, não outro elemento", async () => {
  const img = montarEsqueleto();
  const win = criarWin();
  let motivo = null;
  esperarPosterDoEsqueleto({ win, limite: 5000 }).then((m) => {
    motivo = m;
  });
  win.emitir(document.querySelector("p"));
  await Promise.resolve();
  expect(motivo).toBeNull();
  win.emitir(img);
  await Promise.resolve();
  expect(motivo).toBe("lcp");
  expect(win.observadores[0].desligado).toBe(true);
});

test("imagem com erro não segura a aplicação", async () => {
  const img = montarEsqueleto();
  const espera = esperarPosterDoEsqueleto({ win: criarWin(), limite: 5000 });
  img.dispatchEvent(new Event("error"));
  await expect(espera).resolves.toBe("erro");
});

test("imagem lenta: desiste no limite", async () => {
  montarEsqueleto();
  await expect(esperarPosterDoEsqueleto({ win: criarWin(), limite: 10 })).resolves.toBe("limite");
});
test("imagem que já falhou antes do JavaScript: não espera", async () => {
  const img = montarEsqueleto();
  Object.defineProperty(img, "complete", { value: true });
  Object.defineProperty(img, "naturalWidth", { value: 0 });
  await expect(esperarPosterDoEsqueleto({ win: criarWin() })).resolves.toBe("erro");
});

test("pôster que não vira LCP (ex.: desktop): desiste pouco depois do load", async () => {
  const img = montarEsqueleto();
  const espera = esperarPosterDoEsqueleto({ win: criarWin(), limite: 5000, folga: 10 });
  img.dispatchEvent(new Event("load"));
  await expect(espera).resolves.toBe("apos-load");
});

test("primeira interação libera a montagem", async () => {
  montarEsqueleto();
  const espera = esperarPosterDoEsqueleto({ win: criarWin(), limite: 5000 });
  document.dispatchEvent(new Event("keydown"));
  await expect(espera).resolves.toBe("interacao");
});

test("aba em segundo plano: não espera", async () => {
  montarEsqueleto();
  const doc = { querySelector: (sel) => document.querySelector(sel), visibilityState: "hidden" };
  await expect(esperarPosterDoEsqueleto({ doc, win: criarWin() })).resolves.toBe("oculta");
});

test("erro no PerformanceObserver não impede a montagem", async () => {
  montarEsqueleto();
  const win = criarWin();
  win.PerformanceObserver.prototype.observe = () => {
    throw new Error("sem suporte de verdade");
  };
  await expect(esperarPosterDoEsqueleto({ win, limite: 5000 })).resolves.toBe("erro");
});
/* fim de shellPoster.test.js */
