if(!customElements.get('filter-form')){
    customElements.define('filter-form',
        class FilterForm extends HTMLElement{
            constructor(){
                super();
                this.url = window.location.pathname;
                this.form = this.querySelector('.filter-form');
                this.terms = this.form.dataset['terms']
                this.form.addEventListener('submit',(e)=>{
                    e.preventDefault();
                });
                this.MainSearchId = this.form.dataset['searchResultId'];
                this.sortBy = this.querySelector('#SortBy').querySelector('option[selected]');
                //价格区间筛选逻辑
                this.priceBtn = this.querySelector('.price-sort-box');
                this.iconCaret = this.priceBtn.querySelector('.icon-caret');
                this.priceSortBox = this.querySelector('.price-sort-box__dropdown');
                this.priceBoxStatus = false;
                this.priceBtn.addEventListener('click', ()=>{
                    this.changeBoxStatus();
                });
                this.priceRangeInput = this.querySelectorAll('.price-range-input');
                this.priceRangeInput.forEach((input)=>{
                    input.addEventListener('keydown',this.keydownChange.bind(this));
                    input.addEventListener('change',this.onRangeChange.bind(this));
                })

                this.filterBtn = this.querySelector('.sort-filter-btn');
                this.filterBtn.addEventListener('click',this.filterResults.bind(this));

                //选择框change事件
                this.select = this.querySelector('#SortBy');
                this.select.addEventListener('change',this.selectChange.bind(this));

                //移动端筛选逻辑
                this.mobileFilterBox = this.querySelector('.filter-icon-box');
                this.mobileFilterBox.addEventListener('click',this.showMobileFilterContainer.bind(this));
                this.mobileFilterContainer = this.querySelector('.mobile-filter-container');
                this.mobileFilterClose = this.querySelector('.mobile-filter-close');
                this.mobileFilterClose.addEventListener('click',this.showMobileFilterContainer.bind(this));
            }
            showMobileFilterContainer(){
                this.mobileFilterContainer.classList.toggle('mobile-filter-container--show');
            }
            selectChange(){
                const options = this.select.querySelectorAll('option');
                options.forEach((option)=>{
                    if(option.selected){
                        this.sortBy = option;
                        option.setAttribute('selected','selected');
                        this.filterResults();
                    }
                    else{
                        option.removeAttribute('selected');
                    }
                })
            }
            changeBoxStatus(){

                this.priceBoxStatus = !this.priceBoxStatus;

                this.priceBoxStatus ? this.priceSortBox.style.display = 'block' : this.priceSortBox.style.display = 'none';
                this.priceBoxStatus ? this.iconCaret.classList.add('rotate-icon-caret') : this.iconCaret.classList.remove('rotate-icon-caret');
            }
            onRangeChange(event) {
                this.adjustToValidValues(event.currentTarget);
              }
            adjustToValidValues(input) {
                const value = Number(input.value);
                const min = Number(input.getAttribute('data-min'));
                const max = Number(input.getAttribute('data-max'));
            
                if (value < min) input.value = min;
                if (value > max) input.value = max;
              }
            keydownChange(e){
                //输入的不是0到9或者.则输入到input中
                try{
                    const pattern = /[0-9]|\.|,|'| |Tab|Backspace|Enter|ArrowUp|ArrowDown|ArrowLeft|ArrowRight|Delete|Escape/;
                    if(!e.key.match(pattern)) e.preventDefault();
                }
                catch(err){
                    if(!e.key){
                        console.log('The current operation is not a keyboard event');
                    }
                    else{
                        console.log(err);
                    }
                }
                
            }
            filterResults(){
                const filterUrl = this.getSortFetchUrl();
                fetch(filterUrl).then(response=>{
                    return response.text();
                }).then(data=>{
                    this.updateToRender().forEach(render=>{
                        replaceWitnNewHtml(data,render.selector,render.id);
                    })
                    //隐藏价格区间盒
                    this.priceBoxStatus ? this.changeBoxStatus() : null;
                })
            }
            updateToRender(){
                return [
                    {
                        id:"SearchResult",
                        selector: ".result-ul"
                    },
                    {
                        id:`${this.getAttribute('id')}`,
                        selector: ".search-result-count"
                    }
                ]
            }
            getSortFetchUrl(){
                //https://******/.myshopify.com/search?section_id=***&q=fa&filter.v.price.gte=*&filter.v.price.lte=*&sort_by=relevance*
                return `${window.shopUrl}${this.url}?section_id=${this.MainSearchId}&q=${this.terms}&${this.priceRangeInput[0].getAttribute("name")}=${this.priceRangeInput[0].value}&${this.priceRangeInput[1].getAttribute("name")}=${this.priceRangeInput[1].value}&sort_by=${this.sortBy.value}`;
             
            }
        }
    );
}