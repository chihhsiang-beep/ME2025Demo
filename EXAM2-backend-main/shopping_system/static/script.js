// === 產品資料 ===
const products = [
  {'name': 'T-Shirt',       'price': 25, 'gender': '男裝', 'category': '上衣',   'image_url': '.../static/img/T-Shirt.png'},
  {'name': 'Blouse',        'price': 30, 'gender': '女裝', 'category': '上衣',   'image_url': '.../static/img/Blouse.png'},
  {'name': 'Jeans',         'price': 50, 'gender': '通用', 'category': '褲/裙子', 'image_url': '.../static/img/Jeans.png'},
  {'name': 'Skirt',         'price': 40, 'gender': '女裝', 'category': '褲/裙子', 'image_url': '.../static/img/Skirt.png'},
  {'name': 'Sneakers',      'price': 60, 'gender': '通用', 'category': '鞋子',   'image_url': '.../static/img/Sneakers.png'},
  {'name': 'Leather Shoes', 'price': 80, 'gender': '男裝', 'category': '鞋子',   'image_url': '.../static/img/LeatherShoes.png'},
  {'name': 'Baseball Cap',  'price': 20, 'gender': '通用', 'category': '帽子',   'image_url': '.../static/img/BaseballCap.png'},
  {'name': 'Sun Hat',       'price': 25, 'gender': '女裝', 'category': '帽子',   'image_url': '.../static/img/SunHat.png'},
  {'name': 'Running Shoes', 'price': 85, 'gender': '通用', 'category': '鞋子',   'image_url': '.../static/img/RunningShoes.png'},
  {'name': 'Dress',         'price': 75, 'gender': '女裝', 'category': '上衣',   'image_url': '.../static/img/Dress.png'}
];

// === 顯示登入使用者名稱 & 登出 ===
(function showUsername() {
  const username = localStorage.getItem('username') || 'Guest';
  const nameEl = document.getElementById('username');
  if (nameEl) nameEl.textContent = username;

  const logoutLink = document.getElementById('logout-link');
  if (logoutLink) {
    logoutLink.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('username');
      alert('已登出，返回登入頁面');
      location.href = '/page_login_';
    });
  }

  // 若尚未登入自動導回登入頁
  if (!localStorage.getItem('username') && window.location.pathname !== '/page_login_') {
    alert('請先登入');
    window.location.href = '/page_login_';
  }
})();

// === 建立下單區塊 ===
if (document.querySelector('#products')) {
  (function ensureOrderButton() {
    if (!document.getElementById('place-order')) {
      const wrap = document.createElement('div');
      wrap.className = 'footer-actions';
      wrap.style.position = 'fixed';
      wrap.style.left = '12px';
      wrap.style.bottom = '12px';
      wrap.style.background = '#fff';
      wrap.style.border = '1px solid #e5e7eb';
      wrap.style.borderRadius = '8px';
      wrap.style.padding = '10px 12px';
      wrap.style.boxShadow = '0 6px 18px rgba(0,0,0,.06)';
      wrap.style.zIndex = '20';

      const btn = document.createElement('button');
      btn.id = 'place-order';
      btn.textContent = '下單';
      btn.disabled = true;
      btn.style.background = '#2563eb';
      btn.style.color = '#fff';
      btn.style.border = 'none';
      btn.style.padding = '8px 14px';
      btn.style.borderRadius = '6px';
      btn.style.cursor = 'not-allowed';
      btn.style.opacity = '0.4';

      const span = document.createElement('span');
      span.id = 'cart-summary';
      span.style.marginLeft = '12px';
      span.style.color = '#475569';

      wrap.appendChild(btn);
      wrap.appendChild(span);
      document.body.appendChild(wrap);
    }
  })();
}

const rowState = new Map();

function normalizeImg(url = '') {
  return url.replace(/\/{2,}/g, '/').replace('../static', './static');
}

// === 渲染產品表格 ===
function display_products(products_to_display) {
  const tbody = document.querySelector('#products table tbody');
  if (!tbody) return;
  tbody.innerHTML = '';

  for (let i = 0; i < products_to_display.length; i++) {
    const p = products_to_display[i];
    const key = `${p.name}-${i}`;
    if (!rowState.has(key)) rowState.set(key, { checked: false, qty: 0 });

    const state = rowState.get(key);
    const price = Number(p.price) || 0;
    const total = price * (state.qty || 0);
    const product_info = `
      <tr data-key="${key}">
        <td><input type="checkbox" class="row-check" ${state.checked ? 'checked' : ''}></td>
        <td><img src="${normalizeImg(p.image_url)}" alt="${p.name}" style="width:56px;height:56px;object-fit:cover;border:1px solid #e5e7eb;border-radius:6px;"></td>
        <td>${p.name}</td>
        <td data-price="${price}">${price.toLocaleString()}</td>
        <td>${p.gender}</td>
        <td>${p.category}</td>
        <td>
          <div class="qty" style="display:inline-flex;align-items:center;gap:6px;">
            <button type="button" class="btn-dec" style="padding:2px 8px;">-</button>
            <input type="number" class="qty-input" min="0" value="${state.qty}" style="width:64px;">
            <button type="button" class="btn-inc" style="padding:2px 8px;">+</button>
          </div>
        </td>
        <td class="row-total">${total.toLocaleString()}</td>
      </tr>
    `;
    tbody.insertAdjacentHTML('beforeend', product_info);
  }

  refreshSummary();
}

