'use strict';

/* ---------- Data ---------- */
const PRODUCTS = [
  { id:'p1', title:'Rosa Linjekonst', typeLabel:'Made to order', type:'made', badge:'Ny', image:'assets/sample6.jpg', alt:'Naturell nagel med handmålad rosa linjekonst och hjärtan', shapeLength:'Oval · Medium', basePrice:449, priceLabel:'Från 449 kr', description:'Ett minimalistiskt set med handmålad linjekonst i rosa – enkelt nog för vardagen, personligt nog att bära varje dag.', productionNote:'Görs på beställning efter din valda storlek. Beräknad produktionstid 5–7 arbetsdagar innan avsändning.', productionShort:'Made to order · 5–7 dagar', soldOut:false },
  { id:'p2', title:'Jade Bloom 3D', typeLabel:'Made to order', type:'made', badge:'Bästsäljare', image:'assets/sample2.jpg', alt:'Skulpterade 3D-naglar i jadegrönt och puder med blomdetaljer', shapeLength:'Coffin · Long', basePrice:690, priceLabel:'Från 690 kr', description:'Handskulpterad 3D-konst i jade och puderrosa med blad- och blomdetaljer. Varje set är unikt handmålat i vår studio.', productionNote:'Avancerad 3D-konst kräver längre produktionstid: 8–10 arbetsdagar.', productionShort:'Made to order · 8–10 dagar', soldOut:false },
  { id:'p3', title:'Havspärla Chrome', typeLabel:'Ready to ship', type:'ready', badge:null, image:'assets/sample5.jpg', alt:'Blå chrome-naglar med pärldetaljer i snäckform', shapeLength:'Mandel · Medium', basePrice:520, priceLabel:'520 kr', description:'Djupblå chrome-yta med handsatta pärlor – inspirerad av havets skimmer. Begränsat antal i lager, redo att skickas direkt.', productionNote:'Färdigt set i lager – skickas inom 1–2 arbetsdagar.', productionShort:'Ready to ship · 1–2 dagar', soldOut:false },
  { id:'p4', title:'Spindelnät Edition', typeLabel:'Säsong · Begränsad', type:'ready', badge:'Begränsad', image:'assets/sample3.jpg', alt:'Höstinspirerade naglar med handmålat spindelnät i brunt och beige', shapeLength:'Coffin · Long', basePrice:590, priceLabel:'590 kr', description:'Säsongens mörka favorit – handmålat spindelnät i varma jordtoner. Begränsad upplaga, tillverkas inte om.', productionNote:'Säsongsset i begränsad upplaga – skickas inom 2–3 arbetsdagar.', productionShort:'Begränsad · 2–3 dagar', soldOut:true },
  { id:'p5', title:'Regnbågslek', typeLabel:'Ready to ship', type:'ready', badge:null, image:'assets/sample1.jpg', alt:'Lekfullt regnbågsset med hjärtan och färgglada bågar', shapeLength:'Mandel · Short', basePrice:429, priceLabel:'429 kr', description:'Ett glädjefyllt set i alla regnbågens färger, med hjärtdetaljer på utvalda naglar. Alltid på lager i vanliga storlekar.', productionNote:'Färdigt set i lager – skickas inom 1–2 arbetsdagar.', productionShort:'Ready to ship · 1–2 dagar', soldOut:false },
  { id:'p6', title:'Regnbågsprickar', typeLabel:'Ready to ship', type:'ready', badge:'Ny', image:'assets/sample8.jpg', alt:'Regnbågsset med färgblocksränder och prickmönster', shapeLength:'Coffin · Medium', basePrice:459, priceLabel:'459 kr', description:'Djärva färgblock möter finmålade prickar i regnbågens alla nyanser – ett set som sticker ut i mängden.', productionNote:'Färdigt set i lager – skickas inom 1–2 arbetsdagar.', productionShort:'Ready to ship · 1–2 dagar', soldOut:false }
];

const SHAPES = [
  { value:'round', label:'Rund', glyph:'●' },
  { value:'almond', label:'Mandel', glyph:'◐' },
  { value:'oval', label:'Oval', glyph:'⬭' },
  { value:'square', label:'Fyrkant', glyph:'▢' },
  { value:'coffin', label:'Coffin', glyph:'▱' }
];
const LENGTHS = [
  { value:'xs', label:'XS' }, { value:'s', label:'S' }, { value:'m', label:'M' }, { value:'l', label:'L' }, { value:'xl', label:'XL' }
];
const FINGERS = ['Tumme','Pekfinger','Långfinger','Ringfinger','Lillfinger'];

