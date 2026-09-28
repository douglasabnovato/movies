/*
 * images.js · URLs de imagens da TMDB com placeholder local quando não há imagem.
 */
const IMAGE_BASE = "https://image.tmdb.org/t/p";

export const PLACEHOLDER = `${process.env.PUBLIC_URL || ""}/placeholder.svg`;

/* Devolve a URL da imagem no tamanho pedido ou o placeholder local. */
export function imageUrl(path, size = "w500") {
  return path ? `${IMAGE_BASE}/${size}${path}` : PLACEHOLDER;
}

/* Troca a imagem quebrada pelo placeholder uma única vez, evitando laço de onError. */
export function handleImageError(event) {
  event.currentTarget.onerror = null;
  event.currentTarget.src = PLACEHOLDER;
}
/* fim de images.js */
