(function () {
  "use strict";

  const PUBLISHED_SHEET_ID = "2PACX-1vRRxoQN-Ur4UPW9nEDxz-fPENVJbvfpZj_xBBKMvlfr1CkzHfxv_L7hngLNOkHUhkL3-xxjUCCdQ7Aq";
  const DEFAULT_WHATSAPP = "56932514475";
  const CUSTOM_DECORATION_DESCRIPTION = "Decoración especial a pedido. Requiere referencia y confirmación por WhatsApp. Puede tener un costo adicional entre $2.000 y $5.000.";
  const sheetCsvUrl = (gid) => `https://docs.google.com/spreadsheets/d/e/${PUBLISHED_SHEET_ID}/pub?gid=${gid}&single=true&output=csv`;
  const CSV_URLS = {
    productos: sheetCsvUrl("920376714"),
    formatos: sheetCsvUrl("398707066"),
    precios_especiales: sheetCsvUrl("1958097253"),
    decoraciones: sheetCsvUrl("1210476222")
  };

  const SOLID_COLORS = [
    "#c05a2b", "#6f7d55", "#d9a441", "#8f4f3e", "#e7b8a4",
    "#405b4f", "#b4773b", "#cf6f81", "#8a8f63", "#e1c77a",
    "#68473b", "#9a6f98", "#55736a", "#d8894a", "#b9c795"
  ];

  const PRODUCT_IMAGES = {
    caiti: "assets/Imagenes/Tortas/Imagen torta/Caiti.webp",
    chiricoca: "assets/Imagenes/Tortas/Imagen torta/Chiricoca.webp",
    chucao: "assets/Imagenes/Tortas/Imagen torta/Chucao.webp",
    garza_egretta: "assets/Imagenes/Tortas/Imagen torta/Garza Egretta.webp",
    parrot_cake: "assets/Imagenes/Tortas/Imagen torta/Parrot cake.webp",
    pequen: "assets/Imagenes/Tortas/Imagen torta/Pequen.webp",
    azahar: "assets/Imagenes/Tartas/imagenes tartas/Tartas-azahar.webp",
    chincol: "assets/Imagenes/Tartas/imagenes tartas/Tartas-chincol.webp",
    flamenca: "assets/Imagenes/Tartas/imagenes tartas/Tartas-flamenca.webp",
    flor_de_cacao: "assets/Imagenes/Tartas/imagenes tartas/Tartas-flordecacao.webp",
    mirlo: "assets/Imagenes/Tartas/imagenes tartas/Tartas-mirlo.webp",
    neroli: "assets/Imagenes/Tartas/imagenes tartas/Tartas-neroli.webp",
    naranjazanahoria: "assets/Imagenes/quques/Imagenes queques/Queques-naranjazanahoria.webp",
    naranja_zanahoria: "assets/Imagenes/quques/Imagenes queques/Queques-naranjazanahoria.webp",
    manzanacanela: "assets/Imagenes/quques/Imagenes queques/Queques-manzanacanela.webp",
    manzana_canela: "assets/Imagenes/quques/Imagenes queques/Queques-manzanacanela.webp",
    platanoarandano: "assets/Imagenes/quques/Imagenes queques/Queques-arandano-platano.webp",
    platano_arandano: "assets/Imagenes/quques/Imagenes queques/Queques-arandano-platano.webp",
    arandano_platano: "assets/Imagenes/quques/Imagenes queques/Queques-arandano-platano.webp",
    curcuma: "assets/Imagenes/rawmesan/imagen Rawmesan/Rawmesan-curcuma.webp",
    merken: "assets/Imagenes/rawmesan/imagen Rawmesan/Rawmesan-merken.webp",
    oregano: "assets/Imagenes/rawmesan/imagen Rawmesan/Rawmesan-oregano.webp",
    romero: "assets/Imagenes/rawmesan/imagen Rawmesan/Rawmesan-romero.webp",
    blondies: "assets/Imagenes/Golosinas vegan/Golosinas vegan/Golosinas-blondies.webp",
    brownies: "assets/Imagenes/Golosinas vegan/Golosinas vegan/Golosinas-brownies.webp",
    chocman: "assets/Imagenes/Golosinas vegan/Golosinas vegan/Golosinas-chocman.webp",
    medialunas: "assets/Imagenes/Golosinas vegan/Golosinas vegan/Golosinas-medialunas.webp",
    pinguinitos: "assets/Imagenes/Golosinas vegan/Golosinas vegan/Golosinas-pinguinitos.webp",
    prestigios: "assets/Imagenes/Golosinas vegan/Golosinas vegan/Golosinas-prestigios.webp",
    snickers: "assets/Imagenes/Golosinas vegan/Golosinas vegan/Golosinas-snickers.webp"
  };

  const PRODUCT_GRAPHICS = {
    caiti: "assets/Imagenes/Tortas/Aves/Aves-Caiti.png",
    chiricoca: "assets/Imagenes/Tortas/Aves/Aves-Chiricoca.png",
    chucao: "assets/Imagenes/Tortas/Aves/Aves-Chucao.png",
    garza_egretta: "assets/Imagenes/Tortas/Aves/Aves-Garza Egretta.png",
    parrot_cake: "assets/Imagenes/Tortas/Aves/Aves-Parrot cake.png",
    pequen: "assets/Imagenes/Tortas/Aves/Aves-Pequen.png",
    azahar: "assets/Imagenes/Tartas/Aves y flores/Aves y flores-azahar.png",
    chincol: "assets/Imagenes/Tartas/Aves y flores/Aves y flores-chincol.png",
    flamenca: "assets/Imagenes/Tartas/Aves y flores/Aves y flores-Flamenca.png",
    flor_de_cacao: "assets/Imagenes/Tartas/Aves y flores/Aves y flores-Flor de cacao.png",
    mirlo: "assets/Imagenes/Tartas/Aves y flores/Aves y flores-mirlo.png",
    neroli: "assets/Imagenes/Tartas/Aves y flores/Aves y flores-neroli.png",
    naranjazanahoria: "assets/Imagenes/quques/iconos queques/Queques-naranjazanahoria.png",
    naranja_zanahoria: "assets/Imagenes/quques/iconos queques/Queques-naranjazanahoria.png",
    manzanacanela: "assets/Imagenes/quques/iconos queques/Queques-manzanacanela.png",
    manzana_canela: "assets/Imagenes/quques/iconos queques/Queques-manzanacanela.png",
    platanoarandano: "assets/Imagenes/quques/iconos queques/Queques-arandanoplatano.png",
    platano_arandano: "assets/Imagenes/quques/iconos queques/Queques-arandanoplatano.png",
    arandano_platano: "assets/Imagenes/quques/iconos queques/Queques-arandanoplatano.png",
    curcuma: "assets/Imagenes/rawmesan/Rawmesan icon/Rawmesan icon-curcuma.png",
    merken: "assets/Imagenes/rawmesan/Rawmesan icon/Rawmesan icon-merken.png",
    oregano: "assets/Imagenes/rawmesan/Rawmesan icon/Rawmesan icon-oregano.png",
    romero: "assets/Imagenes/rawmesan/Rawmesan icon/Rawmesan icon-romero.png",
    blondies: "assets/Imagenes/Golosinas vegan/Golosinas vegan icono/Golosinas-blondies.png",
    brownies: "assets/Imagenes/Golosinas vegan/Golosinas vegan icono/Golosinas-brownies.png",
    chocman: "assets/Imagenes/Golosinas vegan/Golosinas vegan icono/Golosinas-chocman.png",
    medialunas: "assets/Imagenes/Golosinas vegan/Golosinas vegan icono/Golosinas-medialunas.png",
    pinguinitos: "assets/Imagenes/Golosinas vegan/Golosinas vegan icono/Golosinas-pinguinitos.png",
    prestigios: "assets/Imagenes/Golosinas vegan/Golosinas vegan icono/Golosinas-prestigios.png",
    snickers: "assets/Imagenes/Golosinas vegan/Golosinas vegan icono/Golosinas-snickers.png"
  };

  function cleanKey(value) { return String(value || "").trim().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, ""); }
  function clean(value) { return String(value || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); }
  function number(value) { return Number.parseFloat(String(value || "").replace(/[^\d,-]/g, "").replace(",", ".")) || 0; }
  function formatMoney(value) { return value ? new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(value) : ""; }
  function escapeHtml(value) { return String(value || "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;"); }
  function isFalseyValue(value) { return ["no", "false", "0", "oculto", "inactivo"].includes(String(value || "").toLowerCase().trim()); }
  function isVisible(row) { return ![row.disponible, row.activo].map((value) => String(value || "").toLowerCase().trim()).some((value) => ["no", "false", "0", "oculto", "inactivo"].includes(value)); }
  function personRange(value) { return String(value).replace(/\s*-\s*/g, " a "); }
  function productId(product) { return product.id || cleanKey(product.nombre || JSON.stringify(product)); }
  function solidColor(index) { return SOLID_COLORS[Math.abs(index) % SOLID_COLORS.length]; }
  function whatsappLink(text) { return `https://api.whatsapp.com/send?phone=${DEFAULT_WHATSAPP}&text=${encodeURIComponent(text)}`; }

  function keyedAsset(map, value) {
    const key = cleanKey(value);
    if (map[key]) return map[key];
    const compact = key.replaceAll("_", "");
    const found = Object.entries(map).find(([assetKey]) => key.includes(assetKey) || assetKey.includes(key) || compact.includes(assetKey.replaceAll("_", "")));
    return found ? found[1] : "";
  }

  function productImage(product) { return product.foto || keyedAsset(PRODUCT_IMAGES, product.nombre); }
  function productGraphic(product) { return keyedAsset(PRODUCT_GRAPHICS, product.nombre); }
  function productGraphicSide() { return "right"; }
  function productGraphicScale(product) {
    const category = clean(product.categoria);
    if (category.includes("golosina")) return "golosina";
    if (category.includes("tarta")) return "tarta";
    return "";
  }
  function productUsesDecoration(product) {
    const category = clean(product.categoria);
    return category.includes("torta") || category.includes("tarta");
  }

  async function fetchCsv(url) {
    const response = await fetch(url + "&t=" + Date.now(), { cache: "no-store" });
    const text = await response.text();
    if (!response.ok || text.trim().startsWith("<!DOCTYPE html")) throw new Error("no-publico");
    return text;
  }

  function parseCsv(text) {
    const rows = [];
    let row = [];
    let field = "";
    let quoted = false;
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const next = text[i + 1];
      if (char === '"' && quoted && next === '"') { field += '"'; i++; }
      else if (char === '"') quoted = !quoted;
      else if (char === "," && !quoted) { row.push(field); field = ""; }
      else if ((char === "\n" || char === "\r") && !quoted) {
        if (char === "\r" && next === "\n") i++;
        row.push(field);
        if (row.some(Boolean)) rows.push(row);
        row = [];
        field = "";
      } else field += char;
    }
    row.push(field);
    if (row.some(Boolean)) rows.push(row);
    if (!rows.length) return [];
    const headers = rows.shift().map(cleanKey);
    return rows.map((values) => Object.fromEntries(headers.map((header, index) => [header, (values[index] || "").trim()])));
  }

  function normalizeRow(row) {
    const aliases = {
      nombre: ["nombre", "producto", "torta", "nombre_torta", "nombre_formato"],
      descripcion: ["descripcion", "descripcion_corta", "detalle", "notas"],
      descripcion_poetica: ["descripcion_poetica", "poetica", "relato"],
      relleno: ["relleno", "rellenos"],
      bizcocho: ["bizcocho", "base"],
      cubierta: ["cubierta", "cobertura"],
      precio: ["precio", "precio_base", "precio_desde", "valor", "desde"],
      porciones: ["porciones", "personas", "formato", "nombre_formato", "tamano", "tamaño"],
      foto: ["foto", "foto_url", "imagen", "imagen_url", "url_imagen"],
      categoria: ["categoria", "tipo"],
      producto_id: ["producto_id", "id_producto", "product_id"],
      formato_id: ["formato_id", "id_formato", "format_id"],
      decoracion_predeterminada: ["decoracion_predeterminada", "decoracion_default", "descripcion_decoracion", "decoracion_descripcion", "detalle_decoracion"],
      disponible: ["disponible", "visible", "publicar"],
      activo: ["activo", "estado"]
    };
    const copy = { ...row };
    for (const [key, names] of Object.entries(aliases)) {
      const found = names.find((name) => row[name]);
      if (found) copy[key] = row[found];
    }
    return copy;
  }

  function formatsForProduct(state, product) {
    const id = cleanKey(productId(product));
    const category = cleanKey(product.categoria);
    const formats = state.formatos.filter((row) => cleanKey(row.categoria) === category);
    if (formats.length) return formats;
    return state.formatos.filter((row) => cleanKey(row.categoria) === id || cleanKey(row.id).startsWith(`${id}_`));
  }

  function specialPriceFor(state, product, format) {
    const productKey = cleanKey(productId(product));
    const formatKey = cleanKey(format.id);
    const row = state.precios_especiales.find((item) => {
      return cleanKey(item.producto_id || item.product_id || item.producto) === productKey
        && cleanKey(item.formato_id || item.format_id || item.formato) === formatKey
        && !isFalseyValue(item.disponible);
    });
    return number(row?.precio_especial || row?.precio_usado || row?.precio);
  }

  function priceForFormat(state, product, format) { return specialPriceFor(state, product, format) || number(format.precio); }

  function formatLabel(row, price) {
    const nombreClean = clean(row.nombre);
    const isPrecioUnico = nombreClean.includes("precio unico") || nombreClean.includes("precio único");
    const nombre = isPrecioUnico ? "Precio" : row.nombre;
    const persons = row.personas || row.porciones || "";
    const personsClean = clean(persons);
    let personsText = "";
    if (persons && !isPrecioUnico && personsClean !== nombreClean && !personsClean.includes("unico")) {
      const match = String(persons).match(/\d+/);
      personsText = match ? `${match[0]} personas` : personRange(persons);
    }
    return [nombre, personsText, price ? formatMoney(price) : ""].filter(Boolean).join(" · ");
  }

  function formatOptions(state, rows, product) {
    const base = number(product.precio || product.precio_desde);
    if (!rows.length) {
      const format = { id: "precio_unico", precio: base };
      const price = priceForFormat(state, product, format);
      const fallback = price ? `Precio · ${formatMoney(price)}` : "Precio";
      return `<option value="precio_unico" data-price="${price}" data-format-id="precio_unico">${escapeHtml(fallback)}</option>`;
    }
    if (rows.length === 1) {
      const price = priceForFormat(state, product, rows[0]);
      return `<option value="0" data-price="${price}" data-format-id="${escapeHtml(rows[0].id || "")}">${escapeHtml(formatLabel(rows[0], price))}</option>`;
    }
    return `<option value="" data-price="0">Elegir tamaño</option>` + rows.map((row, index) => {
      const price = priceForFormat(state, product, row);
      return `<option value="${index}" data-price="${price}" data-format-id="${escapeHtml(row.id || "")}">${escapeHtml(formatLabel(row, price))}</option>`;
    }).join("");
  }

  function defaultDecorationDescription(product) {
    return product.decoracion_predeterminada
      || `Decoración predeterminada de catálogo para ${product.nombre || "este producto"}: bizcocho ${product.bizcocho || "según catálogo"}, relleno ${product.relleno || "según catálogo"} y cubierta ${product.cubierta || "según catálogo"}.`;
  }

  function customDecorationDescription(state) {
    const row = state.decoraciones.find((item) => clean(item.nombre || item.categoria || item.id).includes("personaliz"));
    return row?.descripcion || row?.detalle || CUSTOM_DECORATION_DESCRIPTION;
  }

  function decorationOptions(state, product) {
    const defaultDescription = defaultDecorationDescription(product);
    const customDescription = customDecorationDescription(state);
    return [
      `<option value="" data-price="0" data-description="">Elegir decoración</option>`,
      `<option value="predeterminado" data-price="0" data-description="${escapeHtml(defaultDescription)}">Predeterminado</option>`,
      `<option value="personalizado" data-price="0" data-description="${escapeHtml(customDescription)}">Personalizado</option>`
    ].join("");
  }

  function cardTemplate(state, product, index) {
    const id = productId(product);
    const color = solidColor(index);
    const image = productImage(product);
    const graphic = productGraphic(product);
    const imageStyle = image ? `--media-image:url('${image}');` : "";
    const formats = formatsForProduct(state, product);
    const isFixedFormat = formats.length <= 1;
    const hasDecoration = productUsesDecoration(product);
    return `
      <article class="product-card" data-product="${escapeHtml(id)}" data-product-name="${escapeHtml(product.nombre || "Producto vegano")}">
        <button class="product-media" type="button" style="--solid-color:${escapeHtml(color)};${imageStyle}" aria-hidden="true" tabindex="-1">
          ${graphic ? `<img class="product-bird product-bird--${productGraphicSide()} ${productGraphicScale(product) ? `product-bird--${productGraphicScale(product)}` : ""}" src="${escapeHtml(graphic)}" alt="" aria-hidden="true" loading="lazy" />` : ""}
        </button>
        <div class="product-body">
          <h3>${escapeHtml(product.nombre || "Producto vegano")}</h3>
          <p>${escapeHtml(product.descripcion || product.descripcion_poetica || product.relleno || "Producto vegano a pedido.")}</p>
          <div class="quick-config">
            <select data-quick-format aria-label="Tamaño" class="${isFixedFormat ? "quick-format--fixed" : ""}" ${isFixedFormat ? "disabled" : ""}>${formatOptions(state, formats, product)}</select>
            ${hasDecoration ? `<select data-quick-decoration aria-label="Decoración">${decorationOptions(state, product)}</select><p class="option-help" data-decoration-help style="display:none"></p>` : ""}
            <p class="option-error" data-option-error aria-live="polite"></p>
            <div class="reserve-row">
              <button class="reserve-button" type="button" data-reserve>Reservar pedido</button>
            </div>
          </div>
        </div>
      </article>`;
  }

  function selectedQuick(select) {
    if (!select) return { label: "No aplica", price: 0, value: "", description: "" };
    const option = select.options[select.selectedIndex];
    return {
      label: option?.textContent || "Sin ajuste",
      price: number(option?.dataset.price),
      value: option?.value ?? "",
      description: option?.dataset.description || ""
    };
  }

  async function renderEmbeddedCatalog(container, categoryName, summaryContainer) {
    container.innerHTML = `<p style="text-align:center;color:var(--muted);grid-column:1/-1;">Cargando catálogo...</p>`;
    const state = { productos: [], formatos: [], precios_especiales: [], decoraciones: [] };
    await Promise.all(Object.entries(CSV_URLS).map(async ([name, url]) => {
      try {
        const text = await fetchCsv(url);
        state[name] = parseCsv(text).map(normalizeRow).filter(isVisible);
      } catch (error) {
        state[name] = [];
      }
    }));

    const products = state.productos.filter((product) => clean(product.categoria) === clean(categoryName));
    if (!products.length) {
      container.innerHTML = `<p style="text-align:center;color:var(--muted);grid-column:1/-1;">No pude cargar el catálogo en este momento. <a href="index.html?categoria=${encodeURIComponent(categoryName)}#catalogo">Ver catálogo completo</a>.</p>`;
      return;
    }

    container.innerHTML = products.map((product, index) => cardTemplate(state, product, index)).join("");

    container.querySelectorAll("[data-quick-decoration]").forEach((select) => {
      select.addEventListener("change", () => {
        const help = select.closest(".quick-config").querySelector("[data-decoration-help]");
        const description = select.options[select.selectedIndex]?.dataset.description || "";
        if (!help) return;
        help.textContent = description;
        help.style.display = description ? "" : "none";
      });
    });

    container.querySelectorAll("[data-reserve]").forEach((button) => {
      button.addEventListener("click", () => {
        const card = button.closest(".product-card");
        const product = products.find((item) => productId(item) === card.dataset.product);
        const formatSelect = card.querySelector("[data-quick-format]");
        const decorationSelect = card.querySelector("[data-quick-decoration]");
        const format = selectedQuick(formatSelect);
        const decoration = selectedQuick(decorationSelect);
        const errorEl = card.querySelector("[data-option-error]");
        if (format.value === "") { if (errorEl) errorEl.textContent = "Debes elegir un tamaño antes de reservar."; return; }
        if (productUsesDecoration(product) && decoration.value === "") { if (errorEl) errorEl.textContent = "Debes elegir una decoración antes de reservar."; return; }
        if (errorEl) errorEl.textContent = "";
        const pending = JSON.parse(localStorage.getItem("cocinalibre_pending_reservas") || "[]");
        pending.push({
          name: product.nombre || "Producto vegano",
          category: product.categoria || "Catálogo",
          bizcocho: product.bizcocho || "según catálogo",
          relleno: product.relleno || "según catálogo",
          cubierta: product.cubierta || "según catálogo",
          format: format.label,
          decoration: productUsesDecoration(product) ? decoration.label : "No aplica",
          decorationDescription: productUsesDecoration(product) ? decoration.description : "",
          total: format.price + decoration.price
        });
        localStorage.setItem("cocinalibre_pending_reservas", JSON.stringify(pending));
        window.location.href = "index.html#resumen";
      });
    });
  }

  window.renderEmbeddedCatalog = renderEmbeddedCatalog;
})();