const TYPE_FILTERS = [
  { value:'all', label:'Alla' },
  { value:'ready', label:'Ready to ship' },
  { value:'made', label:'Made to order' }
];

/* ---------- State ---------- */
const state = {
  screen: 'home',
  prevScreen: 'home',
  typeFilter: 'all',
  currentProductId: null,
  shape: 'oval',
  length: 'm',
  hasSizeProfile: false,
  savedProfileName: 'Pat – kort mandel',
  openAccordion: { included: true, production: false, care: false },
  cartOpen: false,
  cartItems: [],
  sizingMethod: null,
  measureConfirmed: false,
  checkoutOpen: false
};

const SCREENS = ['home', 'shop', 'product', 'sizing', 'custom', 'confirmation'];

/* ---------- Helpers ---------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[c]));
const kr = (n) => n.toLocaleString('sv-SE') + ' kr';

function currentProduct() {
  return PRODUCTS.find((p) => p.id === state.currentProductId) || PRODUCTS[0];
}
function cartSubtotalNum() {
  return state.cartItems.reduce((sum, c) => sum + (c.price || 0), 0);
}
function shippingNum() { return state.cartItems.length ? 49 : 0; }
function cartTotalNum() { return cartSubtotalNum() + shippingNum(); }

/* ---------- Navigation ---------- */
function show(screen) {
  if (screen !== state.screen && SCREENS.includes(state.screen)) {
    state.prevScreen = state.screen;
  }
  state.screen = screen;
  SCREENS.forEach((s) => {
    $('#screen-' + s).classList.toggle('hidden', s !== screen);
  });
  window.scrollTo({ top: 0, behavior: 'auto' });
  renderAll();
}

function goHome() { closeCart(); show('home'); }

/* ---------- Renderers ---------- */
function renderFeatured() {
  const root = $('#featured-list');
  root.innerHTML = PRODUCTS.slice(0, 4).map(productCardHTML).join('');
}

function renderShop() {
  const filtered = state.typeFilter === 'all' ? PRODUCTS : PRODUCTS.filter((p) => p.type === state.typeFilter);

  $('#filter-row').innerHTML = TYPE_FILTERS.map((f) => `
    <button class="chip" data-filter="${f.value}" aria-pressed="${state.typeFilter === f.value}">${esc(f.label)}</button>
  `).join('');

  $('#result-count').textContent = filtered.length + ' set';
  $('#shop-list').innerHTML = filtered.map(productCardHTML).join('');
  const none = filtered.length === 0;
  $('#no-results').classList.toggle('hidden', !none);
  $('#shop-list').classList.toggle('hidden', none);
}

function productCardHTML(p) {
  return `
    <button class="product-card" data-product="${p.id}">
      <div class="media">
        <img src="${p.image}" alt="${esc(p.alt)}">
        ${p.badge ? `<span class="badge">${esc(p.badge)}</span>` : ''}
        ${p.soldOut ? `<div class="sold-overlay"><span>Slutsåld</span></div>` : ''}
      </div>
      <div class="p-title">${esc(p.title)}</div>
      <div class="p-meta">${esc(p.shapeLength)}</div>
      <div class="p-price">${esc(p.priceLabel)}</div>
    </button>`;
}

