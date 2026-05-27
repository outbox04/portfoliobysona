(function () {
  const products = Array.isArray(window.__SHOP_PRODUCTS__) ? window.__SHOP_PRODUCTS__ : [];
  const storageKey = 'hs_shop_cart';
  const money = value => `${Number(value || 0).toLocaleString('vi-VN')}đ`;

  function getCart() {
    try {
      return JSON.parse(localStorage.getItem(storageKey)) || [];
    } catch (error) {
      return [];
    }
  }

  function setCart(cart) {
    localStorage.setItem(storageKey, JSON.stringify(cart));
    updateCartCount();
    renderCart();
  }

  function findProduct(slug) {
    return products.find(product => product.slug === slug);
  }

  function addToCart(slug, quantity) {
    const product = findProduct(slug);
    if (!product) return;
    const cart = getCart();
    const item = cart.find(entry => entry.slug === slug);
    if (item) item.quantity += quantity || 1;
    else cart.push({ slug, quantity: quantity || 1 });
    setCart(cart);
    toast(`${product.title} đã thêm vào giỏ`);
  }

  function removeFromCart(slug) {
    setCart(getCart().filter(item => item.slug !== slug));
  }

  function updateQuantity(slug, direction) {
    const cart = getCart().map(item => {
      if (item.slug !== slug) return item;
      return { ...item, quantity: Math.max(1, item.quantity + direction) };
    });
    setCart(cart);
  }

  function updateCartCount() {
    const count = getCart().reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll('[data-cart-count]').forEach(node => {
      node.textContent = count;
    });
  }

  function cartTotals() {
    const subtotal = getCart().reduce((sum, item) => {
      const product = findProduct(item.slug);
      return sum + (product ? product.price * item.quantity : 0);
    }, 0);
    const vat = Math.round(subtotal * 0.08);
    return { subtotal, vat, total: subtotal + vat };
  }

  function renderCart() {
    const lists = document.querySelectorAll('[data-cart-list]');
    if (!lists.length) return;
    const cart = getCart();

    lists.forEach(list => {
      const mini = list.hasAttribute('data-checkout-mini');
      if (!cart.length) {
        list.innerHTML = mini ? '<p class="muted">Chưa có sản phẩm.</p>' : '<div class="empty-state"><h2>Giỏ hàng đang trống</h2><p>Chọn một product trong shop để bắt đầu.</p><a class="btn btn--primary" href="/shop">Về shop</a></div>';
        return;
      }

      list.innerHTML = cart.map(item => {
        const product = findProduct(item.slug);
        if (!product) return '';
        if (mini) {
          return `<div class="summary-line"><span>${product.title} x ${item.quantity}</span><strong>${money(product.price * item.quantity)}</strong></div>`;
        }
        return `
          <article class="cart-item">
            <img src="${product.thumbnail}" alt="" loading="lazy" />
            <div>
              <h3>${product.title}</h3>
              <p>${product.access} - ${product.priceText}</p>
              <button class="btn btn--soft" type="button">Save for later</button>
            </div>
            <div class="cart-item__actions">
              <button type="button" data-cart-minus="${product.slug}">-</button>
              <strong>${item.quantity}</strong>
              <button type="button" data-cart-plus="${product.slug}">+</button>
              <button type="button" data-cart-remove="${product.slug}">Remove</button>
            </div>
          </article>
        `;
      }).join('');
    });

    const totals = cartTotals();
    document.querySelectorAll('[data-subtotal]').forEach(node => { node.textContent = money(totals.subtotal); });
    document.querySelectorAll('[data-vat]').forEach(node => { node.textContent = money(totals.vat); });
    document.querySelectorAll('[data-total]').forEach(node => { node.textContent = money(totals.total); });
  }

  function toast(message) {
    let node = document.querySelector('.shop-toast');
    if (!node) {
      node = document.createElement('div');
      node.className = 'shop-toast';
      document.body.appendChild(node);
    }
    node.textContent = message;
    node.classList.add('is-visible');
    clearTimeout(node._timer);
    node._timer = setTimeout(() => node.classList.remove('is-visible'), 2200);
  }

  document.addEventListener('click', event => {
    const addButton = event.target.closest('[data-add-cart]');
    if (addButton) {
      addToCart(addButton.dataset.slug, 1);
    }

    const buyButton = event.target.closest('[data-buy-now]');
    if (buyButton) {
      event.preventDefault();
      addToCart(buyButton.dataset.slug, 1);
      window.location.href = '/checkout';
    }

    const minus = event.target.closest('[data-cart-minus]');
    if (minus) updateQuantity(minus.dataset.cartMinus, -1);

    const plus = event.target.closest('[data-cart-plus]');
    if (plus) updateQuantity(plus.dataset.cartPlus, 1);

    const remove = event.target.closest('[data-cart-remove]');
    if (remove) removeFromCart(remove.dataset.cartRemove);

    const favorite = event.target.closest('[data-favorite]');
    if (favorite) {
      favorite.classList.toggle('is-favorited');
      favorite.textContent = favorite.classList.contains('is-favorited') ? 'Đã yêu thích' : 'Yêu thích';
    }
  });

  document.querySelector('[data-shop-menu]')?.addEventListener('click', () => {
    document.querySelector('.shop-nav__links')?.classList.toggle('is-open');
  });

  window.addEventListener('scroll', () => {
    document.querySelector('[data-shop-nav]')?.classList.toggle('is-scrolled', window.scrollY > 20);
  }, { passive: true });

  document.querySelector('[data-shop-search]')?.addEventListener('input', event => {
    const query = event.target.value.trim().toLowerCase();
    document.querySelectorAll('[data-product-card]').forEach(card => {
      card.hidden = query && !card.dataset.title.includes(query);
    });
  });

  document.querySelectorAll('[data-countdown]').forEach(node => {
    const target = new Date(node.dataset.countdown).getTime();
    const label = node.querySelector('[data-countdown-label]');
    if (!label || !target) return;

    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) {
        label.textContent = 'Đã đóng';
        return;
      }
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      label.textContent = `Còn ${days} ngày ${hours} giờ ${minutes} phút`;
    };
    tick();
    setInterval(tick, 60000);
  });

  document.querySelectorAll('[data-filter-sort]').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-filter-sort]').forEach(item => item.classList.remove('is-active'));
      button.classList.add('is-active');
      sortCatalog(button.dataset.filterSort);
    });
  });

  document.querySelectorAll('[data-filter-type]').forEach(button => {
    button.addEventListener('click', () => {
      const type = button.dataset.filterType;
      button.classList.toggle('is-active');
      const active = button.classList.contains('is-active');
      document.querySelectorAll('[data-product-card]').forEach(card => {
        card.hidden = active && card.dataset.type !== type;
      });
    });
  });

  document.querySelector('[data-mobile-sort]')?.addEventListener('change', event => {
    sortCatalog(event.target.value);
  });

  function sortCatalog(mode) {
    const grid = document.querySelector('[data-catalog-grid]');
    if (!grid) return;
    const cards = Array.from(grid.querySelectorAll('[data-product-card]'));
    cards.sort((a, b) => {
      if (mode === 'price') return Number(a.dataset.price) - Number(b.dataset.price);
      if (mode === 'bestseller') return Number(b.dataset.bestseller === 'true') - Number(a.dataset.bestseller === 'true');
      return a.dataset.title.localeCompare(b.dataset.title);
    });
    cards.forEach(card => grid.appendChild(card));
  }

  document.querySelector('[data-kpi-tool]')?.addEventListener('submit', event => {
    event.preventDefault();
    const form = event.currentTarget;
    const result = document.querySelector('[data-kpi-result]');
    const goal = new FormData(form).get('goal') || 'campaign growth';
    if (!result) return;
    result.innerHTML = '<span class="skeleton"></span><span class="skeleton skeleton--short"></span>';
    setTimeout(() => {
      result.innerHTML = `
        <strong>KPI Tree demo cho: ${String(goal).replace(/[<>]/g, '')}</strong>
        <p>North Star: qualified revenue pipeline. Chỉ số dẫn: chất lượng traffic, chuyển đổi lead, CAC payback, tốc độ sản xuất content. Chỉ số trễ: MQL, SQL, doanh thu và tín hiệu retention.</p>
      `;
    }, 650);
  });

  document.querySelector('[data-checkout-form]')?.addEventListener('submit', event => {
    event.preventDefault();
    const success = document.querySelector('[data-checkout-success]');
    if (success) success.hidden = false;
    toast('Đơn hàng mock đã được tạo');
  });

  updateCartCount();
  renderCart();
})();
