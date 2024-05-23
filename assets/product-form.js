if (!customElements.get('product-form')) {
    customElements.define(
      'product-form',
      class ProductForm extends HTMLElement {
        constructor() {
          super();
  
          this.form = this.querySelector('form');
          this.addBtnEl = this.getElementsByClassName('add-btn').item(0);
          this.form.addEventListener('submit', (e)=>{
            this.onSubmitHandler(e);
          });
        }
  
        onSubmitHandler(evt) {
            evt.preventDefault();

            let loadingEl = this.getElementsByClassName('loading__spinner').item(0);
            loadingEl.classList.remove('hidden');
            this.addBtnEl.classList.add('hidden');

            const config = fetchConfig('javascript');
            config.headers['X-Requested-With'] = 'XMLHttpRequest';
            delete config.headers['Content-Type'];
    
            const formData = new FormData(this.form);
            
            config.body = formData;
    
            fetch(`${routes.cart_add_url}`, config)
                .then((response) => response.json())
                .then((response) => {
                  
                   showCartWithDrawer();
                   if (response.status) {
                    publish(PUB_SUB_EVENTS.cartError, {
                      source: 'product-form',
                      productVariantId: formData.get('id'),
                      errors: response.errors || response.description,
                      message: response.message,
                    });
                   
                    return;
                  }
                 
                })
                .catch((e) => {
                    console.error(e);
                    
                })
                .finally(() => {
                    //失败，移除添加购物车按钮的效果
                    loadingEl.classList.add('hidden');
                    this.addBtnEl.classList.remove('hidden');
                });
    

        }
      }
    );
  }
  