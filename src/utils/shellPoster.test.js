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
  return document.querySelector("#shell-first img");
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
/* fim de shellPoster.test.js */
