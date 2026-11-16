/*
 * WatchProviders · onde assistir o filme no Brasil (assinatura, aluguel e compra).
 * Os dados vêm da TMDB, que os recebe da JustWatch; a TMDB exige o crédito à JustWatch.
 */
import React from "react";
import { imageUrl } from "../../utils/images";
import "./styles.css";

const COUNTRY = "BR";

const GROUPS = [
  { key: "flatrate", label: "Assinatura" },
  { key: "rent", label: "Aluguel" },
  { key: "buy", label: "Compra" },
];

/* Separa os serviços do Brasil por tipo, na ordem de destaque da TMDB, sem repetir serviço no grupo. */
export function mapWatchProviders(watchProviders) {
  const country = watchProviders?.results?.[COUNTRY];
  if (!country) return [];
  return GROUPS.map(({ key, label }) => {
    const seen = new Set();
    const providers = (Array.isArray(country[key]) ? country[key] : [])
      .filter(
        (item) =>
          item && item.provider_name && !seen.has(item.provider_id) && seen.add(item.provider_id),
      )
      .sort((a, b) => (a.display_priority ?? 0) - (b.display_priority ?? 0));
    return { key, label, providers };
  }).filter((group) => group.providers.length > 0);
}

/* Seção do detalhe; sem dados para o Brasil, avisa em vez de esconder. */
function WatchProviders({ groups }) {
  return (
    <section className="watch-providers" aria-labelledby="watch-providers-title">
      <h2 className="title-watch-providers" id="watch-providers-title">
        Onde assistir no Brasil
      </h2>
      {groups.length === 0 ? (
        <p className="watch-providers-empty">
          Ainda não há informação de onde assistir este filme no Brasil.
        </p>
      ) : (
        groups.map((group) => (
          <div key={group.key} className="watch-providers-group">
            <h3 className="watch-providers-label" id={`watch-${group.key}`}>
              {group.label}
            </h3>
            <ul className="watch-providers-list" aria-labelledby={`watch-${group.key}`}>
              {group.providers.map((provider) => (
                <li key={provider.provider_id} className="watch-provider">
                  {provider.logo_path && (
                    <img
                      src={imageUrl(provider.logo_path, "w92")}
                      alt=""
                      width="40"
                      height="40"
                      loading="lazy"
                    />
                  )}
                  <span>{provider.provider_name}</span>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
      <p className="watch-providers-credit">
        Dados de onde assistir:{" "}
        <a href="https://www.justwatch.com/br" target="_blank" rel="noopener noreferrer">
          JustWatch
        </a>
      </p>
    </section>
  );
}

export default WatchProviders;
/* fim de WatchProviders */
