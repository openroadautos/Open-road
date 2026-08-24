(function () {
  const cfg = window.OPENROAD_SUPABASE || {};
  const hasConfig = Boolean(cfg.url && cfg.anonKey && window.supabase);
  const grid = document.querySelector("[data-openroad-inventory-grid]");
  const detailRoot = document.querySelector("[data-openroad-vehicle-detail]");
  const adminRoot = document.querySelector("[data-openroad-admin]");

  const money = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
  const miles = new Intl.NumberFormat("en-US");

  function client() {
    if (!hasConfig) return null;
    return window.supabase.createClient(cfg.url, cfg.anonKey, {
      auth: { persistSession: true, autoRefreshToken: true },
    });
  }

  function bodyCategory(bodyType) {
    const b = String(bodyType || "").toLowerCase();
    if (b.includes("truck")) return "truck";
    if (b.includes("van")) return "van";
    if (b.includes("suv")) return "suv";
    if (b.includes("sedan") || b.includes("car") || b.includes("coupe")) return "car";
    return "all";
  }

  function titleFor(v) {
    return [v.year, v.make, v.model, v.trim].filter(Boolean).join(" ");
  }

  function imageFor(v) {
    return v.primary_image || (Array.isArray(v.images) && v.images[0]) || "/assets/logo.png";
  }

  function vehicleCard(v, index) {
    const category = bodyCategory(v.body_type);
    const delay = index % 3 === 1 ? " reveal-delay-1" : index % 3 === 2 ? " reveal-delay-2" : "";
    const href = `/inventory/vehicle.html?stock=${encodeURIComponent(v.stock_number)}`;
    return `
      <article class="vehicle-card reveal visible${delay}" data-category="${category}">
        <a href="${href}">
          <div class="vc-img"><span class="vc-fee-sticker">Zero Fees</span><img src="${imageFor(v)}" alt="${titleFor(v)}" loading="lazy"></div>
          <div class="vc-body">
            <div class="vc-make">${escapeHtml(v.make || "")}</div>
            <div class="vc-name">${escapeHtml(v.model || "")}<br><small style="font-size:1rem;opacity:.6">${escapeHtml(`${v.year || ""} · ${v.trim || v.body_type || ""}`)}</small></div>
            <div class="vc-specs">
              <span class="vc-spec">${miles.format(Number(v.mileage || 0))} mi</span>
              <span class="vc-spec">${escapeHtml(v.transmission || "Automatic")}</span>
              <span class="vc-spec">${escapeHtml(v.fuel_type || "Gasoline")}</span>
            </div>
            <div class="vc-price"><strong>${money.format(Number(v.price || 0))}</strong><span>plus taxes only</span></div>
            <div class="vc-cta"><span class="btn btn-gold" style="flex:1;font-size:.72rem">View Details</span></div>
          </div>
        </a>
      </article>
    `;
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (c) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    }[c]));
  }

  async function fetchVehicles(sb) {
    const { data, error } = await sb
      .from("openroad_vehicles")
      .select("*, images:openroad_vehicle_images(url, sort_order, is_primary)")
      .eq("status", "available")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data || []).map((v) => {
      const images = (v.images || []).slice().sort((a, b) => {
        if (a.is_primary !== b.is_primary) return a.is_primary ? -1 : 1;
        return (a.sort_order || 0) - (b.sort_order || 0);
      });
      return { ...v, images: images.map((i) => i.url), primary_image: images[0]?.url || "" };
    });
  }

  async function renderInventory() {
    if (!grid || !hasConfig) return;
    const sb = client();
    try {
      const vehicles = await fetchVehicles(sb);
      if (!vehicles.length) return;
      grid.innerHTML = vehicles.map(vehicleCard).join("");
      window.dispatchEvent(new CustomEvent("openroad:inventory-rendered"));
    } catch (error) {
      console.warn("[openroad] live inventory unavailable; using static fallback", error);
    }
  }

  async function renderDetail() {
    if (!detailRoot) return;
    if (!hasConfig) {
      detailRoot.innerHTML = `<div class="admin-notice">Supabase is not configured yet. Add your project URL and anon key in <code>/assets/openroad-config.js</code>.</div>`;
      return;
    }

    const stock = new URLSearchParams(location.search).get("stock");
    if (!stock) {
      detailRoot.innerHTML = `<h1>Vehicle not found.</h1><p>Missing stock number.</p>`;
      return;
    }

    const sb = client();
    const { data, error } = await sb
      .from("openroad_vehicles")
      .select("*, images:openroad_vehicle_images(url, sort_order, is_primary)")
      .eq("stock_number", stock)
      .single();

    if (error || !data) {
      detailRoot.innerHTML = `<h1>Vehicle not found.</h1><p>This vehicle may have been sold or removed.</p>`;
      return;
    }

    const images = (data.images || []).slice().sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    detailRoot.innerHTML = `
      <div class="detail-dynamic-grid">
        <div>
          <div class="detail-main-img"><img src="${escapeHtml(images[0]?.url || "/assets/logo.png")}" alt="${escapeHtml(titleFor(data))}"></div>
          <div class="detail-thumbs">${images.slice(1, 6).map((img) => `<img src="${escapeHtml(img.url)}" alt="">`).join("")}</div>
        </div>
        <div class="detail-panel">
          <span class="eyebrow">Stock #${escapeHtml(data.stock_number)}</span>
          <h1>${escapeHtml(titleFor(data))}</h1>
          <div class="detail-price">${money.format(Number(data.price || 0))}</div>
          <div class="detail-spec-list">
            <span>${miles.format(Number(data.mileage || 0))} mi</span>
            <span>${escapeHtml(data.body_type || "")}</span>
            <span>${escapeHtml(data.transmission || "")}</span>
            <span>${escapeHtml(data.fuel_type || "")}</span>
          </div>
          <p>${escapeHtml(data.description || "Contact OpenRoad Auto Group for details on this vehicle.")}</p>
          <div class="cta-actions">
            <a href="tel:+13055465509" class="btn btn-gold">Call 305 546 5509</a>
            <a href="/contact/" class="btn btn-outline">Ask a Question</a>
          </div>
        </div>
      </div>
    `;
  }

  async function renderAdmin() {
    if (!adminRoot) return;
    if (!hasConfig) {
      adminRoot.innerHTML = setupMessage();
      return;
    }

    const sb = client();
    const { data: sessionData } = await sb.auth.getSession();
    if (!sessionData.session) {
      adminRoot.innerHTML = loginForm();
      bindLogin(sb);
      return;
    }

    try {
      await renderAdminDashboard(sb);
    } catch (error) {
      adminRoot.innerHTML = `
        <div class="admin-card">
          <span class="eyebrow">Admin Error</span>
          <h1>Inventory could not load.</h1>
          <p>${escapeHtml(error.message || "Check Supabase tables and permissions, then refresh.")}</p>
          <button class="btn btn-outline" data-admin-signout>Sign Out</button>
        </div>
      `;
      document.querySelector("[data-admin-signout]")?.addEventListener("click", async () => {
        await sb.auth.signOut();
        await renderAdmin();
      });
    }
  }

  function setupMessage() {
    return `
      <div class="admin-card">
        <span class="eyebrow">Setup Needed</span>
        <h1>Connect Supabase first.</h1>
        <p>Add your Supabase URL and anon key in <code>/assets/openroad-config.js</code>, then run <code>supabase/openroad_admin.sql</code> in Supabase SQL editor.</p>
      </div>
    `;
  }

  function loginForm() {
    return `
      <form class="admin-card admin-form" data-admin-login>
        <span class="eyebrow">OpenRoad Admin</span>
        <h1>Inventory login.</h1>
        <label>Email<input name="email" type="email" required autocomplete="email"></label>
        <label>Password<input name="password" type="password" required autocomplete="current-password"></label>
        <button class="btn btn-gold" type="submit">Sign In</button>
        <p data-admin-error class="admin-error"></p>
      </form>
    `;
  }

  function bindLogin(sb) {
    const form = document.querySelector("[data-admin-login]");
    form?.addEventListener("submit", async (event) => {
      event.preventDefault();
      const fd = new FormData(form);
      const { error } = await sb.auth.signInWithPassword({
        email: String(fd.get("email") || ""),
        password: String(fd.get("password") || ""),
      });
      if (error) {
        form.querySelector("[data-admin-error]").textContent = error.message;
      } else {
        await renderAdmin();
      }
    });
  }

  async function renderAdminDashboard(sb) {
    const vehicles = await fetchAdminVehicles(sb);
    adminRoot.innerHTML = `
      <div class="admin-shell">
        <div class="admin-topbar">
          <div>
            <span class="eyebrow">OpenRoad Admin</span>
            <h1>Manage inventory.</h1>
          </div>
          <button class="btn btn-outline" data-admin-signout>Sign Out</button>
        </div>
        <div class="admin-layout">
          ${vehicleForm()}
          <section class="admin-card">
            <div class="admin-section-head">
              <h2>${vehicles.length} vehicles</h2>
              <p>Add, delete, or mark sold. Public inventory updates from Supabase.</p>
              ${vehicles.length ? "" : `<button class="btn btn-gold" type="button" data-admin-import>Import Website Inventory</button>`}
            </div>
            <div class="admin-table">${vehicles.map(adminRow).join("") || "<p>No vehicles yet.</p>"}</div>
          </section>
        </div>
      </div>
    `;
    bindAdminActions(sb);
  }

  async function fetchAdminVehicles(sb) {
    const { data, error } = await sb
      .from("openroad_vehicles")
      .select("*, images:openroad_vehicle_images(url, sort_order, is_primary)")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  }

  function vehicleForm() {
    return `
      <form class="admin-card admin-form" data-admin-vehicle-form>
        <h2>Add a car</h2>
        <div class="admin-grid-2">
          <label>Year<input name="year" type="number" min="1900" required></label>
          <label>Make<input name="make" required></label>
          <label>Model<input name="model" required></label>
          <label>Trim<input name="trim"></label>
          <label>Stock #<input name="stock_number" required></label>
          <label>Price<input name="price" type="number" min="0" required></label>
          <label>Mileage<input name="mileage" type="number" min="0" required></label>
          <label>Body Type
            <select name="body_type">
              <option>suv</option><option>sedan</option><option>truck</option><option>van</option><option>coupe</option><option>wagon</option><option>convertible</option><option>hatchback</option>
            </select>
          </label>
          <label>Transmission<input name="transmission" value="Automatic"></label>
          <label>Fuel<input name="fuel_type" value="Gasoline"></label>
        </div>
        <label>Description<textarea name="description" rows="4"></textarea></label>
        <label>Photo URLs, one per line<textarea name="images" rows="5" placeholder="https://..."></textarea></label>
        <button class="btn btn-gold" type="submit">Add Vehicle</button>
        <p data-admin-form-status class="admin-status"></p>
      </form>
    `;
  }

  function adminRow(v) {
    const first = (v.images || []).slice().sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))[0]?.url || "/assets/logo.png";
    return `
      <div class="admin-row" data-id="${v.id}">
        <img src="${escapeHtml(first)}" alt="">
        <div>
          <strong>${escapeHtml(titleFor(v))}</strong>
          <span>Stock #${escapeHtml(v.stock_number)} · ${money.format(Number(v.price || 0))} · ${escapeHtml(v.status || "available")}</span>
        </div>
        <button class="btn btn-ghost" data-admin-sold="${v.id}">${v.status === "sold" ? "Mark Available" : "Mark Sold"}</button>
        <button class="btn btn-outline" data-admin-delete="${v.id}">Delete</button>
      </div>
    `;
  }

  function bindAdminActions(sb) {
    document.querySelector("[data-admin-signout]")?.addEventListener("click", async () => {
      await sb.auth.signOut();
      await renderAdmin();
    });

    document.querySelector("[data-admin-vehicle-form]")?.addEventListener("submit", async (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      const fd = new FormData(form);
      const vehicle = {
        year: Number(fd.get("year")),
        make: String(fd.get("make") || "").trim(),
        model: String(fd.get("model") || "").trim(),
        trim: String(fd.get("trim") || "").trim() || null,
        stock_number: String(fd.get("stock_number") || "").trim(),
        price: Number(fd.get("price")),
        mileage: Number(fd.get("mileage")),
        body_type: String(fd.get("body_type") || "suv"),
        transmission: String(fd.get("transmission") || "Automatic"),
        fuel_type: String(fd.get("fuel_type") || "Gasoline"),
        description: String(fd.get("description") || ""),
        status: "available",
      };

      const status = form.querySelector("[data-admin-form-status]");
      status.textContent = "Saving...";
      const { data, error } = await sb.from("openroad_vehicles").insert(vehicle).select("id").single();
      if (error) {
        status.textContent = error.message;
        return;
      }

      const urls = String(fd.get("images") || "").split(/\n+/).map((s) => s.trim()).filter(Boolean);
      if (urls.length) {
        const rows = urls.map((url, index) => ({
          vehicle_id: data.id,
          url,
          sort_order: index,
          is_primary: index === 0,
        }));
        const { error: imageError } = await sb.from("openroad_vehicle_images").insert(rows);
        if (imageError) {
          status.textContent = imageError.message;
          return;
        }
      }

      form.reset();
      await renderAdminDashboard(sb);
    });

    document.querySelector("[data-admin-import]")?.addEventListener("click", async (event) => {
      const button = event.currentTarget;
      button.textContent = "Importing...";
      button.disabled = true;
      try {
        const imported = await importWebsiteInventory(sb);
        button.textContent = `Imported ${imported} vehicles`;
        await renderAdminDashboard(sb);
      } catch (error) {
        button.textContent = error.message || "Import failed";
        button.disabled = false;
      }
    });

    document.querySelectorAll("[data-admin-delete]").forEach((button) => {
      button.addEventListener("click", async () => {
        if (!confirm("Delete this vehicle from inventory?")) return;
        await sb.from("openroad_vehicles").delete().eq("id", button.dataset.adminDelete);
        await renderAdminDashboard(sb);
      });
    });

    document.querySelectorAll("[data-admin-sold]").forEach((button) => {
      button.addEventListener("click", async () => {
        const id = button.dataset.adminSold;
        const row = button.closest(".admin-row");
        const currentSold = button.textContent.includes("Available");
        await sb.from("openroad_vehicles").update({ status: currentSold ? "available" : "sold" }).eq("id", id);
        if (row) row.style.opacity = "0.55";
        await renderAdminDashboard(sb);
      });
    });
  }

  async function importWebsiteInventory(sb) {
    const vehicles = await readWebsiteInventory();
    if (!vehicles.length) throw new Error("No website inventory found.");

    const vehicleRows = vehicles.map(({ image, ...vehicle }) => vehicle);
    const { data, error } = await sb
      .from("openroad_vehicles")
      .upsert(vehicleRows, { onConflict: "stock_number" })
      .select("id, stock_number");
    if (error) throw error;

    const imported = data || [];
    const ids = imported.map((v) => v.id);
    if (ids.length) {
      await sb.from("openroad_vehicle_images").delete().in("vehicle_id", ids);
    }

    const byStock = new Map(imported.map((v) => [v.stock_number, v.id]));
    const imageRows = vehicles
      .filter((v) => v.image && byStock.has(v.stock_number))
      .map((v) => ({
        vehicle_id: byStock.get(v.stock_number),
        url: v.image,
        sort_order: 0,
        is_primary: true,
      }));

    if (imageRows.length) {
      const { error: imageError } = await sb.from("openroad_vehicle_images").insert(imageRows);
      if (imageError) throw imageError;
    }

    return imported.length;
  }

  async function readWebsiteInventory() {
    const response = await fetch("/inventory/");
    if (!response.ok) throw new Error("Could not read website inventory.");
    const doc = new DOMParser().parseFromString(await response.text(), "text/html");
    return [...doc.querySelectorAll("[data-openroad-inventory-grid] .vehicle-card")].map((card) => {
      const href = card.querySelector("a")?.getAttribute("href") || "";
      const stock = href.split("/").filter(Boolean).pop()?.replace(/\.html$/, "") || "";
      const make = card.querySelector(".vc-make")?.textContent.trim() || "";
      const nameEl = card.querySelector(".vc-name");
      const model = nameEl?.childNodes[0]?.textContent.trim() || "";
      const yearTrim = nameEl?.querySelector("small")?.textContent.split("·").map((s) => s.trim()) || [];
      const specs = [...card.querySelectorAll(".vc-spec")].map((s) => s.textContent.trim());
      const price = Number((card.querySelector(".vc-price strong")?.textContent || "").replace(/[^\d]/g, ""));
      const imagePath = card.querySelector(".vc-img img")?.getAttribute("src") || "";
      return {
        stock_number: stock,
        year: Number(yearTrim[0]) || new Date().getFullYear(),
        make,
        model,
        trim: yearTrim[1] || null,
        price: Number.isFinite(price) ? price : 0,
        mileage: Number((specs[0] || "").replace(/[^\d]/g, "")) || 0,
        body_type: card.dataset.category || "suv",
        transmission: specs[1] || "Automatic",
        fuel_type: specs[2] || "Gasoline",
        description: "Contact OpenRoad Auto Group for details on this vehicle.",
        status: "available",
        image: imagePath ? new URL(imagePath, window.location.origin).href : "",
      };
    }).filter((v) => v.stock_number && v.make && v.model);
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderInventory();
    renderDetail();
    renderAdmin();
  });
})();
