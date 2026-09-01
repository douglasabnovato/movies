/**
 * Converte data da API (YYYY-MM-DD) para o formato brasileiro (DD/MM/YYYY).
 * @param {string} dateString
 * @returns {string}
 */
export const formatDate = (dateString) => {
  if (!dateString) return "Data desconhecida";
  const parts = dateString.split("-");
  if (parts.length !== 3) return "Data inválida";
  const [year, month, day] = parts;
  return `${day}/${month}/${year}`;
};

/**
 * Converte minutos totais em formato legível de horas e minutos (Xh Ym).
 * @param {number} minutes
 * @returns {string}
 */
export const formatRuntime = (minutes) => {
  if (!minutes || typeof minutes !== "number" || minutes <= 0) {
    return "Duração indisponível";
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};