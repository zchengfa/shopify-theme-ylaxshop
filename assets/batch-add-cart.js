if (!customElements.get('batch-add-cart')) {
  class BatchAddCart extends HTMLElement {
    constructor() {
      super();

      this.batchToggleButton = this.querySelector('.batch-toggle-button');
      this.batchVariantsList = this.querySelector('.batch-variants-list');
      this.batchActions = this.querySelector('.batch-actions');
      this.batchCancelButton = this.querySelector('.batch-cancel-button');
      this.batchAddButton = this.querySelector('.batch-add-button');
      this.quantityButtons = this.querySelectorAll('.batch-variant-item .quantity__button');
      this.variantCheckboxes = this.querySelectorAll('.variant-checkbox');
      this.initBtachBtnTxt = this.dataset['initBtn'];
      this.batchQuantities = this.querySelectorAll('.batch-quantity');

      this.toggleBatchBtn = this.toggleBatchBtn.bind(this);
      this.cancelBtnClick = this.cancelBtnClick.bind(this);
      this.batchAdd = this.batchAdd.bind(this);
      this.quantityChange = this.quantityChange.bind(this);
      this.quantityInputChange = this.quantityInputChange.bind(this);
    }

    connectedCallback() {
      this.batchToggleButton.addEventListener('click', this.toggleBatchBtn);
      this.batchCancelButton.addEventListener('click', this.cancelBtnClick);
      this.batchAddButton.addEventListener('click', this.batchAdd);

      this.quantityButtons.forEach((btn) => {
        btn.addEventListener('click', this.quantityChange);
      });

      this.batchQuantities.forEach((input) => {
        input.addEventListener('change', this.quantityInputChange);
      });
    }

    disconnectedCallback() {
      this.batchToggleButton.removeEventListener('click', this.toggleBatchBtn);
      this.batchCancelButton.removeEventListener('click', this.cancelBtnClick);
      this.batchAddButton.removeEventListener('click', this.batchAdd);

      this.quantityButtons.forEach((btn) => {
        btn.removeEventListener('click', this.quantityChange);
      });

      this.batchQuantities.forEach((input) => {
        input.removeEventListener('change', this.quantityInputChange);
      });
    }

    // ✅ 批量加购
    batchAdd() {
      const quantityInputs = this.querySelectorAll('.batch-quantity');
      const cartLineItems = [];

      quantityInputs.forEach(input => {
        const variantId = input.dataset.variantId;
        const checkbox = this.querySelector(`.variant-checkbox[data-variant-id="${variantId}"]`);
        const quantity = parseInt(input.value) || 0;

        if (checkbox?.checked && quantity > 0) {
          cartLineItems.push({
            id: variantId,
            quantity: quantity
          });
        }
      });

      if (cartLineItems.length === 0) {
        alert('Please select at least one item to add to cart');
        return;
      }

      this.batchAddButton.innerHTML = '<span class="loading-spinner"></span> Adding...';
      this.batchAddButton.disabled = true;

      const section1 = document.getElementById('HeaderCenterOther')?.dataset['id'] ;
      const section2 = document.getElementById('cart-drawer')?.dataset['id'];
      const sections = [section1, section2].filter(Boolean).join(',');

      fetch('/cart/add.js', {
        ...fetchConfig(),
        body: JSON.stringify({
          items: cartLineItems,
          sections: sections
        })
      })
          .then(response => response.json())
          .then(data => {
            window.showNotification?.('cart.add.success');
            if(section1){
              replaceWithNewHtml(data.sections[section1],'.cart-display-type','HeaderCenterOther')
            }
            if(section2){
              replaceWithNewHtml(data.sections[section2],'.cart-drawer','cart-drawer')
            }

            quantityInputs.forEach(input => input.value = '0');
            this.variantCheckboxes.forEach(checkbox => checkbox.checked = false);

            this.batchVariantsList.classList.add('hidden');
            this.batchActions.classList.add('hidden');
          })
          .catch(err => {
            window.showNotification?.('cart.add.error');
          })
          .finally(() => {
            this.batchAddButton.innerHTML = this.initBtachBtnTxt;
            this.batchAddButton.disabled = false;
          });
    }

    quantityInputChange(e) {
      const input = e.target;
      const variantId = input.dataset.variantId;
      const checkbox = this.querySelector(`.variant-checkbox[data-variant-id="${variantId}"]`);
      const val = parseInt(input.value) || 0;

      checkbox.checked = val > 0;
    }

    quantityChange(e) {
      const btn = e.target;
      const input = btn.closest('.batch-variant-item').querySelector('.batch-quantity');
      const variantId = input.dataset.variantId;
      const checkbox = this.querySelector(`.variant-checkbox[data-variant-id="${variantId}"]`);
      let current = parseInt(input.value) || 0;

      if (btn.name === 'plus') {
        input.value = current + 1;
        checkbox.checked = true;
      } else if (btn.name === 'minus') {
        if (current > 0) input.value = current - 1;
        if (current - 1 <= 0) checkbox.checked = false;
      }
    }

    cancelBtnClick() {
      this.batchVariantsList.classList.add('hidden');
      this.batchActions.classList.add('hidden');
    }

    toggleBatchBtn() {
      this.batchVariantsList.classList.toggle('hidden');
      this.batchActions.classList.toggle('hidden');
    }
  }

  customElements.define('batch-add-cart', BatchAddCart);
}
