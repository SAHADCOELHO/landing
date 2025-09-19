<script>
const $root = document.getElementById('productRoot');

function getID() {
  return new URLSearchParams(location.search).get('id') || "";
}

function view404() {
  $root.innerHTML = `
    <section class="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-6">
      <h1 class="text-xl font-extrabold mb-2">Produto não encontrado</h1>
      <p class="text-zinc-400 text-sm">Verifique o link ou volte ao catálogo.</p>
      <a href="../catalogo.html" class="mt-4 inline-block rounded-xl border border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-900">Voltar ao Catálogo</a>
    </section>
  `;
}

function render(item) {
  const firstStorage = item.storages?.[0];
  const price = item.prices?.[firstStorage] ?? 0;

  const chips = (item.storages || []).map(s => `
    <button class="js-storage inline-flex items-center gap-1 rounded-full border border-zinc-700/70 px-3 py-1 text-xs"
            data-storage="${s}">
      ${s} GB
    </button>
  `).join('');

  $root.innerHTML = `
    <!-- Galeria -->
    <div class="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4">
      <div class="aspect-[4/3] rounded-xl bg-zinc-900/50 border border-zinc-800 flex items-center justify-center overflow-hidden">
        <img src="${item.image || '../assets/placeholder.png'}" alt="${item.name}" class="max-h-full max-w-full object-contain">
      </div>
    </div>

    <!-- Info -->
    <div class="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5">
      <div class="mb-2">
        <span class="text-[11px] px-2 py-0.5 rounded-full border border-zinc-700/70">Recondicionado com inspeção técnica</span>
      </div>
      <h1 class="text-2xl font-extrabold mb-1">${item.name}</h1>

      <div class="grid grid-cols-2 gap-3 text-sm mt-2">
        <div class="rounded-lg border border-zinc-800 p-2">
          <div class="text-zinc-400 text-xs mb-1">Nota</div>
          <div>${item.note || "Bom estado"}</div>
        </div>
        <div class="rounded-lg border border-zinc-800 p-2">
          <div class="text-zinc-400 text-xs mb-1">Bateria</div>
          <div>${item.battery || "≥ 85% de saúde"}</div>
        </div>
      </div>

      <div class="mt-4">
        <div class="text-xs text-zinc-400 mb-1">Armazenamento</div>
        <div class="flex flex-wrap gap-2">${chips}</div>
      </div>

      <div class="mt-4">
        <div class="text-xs text-zinc-400 mb-1">Preço</div>
        <div id="price" class="text-xl font-extrabold">${formatAOA(price)}</div>
      </div>

      <div class="mt-5 flex gap-3">
        <a id="waBtn" target="_blank"
           class="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold border border-orange-500/30 bg-gradient-to-b from-orange-500/20 to-orange-500/10 hover:from-orange-500/30 hover:to-orange-500/20">
          Encomendar no WhatsApp
        </a>
        <a href="../catalogo.html" class="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold border border-zinc-700 hover:bg-zinc-900">Voltar ao Catálogo</a>
      </div>

      <div class="mt-6">
        <div class="text-xs text-zinc-400 mb-1">Itens inclusos</div>
        <ul class="list-disc pl-5 text-sm">
          ${(item.includes || ["iPhone","Cabo USB-C"]).map(i=>`<li>${i}</li>`).join('')}
        </ul>
      </div>
    </div>
  `;

  // seleção de armazenamento + atualização de preço e link WA
  let currentStorage = firstStorage;
  const $price = document.getElementById('price');
  const $wa = document.getElementById('waBtn');

  function update() {
    const v = item.prices?.[currentStorage] ?? 0;
    $price.textContent = formatAOA(v);
    const utm = `?utm_source=catalogo&utm_medium=button&utm_campaign=product&product=${encodeURIComponent(item.id)}&storage=${currentStorage}`;
    $wa.href = "https://wa.wa" + utm;
  }
  update();

  document.querySelectorAll('.js-storage').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      currentStorage = Number(btn.dataset.storage);
      document.querySelectorAll('.js-storage').forEach(b=>b.classList.remove('ring-1','ring-orange-500/60'));
      btn.classList.add('ring-1','ring-orange-500/60');
      update();
    });
  });
}

(function init(){
  const id = new URLSearchParams(location.search).get('id');
  const item = (window.PRODUCTS || []).find(p => p.id === id);
  if (!item) return view404();
  render(item);
})();
</script>
