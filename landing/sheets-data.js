<script>
// ====== CONFIGURE AQUI SEU CSV PUBLICADO ======
const KAPRI_SHEET_CSV =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQnFPOEgBZbQmsQAvnwlGtzlfuk2qVe4__apL1p2U2feKE-4inWb8Q6VG4tCve_49d24n4I6umjVQUx/pub?output=csv";

// ====== PARSER DE CSV (robusto para vírgulas em aspas) ======
function parseCSV(text) {
  const lines = text.replace(/\r/g, "").split("\n").filter(Boolean);
  const split = (row) => row.match(/("([^"]|"")*"|[^,])+/g)?.map(c => {
    c = c.trim();
    if (c.startsWith('"') && c.endsWith('"')) c = c.slice(1, -1).replace(/""/g, '"');
    return c;
  }) ?? [];
  const header = split(lines[0]).map(h => h.trim());
  const rows = lines.slice(1).map(line => {
    const cols = split(line);
    const obj = {};
    header.forEach((h, i) => obj[h] = cols[i] ?? "");
    return obj;
  });
  return { header, rows };
}

// ====== NAMESPACE ======
const KapriSheet = {
  // Formata Kz
  formatAOA(v) {
    const n = Number(String(v).replace(/[^\d.-]/g,"")) || 0;
    return n.toLocaleString("pt-PT") + " Kz";
  },

  // Lê e normaliza os produtos do Sheet
  async loadProductsFromSheet() {
    let csv = "";
    try {
      const res = await fetch(KAPRI_SHEET_CSV, { cache: "no-store" });
      if (!res.ok) throw new Error("HTTP " + res.status);
      csv = await res.text();
    } catch (e) {
      console.error("[Sheets] Falha ao buscar CSV:", e);
      return [];
    }

    const { header, rows } = parseCSV(csv);

    // Procura nomes de colunas (aceita variações)
    const findCol = (...alts) => header.find(h =>
      alts.some(a => h.toLowerCase().includes(a.toLowerCase()))
    );

    const col = {
      id:        findCol("id") || "id",
      name:      findCol("name","nome","modelo") || "name",
      image:     findCol("image","foto","img") || "image",
      storages:  findCol("storages","armazenamento") || "storages",
      p64:       findCol("64"),
      p128:      findCol("128"),
      p256:      findCol("256"),
      p512:      findCol("512"),
      p1tb:      findCol("1024","1tb"),
      available: findCol("available","disponível","disponivel") || "available",
      leadAO:    findCol("angola","aoa","ao"),
      leadBR:    findCol("brasil","br"),
      leadPT:    findCol("portugal","pt"),
      note:      findCol("note","estado","nota"),
      batt:      findCol("battery","bateria"),
      includes:  findCol("includes","itens"),
      pop:       findCol("pop","popularidade","ordem")
    };

    const products = rows.map(r => {
      const storages = (r[col.storages] || "")
        .split("|").map(s => s.trim()).filter(Boolean);
      const prices = {};
      if (col.p64  && r[col.p64 ]) prices["64"]  = r[col.p64 ];
      if (col.p128 && r[col.p128]) prices["128"] = r[col.p128];
      if (col.p256 && r[col.p256]) prices["256"] = r[col.p256];
      if (col.p512 && r[col.p512]) prices["512"] = r[col.p512];
      if (col.p1tb && r[col.p1tb]) prices["1024"]= r[col.p1tb];

      return {
        id:   (r[col.id]   || "").trim(),
        name: (r[col.name] || "").trim(),
        image: (r[col.image] || "").trim(),
        storages,
        prices,
        available: /^(sim|yes|true|1)$/i.test(r[col.available] || ""),
        lead_time: {
          ao: (r[col.leadAO] || "").trim(),
          br: (r[col.leadBR] || "").trim(),
          pt: (r[col.leadPT] || "").trim(),
        },
        note: (r[col.note] || "Bom estado").trim(),
        battery_min: Number(String(r[col.batt] || "85").replace(/\D/g,"")) || 85,
        includes: (r[col.includes] || "").split("|").map(x => x.trim()).filter(Boolean),
        popularity: Number(r[col.pop] || 9999)
      };
    }).filter(p => p.id && p.name);

    return products;
  }
};

// Exponha no escopo global
window.KapriSheet = KapriSheet;
</script>
