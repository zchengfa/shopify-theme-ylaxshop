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


class Typewriter extends HTMLElement {
  constructor() {
    super();

    this.poetCollection = this.querySelectorAll('.poet-item');
    this.poetCollection.forEach((poet,index) => {
      this.querySelectorAll('.typewriter-span')[index].style.borderLeft = 'none';
    })
    this.index = 0;
    this.isAnimate = this.getAttribute('animation')
  }
  addTypewriterAnimation() {
    let stringArr = this.poetCollection[this.index].textContent.replace(/\s+/g, "");
    this.querySelectorAll('.typewriter-span')[this.index].style.borderLeft = '2px solid #000';
    let typewriterEl = this.querySelectorAll('.typewriter-span')[this.index];
    typewriterEl.style.animation = `typewriter ${stringArr.length * .2}s steps(${stringArr.length}, end) forwards,flashing .3s ease-out forwards infinite`;
    typewriterEl.addEventListener('animationend', () => {
      typewriterEl.style.display = 'none';
      this.index++;
      if (this.index < this.poetCollection.length) {
        this.addTypewriterAnimation();
      }
    })
  }
  connectedCallback(){
   if(this.isAnimate === 'true'){
    const intersectionObserverHandler = (entries,observer)=>{
      if(entries[0].isIntersecting){
        this.addTypewriterAnimation();

        //停止观察，达到只执行一次的效果
        observer.unobserve(this);
      }
    }


    new IntersectionObserver(intersectionObserverHandler.bind(this),{rootMargin:'0px 0px -50px 0px'}).observe(this);
   }
  }

}

customElements.define('type-writer', Typewriter);

class ModalDialog extends HTMLElement {
  constructor() {
    super();
    this.querySelector('[id^="ModalClose-"]').addEventListener('click', this.hide.bind(this, false));
    this.addEventListener('keyup', (event) => {
      if (event.code.toUpperCase() === 'ESCAPE') this.hide();
    });
    if (this.classList.contains('media-modal')) {
      this.addEventListener('pointerup', (event) => {
        if (event.pointerType === 'mouse' && !event.target.closest('deferred-media, product-model')) this.hide();
      });
    } else {
      this.addEventListener('click', (event) => {
        if (event.target === this) this.hide();
      });
    }
  }

  connectedCallback() {
    if (this.moved) return;
    this.moved = true;
    document.body.appendChild(this);
  }

  show(opener) {
    this.openedBy = opener;
    const popup = this.querySelector('.template-popup');
    document.body.classList.add('overflow-hidden');
    this.setAttribute('open', '');
    if (popup) popup.loadContent();
    trapFocus(this, this.querySelector('[role="dialog"]'));
    window.pauseAllMedia();
  }

  hide() {
    document.body.classList.remove('overflow-hidden');
    document.body.dispatchEvent(new CustomEvent('modalClosed'));
    this.removeAttribute('open');
    removeTrapFocus(this.openedBy);
    window.pauseAllMedia();
  }
}
customElements.define('modal-dialog', ModalDialog);

class ModalOpener extends HTMLElement {
  constructor() {
    super();

    const button = this.querySelector('button');

    if (!button) return;
    button.addEventListener('click', () => {
      const modal = document.querySelector(this.getAttribute('data-modal'));
      if (modal) modal.show(button);
    });
  }
}
customElements.define('modal-opener', ModalOpener);

class Countdown extends HTMLElement {
  constructor() {
    super();
    this.timer = null;
    this.beforeTime = { day: '00', hour: '00', minute: '00', second: '00' };
    this.timeUnits = ['day', 'hour', 'minute', 'second'];
    this.timeBoxes = {};
  }

  connectedCallback() {
    this.init();
  }

  disconnectedCallback() {
    this.stopCountdown();
  }

  init() {
    // 获取结束时间
    this.activity_end_time = this.dataset.activity_end_time || '';
    if (this.activity_end_time.includes('+')) {
      this.activity_end_time = this.activity_end_time.replace('+', ' ');
    }

    // 缓存DOM元素
    this.cacheDOM();

    // 验证时间
    if (!this.validateTimeFormat()) {
      console.warn('倒计时时间格式无效或已过期');
      return;
    }

    // 初始显示
    this.updateDisplay();

    // 开始倒计时
    this.startCountdown();
  }

  cacheDOM() {
    this.timeUnits.forEach(unit => {
      const container = this.querySelector(`[data-time-name="${unit}"]`);
      if (container) {
        this.timeBoxes[unit] = {
          container: container,
          cards: container.querySelectorAll('.card-item'),
          // 添加当前值和目标值的缓存
          currentValue: '00',
          nextValue: '00'
        };
      }
    });
  }

  validateTimeFormat() {
    if (!this.activity_end_time) return false;

    const endTime = new Date(this.activity_end_time).getTime();
    const now = Date.now();

    // 检查是否有效时间且在未来
    return !isNaN(endTime) && endTime > now;
  }

  getRemainingTime() {
    const now = Date.now();
    const end = new Date(this.activity_end_time).getTime();
    const diff = Math.max(0, end - now);

    if (diff <= 0) {
      this.stopCountdown();
      return { day: '00', hour: '00', minute: '00', second: '00' };
    }

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
      day: days.toString().padStart(2, '0'),
      hour: hours.toString().padStart(2, '0'),
      minute: minutes.toString().padStart(2, '0'),
      second: seconds.toString().padStart(2, '0')
    };
  }

  updateDisplay() {
    const currentTime = this.getRemainingTime();

    this.timeUnits.forEach(unit => {
      const box = this.timeBoxes[unit];
      if (box && box.cards) {
        const newValue = currentTime[unit];

        // 如果值发生变化，触发翻牌动画
        if (box.currentValue !== newValue) {
          this.triggerFlipAnimation(box, unit, newValue);
          box.currentValue = newValue;
        }
      }
    });

    this.beforeTime = currentTime;
  }

  triggerFlipAnimation(box, unit, newValue) {
    const cards = box.cards;
    if (!cards || cards.length < 4) return;

    // 更新上半部分卡片（立即显示新值）
    cards[0].textContent = newValue;

    // 触发下半部分的翻牌动画
    cards[1].classList.add('flip_card_2');
    cards[1].textContent = newValue;

    cards[2].classList.add('flip_card_3');

    // 动画结束后更新下半部分卡片
    const onAnimationEnd = () => {
      cards[1].classList.remove('flip_card_2');
      cards[2].classList.remove('flip_card_3');
      cards[2].textContent = newValue;
      cards[3].textContent = newValue;

      // 清理事件监听
      cards[1].removeEventListener('animationend', onAnimationEnd);
      cards[2].removeEventListener('animationend', onAnimationEnd);
    };

    cards[1].addEventListener('animationend', onAnimationEnd, { once: true });
    cards[2].addEventListener('animationend', onAnimationEnd, { once: true });
  }

  startCountdown() {
    // 先立即更新一次
    this.updateDisplay();

    // 使用setInterval保持精确的1秒间隔
    this.timer = setInterval(() => {
      this.updateDisplay();

      // 检查是否结束
      const remaining = this.getRemainingTime();
      if (remaining.day === '00' && remaining.hour === '00' &&
          remaining.minute === '00' && remaining.second === '00') {
        this.stopCountdown();
        this.dispatchEvent(new CustomEvent('countdown-end', {
          bubbles: true,
          detail: { message: '活动已结束' }
        }));
      }
    }, 1000);
  }

  stopCountdown() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}

// 注册组件
if (!customElements.get('count-down')) {
  customElements.define('count-down', Countdown);
}
