/* Depois do build, leva o CSS para dentro do index.html, para ele não bloquear a primeira pintura */
const fs = require("fs");
const path = require("path");

const build = path.join(__dirname, "..", "build");
const page = path.join(build, "index.html");
const html = fs.readFileSync(page, "utf8");
const inlined = html.replace(/<link href="\.?\/?(static\/css\/[^"]+\.css)" rel="stylesheet">/, (_, file) => {
  const css = fs.readFileSync(path.join(build, file), "utf8").replace(/\/\*# sourceMappingURL=.*?\*\//, "");
  return `<style>${css}</style>`;
});
if (inlined === html) throw new Error("CSS do build não encontrado em index.html");
fs.writeFileSync(page, inlined);
/* fim de inline-css.js */
