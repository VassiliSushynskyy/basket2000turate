/**
 * Effetto Lente di Ingrandimento (Magnifier) + Zoom Modal per l'immagine
 */
document.addEventListener("DOMContentLoaded", function () {
    const img = document.getElementById("orariImg");
    if (!img) return;

    const zoomLevel = 2.4;
    const glassSize = 170;

    // Crea l'elemento lente
    const glass = document.createElement("div");
    glass.className = "img-magnifier-glass";
    glass.style.width = glassSize + "px";
    glass.style.height = glassSize + "px";
    img.parentElement.appendChild(glass);

    // Imposta immagine di sfondo della lente
    function updateGlassBackground() {
        glass.style.backgroundImage = `url('${img.currentSrc || img.src}')`;
        glass.style.backgroundRepeat = "no-repeat";
        const w = img.offsetWidth;
        const h = img.offsetHeight;
        glass.style.backgroundSize = `${w * zoomLevel}px ${h * zoomLevel}px`;
    }

    if (img.complete) {
        updateGlassBackground();
    } else {
        img.addEventListener("load", updateGlassBackground);
    }

    function getCursorPos(e) {
        const rect = img.getBoundingClientRect();
        let clientX = e.clientX;
        let clientY = e.clientY;

        if (e.touches && e.touches.length > 0) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        }

        let x = clientX - rect.left;
        let y = clientY - rect.top;

        x = Math.max(0, Math.min(x, rect.width));
        y = Math.max(0, Math.min(y, rect.height));

        return { x, y, width: rect.width, height: rect.height };
    }

    function moveMagnifier(e) {
        const pos = getCursorPos(e);
        const halfW = glassSize / 2;
        const halfH = glassSize / 2;

        glass.style.left = `${pos.x - halfW}px`;
        glass.style.top = `${pos.y - halfH}px`;

        const bgX = (pos.x * zoomLevel) - halfW;
        const bgY = (pos.y * zoomLevel) - halfH;

        glass.style.backgroundPosition = `-${bgX}px -${bgY}px`;
    }

    let isInside = false;

    function onEnter(e) {
        isInside = true;
        updateGlassBackground();
        glass.style.display = "block";
        requestAnimationFrame(() => {
            if (isInside) glass.style.opacity = "1";
        });
        moveMagnifier(e);
    }

    function onLeave() {
        isInside = false;
        glass.style.opacity = "0";
        setTimeout(() => {
            if (!isInside) glass.style.display = "none";
        }, 200);
    }

    img.parentElement.addEventListener("mouseenter", onEnter);
    img.parentElement.addEventListener("mousemove", moveMagnifier);
    img.parentElement.addEventListener("mouseleave", onLeave);

    // Supporto Touch per tablet / smartphone
    img.parentElement.addEventListener("touchstart", function (e) {
        onEnter(e);
    }, { passive: true });

    img.parentElement.addEventListener("touchmove", function (e) {
        moveMagnifier(e);
    }, { passive: true });

    img.parentElement.addEventListener("touchend", onLeave);
    window.addEventListener("resize", updateGlassBackground);

    // Modal Zoom al click per visualizzazione a schermo intero
    const modal = document.createElement("div");
    modal.className = "magnifier-modal";
    modal.innerHTML = `
        <div class="magnifier-modal-backdrop"></div>
        <div class="magnifier-modal-content">
            <button class="magnifier-modal-close" type="button" aria-label="Chiudi">&times;</button>
            <img src="${img.currentSrc || img.src}" alt="${img.alt}">
        </div>
    `;
    document.body.appendChild(modal);

    const closeBtn = modal.querySelector(".magnifier-modal-close");
    const backdrop = modal.querySelector(".magnifier-modal-backdrop");

    function openModal() {
        modal.classList.add("is-open");
        document.body.style.overflow = "hidden";
    }

    function closeModal() {
        modal.classList.remove("is-open");
        document.body.style.overflow = "";
    }

    img.addEventListener("click", openModal);
    closeBtn.addEventListener("click", closeModal);
    backdrop.addEventListener("click", closeModal);
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && modal.classList.contains("is-open")) {
            closeModal();
        }
    });
});
