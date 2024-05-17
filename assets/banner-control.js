
if(!customElements.get('banner-control')){
    customElements.define('banner-control',
    class BannerControl extends HTMLElement{
        constructor(){
            super();
            //当前激活的index
            this.currentIndex = 0;
            //轮播图片总数
            this.totalBannerCount = this.getElementHandler('banner-items',true).length;
            
            this.timer = undefined;
            this.timeout = undefined;

            this.bannerEl = this.getElementHandler('banner-con-imgs');

            //是否自动轮播
            this.isAutoPlay = this.bannerEl.attributes['data-auto_play'].value;
            //自动轮播的速度（/s）
            this.speed = this.bannerEl.attributes['data-speed'].value * 1000;
            //控制器的类型（dots：点、number：数字、counter：计数器）
            this.controller_type = this.bannerEl.attributes['data-controller-type'].value

            this.isAutoPlay === 'true' ? this.autoPlay() : null;
            this.controller_type === 'dots' || this.controller_type === 'number' ? this.listeningButtonMouseEvent() : null;
            
            //初始化后开始执行监听
            this.initListening();
        
        }

        /**
         * @description This is a function for obtaining elements（获取元素函数）
         * @param {string} classname element`s classname（元素的类名）
         * @param {boolean} all Whether to obtain all（是否获取全部给定类名的元素）
         * @param {number | undefined} item which element（具体元素的item）
         * @returns {HTMLCollectionOf<Element>} return HTMLCollectionOf element（返回元素/或元素集合）
        */
        getElementHandler(classname,all = false,item = undefined){
            let allEl = this.getElementsByClassName(classname);
            return all ? allEl : allEl.item(item === undefined ? 0 : item);
        }

        /**
         * @description auto play function（自动轮播函数）
         */
        autoPlay(){
            this.timer = setInterval(()=>{
                this.listeningEvent(true);
            },this.speed)
        }

        /**
         * @description listening the event for button mouse（监听按钮的鼠标移入移出事件）
         */
        listeningButtonMouseEvent(){
            let els = this.controller_type === 'dots' ? this.getElementHandler('btn-dot',true) : this.getElementHandler('btn-number',true);
            for(let i=0; i<els.length;i++){
                els.item(i).addEventListener('click',(e)=>{
                    let targetIndex = e.target.attributes['data-index'].value;
                    targetIndex = Number(targetIndex) -1;
                    if(this.currentIndex !== targetIndex){
                       
                        let direction = undefined;
                        if(this.currentIndex > targetIndex){
                            direction = false;
                        }
                        else{
                            direction = true;
                        }
                        this.listeningEvent(direction,targetIndex);
                    }
                
                })
        
                els.item(i).addEventListener('mouseenter',()=>{
                    clearInterval(this.timer);
                });
        
               if(this.isAutoPlay === 'true'){
                els.item(i).addEventListener('mouseleave',()=>{
                    this.autoPlay();
                });
               }
            }
        }
        /**
         * @description Pause animation for 3 seconds function（动画暂停三秒执行）
         */
        pauseAutoPlay(){
            clearInterval(this.timer);
            clearTimeout(this.timeout);
            this.timeout = setTimeout(()=>{
                if(this.isAutoPlay === 'true'){
                    this.autoPlay();
                }
                clearTimeout(this.timeout);
            },3000);
        }

        /**
         * @description Element moves 100% left or right（元素向左或向右移动100%）
         * @param {number} currentIndex Current index
         */
        tranformEl(currentIndex){
            let el = this.getElementHandler('banner-items',true);
            for(let i = 0 ; i < el.length; i++){
                let transformPercent = currentIndex * 100 + '%';
                el.item(i).style.transition = "transform 1s";
                el.item(i).style.transform = `translateX(-${transformPercent})`;
                i === currentIndex ? el.item(i).style.zIndex = el.length : el.item(i).style.zIndex = 0;
            }
        
            //if it`s dots or number type
            if(this.controller_type === 'dots' || this.controller_type === 'number'){
                let els = undefined,classname = undefined;
                if(this.controller_type === 'dots'){
                    els = this.getElementHandler('dot',true);
                    classname = 'dot-active'
                }
                else{
                    els = this.getElementHandler('number-span',true);
                    classname = 'number-active';
                }
                for(let i = 0 ; i < els.length; i++){
                    i === currentIndex ? els.item(i).classList.add(classname) : els.item(i).classList.remove(classname);
                }
            }
            
        }
        /**
         * @description Change page index（改变number控制器中的当前数字）
         * @param {number} currentIndex Current index
         */
        changeCurrentPageIndex(currentIndex){
            let el = this.getElementHandler('current-page');
            el ? el.textContent = currentIndex + 1 : null;
        }
        /**
         * @description Button event（按钮点击后要触发的事件）
         * @param {false | true} direction left ot right（移动方向，false表示向左，true表示向右）
         */
        listeningEvent = (direction = false,clickIndex = undefined)=> {
            if(clickIndex === undefined){
                direction ? (()=>{
                    this.currentIndex < this.totalBannerCount -1 ? this.currentIndex ++ : this.currentIndex = 0;
                })() : (()=>{
                    this.currentIndex > 0 ? this.currentIndex -- : this.currentIndex = this.totalBannerCount -1;
                })();
            }
            else{
                this.currentIndex = clickIndex;
            }
            this.tranformEl(this.currentIndex);
            this.changeCurrentPageIndex(this.currentIndex);
        }

        /**
         * @description init listening（初始化后，要监听的点击事件）
         */
        initListening(){
            // Get two button elements for the carousel chart
            const previousEl = this.getElementHandler('btn-previous');
            const nextEl = this.getElementHandler('btn-next');

            //Listening button click event
            previousEl.addEventListener('click',()=>{
                this.pauseAutoPlay();
                this.listeningEvent();
            })

            nextEl.addEventListener('click',()=>{
                this.pauseAutoPlay();
                this.listeningEvent(true);
            })
        }
    }
    );
}

