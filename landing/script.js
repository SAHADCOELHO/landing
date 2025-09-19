// Ano dinâmico
document.addEventListener("DOMContentLoaded", () => {
  const el = document.getElementById("year");
  if (el) el.textContent = new Date().getFullYear();
});
// ===== EFEITO PARALLAX 3D NO MOBILE =====
document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".receive-card");

  const applyMobileParallax = () => {
    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    if (!isMobile) {
      // desktop: limpa efeitos do mobile
      cards.forEach(card => {
        const img = card.querySelector(".receive-img");
        if (img) img.style.transform = "";
      });
      return;
    }

    const scrollY = window.scrollY || window.pageYOffset;

    cards.forEach((card, idx) => {
      const rect = card.getBoundingClientRect();
      const cardCenter = rect.top + rect.height / 2 + scrollY;

      // distância do centro da viewport (efeito suave)
      const viewportCenter = scrollY + window.innerHeight / 2;
      const delta = (cardCenter - viewportCenter) / window.innerHeight; // ~ -0.5..0.5

      const img = card.querySelector(".receive-img");
      if (!img) return;

      // deslocamentos pequenos para não “bater” no texto
      const translateY = Math.max(-4, Math.min(4, -delta * 12)); // -4..4px
      const rotateX = Math.max(-2, Math.min(2, delta * 8));      // -2..2 deg

      img.style.transform = `translateY(${translateY}px) rotateX(${rotateX}deg)`;
    });
  };

  applyMobileParallax();
  window.addEventListener("scroll", applyMobileParallax, { passive: true });
  window.addEventListener("resize", applyMobileParallax);
});
