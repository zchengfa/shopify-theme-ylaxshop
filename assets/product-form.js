if (!customElements.get('product-form')) {
    customElements.define(
      'product-form',
      class ProductForm extends HTMLElement {
        constructor() {
          super();
          this.isBtnListenter = this.attributes['listener']?.value === 'button'
          this.listener = this.isBtnListenter ? this.querySelector('button[name="add"]') : this.querySelector('form');
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
            const variantId =  this.isBtnListenter ? this.querySelector('.product-variant-id').value : this.listener.querySelector('input[name="id"]').value;

            let body = {
              id:variantId,
              quantity: this.isBtnListenter ? document.getElementById(this.listener.dataset['inputId']).value : 1,
              sections: this.updateToRender().map(section => section.section),
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
                    //更新选定section的页面数据
                    this.updateToRender().map((section)=> replaceWithNewHtml(parseData.sections[section.section],section.selector,section.id));
                    //若有抽屉购物车组件
                    if(document.getElementsByClassName('cart-container').item(0)){
                        showCartWithDrawer();
                        //重新监听按钮点击事件
                        hideCartWithDrawer();
                    }
                    showNotification('cart.add.success','success');
                })

                .catch((e) => {
                    showNotification('cart.add.error','error');

                })
                .finally(() => {
                    //失败，移除添加购物车按钮的效果
                    loadingEl.classList.add('hidden');
                    this.addBtnEl.classList.remove('hidden');
                });


        }
          updateToRender(){
              //需要部分渲染集合
              return [
                  //侧边购物车
                  {
                      id:"cart-drawer",
                      section: document.getElementById('cart-drawer')?.dataset?.id,
                      selector: '.cart-drawer'
                  },
                  //页面顶部购物车商品总数量
                  {
                      id:"HeaderCenterOther",
                      section: document.getElementById('HeaderCenterOther')?.dataset?.id,
                      selector: '.cart-display-type'
                  },
                  //产品详情页的产品部分
                  {
                      id: "main-product-content",
                      section: document.getElementById('main-product-content')?.dataset?.id,
                      selector: ".main-product-info"
                  }
              ]
          }
      }
    );
  }