function renderProduct() {
  const p = currentProduct();
  $('#pdp-img').src = p.image;
  $('#pdp-img').alt = p.alt;
  const badge = $('#pdp-badge');
  if (p.badge) { badge.textContent = p.badge; badge.classList.remove('hidden'); }
  else { badge.classList.add('hidden'); }
  $('#pdp-type').textContent = p.typeLabel;
  $('#pdp-title').textContent = p.title;
  $('#pdp-price').textContent = p.priceLabel;
  $('#pdp-desc').textContent = p.description;

  const shape = SHAPES.find((s) => s.value === state.shape);
  const length = LENGTHS.find((l) => l.value === state.length);
  $('#shape-val').textContent = shape.label;
  $('#length-val').textContent = length.label;

  $('#shape-opts').innerHTML = SHAPES.map((s) => `
    <button class="shape-opt" data-shape="${s.value}" aria-pressed="${state.shape === s.value}" aria-label="${esc(s.label)}">${s.glyph}</button>
  `).join('');
  $('#length-opts').innerHTML = LENGTHS.map((l) => `
    <button class="length-opt" data-length="${l.value}" aria-pressed="${state.length === l.value}">${esc(l.label)}</button>
  `).join('');

  $('#size-info').innerHTML = state.hasSizeProfile
    ? `<div class="size-status">✓ Använder profil "${esc(state.savedProfileName)}"</div>`
    : `<div class="size-empty">Ingen storlek vald ännu — vi rekommenderar en sizing-kit innan ditt första köp.</div>`;

  const acc = [
    { key:'included', title:'Det här ingår', body:'10 handmålade nagelspetsar, nagellim + adhesive tabs, mini-fil, träpinne för applicering, förvaringsask.' },
    { key:'production', title:'Produktion & leverans', body:p.productionNote },
    { key:'care', title:'Applicering, borttagning & skötsel', body:'Applicera med lim för längre hållbarhet eller adhesive tabs för skonsam, återanvändningsbar fästning. Ta bort varsamt med värme och olja – undvik att dra loss. Förvara torrt i asken mellan användningar.' }
  ];
  $('#accordions').innerHTML = acc.map((a) => {
    const open = state.openAccordion[a.key];
    return `
      <div class="accordion-item">
        <button class="accordion-head" data-accordion="${a.key}" aria-expanded="${open}">
          <span>${esc(a.title)}</span><span>${open ? '–' : '+'}</span>
        </button>
        ${open ? `<div class="accordion-body">${esc(a.body)}</div>` : ''}
      </div>`;
  }).join('');

  $('#pdp-price').textContent = p.priceLabel;
  ['pdp-inline-price', 'pdp-sticky-price'].forEach((id) => { $('#' + id).textContent = p.priceLabel; });
  ['pdp-inline-note', 'pdp-sticky-note'].forEach((id) => { $('#' + id).textContent = p.productionShort; });
}

function renderSizingPanel() {
  const root = $('#sizing-panel');
  $$('.method-card').forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.method === state.sizingMethod)));

  if (state.sizingMethod === 'kit') {
    root.innerHTML = `
      <div class="sizing-panel">
        <h3>Sizing-kit tillagd</h3>
        <p style="font-size:14px; color:var(--text-soft); line-height:1.6; margin:0 0 16px;">Vi skickar kitet separat. När du mätt klart sparar du din nagelprofil och kan slutföra det här setet direkt utan att börja om.</p>
        <button class="btn btn-primary btn-block" data-confirm-sizing>Fortsätt till kundvagn</button>
      </div>`;
  } else if (state.sizingMethod === 'measure') {
    root.innerHTML = `
      <div class="sizing-panel">
        <h3>Mät dina tio naglar</h3>
        <div class="finger-list">
          ${FINGERS.map((f) => `<div class="finger-row"><span>${esc(f)} (V / H)</span><span class="mm">mm / mm</span></div>`).join('')}
        </div>
        <label class="confirm-check">
          <input type="checkbox" id="measure-confirm" ${state.measureConfirmed ? 'checked' : ''}>
          Jag bekräftar att jag mätt alla tio naglar noggrant enligt guiden.
        </label>
        <button class="btn btn-primary btn-block" data-confirm-sizing ${state.measureConfirmed ? '' : 'disabled'}>Spara &amp; fortsätt till kundvagn</button>
      </div>`;
  } else if (state.sizingMethod === 'profile') {
    root.innerHTML = `
      <div class="sizing-panel">
        <button class="profile-card" data-pick-profile>
          <div>
            <div class="pc-name">Pat – kort mandel</div>
            <div class="pc-date">Sparad 14 mars 2026</div>
          </div>
          <span class="pc-pick">Välj</span>
        </button>
      </div>`;
  } else {
    root.innerHTML = '';
  }
}

