 // ── TEST DATA ──────────────────────────────────────────────────────────────
const tests = [
  {id:1,  name:'CBC (Complete Blood Count)',      cat:'blood',   desc:'RBC, WBC, haemoglobin, platelets. Detects anaemia, infections.',       price:500,  icon:'🩸'},
  {id:2,  name:'Blood Glucose (Sugar Test)',       cat:'blood',   desc:'Fasting & post-meal sugar. Checks for diabetes.',                      price:500,  icon:'💉'},
  {id:3,  name:'Lipid Profile',                   cat:'blood',   desc:'Cholesterol, triglycerides, HDL, LDL for heart health.',               price:500,  icon:'❤️'},
  {id:4,  name:'Liver Function Test (LFT)',        cat:'liver',   desc:'SGOT, SGPT, Bilirubin — evaluates liver health.',                      price:800,  icon:'🫀'},
  {id:5,  name:'Kidney Function Test (KFT)',       cat:'liver',   desc:'Creatinine, Urea, Uric Acid — checks kidney functioning.',            price:700,  icon:'🫘'},
  {id:6,  name:'LFT & KFT Combined',              cat:'liver',   desc:'Complete liver and kidney panel together.',                            price:1000, icon:'🔬'},
  {id:7,  name:'Urine Routine & Microscopy',       cat:'urine',   desc:'Detects UTI, kidney problems, diabetes markers.',                     price:1000, icon:'🧫'},
  {id:8,  name:'Thyroid Profile (T3, T4, TSH)',    cat:'thyroid', desc:'Complete thyroid check — Hypo & Hyperthyroidism.',                    price:2000, icon:'🦋'},
  {id:9,  name:'HBA1c (Diabetes Control)',         cat:'blood',   desc:'3-month average blood sugar for diabetes monitoring.',                 price:600,  icon:'📊'},
  {id:10, name:'Digital X-Ray (Chest)',            cat:'xray',    desc:'High-quality digital chest X-Ray for lungs and heart.',               price:300,  icon:'📡'},
  {id:11, name:'OPG X-Ray (Dental)',               cat:'xray',    desc:'Panoramic dental X-ray for full mouth view.',                         price:500,  icon:'🦷'},
  {id:12, name:'Complete Health Package',          cat:'package', desc:'CBC + LFT + KFT + Thyroid + Sugar + Lipid — Full body.',             price:3500, icon:'🏥'},
  {id:13, name:'Diabetes Package',                 cat:'package', desc:'Blood Glucose + HBA1c + Urine + Kidney Function.',                   price:1500, icon:'💊'},
  {id:14, name:'Women Health Package',             cat:'package', desc:'CBC + Thyroid + Iron + Calcium + Vitamin D + Sugar.',                 price:2500, icon:'👩‍⚕️'},
  {id:15, name:'Vitamin D (25-OH)',                cat:'blood',   desc:'Vitamin D deficiency test — very common in India.',                   price:800,  icon:'☀️'},
  {id:16, name:'Serum Calcium',                    cat:'blood',   desc:'Calcium level for bone and muscle health.',                           price:300,  icon:'🦴'},
];

let cart = [], activeCategory = 'all', bookingId = '';

// ── PAGE NAVIGATION ────────────────────────────────────────────────────────
function showPage(id){
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0, 0);
}

function scrollTo(id){
  const el = document.getElementById(id);
  if(el) el.scrollIntoView({behavior: 'smooth'});
}

function openBooking(){
  showPage('bookingPage');
  renderTests();
}

// ── TESTS ──────────────────────────────────────────────────────────────────
function catLabel(c){
  return {blood:'Blood', thyroid:'Thyroid', liver:'Liver/Kidney', urine:'Urine', xray:'X-Ray', package:'Package'}[c] || 'Test';
}

function renderTests(){
  const q    = (document.getElementById('searchInput').value || '').toLowerCase();
  const grid = document.getElementById('testsGrid');
  const list = tests.filter(t => {
    const mc = activeCategory === 'all' || t.cat === activeCategory;
    const ms = !q || t.name.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q);
    return mc && ms;
  });

  if(!list.length){
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;color:#888;">No tests found.</div>';
    return;
  }

  grid.innerHTML = list.map(t => `
    <div class="test-card" id="tc-${t.id}">
      <div class="tc-img">${t.icon}</div>
      <div class="tc-body">
        <span class="tc-badge">${catLabel(t.cat)}</span>
        <h3>${t.name}</h3>
        <p>${t.desc}</p>
        <div class="tc-price">&#8377;${t.price.toLocaleString('en-IN')}</div>
        <button class="btn-bn" onclick="selectTest(${t.id})">Book Now &rarr;</button>
      </div>
    </div>
  `).join('');

  // Re-highlight already selected cards after re-render
  cart.forEach(t => {
    const el = document.getElementById('tc-' + t.id);
    if(el) el.style.border = '2px solid #1565C0';
  });
}

function filterTests(){ renderTests(); }

function filterCat(el, cat){
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  activeCategory = cat;
  renderTests();
}

