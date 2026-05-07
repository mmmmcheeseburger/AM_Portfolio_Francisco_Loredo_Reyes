/* =========================
   Reveal animations (cards/projects/docs)
========================= */
const revealTargets = document.querySelectorAll(".card, .project, .doc-card");

const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add("show");
    });
  },
  { threshold: 0.12 }
);

revealTargets.forEach((el) => io.observe(el));

/* =========================
   Active nav highlight based on file name
========================= */
(function setActiveNav() {
  const path = (
    location.pathname.split("/").pop() || "index.html"
  ).toLowerCase();

  document.querySelectorAll(".nav-links a").forEach((a) => {
    const href = (a.getAttribute("href") || "").toLowerCase();

    if (href === path) {
      a.classList.add("active");
    }
  });
})();

/* =========================
   Projects page helper
   - Disables placeholder links
   - Optional copy-link buttons
========================= */
(function projectsHelper() {
  // Disable placeholder project links so you don't get dead buttons
  const linkButtons = document.querySelectorAll("a.btn[href]");

  linkButtons.forEach((a) => {
    const href = (a.getAttribute("href") || "").trim();

    // If user left placeholder text, make it disabled
    const isPlaceholder =
      href === "" ||
      href === "#" ||
      href.includes("your-live-link") ||
      href.includes("your-weather-live-link") ||
      href.includes("your-card-live-link") ||
      href.includes("your-download-link") ||
      href.includes("github.com/your-") ||
      href.includes("your-repo") ||
      href.includes("your-");

    if (isPlaceholder) {
      a.classList.add("btn-disabled");
      a.setAttribute("aria-disabled", "true");
      a.removeAttribute("target");
      a.removeAttribute("rel");
      a.addEventListener("click", (e) => e.preventDefault());
      a.title = "Paste your real link here first";
    }
  });

  // Optional: Copy link buttons
  // Example:
  // <button class="btn btn-ghost" data-copy="https://example.com">Copy Link</button>
  const copyBtns = document.querySelectorAll("[data-copy]");

  copyBtns.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const url = btn.getAttribute("data-copy") || "";
      if (!url) return;

      try {
        await navigator.clipboard.writeText(url);

        const old = btn.textContent;
        btn.textContent = "Copied ✅";

        setTimeout(() => {
          btn.textContent = old;
        }, 900);
      } catch (err) {
        const old = btn.textContent;
        btn.textContent = "Copy failed";

        setTimeout(() => {
          btn.textContent = old;
        }, 900);
      }
    });
  });
})();

/* =========================
   Files page logic
   - Drag/drop
   - Remembers file names in browser
========================= */
(function filesPage() {
  const dz = document.getElementById("dropzone");
  const input = document.getElementById("fileInput");
  const list = document.getElementById("fileList");
  const clearBtn = document.getElementById("clearFiles");

  if (!dz || !input || !list) return;

  const KEY = "portfolio_uploaded_files_v1";

  const load = () => {
    try {
      return JSON.parse(localStorage.getItem(KEY) || "[]");
    } catch {
      return [];
    }
  };

  const save = (arr) => {
    localStorage.setItem(KEY, JSON.stringify(arr));
  };

  const render = () => {
    const files = load();
    list.innerHTML = "";

    if (files.length === 0) {
      list.innerHTML = `
        <div class="small">
          No files saved yet. Drop something in here and it’ll show up.
        </div>
      `;
      return;
    }

    files.forEach((f, idx) => {
      const row = document.createElement("div");
      row.className = "file-item";

      row.innerHTML = `
        <div>
          <div class="name">${f.name}</div>
          <div class="meta">${f.size} • ${f.type || "file"}</div>
        </div>
        <button class="btn" data-del="${idx}">Remove</button>
      `;

      list.appendChild(row);
    });

    list.querySelectorAll("[data-del]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const i = Number(btn.getAttribute("data-del"));
        const files = load();

        files.splice(i, 1);
        save(files);
        render();
      });
    });
  };

  const addFiles = (fileList) => {
    const current = load();

    [...fileList].forEach((file) => {
      current.push({
        name: file.name,
        size: `${Math.round(file.size / 1024)} KB`,
        type: file.type,
      });
    });

    save(current);
    render();
  };

  dz.addEventListener("click", () => {
    input.click();
  });

  input.addEventListener("change", () => {
    if (input.files?.length) {
      addFiles(input.files);
    }

    input.value = "";
  });

  ["dragenter", "dragover"].forEach((evt) => {
    dz.addEventListener(evt, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dz.classList.add("dragover");
    });
  });

  ["dragleave", "drop"].forEach((evt) => {
    dz.addEventListener(evt, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dz.classList.remove("dragover");
    });
  });

  dz.addEventListener("drop", (e) => {
    if (e.dataTransfer?.files?.length) {
      addFiles(e.dataTransfer.files);
    }
  });

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      localStorage.removeItem(KEY);
      render();
    });
  }

  render();
})();

/* =========================
   Gmail copy button
========================= */
function copyGmail() {
  const gmail = "franciscojlr859@gmail.com";
  const message = document.getElementById("copyMessage");

  navigator.clipboard
    .writeText(gmail)
    .then(function () {
      if (message) {
        message.textContent = "Gmail copied!";
      }

      setTimeout(function () {
        if (message) {
          message.textContent = "";
        }
      }, 2000);
    })
    .catch(function () {
      if (message) {
        message.textContent = "Copy failed";
      }

      setTimeout(function () {
        if (message) {
          message.textContent = "";
        }
      }, 2000);
    });
}
