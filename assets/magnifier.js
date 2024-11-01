/**
 * @description 放大镜效果自定义元素
 */
class MagnifierImage extends HTMLElement {
    constructor() {
        super();
        this.showInMagnifier = this.dataset['showInMagnifier']; // 是否在放大镜中显示
        this.magnifierTimes = this.dataset['magnifierTimes']; // 放大倍数
    }
    connectedCallback() {
      const mask = this.querySelector('#MagnifierMask');
      const originalBox = this.querySelector('.magnifier-img-container');
      const magnifierBox = this.querySelector('.magnifier-img-box');
      this.listenBox(".original-img-box",{
        mask,originalBox,magnifierBox
      })
    }
  
    listenBox = (selector, elements, event)=>{
      let target = document.querySelector(selector),defaultEvent = ['mouseover','mousemove','mouseout'];
      !event ? event = defaultEvent : null;
      const listenEvent = (event,callback)=>{
        target.addEventListener(event,(e)=>callback(e))
      }
    
      const checkEvent = (event)=>{
        if(defaultEvent.indexOf(event) === -1){
          throw Error('Your event is not a mouse event !')
        }
        return defaultEvent.indexOf(event) !== -1;
      }
    
      const dealEvent = (event)=>{
        if(checkEvent(event)){
          listenEvent(event,(e)=>{
            switch (event){
              case 'mouseover':
                this.mouseoverEvent(elements);
                break;
              case 'mouseout':
                this.mouseoutEvent(elements);
                break;
              default:
                this.mousemoveEvent(e,elements);
            }
          })
        }
      }
    
      if(Array.isArray(event)){
        event.forEach((event)=>{
          dealEvent(event);
        })
      }
      else{
        dealEvent(event);
      }
    }
    
    mouseoverEvent = ({mask,magnifierBox,originalBox})=>{
      mask.style.display = 'block';
      magnifierBox.style.display = 'block';
      magnifierBox.style.backgroundSize = `${originalBox.clientWidth*this.magnifierTimes}px`;
      if(this.showInMagnifier === 'true'){
        mask.style.backgroundSize = `${originalBox.clientWidth*this.magnifierTimes}px`;
      }
    }
    mouseoutEvent = ({mask,magnifierBox})=>{
      mask.style.display = 'none';
      magnifierBox.style.display = 'none';
    }
    
    mousemoveEvent = (e,{mask,magnifierBox,originalBox})=>{
      let x = e.pageX - originalBox.offsetLeft , y = e.pageY - originalBox.offsetTop;
      let thresholdX = originalBox.clientWidth - mask.clientWidth , thresholdY = originalBox.clientHeight - mask.clientHeight;
      x -= mask.offsetWidth / 2 ;
      y -= mask.offsetHeight / 2;
     
      x = x < 0 ? 0 : x;
      x = x > thresholdX ? thresholdX : x;
      y = y < 0 ? 0 : y;
      y = y > thresholdY ? thresholdY : y;
      mask.style.left = x + 'px';
      mask.style.top = y + 'px';

      if(this.showInMagnifier === 'true'){
        mask.style.backgroundPosition = `${(x/thresholdX)*100}% ${(y/thresholdY)*100}%`;
      }

      magnifierBox.style.backgroundPosition = `${(x/thresholdX)*100}% ${(y/thresholdY)*100}%`;
      
    }
    
  }
  
  customElements.define('magnifier-image',MagnifierImage);