function renderCart() {
  const root = $('#cart-root');
  if (!state.cartOpen) { root.innerHTML = ''; return; }
  const items = state.cartItems;
  root.innerHTML = `
    <div class="overlay" data-close-cart></div>
    <aside class="drawer" role="dialog" aria-label="Kundvagn">
      <div class="drawer-head">
        <span class="title">Kundvagn</span>
        <button class="drawer-close" data-close-cart aria-label="Stäng">✕</button>
      </div>
      <div class="drawer-body">
        ${items.length ? items.map((c) => `
          <div class="cart-item">
            <img src="${c.image}" alt="${esc(c.title)}">
            <div style="flex:1;">
              <div class="ci-title">${esc(c.title)}</div>
              <div class="ci-meta">${esc(c.shapeLength)}</div>
              ${c.sizingWarning ? `<div class="ci-warn">⚠ Storlek ej vald</div>` : ''}
              <div class="ci-price">${esc(c.priceLabel)}</div>
            </div>
          </div>`).join('') : `<div class="cart-empty">Din kundvagn är tom.</div>`}
      </div>
      <div class="drawer-foot">
        <div class="subtotal-row"><span>Delsumma</span><strong>${kr(cartSubtotalNum())}</strong></div>
        <button class="btn btn-primary btn-block" data-checkout ${items.length ? '' : 'disabled'}>Till kassan</button>
      </div>
    </aside>`;
}

function renderCheckout() {
  const root = $('#checkout-root');
  if (!state.checkoutOpen) { root.innerHTML = ''; return; }
  const total = cartTotalNum();
  const vat = Math.round(total * 0.2);
  root.innerHTML = `
    <div class="checkout-panel" role="dialog" aria-label="Kassa">
      <div class="checkout-head">
        <button class="back-btn" data-close-checkout aria-label="Tillbaka">←</button>
        <span class="title">Kassa</span>
      </div>
      <div class="checkout-scroll">
        <div class="checkout-inner">
          <p class="co-step-label">1. Leveransadress</p>
          <div class="co-fields">
            <input placeholder="Namn" autocomplete="name">
            <input placeholder="E-post" autocomplete="email" type="email">
            <input placeholder="Adress" autocomplete="street-address">
            <div class="row">
              <input placeholder="Postnr" autocomplete="postal-code" style="flex:1;">
              <input placeholder="Ort" autocomplete="address-level2" style="flex:2;">
            </div>
          </div>
          <p class="co-step-label">2. Betalning</p>
          <div class="pay-opt-wrap">
            <div class="pay-opt"><span>Swish</span><span class="ph">platshållare</span></div>
            <div class="pay-opt"><span>Kort</span><span class="ph">platshållare</span></div>
            <div class="pay-opt"><span>Klarna</span><span class="ph">platshållare</span></div>
          </div>
          <p class="co-step-label" style="margin-top:16px;">3. Sammanfattning</p>
          <div class="summary-box">
            <div class="s-row"><span>Delsumma</span><span>${kr(cartSubtotalNum())}</span></div>
            <div class="s-row"><span>Frakt</span><span>${kr(shippingNum())}</span></div>
            <div class="s-row s-vat"><span>varav moms (25%)</span><span>${kr(vat)}</span></div>
            <div class="s-row s-total"><span>Totalt</span><span>${kr(total)}</span></div>
          </div>
        </div>
      </div>
      <div class="checkout-foot">
        <div class="inner">
          <button class="btn btn-primary btn-block" data-place-order>Slutför köp — ${kr(total)}</button>
        </div>
      </div>
    </div>`;
}

function renderCartCount() {
  const el = $('#cart-count');
  const n = state.cartItems.length;
  el.textContent = n;
  el.classList.toggle('hidden', n === 0);
}

function renderAll() {
  renderFeatured();
  renderShop();
  if (state.screen === 'product') renderProduct();
  if (state.screen === 'sizing') renderSizingPanel();
  renderCart();
  renderCheckout();
  renderCartCount();
}

/* ---------- Actions ---------- */
function openProduct(id) {
  state.currentProductId = id;
  state.shape = 'oval';
  state.length = 'm';
  show('product');
}

function addToCart() {
  const p = currentProduct();
  const shapeLabel = SHAPES.find((s) => s.value === state.shape).label;
  const lengthLabel = LENGTHS.find((l) => l.value === state.length).label;
  state.cartItems.push({
    id: p.id + '-' + Date.now(),
    title: p.title,
    image: p.image,
    shapeLength: shapeLabel + ' · ' + lengthLabel,
    priceLabel: p.priceLabel,
    price: p.basePrice,
    sizingWarning: !state.hasSizeProfile
  });
  state.cartOpen = true;
  renderAll();
}

function openCart() { state.cartOpen = true; renderCart(); }
function closeCart() { state.cartOpen = false; renderCart(); }

function selectSizingMethod(method) {
  state.sizingMethod = method;
  state.measureConfirmed = false;
  renderSizingPanel();
}

