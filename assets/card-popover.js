if(!customElements.get('card-popover')){
    customElements.define('card-popover',
        class CardPopover extends HTMLElement{
            constructor(){
                super();
                //如何展示（row | column）
                this.display_type = this.attributes['data-display-type'].value;
                //延迟显示时间
                this.card_popover_delay = this.attributes['data-card-popover-delay'].value;
                 //全局弹框元素
                this.globalPopEl = document.getElementById(this.dataset.componentPopoverId);
                this.titleEl = this.getElementsByClassName('holiday-product-title').item(0);
                this.titleEl.setAttribute('title',this.titleEl.textContent);
                this.descriptionEl = this.getElementsByClassName('holiday-product-desc').item(0);
                this.descriptionEl.setAttribute('title',this.descriptionEl.textContent);
                this.timer = null;

                this.addEventListener('mouseenter',(e)=>{
                    
                    if(document.body.clientWidth > 750){
                        //鼠标移入时不会马上显示弹框，隔一段时间再显示
                        this.timer = setTimeout(()=>{
                            this.setPopoverContent();
                            this.addContentToGlobalPopover(e);
                        },this.card_popover_delay);
                    }
                });

                this.addEventListener('mouseleave',(e)=>{
                    //添加一层判断，防止在鼠标快速移动时，离开当前元素，但进入全局弹框元素，导致全局弹框反复消失隐藏
                    this.hideGlobalPopover(e);
                });

                //给全局弹框绑定离开事件，离开时隐藏弹框
                this.globalPopEl.addEventListener('mouseleave',(e)=>{
                    this.hideGlobalPopover(e);
                })
            } 
            
            hideGlobalPopover(e){
                //判断是否离开的是当前元素
                    if (!this.globalPopEl.contains(e.relatedTarget)) {
                        this.globalPopEl.style.display = 'none';
                        
                    }
                    //离开时清除定时器，若离开时间与移入的间隔时间小于显示延迟时间时，可达成快入快出不显示弹框的效果
                    if(this.timer){
                        clearTimeout(this.timer);
                        this.timer = null;
                    }
            }

            getElementValue(classname,property){
                return (this.getElementsByClassName(classname).item(0))[property];
            }

            addContentToGlobalPopover(e){
                let {pageX,pageY} = e;
                this.globalPopEl.style.display = 'block';
                //若鼠标位置与弹框宽度的和大于浏览器窗口，则需要调整鼠标位置，使弹框不会出现在窗口外
                
                if(this.globalPopEl.clientWidth + pageX > window.innerWidth){
                    
                    pageX = window.innerWidth - this.globalPopEl.clientWidth;
                }
                if(this.globalPopEl.clientHeight + pageY > window.innerHeight){
                    pageY = (window.innerHeight - this.globalPopEl.clientHeight) + this.clientHeight;
                }
                
                this.globalPopEl.style.left = pageX + 'px';
                this.globalPopEl.style.top = pageY + 'px';
               
                this.globalPopEl.classList.remove('global-popover-hidden');
            }

            setPopoverContent(){
                const {img,title,description,price,vendor,url} = this.dataset;
                //设置产品详情链接
                this.globalPopEl.getElementsByClassName('global-popover-link').item(0).setAttribute('href',url);
                //设置其它内容
                let data = this.getCardPopoverContent([img,title,description,price,vendor]);

                this.globalPopEl.getElementsByClassName('popover-img').item(0).setAttribute('src',data[0]);
                this.globalPopEl.getElementsByClassName('popover-title').item(0).textContent = data[1];
                this.globalPopEl.getElementsByClassName('popover-description').item(0).textContent = data[2];
                this.globalPopEl.getElementsByClassName('popover-price').item(0).textContent = data[3];
                this.globalPopEl.getElementsByClassName('popover-vendor').item(0).textContent = data[4];

                //根据模板设置的排列类型来改变布局
                if(this.display_type === 'row'){
                    this.globalPopEl.getElementsByClassName('popover-container').item(0).classList.remove('container-display-column');
                    this.globalPopEl.classList.add('popover-row');
                    this.globalPopEl.classList.remove('popover-column');
                }
                else if(this.display_type === 'column'){
                    this.globalPopEl.getElementsByClassName('popover-container').item(0).classList.add('container-display-column');
                    this.globalPopEl.classList.add('popover-column');
                    this.globalPopEl.classList.remove('popover-row');
                }
            }

            getCardPopoverContent(targets){
                let property = 'textContent';
                let contentArr = [];
                targets.map((item)=>{
                    property = item.indexOf('img') === -1 ? 'textContent' : 'src' ;
                    
                    contentArr.push(this.getElementValue(item,property));
                });

                return contentArr;
            }
        }
    )
}