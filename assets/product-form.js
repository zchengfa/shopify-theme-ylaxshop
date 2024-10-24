if (!customElements.get('product-form')) {
    customElements.define(
      'product-form',
      class ProductForm extends HTMLElement {
        constructor() {
          super();
          this.isBtnListenter = this.attributes['listener']?.value === 'button'
          this.listener = this.isBtnListenter ? this.querySelector('button[name="add"]') : this.querySelector('form');
          this.variantId = this.isBtnListenter ? this.attributes['variant-id'].value : this.listener.querySelector('input[name="id"]').value;
          this.addBtnEl = this.getElementsByClassName('add-btn').item(0);
          this.listener.addEventListener(this.isBtnListenter ? 'click' : 'submit', (e)=>{
            this.onSubmitHandler(e);
          });

          this.label = document.getElementsByClassName('quantity__label')?.item(0)
        
        }
  
        onSubmitHandler(evt) {
            evt.preventDefault();
            if(this.label){
              this.label.querySelector('.loading__spinner').classList.remove('hidden')
              this.label.querySelector('.quantity-cart-span').classList.add('hidden');
            }

            let loadingEl = this.getElementsByClassName('loading__spinner').item(0);
            loadingEl.classList.remove('hidden');
            this.addBtnEl.classList.add('hidden');
            
            let body = {
              id:this.variantId,
              quantity: this.isBtnListenter ? document.getElementById(this.listener.dataset['inputId']).value : 1,
              sections: this.label ? ["cart-drawer",`${this.listener.dataset['sectionId']}`] : ["cart-drawer"],
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
                  this.label ? replaceWitnNewHtml(parseData.sections[`${this.listener.dataset['sectionId']}`],".quantity__label", "main-product-info") : null
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
  