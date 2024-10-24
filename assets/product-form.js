if (!customElements.get('product-form')) {
    customElements.define(
      'product-form',
      class ProductForm extends HTMLElement {
        constructor() {
          super();
  
          this.form = this.querySelector('form');
          this.variantId = this.form.querySelector('input[name="id"]').value;
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
            
            // const config = fetchConfig('javascript');
            // config.headers['X-Requested-With'] = 'XMLHttpRequest';
            // delete config.headers['Content-Type'];
    
            //const formData = new FormData(this.form);
            // config.body = formData;
            let body = {
              id:this.variantId,
              quantity:1,
              sections: ["cart-drawer"],
              sections_url: window.location.pathname
            }
    
            fetch(`${routes.cart_add_url}`, {
              method:"POST",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
              },
              body:JSON.stringify(body)
            })
                .then((response) => response.text())
                .then((response) => {
                  let parseData = JSON.parse(response);
                  replaceWitnNewHtml(parseData.sections["cart-drawer"],'.cart-drawer', 'cart-drawer');
                  showCartWithDrawer();
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
  