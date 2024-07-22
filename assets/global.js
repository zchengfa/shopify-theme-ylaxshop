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
