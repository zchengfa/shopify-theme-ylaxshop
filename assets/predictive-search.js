
  
  if(!customElements.get('predictive-search')) {
    customElements.define('predictive-search', class PredictiveSearch extends HTMLElement {
      constructor() {
        super();
    
        this.input = this.querySelector('input[type="search"]');
        this.predictiveSearchResults = this.querySelector('#predictive-search-results-box');
        this.form = this.querySelector('form');
        this.form.addEventListener('submit', (event)=>{
          //当无输入内容时，阻止搜索表单的提交
          if(!this.input.value.trim().length){
            event.preventDefault();
          }
        });
        
        //防抖处理输入事件
        this.input.addEventListener('input', this.debounce((event) => {
          this.onChange(event);
        }, 300).bind(this));
      }
    
      onChange() {
        const searchTerm = this.input.value.trim();
    
        if (!searchTerm.length) {
          this.close();
          return;
        }
    
        this.getSearchResults(searchTerm);
      }
    
      getSearchResults(searchTerm) {
        fetch(`search/suggest?q=${searchTerm}&section_id=predictive-search`)
          .then((response) => {
            if (!response.ok) {
              var error = new Error(response.status);
              this.close();
              throw error;
            }
    
            return response.text();
          })
          .then((text) => {
            const resultsMarkup = new DOMParser().parseFromString(text, 'text/html').querySelector('#shopify-section-predictive-search');
            const spanArr = resultsMarkup.querySelectorAll('span');
           
            spanArr.forEach((span) => {
              let spanText = span.innerText;
              span.classList.add('predictive-search-product-text');
              //替换特定字符串
              spanText = spanText.replace(spanText.match(new RegExp(searchTerm, 'i')), `<span class="predictive-search__result--highlight">${spanText.match(new RegExp(searchTerm, 'i'))}</span>`);
              span.innerHTML = spanText;
            })
            this.predictiveSearchResults.innerHTML = resultsMarkup.innerHTML;
            this.open();
          })
          .catch((error) => {
            this.close();
            throw error;
          });
      }
      //首字母大写
      // capitalizeFirstLetter(string) {
      //   return string.toLowerCase().replace(/\b[a-z]/g, function(match) {
      //     return match.toUpperCase();
      //   });
      // }
    
      open() {
        this.predictiveSearchResults.style.display = 'block';
      }
    
      close() {
        this.predictiveSearchResults.style.display = 'none';
      }
    
      debounce(fn, wait) {
        let t;
        return (...args) => {
          clearTimeout(t);
          t = setTimeout(() => fn.apply(this, args), wait);
        };
      }
    });
  }