// ── SELECT / DESELECT TEST ─────────────────────────────────────────────────
function selectTest(id){
  const test = tests.find(t => t.id === id);
  const idx  = cart.findIndex(t => t.id === id);

  if(idx > -1){
    cart.splice(idx, 1); // already in cart — remove it
  } else {
    cart.push(test);     // not in cart — add it
  }

  // Update card highlights
  document.querySelectorAll('.test-card').forEach(c => c.style.border = '2px solid #e8f0fb');
  cart.forEach(t => {
    const el = document.getElementById('tc-' + t.id);
    if(el) el.style.border = '2px solid #1565C0';
  });

  // Update cart bar
  if(cart.length > 0){
    const total = cart.reduce((s, t) => s + t.price, 0);
    document.getElementById('cart-name').textContent  = cart.length === 1 ? cart[0].name : cart.length + ' tests selected';
    document.getElementById('cart-price').textContent = '₹' + total.toLocaleString('en-IN');
    document.getElementById('cartBar').classList.add('show');
  } else {
    document.getElementById('cartBar').classList.remove('show');
  }
}

 

function openCheckout(){
  if(!cart.length) {
    alert("Please select at least one test.");
    return;
  }

  bookingId = Math.floor(10000 + Math.random() * 90000);
  const total = cart.reduce((s, t) => s + t.price, 0);
  const formattedPrice = '₹' + total.toLocaleString('en-IN');

  // 1. Handle Multiple Tests (for the mini list)
  const listHTML = cart.map(t => `
    <div class="sel-mini">
      <span class="si">${t.icon}</span>
      <div style="flex:1">
        <div class="sn">${t.name}</div>
        <div class="sp">₹${t.price.toLocaleString('en-IN')}</div>
      </div>
    </div>
  `).join('');

  // 2. Update the UI Elements
  // If you want to show only the first test name in the summary header:
  document.getElementById('co-name').textContent = cart.length === 1 ? cart[0].name : cart.length + " Tests Selected";
  document.getElementById('co-icon').textContent = cart.length === 1 ? cart[0].icon : '🧪';
  document.getElementById('co-price-show').textContent = formattedPrice;

  // 3. Update the rest of the IDs
  document.getElementById('co-bid').textContent = bookingId;
  document.getElementById('co-amt').textContent = formattedPrice;
  document.getElementById('co-total').textContent = formattedPrice;
  document.getElementById('ps-charges').textContent = formattedPrice;
  document.getElementById('ps-total').textContent = formattedPrice;

  // 4. Set Date constraints
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('f-date').min = today;
  if(!document.getElementById('f-date').value) document.getElementById('f-date').value = today;

  // 5. SWITCH THE PAGE
  showPage('checkoutPage');
}



// ── PLACE ORDER ────────────────────────────────────────────────────────────
function placeOrder(){
  const name    = document.getElementById('f-name').value.trim();
  const phone   = document.getElementById('f-phone').value.trim();
  const email   = document.getElementById('f-email').value.trim();
  const age     = document.getElementById('f-age').value.trim();
  const gender  = document.getElementById('f-gender').value;
  const address = document.getElementById('f-address').value.trim();
  const date    = document.getElementById('f-date').value;
  const time    = document.getElementById('f-time').value;
  const notes   = document.getElementById('f-notes').value.trim();

  if(!name)                    { alert('Please enter patient name.'); return; }
  if(!phone || phone.length<10){ alert('Please enter valid 10-digit mobile number.'); return; }
  if(!age)                     { alert('Please enter patient age.'); return; }
  if(!gender)                  { alert('Please select gender.'); return; }
  if(!address)                 { alert('Please enter your address.'); return; }
  if(!date)                    { alert('Please select preferred date.'); return; }

  const testLines = cart.map(t => `   • ${t.name} — ₹${t.price.toLocaleString('en-IN')}`).join('\n');
  const total     = cart.reduce((s, t) => s + t.price, 0);

  const msg =
`🏥 *MAA BHAWANI DIAGNOSTICS*
📋 *NEW BOOKING ORDER*
━━━━━━━━━━━━━━━━━━
🔖 *Booking ID:* #MB${bookingId}
━━━━━━━━━━━━━━━━━━
🧪 *Tests Selected:*
${testLines}
💰 *Total Amount:* ₹${total.toLocaleString('en-IN')}
💵 *Payment:* Cash on Delivery
━━━━━━━━━━━━━━━━━━
👤 *Name:* ${name}
📞 *Mobile:* +91 ${phone}${email ? '\n📧 *Email:* ' + email : ''}
🎂 *Age:* ${age} yrs | *Gender:* ${gender}
📍 *Address:* ${address}
📅 *Date:* ${date}
⏰ *Time:* ${time}${notes ? '\n📝 *Notes:* ' + notes : ''}
━━━━━━━━━━━━━━━━━━
✅ Please confirm appointment.`;

  window.open('https://wa.me/918677828555?text=' + encodeURIComponent(msg), '_blank');
  document.getElementById('cartBar').classList.remove('show');
  cart = []; // clear cart after order
  showPage('successPage');
}