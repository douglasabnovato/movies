import { deveMedir, GOATCOUNTER_URL, iniciarMedicao, registrarRota } from "./medicao";

const publicado = { producao: true, hostname: "douglasabnovato.github.io", automatizado: false };

describe("Utils / Medição com GoatCounter", () => {
  it("aponta para o código único do portfólio", () => {
    expect(GOATCOUNTER_URL).toBe("https://douglasabnovato.goatcounter.com/count");
  });

  it("mede só no build de produção, fora de localhost e de teste automatizado", () => {
    expect(deveMedir(publicado)).toBe(true);
    expect(deveMedir({ ...publicado, producao: false })).toBe(false);
    expect(deveMedir({ ...publicado, automatizado: true })).toBe(false);
    expect(deveMedir({ ...publicado, hostname: "localhost" })).toBe(false);
    expect(deveMedir({ ...publicado, hostname: "127.0.0.1" })).toBe(false);
  });

  it("não carrega o script nos testes", () => {
    expect(iniciarMedicao()).toBe(false);
    expect(document.querySelector("script[data-goatcounter]")).toBeNull();
  });

  it("conta a rota e o evento abriu-filme, sem outro dado", () => {
    const count = jest.fn();
    window.goatcounter = { count };
    registrarRota("/movie/42");
    expect(count).toHaveBeenCalledWith({ path: "/movie/42" });
    expect(count).toHaveBeenCalledWith({ path: "abriu-filme", title: "abriu-filme", event: true });
    count.mockClear();
    registrarRota("/");
    expect(count).toHaveBeenCalledTimes(1);
    delete window.goatcounter;
  });
});