// === 表格事件 ===
(function bindTableEvents() {
  const tbody = document.querySelector('#products table tbody');
  if (!tbody) return;

  tbody.addEventListener('click', (e) => {
    const tr = e.target.closest('tr');
    if (!tr) return;
    const key = tr.getAttribute('data-key');
    const st = rowState.get(key) || { checked: false, qty: 0 };
    const chk = tr.querySelector('.row-check');
    const input = tr.querySelector('.qty-input');

    // 勾選事件
    if (e.target.classList.contains('row-check')) {
      st.checked = e.target.checked;
      if (st.checked) {
        st.qty = 1; // 勾選後數量從 0 -> 1
      } else {
        st.qty = 0; // 取消勾選 -> 歸 0
      }
      input.value = st.qty;
      rowState.set(key, st);
      refreshSummary();
      return;
    }

    // 減少數量
    if (e.target.classList.contains('btn-dec')) {
      const v = Math.max(0, Number(input.value || 0) - 1);
      input.value = v;
      st.qty = v;
      if (v <= 0) {
        chk.checked = false;
        st.checked = false;
      }
      rowState.set(key, st);
      refreshSummary();
      return;
    }

    // 增加數量
    if (e.target.classList.contains('btn-inc')) {
      const v = Math.max(0, Number(input.value || 0) + 1);
      input.value = v;
      st.qty = v;
      chk.checked = true;
      st.checked = true;
      rowState.set(key, st);
      refreshSummary();
      return;
    }
  });
})();

// === 更新總覽 ===
function refreshSummary() {
  const tbody = document.querySelector('#products table tbody');
  if (!tbody) return;

  let selectedCount = 0;
  let totalQty = 0;
  let totalPrice = 0;

  tbody.querySelectorAll('tr').forEach(tr => {
    const chk = tr.querySelector('.row-check');
    const input = tr.querySelector('.qty-input');
    const dec = tr.querySelector('.btn-dec');
    const inc = tr.querySelector('.btn-inc');
    const price = Number(tr.querySelector('[data-price]')?.dataset?.price || 0);
    const qty = Number(input?.value || 0);

    // === 禁用未勾選品項的按鈕、歸零 ===
    if (!chk.checked) {
      dec.disabled = true;
      inc.disabled = true;
      input.disabled = true;
      input.value = 0;
      dec.style.opacity = inc.style.opacity = '0.4';
      dec.style.cursor = inc.style.cursor = 'not-allowed';
    } else {
      dec.disabled = qty <= 1; // 數量=1 時，- 鎖定
      inc.disabled = false;
      input.disabled = false;
      dec.style.opacity = dec.disabled ? '0.4' : '1';
      inc.style.opacity = '1';
      dec.style.cursor = dec.disabled ? 'not-allowed' : 'pointer';
      inc.style.cursor = 'pointer';
    }

    // 累計
    if (chk.checked && qty > 0) {
      selectedCount++;
      totalQty += qty;
      totalPrice += qty * price;
    }

    const totalCell = tr.querySelector('.row-total');
    if (totalCell) totalCell.textContent = (price * qty).toLocaleString();
  });

  const btnOrder = document.getElementById('place-order');
  const summaryEl = document.getElementById('cart-summary');

  if (btnOrder) {
    if (selectedCount > 0 && totalQty > 0) {
      btnOrder.disabled = false;
      btnOrder.style.opacity = '1';
      btnOrder.style.cursor = 'pointer';
    } else {
      btnOrder.disabled = true;
      btnOrder.style.opacity = '0.4';
      btnOrder.style.cursor = 'not-allowed';
    }
  }

  if (summaryEl) {
    summaryEl.textContent = `已選 ${selectedCount} 項、總數量 ${totalQty}、總金額 $${totalPrice.toLocaleString()}`;
  }
}

// === 下單按鈕 ===
(function bindOrderButton() {
  const btnOrder = document.getElementById('place-order');
  if (!btnOrder) return;
  btnOrder.addEventListener('click', () => {
    const tbody = document.querySelector('#products table tbody');
    if (!tbody) return;
    const orderItems = [];
    tbody.querySelectorAll('tr').forEach(tr => {
      const chk = tr.querySelector('.row-check');
      if (!chk?.checked) return;
      const qty = Number(tr.querySelector('.qty-input')?.value || 0);
      const name = tr.children[2]?.textContent?.trim() || '';
      const price = Number(tr.querySelector('[data-price]')?.dataset?.price || 0);
      if (qty > 0) orderItems.push({ name, price, qty, total: price * qty });
    });
    if (!orderItems.length) return;
    console.log('下單內容：', orderItems);
    alert('下單成功！詳情請見主控台 (Console)。');
  });
})();

// === 首次渲染 ===
display_products(products);
