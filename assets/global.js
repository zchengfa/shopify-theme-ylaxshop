function fetchConfig(type = 'json') {
    return {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: `application/${type}` },
    };
  }

function showCartWithDrawer(){
  
  document.getElementsByClassName('cart-container')?.item(0).classList.remove('hidden');
   document.getElementsByClassName('cart-container')?.item(0).classList.add('cart-show');
  let timer = setTimeout(()=>{
   
      document.getElementsByClassName('cart-drawer')?.item(0).classList.add('animate-drawer');
      clearTimeout(timer);
  }); 
}

function hideCartWithDrawer(){
  const el =  document.getElementsByClassName('cart-container').item(0);
  const closeEl =  document.getElementsByClassName('cart-close-btn').item(0);

  el?.addEventListener('click',(e)=>{
      if(e.target === e.currentTarget){
          animateCart();
      } 
  });

  closeEl?.addEventListener('click',()=>{
      animateCart();
  })

  function animateCart(){
      document.getElementsByClassName('cart-drawer')?.item(0).classList.remove('animate-drawer');
          let timer = setTimeout(()=>{
              el.classList.remove('cart-show');
              el.classList.add('hidden');
              clearTimeout(timer);
          },500);
  }

}

function debounce(func,delay){
  let timer = null;
  return function (...args){
    if(timer){
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      func.apply(this,args);
    },delay);
  }
}

function throttle (func,delay) {
  let flag = true
  return function (...args) {
      if (flag) {
          setTimeout(()=>{
              func.call(this,args)
              flag = true
          },delay)
      }
      flag = false
  }
}


  /**
   * @description 用新数据替换旧数据以达到页面部分更新效果
   * @param {string} html 新数据
   * @param {string} selector 要替换的目标
   * @param {string} id 在哪个元素内
   */
  function replaceWitnNewHtml(html, selector,id){
    
    if(html){
      
       let parseHtml = new DOMParser().parseFromString(html,'text/html').querySelector(selector);
       
       let replaceEl = document.getElementById(id).querySelector(selector);
      
       replaceEl.innerHTML = parseHtml.innerHTML;
    }

  }


//发布、
let subscribers = {};

function subscribe(eventName, callback) {
  if (subscribers[eventName] === undefined) {
    subscribers[eventName] = [];
  }

  subscribers[eventName] = [...subscribers[eventName], callback];

  return function unsubscribe() {
    subscribers[eventName] = subscribers[eventName].filter((cb) => {
      return cb !== callback;
    });
  };
}

function publish(eventName, data) {
  if (subscribers[eventName]) {
    subscribers[eventName].forEach((callback) => {
      callback(data);
    });
  }
}

  class HeaderDrawer extends HTMLElement{
    constructor(){
      super();
    }
  }

customElements.define('header-drawer',HeaderDrawer);


if(!customElements.get('intersection-box')){
  customElements.define('intersection-box',
    class IntersectionBox extends HTMLElement{
      constructor(){
        super();
      }

      connectedCallback(){
        const intersectionObserverHandler = (entries,observer)=>{
          if(entries[0].isIntersecting){
            this.classList.add('animate-intersection-el');
          }
        }


        new IntersectionObserver(intersectionObserverHandler.bind(this),{rootMargin:'0px 0px -50px 0px'}).observe(this);
      }
    }
  );
}



if(!customElements.get('recommend-products')){
  customElements.define('recommend-products',
    class RecommendProducts extends HTMLElement {
      constructor(){
        super();

        this.productRecommendationsSection = this.getElementsByClassName('product-recommendations').item(0);
        
      
      }
     
      connectedCallback(){
        const url = this.productRecommendationsSection.dataset.url;
      
          fetch(url)
            .then(response => response.text())
            .then(text => {
              const html = document.createElement('div');
              html.innerHTML = text;
              const recommendations = html.querySelector('.product-recommendations');
      
              if (recommendations && recommendations.innerHTML.trim().length) {
                this.productRecommendationsSection.innerHTML = recommendations.innerHTML;
              }
            })
            .catch(e => {
              console.error(e);
            });
      }
    }
  )

}


