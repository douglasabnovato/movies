/* cache.test.js · comportamento do TtlCache (TTL e limite de entradas). */
import { TtlCache } from "./cache";

describe("Services / TtlCache", () => {
  it("devolve o valor enquanto o TTL não vence e remove depois", () => {
    let now = 0;
    const cache = new TtlCache({ ttlMs: 100, now: () => now });
    cache.set("a", 1);
    now = 99;
    expect(cache.get("a")).toBe(1);
    now = 100;
    expect(cache.get("a")).toBeUndefined();
    expect(cache.size).toBe(0);
  });

  it("descarta a entrada mais antiga ao passar do limite", () => {
    const cache = new TtlCache({ maxEntries: 2 });
    cache.set("a", 1);
    cache.set("b", 2);
    cache.set("c", 3);
    expect(cache.get("a")).toBeUndefined();
    expect(cache.get("b")).toBe(2);
    expect(cache.get("c")).toBe(3);
  });

  it("regravar uma chave a torna a mais recente", () => {
    const cache = new TtlCache({ maxEntries: 2 });
    cache.set("a", 1);
    cache.set("b", 2);
    cache.set("a", 10);
    cache.set("c", 3);
    expect(cache.get("b")).toBeUndefined();
    expect(cache.get("a")).toBe(10);
  });
});
/* fim de cache.test.js */
