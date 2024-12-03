//商品详情页中商品视频展示以及图片切换
if(!customElements.get("media-display")){

    customElements.define('media-display', class MediaDisplay extends HTMLElement {
      constructor() {
        super();
        this.mediaContainer = this.querySelector('.product-media');
        this.magnifier = this.querySelector('magnifier-image');
        //默认选择第一张图片
        this.mediaItems = this.mediaContainer?.querySelectorAll('.media-item');
        if(this.mediaItems){
          this.mediaItems[0].querySelector('img').classList.add('active');
          this.mediaItems.forEach((item,index)=>{
              let img = item.querySelector('img');
              img.addEventListener('mouseenter',(e)=>{
                  this.changeImage(e);
                  //获取大图展示中的所有图片，并控制显示对应图片
                  let mainProductImgs = this.querySelectorAll('.main-product-img');
                  mainProductImgs.forEach((img,i)=>{
                      if(index === i){
                          img.style.display = 'block';
                          if(this.magnifier.dataset['zoomType'] === 'hover'){
                              let magnifierimgbox = this.magnifier.querySelector('.magnifier-img-box');
                              let showMagnifierMask = this.magnifier.querySelector('.show-magnifier-mask');
                              magnifierimgbox.style.backgroundImage = `url(${img.src})`;
                              if(this.magnifier.dataset['showInMagnifier']){
                                  showMagnifierMask.style.backgroundImage = `url(${img.src})`;
                              }
                          }
                      }
                      else{
                          img.style.display = 'none';
                      }
                  });
                
              })
              img.addEventListener('mouseleave',(e)=>{
                  this.changeImage(e);
              })
          })
        }
      }

      changeImage(e) {
        this.mediaItems.forEach((item) => {
          item.querySelector('img').classList.remove('active');
        });
        e.target.classList.add('active');
        
      }
      
    });
  }