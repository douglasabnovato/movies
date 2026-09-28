/*
 * cache.js · cache em memória com tempo de vida (TTL) e limite de entradas.
 * O Map preserva a ordem de inserção: a primeira chave é sempre a mais antiga,
 * então inserir, ler e remover custam O(1).
 */
export class TtlCache {
  /* Cria o cache com tempo de vida em milissegundos e número máximo de entradas. */
  constructor({ ttlMs = 5 * 60 * 1000, maxEntries = 100, now = () => Date.now() } = {}) {
    this.ttlMs = ttlMs;
    this.maxEntries = maxEntries;
    this.now = now;
    this.store = new Map();
  }

  /* Devolve o valor ainda válido ou undefined; entradas vencidas são removidas na leitura. */
  get(key) {
    const entry = this.store.get(key);
    if (!entry) return undefined;
    if (entry.expiresAt <= this.now()) {
      this.store.delete(key);
      return undefined;
    }
    return entry.value;
  }

  /* Grava o valor e descarta a entrada mais antiga quando o limite é ultrapassado. */
  set(key, value) {
    this.store.delete(key);
    this.store.set(key, { value, expiresAt: this.now() + this.ttlMs });
    if (this.store.size > this.maxEntries) {
      const oldestKey = this.store.keys().next().value;
      this.store.delete(oldestKey);
    }
  }

  /* Esvazia o cache. */
  clear() {
    this.store.clear();
  }

  /* Quantidade de entradas guardadas. */
  get size() {
    return this.store.size;
  }
}
/* fim de cache.js */
