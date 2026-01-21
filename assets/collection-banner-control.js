if(!customElements.get('collection-banner-control')){
    customElements.define('collection-banner-control',
        class CollectionBannerControl extends HTMLElement{
            constructor(){
                super();

                this.preEl = this.getElementsByClassName('collection-btn-previous').item(0);
                this.nexEl = this.getElementsByClassName('collection-btn-next').item(0);
                this.itemEls = this.getElementsByClassName('product-item');
                this.currentEl = this.getElementsByClassName('collection-current-page').item(0);
                this.totalEl = this.getElementsByClassName('collection-total-page')?.item(0);
                this.totalPage = this.totalEl?.attributes['data-pages'].value * 1;

                this.preEl?.addEventListener('click',()=>{
                    this.listeningCoEvent();
                });

                this.nexEl?.addEventListener('click',()=>{
                    this.listeningCoEvent(true);
                });

                this.createResizeObserver(".product-box");
            }

            // 监听product-box的宽，根据宽变化来变化页数
            createResizeObserver(selector) {
                const wrapper = this.querySelector(selector);
                this.observer = new ResizeObserver((entries) => {
                entries.forEach((entry) => {
                    this.totalWidth =  entry.contentRect.width; //被监听元素宽
                    if(this.totalPage){
                        let itemWidth = this.itemEls[0].clientWidth;
                        let page = this.totalWidth/itemWidth;
                        let totalCount = this.totalEl.attributes['data-show-count'].value * 1;
                        let count = (totalCount - Math.round(page)) + 1;
                        this.totalPage = count;
                        this.getElementsByClassName('collection-total-page').item(0).textContent = count;
                    }
                });
                });
                this.observer.observe(wrapper);
            }

            transformCoEl(direction,index){
                let charactor = direction && index !== 1 ? '-' : '' ;
                let marginW = this.itemEls.item(0).attributes['data-margin'].value;
                let num = (this.currentEl.textContent * 1);
                if(!direction){
                    charactor = '-';
                    if(index === this.totalPage){
                        num = this.totalPage -1;
                    }
                    else{
                        num = index -1;
                    }

                }
                else{
                    if(index === this.totalPage){
                        num = this.totalPage -1;
                    }
                }
                let w = charactor + ((this.itemEls[0].clientWidth * num )+ (marginW * 1)) + 'px';

                for(let i=0;i<this.itemEls.length;i++){
                    if(index === 1){
                        w = 0;
                    }
                    this.itemEls.item(i).style.transition = "transform .3s";
                    this.itemEls.item(i).style.transform = `translateX(${w})`;

                }
            }

            changeCoPageIndex(currentIndex){
                this.currentEl.textContent = currentIndex;
            }

            listeningCoEvent = (direction = false)=> {
                let currentIndex = this.currentEl.textContent * 1;
                direction ? (()=>{
                    currentIndex < this.totalPage ? currentIndex ++ : currentIndex = 1;
                })() : (()=>{
                    currentIndex > 1 ? currentIndex -- : currentIndex = this.totalPage;
                })();
                this.transformCoEl(direction,currentIndex);
                this.changeCoPageIndex(currentIndex);
            }

        }
    );
}
