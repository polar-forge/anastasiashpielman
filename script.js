/* ============================================================
   Anastasia Skibunova-Shpielman — interactions
   Plain JS · no libraries
   ============================================================ */
(function () {
  "use strict";

  var header = document.getElementById("site-header");
  var navToggle = document.getElementById("nav-toggle");
  var mobileMenu = document.getElementById("mobile-menu");
  var yearEl = document.getElementById("year");

  /* ---------- Footer year ---------- */
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* YouTube blocks embedded players on file:// (Error 153 — no Referer).
     Over http(s) we layer the muted showreel over the poster; on file://
     the cinematic poster stays and video links open on youtube.com. */
  var isFile =
    location.protocol === "file:" ||
    (typeof location.hostname === "string" &&
      location.hostname === "" &&
      location.protocol !== "http:" &&
      location.protocol !== "https:");

  if (!isFile) {
    var heroMedia = document.querySelector(".hero-media");
    if (heroMedia) {
      var heroIframe = document.createElement("iframe");
      heroIframe.className = "hero-video";
      heroIframe.src =
        "https://www.youtube.com/embed/flLK3WEtlb0?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&loop=1&playlist=flLK3WEtlb0&playsinline=1&modestbranding=1";
      heroIframe.title = "Acting Showreel of Anastasia Skibunova";
      heroIframe.setAttribute("frameborder", "0");
      heroIframe.setAttribute(
        "allow",
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      );
      heroIframe.setAttribute("allowfullscreen", "");
      heroIframe.addEventListener("load", function () {
        heroIframe.classList.add("is-ready");
      });
      heroMedia.insertBefore(heroIframe, heroMedia.firstChild);
    }
  }

  /* ---------- Header scroll state + progress bar + hero parallax ---------- */
  var progressBar = document.getElementById("scroll-progress");
  var heroContent = document.querySelector(".hero-content");
  var heroSection = document.querySelector(".hero");
  var reduceMotion = false;
  try {
    reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch (e) {}

  function onScroll() {
    var y = window.scrollY;
    if (header) header.classList.toggle("is-scrolled", y > 24);

    if (progressBar) {
      var doc = document.documentElement;
      var max = doc.scrollHeight - doc.clientHeight;
      var p = max > 0 ? y / max : 0;
      progressBar.style.transform = "scaleX(" + p + ")";
    }

    if (!reduceMotion && heroContent && heroSection) {
      var h = heroSection.offsetHeight || window.innerHeight;
      if (y < h) {
        heroContent.style.transform = "translateY(" + y * 0.22 + "px)";
        heroContent.style.opacity = String(Math.max(0, 1 - y / (h * 0.72)));
      }
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  function closeMenu() {
    if (!navToggle || !mobileMenu) return;
    navToggle.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
    mobileMenu.classList.remove("is-open");
    document.body.classList.remove("menu-open");
    // keep hidden in sync after fade-out
    window.setTimeout(function () {
      if (!mobileMenu.classList.contains("is-open")) mobileMenu.hidden = true;
    }, 400);
  }

  function openMenu() {
    navToggle.classList.add("is-open");
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", "Close menu");
    mobileMenu.hidden = false;
    // force reflow so transition runs
    void mobileMenu.offsetWidth;
    mobileMenu.classList.add("is-open");
    document.body.classList.add("menu-open");
  }

  if (navToggle && mobileMenu) {
    navToggle.addEventListener("click", function () {
      if (mobileMenu.classList.contains("is-open")) closeMenu();
      else openMenu();
    });

    mobileMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    // close menu if viewport grows to desktop width
    window.addEventListener("resize", function () {
      if (window.innerWidth > 860 && mobileMenu.classList.contains("is-open")) {
        closeMenu();
      }
    });
  }

  /* ---------- Scroll spy (desktop nav) ---------- */
  var sections = document.querySelectorAll("main section[id]");
  var navLinks = document.querySelectorAll(".nav-desktop a");

  if ("IntersectionObserver" in window && sections.length && navLinks.length) {
    var spyObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var id = entry.target.getAttribute("id");
          navLinks.forEach(function (link) {
            link.classList.toggle(
              "is-active",
              link.getAttribute("href") === "#" + id
            );
          });
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );
    sections.forEach(function (sec) {
      spyObserver.observe(sec);
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var revealObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ---------- Gallery items: staggered rise ---------- */
  var galleryItems = document.querySelectorAll(".gallery-item");
  if ("IntersectionObserver" in window && galleryItems.length && !reduceMotion) {
    var galleryObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -4% 0px", threshold: 0.05 }
    );
    galleryItems.forEach(function (item, i) {
      item.style.transitionDelay = (i % 4) * 0.08 + "s";
      galleryObserver.observe(item);
    });
  } else {
    galleryItems.forEach(function (item) {
      item.classList.add("is-visible");
    });
  }

  /* ---------- Video thumbnails: fallback + lazy embed ---------- */
  document.querySelectorAll(".video-thumb img").forEach(function (img) {
    img.addEventListener("error", function () {
      // maxresdefault missing → try standard HQ thumbnail
      var src = img.getAttribute("src") || "";
      if (src.indexOf("maxresdefault") !== -1 && !img.dataset.fallback) {
        img.dataset.fallback = "1";
        img.src = src.replace("maxresdefault", "hqdefault");
      }
    });
  });

  document.querySelectorAll(".video-card[data-embed]").forEach(function (card) {
    card.addEventListener("click", function (e) {
      // let modified clicks / open-in-new-tab pass through
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      // on file:// embeds are blocked by YouTube → navigate to youtube.com instead
      if (isFile) return;
      e.preventDefault();

      var embed = card.getAttribute("data-embed");
      var thumb = card.querySelector(".video-thumb");
      if (!embed || !thumb) return;

      // replace thumbnail with playing iframe
      var iframe = document.createElement("iframe");
      iframe.src = embed;
      iframe.title = (card.querySelector(".video-title") || {}).textContent || "Video player";
      iframe.allow =
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      iframe.allowFullscreen = true;
      iframe.setAttribute("frameborder", "0");

      thumb.innerHTML = "";
      thumb.appendChild(iframe);
    });
  });

  /* ---------- Gallery lightbox ---------- */
  var galleryLinks = Array.prototype.slice.call(
    document.querySelectorAll("#gallery-grid a[href]")
  );
  var lightbox = document.getElementById("lightbox");
  var lbImg = document.getElementById("lightbox-img");
  var lbCaption = document.getElementById("lightbox-caption");
  var lbCounter = document.getElementById("lightbox-counter");
  var lbClose = document.getElementById("lightbox-close");
  var lbPrev = document.getElementById("lightbox-prev");
  var lbNext = document.getElementById("lightbox-next");

  var currentIndex = 0;
  var touchStartX = 0;
  var touchStartY = 0;

  function pad(n) {
    return n < 10 ? "0" + n : String(n);
  }

  function render(index) {
    if (!galleryLinks.length || !lbImg) return;
    currentIndex = (index + galleryLinks.length) % galleryLinks.length;
    var link = galleryLinks[currentIndex];
    var img = link.querySelector("img");

    lbImg.style.animation = "none";
    void lbImg.offsetWidth; // restart animation
    lbImg.style.animation = "";

    lbImg.src = link.getAttribute("href");
    lbImg.alt = img ? img.alt : "";
    if (lbCaption) {
      lbCaption.textContent = img ? img.alt : "";
    }
    if (lbCounter) {
      lbCounter.textContent = pad(currentIndex + 1) + " / " + pad(galleryLinks.length);
    }
  }

  function openLightbox(index) {
    if (!lightbox) return;
    lightbox.hidden = false;
    void lightbox.offsetWidth;
    lightbox.classList.add("is-open");
    document.body.classList.add("lightbox-open");
    render(index);
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("is-open");
    document.body.classList.remove("lightbox-open");
    window.setTimeout(function () {
      if (!lightbox.classList.contains("is-open")) {
        lightbox.hidden = true;
        if (lbImg) lbImg.src = "";
      }
    }, 350);
  }

  galleryLinks.forEach(function (link, i) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      openLightbox(i);
    });
  });

  if (lbClose) lbClose.addEventListener("click", closeLightbox);
  if (lbPrev)
    lbPrev.addEventListener("click", function () {
      render(currentIndex - 1);
    });
  if (lbNext)
    lbNext.addEventListener("click", function () {
      render(currentIndex + 1);
    });

  if (lightbox) {
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });

    // swipe support
    lightbox.addEventListener(
      "touchstart",
      function (e) {
        var t = e.changedTouches[0];
        touchStartX = t.screenX;
        touchStartY = t.screenY;
      },
      { passive: true }
    );

    lightbox.addEventListener(
      "touchend",
      function (e) {
        var t = e.changedTouches[0];
        var dx = t.screenX - touchStartX;
        var dy = t.screenY - touchStartY;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
          if (dx < 0) render(currentIndex + 1);
          else render(currentIndex - 1);
        }
      },
      { passive: true }
    );
  }

  /* ---------- Keyboard ---------- */
  document.addEventListener("keydown", function (e) {
    // lightbox
    if (lightbox && lightbox.classList.contains("is-open")) {
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowRight") render(currentIndex + 1);
      else if (e.key === "ArrowLeft") render(currentIndex - 1);
      return;
    }
    // mobile menu
    if (e.key === "Escape" && mobileMenu && mobileMenu.classList.contains("is-open")) {
      closeMenu();
      if (navToggle) navToggle.focus();
    }
  });
})();
