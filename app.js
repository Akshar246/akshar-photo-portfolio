(() => {
  const data = window.PORTFOLIO || { coverImage: "", photos: [] };
  const photos = Array.isArray(data.photos) ? data.photos : [];
  const grid = document.querySelector("#gallery-grid");
  const empty = document.querySelector("#empty-state");
  const filters = document.querySelector("#filters");
  const count = document.querySelector("#photo-count");
  const dialog = document.querySelector("#lightbox");
  const modalImage = document.querySelector("#lightbox-image");
  const modalCaption = document.querySelector("#lightbox-caption");
  const position = document.querySelector("#lightbox-position");
  const shareButton = document.querySelector("#share-button");
  let visiblePhotos = [...photos];
  let activeIndex = 0;

  if (data.coverImage) {
    const art = document.querySelector("#hero-art");
    const cover = document.querySelector("#cover-image");
    art.classList.add("has-cover");
    cover.src = data.coverImage;
    cover.alt = data.coverAlt || "Cover photograph from Akshar's personal archive.";
    cover.hidden = false;
    document.querySelector("#hero-art-empty").hidden = true;
  }

  const plural = n => `${n} ${n === 1 ? "photograph" : "photographs"}`;
  count.textContent = plural(photos.length);

  function makeCard(photo, index) {
    const article = document.createElement("article");
    article.className = "photo-card";
    const button = document.createElement("button");
    button.className = "photo-open";
    button.type = "button";
    button.setAttribute("aria-label", `Open photograph: ${photo.title || `Frame ${index + 1}`}`);
    const wrap = document.createElement("span");
    wrap.className = "photo-image-wrap";
    const image = document.createElement("img");
    image.src = photo.src;
    image.alt = photo.alt || "Photograph; add descriptive alt text in gallery.js.";
    image.loading = "lazy";
    image.decoding = "async";
    image.addEventListener("error", () => {
      wrap.classList.add("image-error");
      image.alt = `Image could not be loaded: ${photo.title || photo.src}`;
      image.removeAttribute("src");
      const message = document.createElement("span");
      message.className = "image-error-message";
      message.textContent = "Image unavailable — check its path in gallery.js.";
      wrap.append(message);
    }, { once: true });
    wrap.append(image);
    button.append(wrap);
    button.addEventListener("click", () => openLightbox(index));
    const caption = document.createElement("div");
    caption.className = "photo-caption";
    const title = document.createElement("p");
    title.className = "photo-title";
    title.textContent = photo.title || `Frame ${String(index + 1).padStart(2, "0")}`;
    const series = document.createElement("span");
    series.className = "photo-series";
    series.textContent = photo.series || "Photograph";
    caption.append(title, series);
    article.append(button, caption);
    if (photo.caption) {
      const note = document.createElement("p");
      note.className = "photo-note";
      note.textContent = photo.caption;
      article.append(note);
    }
    return article;
  }

  function render(items) {
    visiblePhotos = items;
    grid.replaceChildren(...items.map((photo, index) => makeCard(photo, index)));
    empty.hidden = items.length !== 0;
    count.textContent = plural(items.length);
  }

  function setFilter(series) {
    filters.querySelectorAll("button").forEach(button => {
      button.setAttribute("aria-pressed", String(button.dataset.series === series));
    });
    render(series === "all" ? photos : photos.filter(photo => photo.series === series));
  }

  const seriesNames = [...new Set(photos.map(photo => photo.series).filter(Boolean))];
  if (photos.length) {
    filters.hidden = false;
    const all = document.createElement("button");
    all.type = "button";
    all.className = "filter-button";
    all.textContent = "All frames";
    all.dataset.series = "all";
    all.setAttribute("aria-pressed", "true");
    all.addEventListener("click", () => setFilter("all"));
    filters.append(all);
    seriesNames.forEach(series => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "filter-button";
      button.textContent = series;
      button.dataset.series = series;
      button.setAttribute("aria-pressed", "false");
      button.addEventListener("click", () => setFilter(series));
      filters.append(button);
    });
  }
  render(photos);

  function openLightbox(index) {
    activeIndex = index;
    const photo = visiblePhotos[activeIndex];
    if (!photo) return;
    modalImage.src = photo.src;
    modalImage.alt = photo.alt || photo.title || "Photograph";
    modalCaption.textContent = [photo.title, photo.caption].filter(Boolean).join(" — ");
    position.textContent = `${String(activeIndex + 1).padStart(2, "0")} / ${String(visiblePhotos.length).padStart(2, "0")}`;
    if (typeof dialog.showModal === "function") dialog.showModal();
  }
  function moveLightbox(delta) {
    if (!visiblePhotos.length) return;
    activeIndex = (activeIndex + delta + visiblePhotos.length) % visiblePhotos.length;
    openLightbox(activeIndex);
  }
  document.querySelector("#lightbox-close").addEventListener("click", () => dialog.close());
  document.querySelector("#lightbox-prev").addEventListener("click", () => moveLightbox(-1));
  document.querySelector("#lightbox-next").addEventListener("click", () => moveLightbox(1));
  dialog.addEventListener("click", event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener("keydown", event => {
    if (event.key === "ArrowRight") moveLightbox(1);
    if (event.key === "ArrowLeft") moveLightbox(-1);
  });

  shareButton.addEventListener("click", async () => {
    const payload = { title: document.title, text: "A personal photography archive by Akshar.", url: window.location.href };
    const status = document.querySelector("#share-status");
    try {
      if (navigator.share) {
        await navigator.share(payload);
        status.textContent = "Share options opened.";
      } else if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(window.location.href);
        status.textContent = "Page link copied to clipboard.";
      } else {
        window.prompt("Copy this page link", window.location.href);
        status.textContent = "Copy the page link from the dialog.";
      }
    } catch (error) {
      if (error.name !== "AbortError") status.textContent = "Unable to open sharing options.";
    }
  });
})();
