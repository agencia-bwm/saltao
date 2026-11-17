/**
 * Setas dos carrosséis de fotos da landing. Sem biblioteca: só rola o trilho nativo (scroll-snap),
 * que continua funcionando no dedo e pelo teclado mesmo sem este script. As setas e o contador
 * nascem escondidos (hidden) e só aparecem quando o script roda.
 */
const suave = () => (matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth");

for (const c of document.querySelectorAll<HTMLElement>("[data-carrossel]")) {
  const trilho = c.querySelector<HTMLElement>(".lp-trilho");
  const ant = c.querySelector<HTMLButtonElement>("[data-ant]");
  const prox = c.querySelector<HTMLButtonElement>("[data-prox]");
  const contador = c.querySelector<HTMLElement>("[data-contador]");
  if (!trilho || !ant || !prox) continue;
  const total = trilho.children.length;
  if (total < 2) continue;

  const atual = () => Math.round(trilho.scrollLeft / trilho.clientWidth);
  const ir = (i: number) => trilho.scrollTo({ left: ((i + total) % total) * trilho.clientWidth, behavior: suave() });
  const mostrar = () => {
    if (contador) contador.textContent = `${atual() + 1} / ${total}`;
  };

  ant.addEventListener("click", () => ir(atual() - 1));
  prox.addEventListener("click", () => ir(atual() + 1));
  let quadro = 0;
  trilho.addEventListener("scroll", () => {
    cancelAnimationFrame(quadro);
    quadro = requestAnimationFrame(mostrar);
  }, { passive: true });

  ant.hidden = prox.hidden = false;
  if (contador) contador.hidden = false;
  mostrar();
}