function addSizingKitToCart() {
  if (state.cartItems.some((c) => c.isKit)) return;
  state.cartItems.push({
    id: 'sizing-kit-' + Date.now(),
    title: 'Sizing-kit',
    image: 'assets/sample4.jpg',
    shapeLength: 'Provtips i alla storlekar',
    priceLabel: '149 kr',
    price: 149,
    sizingWarning: false,
    isKit: true
  });
}

function confirmSizingAndReturn() {
  if (state.sizingMethod === 'measure') {
    if (!state.measureConfirmed) return;
    state.hasSizeProfile = true;
    show('product');
  } else if (state.sizingMethod === 'kit') {
    state.hasSizeProfile = false;
    addSizingKitToCart();
    show('product');
    state.cartOpen = true;
    renderCart();
    renderCartCount();
  } else {
    show('product');
  }
  state.sizingMethod = null;
}

function pickSavedProfile() {
  state.hasSizeProfile = true;
  state.sizingMethod = null;
  show('product');
}

function goToCheckout() {
  state.cartOpen = false;
  state.checkoutOpen = true;
  renderCart();
  renderCheckout();
}
function closeCheckout() {
  state.checkoutOpen = false;
  state.cartOpen = true;
  renderCheckout();
  renderCart();
}
function placeOrder() {
  state.checkoutOpen = false;
  state.cartItems = [];
  renderCheckout();
  show('confirmation');
}

/* ---------- Event delegation ---------- */
document.addEventListener('click', (e) => {
  const t = e.target.closest('[data-nav],[data-shop-type],[data-product],[data-filter],[data-shape],[data-length],[data-accordion],[data-add-cart],[data-back-product],[data-back-sizing],[data-confirm-sizing],[data-pick-profile],[data-method],[data-close-cart],[data-checkout],[data-close-checkout],[data-place-order],#cart-btn,#clear-filters');
  if (!t) return;

  if (t.id === 'cart-btn') { openCart(); return; }
  if (t.id === 'clear-filters') { state.typeFilter = 'all'; renderShop(); return; }

  if (t.dataset.shopType !== undefined) {
    e.preventDefault();
    state.typeFilter = t.dataset.shopType;
    show('shop');
    return;
  }
  if (t.dataset.nav !== undefined) {
    e.preventDefault();
    const nav = t.dataset.nav;
    if (nav === 'home') {
      goHome();
      if (t.dataset.scroll === 'how') {
        requestAnimationFrame(() => $('#how').scrollIntoView({ behavior: 'smooth' }));
      }
    } else {
      show(nav);
    }
    return;
  }
  if (t.dataset.product) { openProduct(t.dataset.product); return; }
  if (t.dataset.filter) { state.typeFilter = t.dataset.filter; renderShop(); return; }
  if (t.dataset.shape) { state.shape = t.dataset.shape; renderProduct(); return; }
  if (t.dataset.length) { state.length = t.dataset.length; renderProduct(); return; }
  if (t.dataset.accordion) {
    const k = t.dataset.accordion;
    state.openAccordion[k] = !state.openAccordion[k];
    renderProduct();
    return;
  }
  if (t.hasAttribute('data-add-cart')) { addToCart(); return; }
  if (t.hasAttribute('data-back-product')) { show(state.prevScreen); return; }
  if (t.hasAttribute('data-back-sizing')) { show('product'); return; }
  if (t.dataset.method) { selectSizingMethod(t.dataset.method); return; }
  if (t.hasAttribute('data-confirm-sizing')) { confirmSizingAndReturn(); return; }
  if (t.hasAttribute('data-pick-profile')) { pickSavedProfile(); return; }
  if (t.hasAttribute('data-close-cart')) { closeCart(); return; }
  if (t.hasAttribute('data-checkout')) { goToCheckout(); return; }
  if (t.hasAttribute('data-close-checkout')) { closeCheckout(); return; }
  if (t.hasAttribute('data-place-order')) { placeOrder(); return; }
});

document.addEventListener('change', (e) => {
  if (e.target.id === 'measure-confirm') {
    state.measureConfirmed = e.target.checked;
    const btn = $('#sizing-panel [data-confirm-sizing]');
    if (btn) btn.disabled = !state.measureConfirmed;
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (state.checkoutOpen) closeCheckout();
    else if (state.cartOpen) closeCart();
  }
});

/* ---------- Init ---------- */
renderAll();
