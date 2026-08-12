(function () {
  "use strict";

  const DEFAULT_BIRD = { src: "assets/Imagenes/recursosGraficos/recursos graficos extra-chincol3.webp", flip: false };

  function init() {
    const config = window.SCROLL_TOP_CONFIG || {};
    const defaultBird = config.default || DEFAULT_BIRD;

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "scroll-top-btn";
    btn.setAttribute("aria-label", "Volver arriba");
    btn.innerHTML = `
      <img class="scroll-top-bird" src="${defaultBird.src}" alt="" />
      <svg class="scroll-top-arrow" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 5l6 6.5h-4V19h-4v-7.5H6z" fill="currentColor"/>
      </svg>
    `;
    document.body.appendChild(btn);

    const birdImg = btn.querySelector(".scroll-top-bird");
    birdImg.classList.toggle("is-flipped", !!defaultBird.flip);

    function applyBirdForRoute() {
      if (!config.routes) return;
      const route = (location.hash || "#inicio").replace("#", "") || "inicio";
      const entry = config.routes[route] || defaultBird;
      birdImg.src = entry.src;
      birdImg.classList.toggle("is-flipped", !!entry.flip);
    }
    applyBirdForRoute();
    if (config.routes) {
      window.addEventListener("hashchange", applyBirdForRoute);
    }

    btn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    let pastThreshold = false;
    window.addEventListener("scroll", () => {
      const nowPast = window.scrollY > 480;
      if (nowPast !== pastThreshold) {
        pastThreshold = nowPast;
        btn.classList.toggle("is-visible", pastThreshold);
      }
    }, { passive: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