if(!customElements.get('main-product-info-other')){
  customElements.define('main-product-info-other',
    class MainProductInfoOther extends HTMLElement {
      constructor(){
        super();
        this.productDetailDescContent = this.getElementsByClassName('product-detail-desc-content').item(0);
        this.recommendations = this.getElementsByClassName('recommendations-ul').item(0);
        this.mainDesOther = this.getElementsByClassName('main-product-info-other').item(0);
        

        if(!this.productDetailDescContent){
          
          this.mainDesOther.classList = 'main-product-info-other product-info-other-normal';
          if(this.recommendations){
            this.recommendations.classList = 'recommendations-ul recommendations-ul-flex-row';
          }
          
        }
      }
    }
   
  )
}

class QuantityInput extends HTMLElement {
  constructor() {
    super();
    this.input = this.querySelector('input');
    this.min = this.input.getAttribute('min') || 1;
    this.addBtn = this.querySelector('button[name="plus"]');
    this.minusBtn = this.querySelector('button[name="minus"]');
    this.removeBtn = this.querySelector('button[name="remove"]');
    this.addBtn.addEventListener('click', this.addBtnClick);
    this.minusBtn.addEventListener('click', this.minusBtnClick);
    this.removeBtn?.addEventListener('click', this.removeBtnClick);
    this.variantId = this.input.getAttribute('data-quantity-variant-id');
    this.loadingEl = document.getElementById(this.dataset['loadingParent'])?.querySelector('.loading__spinner');
  };

  addBtnClick = () => {
    this.input.value = this.input.value*1 + 1
    if(this.dataset['fetchAllowed'] !== 'false'){
      this.updateQuantity(this.input.value)
    }
  }
  minusBtnClick = () => {
    if (this.input.value > this.min) {
      this.input.value -= 1
      if(this.dataset['fetchAllowed'] !== 'false'){
        this.updateQuantity(this.input.value)
      }
    }
  }
  removeBtnClick = () => {
    this.updateQuantity(0);
  }
  /**
   * @description 修改购物车中对应产品的数量，并触发页面部分更新
   * @param {string | number} value 对应产品操作后的数量
   */
  updateQuantity = (value) => {
    //阻止表单提交跳转
    document.getElementById('CartDrawer-Form').addEventListener('submit', function (e) {
      e.preventDefault();
    })
    this.loadingEl?.classList.remove('hidden')
    /**
     * @description 定义请求参数
     * @property id:对应产品的id
     * @property quantity:对应产品操作后的数量
     * @property {Array} sections:需要更新的页面部分
     * @property {string} sections_url:需要更新的页面部分对应的url
     */
    let body = {
      id:this.variantId,
      quantity:value,
      sections: this.updateToRender().map(section => section.section),
      sections_url: window.location.pathname,
    }
    fetch(`${routes.cart_change_url}`,{
      method:"POST",
      //headers中的Accept表示获取服务器推送的数据类型
      headers: { 'Content-Type': 'application/json', Accept: `application/json` },
      body: JSON.stringify(body)
    }).then((response)=>{
      return response.text();
    }).then((data)=>{
      //数据转换
      let parseData = JSON.parse(data);
      //更新选定section的页面数据
      this.updateToRender().map((section)=> replaceWitnNewHtml(parseData.sections[section.section],section.selector,section.id));
      //重新监听事件
      hideCartWithDrawer();
    })
  }

  /**
   * @description 定义需要更新的section、选择器目标等
   * @returns {Array} 需要更新的页面部分
   */
  updateToRender(){
    //需要部分渲染集合
    return [
      //侧边购物车
      {
        id:"cart-drawer",
        section: document.getElementById('cart-drawer')?.dataset?.id,
        selector: '.cart-drawer'
      },
      //页面购物车子项
      {
        id:"main-cart-items",
        section: document.getElementById('main-cart-items')?.dataset?.id,
        selector: '.js-contents'
      },
      //页面购物车底部
      {
        id:"main-cart-footer",
        section: document.getElementById('main-cart-footer')?.dataset?.id,
        selector: '.js-contents'
      },
      //商品详情页提示商品在购物车中的数量
      {
        id:"quantity-label",
        section: document.getElementById('quantity-label')?.dataset?.id,
        selector: '.quantity__rules-cart'
      },
      //页面顶部购物车商品总数量
      {
        id:"HeaderCenterOther",
        section: document.getElementById('HeaderCenterOther')?.dataset?.id,
        selector: '.cart-display-type'
      }
    ]
  }
}

customElements.define('quantity-input', QuantityInput);