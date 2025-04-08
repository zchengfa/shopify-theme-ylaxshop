/**
 * @description 放大镜效果自定义元素
 */
class MagnifierImage extends HTMLElement {
    constructor() {
        super();
        this.showInMagnifier = this.dataset['showInMagnifier']; // 是否在放大镜中显示
        this.magnifierTimes = this.dataset['magnifierTimes']; // 放大倍数
    }
    closeMedia(){
      let video = this.querySelector('video');
      video.pause();
      video.currentTime = 0;
      this.querySelector('.main-video-box').style.display = 'none';
      this.querySelector('.close-media-btn').style.display = 'none';

    }
    showMedia(){
      this.querySelector('.close-media-btn').style.display = 'flex';
      let videoBox = this.querySelector('.main-video-box');
      videoBox.style.display = "block";
      videoBox.style.zIndex = "100";
    }
    connectedCallback() {
      const mask = this.querySelector('#MagnifierMask');
      const originalBox = this.querySelector('.magnifier-img-container');
      const magnifierBox = this.querySelector('.magnifier-img-box');
      if(this.dataset['zoomType'] === 'hover'){
        this.listenBox(".original-img-box",{
          mask,originalBox,magnifierBox
        })
      }

      const closeMediaBtn = this.querySelector('.close-media-btn');
      closeMediaBtn?.addEventListener('click', () => {
        this.closeMedia();
      })

      const playBtn = this.querySelector('.play-media-btn');
      playBtn?.addEventListener('click',()=>{
        this.showMedia();
      });
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
            //判断用户当前是否在观看商品视频，观看视频时不显示放大镜效果
            let videoElDisplay = undefined;
            if(this.querySelector('.main-video-box')){
              videoElDisplay = window.getComputedStyle(this.querySelector('.main-video-box')).display;
            }
            switch (event){
              case 'mouseover':
                if(videoElDisplay === 'none' || !videoElDisplay){
                  this.mouseoverEvent(elements);
                }
                break;
              case 'mouseout':
                this.mouseoutEvent(elements);
                break;
              default:
                if(videoElDisplay === 'none' || !videoElDisplay){
                  this.mousemoveEvent(e,elements);
                }
                
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
      window.requestAnimationFrame(()=>{
        //判断视口是否大于750
        if(document.body.clientWidth > 750){
          mask.style.display = 'block';
          magnifierBox.style.display = 'block';
          magnifierBox.style.backgroundSize = `${originalBox.clientWidth*this.magnifierTimes}px`;
          if(this.showInMagnifier === 'true'){
            mask.style.backgroundSize = `${originalBox.clientWidth*this.magnifierTimes}px`;
          }    
        }
        
      });
        
    }
    mouseoutEvent = ({mask,magnifierBox})=>{
      mask.style.display = 'none';
      magnifierBox.style.display = 'none';
    }
    
    mousemoveEvent = (e,{mask,magnifierBox,originalBox})=>{
      window.requestAnimationFrame(()=>{
        //判断视口是否大于750
        if(document.body.clientWidth > 750){
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
        
        }) 
    }
    
  }
  
  customElements.define('magnifier-image',MagnifierImage);
