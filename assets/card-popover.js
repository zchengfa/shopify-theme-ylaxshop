if(!customElements.get('card-popover')){
    customElements.define('card-popover',
        class CardPopover extends HTMLElement{
            constructor(){
                super();
                //如何展示（row | column）
                this.display_type = this.attributes['data-display-type'].value;
                 //全局弹框元素
                this.globalPopEl = document.getElementById(this.dataset.componentPopoverId);
                this.titleEl = this.getElementsByClassName('holiday-product-title').item(0);
                this.titleEl.setAttribute('title',this.titleEl.textContent);
                this.descriptionEl = this.getElementsByClassName('holiday-product-desc').item(0);
                this.descriptionEl.setAttribute('title',this.descriptionEl.textContent);

                this.addEventListener('mouseenter',(e)=>{
                    this.setPopoverContent();
                    this.addContentToGlobalPopover(e);
                });

                this.addEventListener('mouseleave',()=>{
                    this.globalPopEl.style.display = 'none';
                });
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
                const {img,title,description,price} = this.dataset;
                let data = this.getCardPopoverContent([img,title,description,price]);

                this.globalPopEl.getElementsByClassName('popover-img').item(0).setAttribute('src',data[0]);
                this.globalPopEl.getElementsByClassName('popover-title').item(0).textContent = data[1];
                this.globalPopEl.getElementsByClassName('popover-description').item(0).textContent = data[2];
                this.globalPopEl.getElementsByClassName('popover-price').item(0).textContent = data[3];
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