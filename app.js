(function () {
  "use strict";

  const KEY_STATE = "rw_state_v1";
  const KEY_CUSTOM_SITES = "rw_custom_sites_v1";
  const KEY_RECENT = "rw_recent_v1";

  /**
   * Built-in allow-list.
   * You can edit this list, import custom sites in the UI,
   * or provide `sites-extra.txt` in the repo root for large lists.
   */
  const BUILTIN_SITES = [
    // Chinese / Zh sites (tagged with lang-zh for 偏向中文站点)
    { url: "https://zh.wikipedia.org/", name: "维基百科（中文）", tags: ["wiki", "education", "lang-zh"], safe: true },
    { url: "https://zh.wiktionary.org/", name: "维基词典（中文）", tags: ["wiki", "education", "lang-zh"], safe: true },
    { url: "https://www.zhihu.com/", name: "知乎", tags: ["social", "lang-zh"], safe: false },
    { url: "https://www.bilibili.com/", name: "哔哩哔哩", tags: ["video", "anime", "social", "lang-zh"], safe: false },
    { url: "https://bangumi.tv/", name: "Bangumi", tags: ["anime", "lang-zh"], safe: true },
    { url: "https://www.qidian.com/", name: "起点中文网", tags: ["novel", "lang-zh"], safe: true },
    { url: "https://www.jjwxc.net/", name: "晋江文学城", tags: ["novel", "lang-zh"], safe: true },
    { url: "https://weread.qq.com/", name: "微信读书", tags: ["novel", "education", "lang-zh"], safe: true },
    { url: "https://book.douban.com/", name: "豆瓣读书", tags: ["education", "lang-zh"], safe: true },
    { url: "https://www.people.com.cn/", name: "人民网", tags: ["news", "lang-zh"], safe: true },
    { url: "https://www.xinhuanet.com/", name: "新华网", tags: ["news", "lang-zh"], safe: true },
    { url: "https://www.thepaper.cn/", name: "澎湃新闻", tags: ["news", "lang-zh"], safe: true },
    { url: "https://www.solidot.org/", name: "Solidot", tags: ["news", "dev", "lang-zh"], safe: true },

    { url: "https://www.wikipedia.org/", name: "Wikipedia", tags: ["wiki", "education"], safe: true },
    { url: "https://www.wikidata.org/", name: "Wikidata", tags: ["wiki", "education"], safe: true },
    { url: "https://archive.org/", name: "Internet Archive", tags: ["education", "tools"], safe: true },
    { url: "https://www.britannica.com/", name: "Britannica", tags: ["education"], safe: true },
    { url: "https://www.khanacademy.org/", name: "Khan Academy", tags: ["education"], safe: true },
    { url: "https://ocw.mit.edu/", name: "MIT OpenCourseWare", tags: ["education"], safe: true },
    { url: "https://www.edx.org/", name: "edX", tags: ["education"], safe: true },
    { url: "https://arxiv.org/", name: "arXiv", tags: ["science"], safe: true },
    { url: "https://pubmed.ncbi.nlm.nih.gov/", name: "PubMed", tags: ["science"], safe: true },
    { url: "https://www.nasa.gov/", name: "NASA", tags: ["science"], safe: true },
    { url: "https://www.noaa.gov/", name: "NOAA", tags: ["science"], safe: true },
    { url: "https://www.nationalgeographic.com/", name: "National Geographic", tags: ["science", "news"], safe: true },
    { url: "https://www.bbc.com/", name: "BBC", tags: ["news"], safe: true },
    { url: "https://www.reuters.com/", name: "Reuters", tags: ["news"], safe: true },
    { url: "https://apnews.com/", name: "AP News", tags: ["news"], safe: true },
    { url: "https://www.theguardian.com/international", name: "The Guardian", tags: ["news"], safe: true },
    { url: "https://www.npr.org/", name: "NPR", tags: ["news"], safe: true },
    { url: "https://news.ycombinator.com/", name: "Hacker News", tags: ["news", "dev"], safe: true },
    { url: "https://developer.mozilla.org/", name: "MDN Web Docs", tags: ["dev", "education"], safe: true },
    { url: "https://www.github.com/", name: "GitHub", tags: ["dev", "tools"], safe: true },
    { url: "https://stackoverflow.com/", name: "Stack Overflow", tags: ["dev"], safe: true },
    { url: "https://www.openstreetmap.org/", name: "OpenStreetMap", tags: ["maps", "tools"], safe: true },
    { url: "https://earth.google.com/web/", name: "Google Earth (Web)", tags: ["maps"], safe: true },
    { url: "https://www.wolframalpha.com/", name: "Wolfram|Alpha", tags: ["tools", "education"], safe: true },
    { url: "https://www.desmos.com/calculator", name: "Desmos", tags: ["tools", "education"], safe: true },
    { url: "https://www.canva.com/", name: "Canva", tags: ["tools", "art"], safe: true },
    { url: "https://www.figma.com/", name: "Figma", tags: ["tools", "art"], safe: true },
    { url: "https://www.photopea.com/", name: "Photopea", tags: ["tools", "art"], safe: true },
    { url: "https://www.timeanddate.com/", name: "timeanddate", tags: ["tools"], safe: true },
    { url: "https://www.gutenberg.org/", name: "Project Gutenberg", tags: ["education"], safe: true },
    { url: "https://www.metmuseum.org/", name: "The Met", tags: ["art", "education"], safe: true },
    { url: "https://artsandculture.google.com/", name: "Google Arts & Culture", tags: ["art", "education"], safe: true },
    { url: "https://lichess.org/", name: "Lichess", tags: ["games"], safe: true },
    { url: "https://play2048.co/", name: "2048", tags: ["games"], safe: true },
    { url: "https://duckduckgo.com/", name: "DuckDuckGo", tags: ["search"], safe: true },
    { url: "https://www.ecosia.org/", name: "Ecosia", tags: ["search"], safe: true },
    { url: "https://www.gog.com/", name: "GOG", tags: ["games", "shopping"], safe: true },

    // Novels / Anime (global)
    { url: "https://www.royalroad.com/", name: "Royal Road", tags: ["novel"], safe: true },
    { url: "https://www.webnovel.com/", name: "Webnovel", tags: ["novel"], safe: true },
    { url: "https://myanimelist.net/", name: "MyAnimeList", tags: ["anime"], safe: true },
    { url: "https://anilist.co/", name: "AniList", tags: ["anime"], safe: true },
    { url: "https://www.crunchyroll.com/", name: "Crunchyroll", tags: ["anime", "video"], safe: true },

    // Marked not-safe for 安全模式, but still available when you disable 安全模式.
    { url: "https://www.reddit.com/", name: "Reddit", tags: ["social"], safe: false },
    { url: "https://x.com/", name: "X", tags: ["social"], safe: false },
    { url: "https://www.tiktok.com/", name: "TikTok", tags: ["social", "video"], safe: false },
    { url: "https://www.instagram.com/", name: "Instagram", tags: ["social"], safe: false }
  ];

  const DEFAULT_STATE = {
    safeMode: true,
    openInNewTab: true,
    confirmBeforeOpen: true,
    excludedTags: new Set(["adult", "gambling", "crypto", "torrent", "dating"]),
    includeCustomSites: true,
    treatCustomAsSafe: false,
    biasMode: "global", // "global" | "zh"
    categoryTags: new Set(),
    customSites: { sites: [] },
    recentUrls: [],
    extraSites: { sites: [] }
  };

  const ALL_EXCLUDABLE_TAGS = [
    { tag: "adult", label: "成人内容" },
    { tag: "gambling", label: "博彩" },
    { tag: "crypto", label: "加密货币" },
    { tag: "torrent", label: "下载/种子" },
    { tag: "dating", label: "交友/约会" },
    { tag: "social", label: "社交媒体" },
    { tag: "news", label: "新闻" }
  ];

  const CATEGORY_TAGS = [
    { tag: "novel", label: "小说" },
    { tag: "anime", label: "动漫" },
    { tag: "video", label: "视频" },
    { tag: "music", label: "音乐" },
    { tag: "games", label: "游戏" },
    { tag: "news", label: "新闻" },
    { tag: "education", label: "学习" },
    { tag: "science", label: "科学" },
    { tag: "tools", label: "工具" },
    { tag: "dev", label: "开发" },
    { tag: "art", label: "艺术" },
    { tag: "maps", label: "地图" },
    { tag: "shopping", label: "购物" }
  ];

  function el(tag, attrs = {}, children = []) {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
    for (const child of children) node.append(typeof child === "string" ? document.createTextNode(child) : child);
    return node;
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(KEY_STATE);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  function saveState(state) {
    try {
      localStorage.setItem(KEY_STATE, JSON.stringify(state));
    } catch {
      // ignore
    }
  }

  function loadCustomSites() {
    try {
      const raw = localStorage.getItem(KEY_CUSTOM_SITES);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      const sites = [];
      for (const item of parsed) {
        if (!item || typeof item !== "object") continue;
        const url = item.url;
        const name = item.name;
        const tags = item.tags;
        if (typeof url !== "string") continue;
        if (!isValidHttpUrl(url)) continue;
        sites.push({
          url,
          name: typeof name === "string" ? name : undefined,
          tags: Array.isArray(tags) ? tags.filter((t) => typeof t === "string") : ["custom"]
        });
      }
      return sites;
    } catch {
      return [];
    }
  }

  function saveCustomSites(sites) {
    try {
      const payload = sites.map((s) => ({ url: s.url, name: s.name, tags: s.tags ?? ["custom"] }));
      localStorage.setItem(KEY_CUSTOM_SITES, JSON.stringify(payload));
    } catch {
      // ignore
    }
  }

  function loadRecentUrls() {
    try {
      const raw = localStorage.getItem(KEY_RECENT);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed.filter((x) => typeof x === "string").slice(0, 50);
    } catch {
      return [];
    }
  }

  function pushRecentUrl(url, max = 20) {
    const current = loadRecentUrls();
    const next = [url, ...current.filter((u) => u !== url)].slice(0, max);
    try {
      localStorage.setItem(KEY_RECENT, JSON.stringify(next));
    } catch {
      // ignore
    }
    return next;
  }

  function parseUrlsFromText(text) {
    const lines = text.split(/\r?\n/g).map((l) => l.trim()).filter(Boolean);
    const sites = [];
    for (const line of lines) {
      const parsed = parseLine(line);
      if (!parsed) continue;
      sites.push(parsed);
    }

    const seen = new Set();
    const deduped = [];
    for (const s of sites) {
      if (seen.has(s.url)) continue;
      seen.add(s.url);
      deduped.push(s);
    }
    return deduped;
  }

  function parseLine(line) {
    const rawTokens = line.split(/\s+/g).filter(Boolean);
    const tags = [];
    let urlToken = null;

    for (const tok of rawTokens) {
      if (tok.startsWith("#")) {
        const t = normalizeTag(tok.slice(1));
        if (t) tags.push(t);
        continue;
      }
      if (!urlToken) urlToken = tok;
    }

    if (!urlToken) return null;
    const normalizedUrl = normalizeUrl(urlToken);
    if (!normalizedUrl) return null;
    return { url: normalizedUrl, tags: ["custom", ...tags] };
  }

  function normalizeTag(tag) {
    const t = String(tag).trim().toLowerCase();
    if (!t) return null;
    if (t === "zh" || t === "cn" || t === "中文" || t === "china") return "lang-zh";
    return t;
  }

  function normalizeUrl(input) {
    if (isValidHttpUrl(input)) return input;
    if (/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(input)) {
      const candidate = `https://${input}`;
      if (isValidHttpUrl(candidate)) return candidate;
    }
    return null;
  }

  function isValidHttpUrl(input) {
    try {
      const u = new URL(input);
      return u.protocol === "http:" || u.protocol === "https:";
    } catch {
      return false;
    }
  }

  function hasExcludedTag(site, excludedTags) {
    if (!site.tags) return false;
    for (const t of site.tags) if (excludedTags.has(t)) return true;
    return false;
  }

  function isSafeSite(site) {
    if (site.safe === true) return true;
    if (site.safe === false) return false;
    return false;
  }

  function matchesAnyRequiredTag(site, requiredAnyTags) {
    if (!requiredAnyTags || requiredAnyTags.size === 0) return true;
    if (!site.tags || site.tags.length === 0) return false;
    for (const t of site.tags) if (requiredAnyTags.has(t)) return true;
    return false;
  }

  function isChineseBiased(site) {
    if (site.tags?.includes("lang-zh")) return true;
    try {
      const u = new URL(site.url);
      return u.hostname.endsWith(".cn") || u.hostname.endsWith(".中国");
    } catch {
      return false;
    }
  }

  function pickRandomSite(sites, options) {
    const avoidUrls = options.avoidUrls ?? new Set();
    let candidates = sites.filter((s) => {
      if (options.safeMode && !isSafeSite(s)) return false;
      if (hasExcludedTag(s, options.excludedTags)) return false;
      if (avoidUrls.has(s.url)) return false;
      if (!matchesAnyRequiredTag(s, options.requiredAnyTags)) return false;
      return true;
    });

    if (options.biasMode === "zh") {
      const zh = candidates.filter(isChineseBiased);
      if (zh.length > 0) candidates = zh;
    }

    if (candidates.length === 0 && avoidUrls.size > 0) {
      candidates = sites.filter((s) => {
        if (options.safeMode && !isSafeSite(s)) return false;
        if (hasExcludedTag(s, options.excludedTags)) return false;
        if (!matchesAnyRequiredTag(s, options.requiredAnyTags)) return false;
        return true;
      });

      if (options.biasMode === "zh") {
        const zh = candidates.filter(isChineseBiased);
        if (zh.length > 0) candidates = zh;
      }
    }

    if (candidates.length === 0) return null;
    const idx = Math.floor(Math.random() * candidates.length);
    return candidates[idx] ?? null;
  }

  function segmentedButton(label, initialActive, onClick) {
    const btn = el("button", { class: `seg ${initialActive ? "active" : ""}`, type: "button" }, [label]);
    btn.addEventListener("click", onClick);
    return btn;
  }

  function setSegmentActive(container, activeIndex) {
    const buttons = Array.from(container.querySelectorAll("button.seg"));
    for (const [i, b] of buttons.entries()) {
      if (i === activeIndex) b.classList.add("active");
      else b.classList.remove("active");
    }
  }

  function toggleRow(label, desc, initial, onChange) {
    const input = /** @type {HTMLInputElement} */ (el("input", { type: "checkbox" }));
    input.checked = initial;
    input.addEventListener("change", () => onChange(input.checked));
    const row = el("label", { class: "row" }, [
      el("span", { class: "row-main" }, [
        el("span", { class: "row-title" }, [label]),
        el("span", { class: "row-desc muted" }, [desc])
      ]),
      el("span", { class: "row-control" }, [input])
    ]);
    return row;
  }

  function chipToggle(label, initial, onChange) {
    const id = `chip-${label}-${Math.random().toString(16).slice(2)}`;
    const input = /** @type {HTMLInputElement} */ (el("input", { type: "checkbox", id }));
    input.checked = initial;
    input.addEventListener("change", () => onChange(input.checked));
    const chip = el("label", { class: "chip", for: id }, [input, el("span", {}, [label])]);
    return chip;
  }

  function hydrateFromStorage(state) {
    const persisted = loadState();
    if (persisted) {
      state.safeMode = Boolean(persisted.safeMode);
      state.openInNewTab = Boolean(persisted.openInNewTab);
      state.confirmBeforeOpen = Boolean(persisted.confirmBeforeOpen);
      state.includeCustomSites = Boolean(persisted.includeCustomSites);
      state.treatCustomAsSafe = Boolean(persisted.treatCustomAsSafe);
      state.excludedTags = new Set(Array.isArray(persisted.excludedTags) ? persisted.excludedTags : []);
      state.biasMode = persisted.biasMode === "zh" ? "zh" : "global";
      state.categoryTags = new Set(Array.isArray(persisted.categoryTags) ? persisted.categoryTags : []);
    }
    state.customSites.sites = loadCustomSites();
    state.recentUrls = loadRecentUrls();
  }

  function persistState(state) {
    saveState({
      safeMode: state.safeMode,
      openInNewTab: state.openInNewTab,
      confirmBeforeOpen: state.confirmBeforeOpen,
      excludedTags: [...state.excludedTags],
      includeCustomSites: state.includeCustomSites,
      treatCustomAsSafe: state.treatCustomAsSafe,
      biasMode: state.biasMode,
      categoryTags: [...state.categoryTags]
    });
  }

  function getAllSites(state) {
    const base = [...BUILTIN_SITES, ...state.extraSites.sites];
    if (!state.includeCustomSites) return base;
    const customSites = state.customSites.sites.map((s) => ({
      ...s,
      safe: state.treatCustomAsSafe ? true : Boolean(s.safe)
    }));
    return [...base, ...customSites];
  }

  async function loadExtraSitesFromFile() {
    // Only works when hosted (http/https). `file://` cannot reliably fetch.
    if (location.protocol !== "http:" && location.protocol !== "https:") return [];
    try {
      // cache-bust so updates appear quickly after deploy
      const res = await fetch(`./sites-extra.txt?v=${Date.now()}`, { cache: "no-store" });
      if (!res.ok) return [];
      const text = await res.text();
      const parsed = parseUrlsFromText(text);
      // External lists default to `safe: true` so they work with 安全模式.
      // Use excluded tags (adult/gambling/etc) to control sensitive categories.
      return parsed.map((s) => ({ url: s.url, tags: s.tags ?? ["custom"], safe: true }));
    } catch {
      return [];
    }
  }

  function render(app) {
    const state = structuredClone(DEFAULT_STATE);
    hydrateFromStorage(state);

    const title = el("h1", {}, ["随机网站"]);
    const subtitle = el("p", { class: "muted" }, [
      "说明：不可能真的“随机进入这个世界上存在的任意一个网站”。这个项目会从一份站点库里随机抽取并打开；你也可以替换/扩展站点库。"
    ]);

    const lastPick = el("div", { class: "last-pick" }, [
      el("div", { class: "label" }, ["上次抽到："]),
      el("a", { class: "value", href: "#", rel: "noreferrer noopener" }, ["（还没有）"])
    ]);

    const controls = el("div", { class: "panel" }, []);

    const safeMode = toggleRow("安全模式（推荐）", "尽量使用更“可信/常见”的站点。", state.safeMode, (v) => {
      state.safeMode = v;
      persistState(state);
    });
    const confirmBeforeOpen = toggleRow("打开前确认", "先显示域名，再点一次确认打开。", state.confirmBeforeOpen, (v) => {
      state.confirmBeforeOpen = v;
      persistState(state);
    });
    const openInNewTab = toggleRow("新标签页打开", "避免把本页覆盖掉。", state.openInNewTab, (v) => {
      state.openInNewTab = v;
      persistState(state);
    });
    const includeCustom = toggleRow("包含自定义列表", "把你粘贴/导入的链接也纳入随机抽取。", state.includeCustomSites, (v) => {
      state.includeCustomSites = v;
      persistState(state);
    });
    const treatCustomAsSafe = toggleRow(
      "安全模式也允许自定义",
      "默认安全模式不会抽到自定义链接；打开此项后会允许。",
      state.treatCustomAsSafe,
      (v) => {
        state.treatCustomAsSafe = v;
        persistState(state);
      }
    );
    controls.append(safeMode, confirmBeforeOpen, openInNewTab, includeCustom, treatCustomAsSafe, el("hr"));

    controls.append(el("div", { class: "label" }, ["随机范围："]));
    const biasRow = el("div", { class: "segmented" }, []);
    const biasGlobal = segmentedButton("全网站点", state.biasMode === "global", () => {
      state.biasMode = "global";
      setSegmentActive(biasRow, 0);
      persistState(state);
    });
    const biasZh = segmentedButton("偏向中文站点", state.biasMode === "zh", () => {
      state.biasMode = "zh";
      setSegmentActive(biasRow, 1);
      persistState(state);
    });
    biasRow.append(biasGlobal, biasZh);
    setSegmentActive(biasRow, state.biasMode === "zh" ? 1 : 0);
    controls.append(biasRow);

    controls.append(el("div", { class: "label", style: "margin-top:12px" }, ["类别（可选）："]));
    const categories = el("div", { class: "chips" }, []);
    const allCatChip = chipToggle("全部", state.categoryTags.size === 0, (checked) => {
      if (checked) {
        state.categoryTags.clear();
        for (const node of categories.querySelectorAll("label.chip")) {
          const input = node.querySelector("input");
          if (input) input.checked = false;
        }
        const allInput = allCatChip.querySelector("input");
        if (allInput) allInput.checked = true;
        persistState(state);
      }
    });
    categories.append(allCatChip);
    for (const { tag, label } of CATEGORY_TAGS) {
      const chip = chipToggle(label, state.categoryTags.has(tag), (checked) => {
        const allInput = allCatChip.querySelector("input");
        if (checked) state.categoryTags.add(tag);
        else state.categoryTags.delete(tag);
        if (allInput) allInput.checked = state.categoryTags.size === 0;
        persistState(state);
      });
      categories.append(chip);
    }
    controls.append(categories);

    controls.append(
      el("div", { class: "muted small", style: "margin-top:8px" }, [
        "以后要加新类别：给站点打上新 tag 即可（例如在导入时写 ",
        el("code", {}, ["#novel"]),
        " / ",
        el("code", {}, ["#anime"]),
        "）。"
      ])
    );

    controls.append(el("hr"));

    controls.append(el("div", { class: "label" }, ["排除内容："]));
    const excludes = el("div", { class: "chips" }, []);
    for (const { tag, label } of ALL_EXCLUDABLE_TAGS) {
      const chip = chipToggle(label, state.excludedTags.has(tag), (checked) => {
        if (checked) state.excludedTags.add(tag);
        else state.excludedTags.delete(tag);
        persistState(state);
      });
      excludes.append(chip);
    }
    controls.append(excludes);

    controls.append(el("hr"));
    controls.append(el("div", { class: "label" }, ["自定义列表（每行一个网址/域名，可带 #tag）："]));
    const textarea = /** @type {HTMLTextAreaElement} */ (
      el("textarea", {
        class: "textarea",
        placeholder: "例如：\nhttps://example.com\n#novel #zh https://example.com\nnews.ycombinator.com"
      })
    );
    const customButtons = el("div", { class: "buttons" }, []);
    const importBtn = el("button", { class: "secondary", type: "button" }, ["导入到自定义列表"]);
    const clearBtn = el("button", { class: "ghost", type: "button" }, ["清空自定义列表"]);
    const customCount = el("div", { class: "muted small" }, []);
    function refreshCustomCount() {
      customCount.textContent = `自定义链接数：${state.customSites.sites.length}`;
    }
    refreshCustomCount();

    importBtn.addEventListener("click", () => {
      const parsed = parseUrlsFromText(textarea.value);
      if (parsed.length === 0) return;
      const merged = [...state.customSites.sites, ...parsed].reduce((acc, s) => {
        const existing = acc.find((x) => x.url === s.url);
        if (!existing) {
          acc.push(s);
          return acc;
        }
        const nextTags = new Set([...(existing.tags ?? []), ...(s.tags ?? [])]);
        existing.tags = [...nextTags];
        if (!existing.name && s.name) existing.name = s.name;
        return acc;
      }, []);
      state.customSites.sites = merged;
      saveCustomSites(state.customSites.sites);
      refreshCustomCount();
      textarea.value = "";
    });
    clearBtn.addEventListener("click", () => {
      state.customSites.sites = [];
      saveCustomSites([]);
      refreshCustomCount();
    });
    customButtons.append(importBtn, clearBtn);
    controls.append(textarea, customButtons, customCount);

    const primary = el("button", { class: "primary", type: "button" }, ["给我来一个随机网站"]);
    const secondary = el("button", { class: "secondary", type: "button" }, ["只随机一个链接（不打开）"]);
    const buttons = el("div", { class: "buttons" }, [primary, secondary]);

    const result = el("div", { class: "result" }, []);
    const resultTitle = el("div", { class: "label" }, ["本次抽到："]);
    const resultLink = el("a", { class: "value", href: "#", rel: "noreferrer noopener" }, ["—"]);
    const resultMeta = el("div", { class: "muted small" }, [""]);
    result.append(resultTitle, resultLink, resultMeta);

    const confirmRow = el("div", { class: "confirm-row hidden" }, []);
    const confirmBtn = el("button", { class: "primary", type: "button" }, ["确认打开"]);
    const cancelBtn = el("button", { class: "ghost", type: "button" }, ["取消"]);
    confirmRow.append(confirmBtn, cancelBtn);

    let pendingUrl = null;

    function updateLast(url, name) {
      const a = lastPick.querySelector("a");
      if (a) {
        a.textContent = name;
        a.setAttribute("href", url);
      }
    }

    function openUrl(url) {
      if (state.openInNewTab) window.open(url, "_blank", "noopener,noreferrer");
      else window.location.assign(url);
    }

    function pick(shouldOpen) {
      const allSites = getAllSites(state);
      const options = {
        safeMode: state.safeMode,
        excludedTags: state.excludedTags,
        avoidUrls: new Set(state.recentUrls),
        biasMode: state.biasMode,
        requiredAnyTags: state.categoryTags
      };
      const picked = pickRandomSite(allSites, options);
      if (!picked) {
        resultLink.textContent = "（没有符合条件的站点）";
        resultLink.setAttribute("href", "#");
        resultMeta.textContent = "请减少排除标签/类别，或关闭安全模式/中文偏向。";
        confirmRow.classList.add("hidden");
        pendingUrl = null;
        return;
      }

      resultLink.textContent = picked.name ?? picked.url;
      resultLink.setAttribute("href", picked.url);
      resultMeta.textContent = (picked.tags?.length ?? 0) > 0 ? `标签：${picked.tags.join(", ")}` : "标签：无";
      updateLast(picked.url, picked.name ?? picked.url);
      state.recentUrls = pushRecentUrl(picked.url, 20);

      if (!shouldOpen) {
        confirmRow.classList.add("hidden");
        pendingUrl = null;
        return;
      }

      if (state.confirmBeforeOpen) {
        pendingUrl = picked.url;
        confirmRow.classList.remove("hidden");
        return;
      }

      confirmRow.classList.add("hidden");
      pendingUrl = null;
      openUrl(picked.url);
    }

    primary.addEventListener("click", () => pick(true));
    secondary.addEventListener("click", () => pick(false));
    confirmBtn.addEventListener("click", () => {
      if (!pendingUrl) return;
      const url = pendingUrl;
      pendingUrl = null;
      confirmRow.classList.add("hidden");
      openUrl(url);
    });
    cancelBtn.addEventListener("click", () => {
      pendingUrl = null;
      confirmRow.classList.add("hidden");
    });

    const footer = el("p", { class: "footer muted" }, [
      "内置站点 ",
      String(BUILTIN_SITES.length),
      " 个；外部站点 ",
      el("span", { id: "extra-count" }, [String(state.extraSites.sites.length)]),
      " 个；自定义站点 ",
      String(state.customSites.sites.length),
      " 个。"
    ]);

    app.append(title, subtitle, lastPick, controls, buttons, result, confirmRow, footer);

    // Load large external lists from `sites-extra.txt` (hosted only).
    loadExtraSitesFromFile().then((extra) => {
      if (!Array.isArray(extra) || extra.length === 0) return;
      // Merge & de-dupe against builtin/custom by url.
      const seen = new Set(BUILTIN_SITES.map((s) => s.url));
      for (const s of state.customSites.sites) seen.add(s.url);
      const merged = [];
      for (const s of extra) {
        if (!s?.url || typeof s.url !== "string") continue;
        if (seen.has(s.url)) continue;
        seen.add(s.url);
        merged.push(s);
      }
      state.extraSites.sites = merged;
      const node = footer.querySelector("#extra-count");
      if (node) node.textContent = String(state.extraSites.sites.length);
    });
  }

  const app = document.querySelector("#app");
  if (!app) return;
  render(app);
})();

