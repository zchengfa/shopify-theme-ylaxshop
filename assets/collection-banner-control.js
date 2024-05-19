if(!customElements.get('collection-banner-control')){
    customElements.define('collection-banner-control',
        class CollectionBannerControl extends HTMLElement{
            constructor(){
                super();

                this.preEl = this.getElementsByClassName('collection-btn-previous').item(0);
                this.nexEl = this.getElementsByClassName('collection-btn-next').item(0);
                this.itemEls = this.getElementsByClassName('product-item');
                this.currentEl = this.getElementsByClassName('collection-current-page').item(0);
                this.totalPage = this.getElementsByClassName('collection-total-page')?.item(0)?.attributes['data-pages'].value * 1;

                this.preEl?.addEventListener('click',()=>{
                    this.listeningCoEvent();
                });
                
                this.nexEl?.addEventListener('click',()=>{
                    this.listeningCoEvent(true);
                });
                

                this.addToCartEl = this.getElementsByClassName('add-to-cart').item(0);
                this.addToCartEl?.addEventListener('click',()=>{
                    this.addCartEvent();
                });
            }

            tranformCoEl(direction,index){
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
                this.tranformCoEl(direction,currentIndex);
                this.changeCoPageIndex(currentIndex);
            }

            addCartEvent(){
              
    
                // let product_id = this.addToCartEl.attributes['data-product-id'].value;
                // let loadingEl = this.getElementsByClassName('loading__spinner').item(0);
                // loadingEl.classList.remove('hidden');
                // this.addToCartEl.classList.add('hidden');

                document.getElementsByClassName('cart-container')?.item(0).classList.add('cart-show');
                    let timer = setTimeout(()=>{
                        document.getElementsByClassName('cart-drawer')?.item(0).classList.add('animate-drawer');
                        clearTimeout(timer);
                    }); 
    
                //发起添加商品到购物车请求(会报错，需后续处理)
                fetch(window.Shopify.routes.root + '/cart/add',{
                    method:'POST',
                    body:JSON.stringify({
                        items:[
                            {
                                id:'product_id',
                                 quantity:1
                            }
                        ]
                    })
                })
                .then(response => {
                    response.json();

                    //添加成功后显示购物车元素
                    document.getElementsByClassName('cart-container')?.item(0).classList.add('cart-show');
                    let timer = setTimeout(()=>{
                        document.getElementsByClassName('cart-drawer')?.item(0).classList.add('animate-drawer');
                        clearTimeout(timer);
                    }); 
                })
                .catch((err)=>{
                    console.log(err);

                    //失败，移除添加购物车按钮的效果
                    loadingEl.classList.add('hidden');
                    this.addToCartEl.classList.remove('hidden');
                });
            }
        }
    );
}