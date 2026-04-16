if(!customElements.get('catalog-tabs')){
    class CatalogTabs extends HTMLElement  {
        constructor() {
            super();
            this.tabsEl = this.querySelectorAll('.catalog-tab');
            this.replceParentEl = this.querySelector('.catalog-page__grid');
            this.sale = this.dataset['sale']
            this.soldOut = this.dataset['soldOut']
            this.moneyCurrency = this.dataset['moneyCurrency']
            this.productsPerPage = parseInt(this.dataset['productsPerPage']) || 12;
            this.paginationEl = null;
            this.paginationHandler = null;
            this.initTimeout = null;
        }
        changeCatalogTab(e) {
            // 使用currentTarget确保获取到绑定事件的元素，而不是内部的文本节点
            const target = e.currentTarget;

            // 检查是否是更多或更少按钮，如果是则不执行产品获取请求
            if (target.classList.contains('catalog-tab--more') || target.classList.contains('catalog-tab--less')) {
                return;
            }

            // 重新获取所有tab元素，确保包含动态添加的tab
            const allTabs = this.querySelectorAll('.catalog-tab');
            allTabs.forEach(tab => {
                tab.classList.remove('is-active')
            })

            target.classList.add('is-active')
            const handle = target.dataset['handle'];

            // 使用Promise.all并行发送两个请求
            Promise.all([
                fetch(`/collections/${handle}.json`).then(res => res.json()),
                fetch(`/collections/${handle}/products.json?limit=${this.productsPerPage}&page=1`).then(res => res.json())
            ]).then(([collectionData, productsData]) => {
                // 渲染产品
                this.renderProducts(productsData.products);

                // 处理分页，使用collection的products_count
                const totalProducts = collectionData.collection?.products_count || productsData.products.length;
                const paginationData = {
                    collection: {
                        products_count: totalProducts
                    },
                    products: productsData.products
                };
                this.handlePagination(paginationData, handle);
            }).catch(e => {
                console.error('Error fetching data:', e);
            });
        }
        renderProducts(products) {
            let productsHtml = '';
            products.map((item)=>{
                productsHtml += this.generateProductCard(item)
            })
            this.replceParentEl.innerHTML = productsHtml
        }
        /**
         * 处理分页逻辑
         * @param {Object} data - API响应数据
         * @param {String} handle - 当前collection的handle
         */
        handlePagination(data, handle) {
            const limit = this.productsPerPage;
            const totalProducts = data.collection?.products_count || data.products.length;
            const totalPages = Math.ceil(totalProducts / limit);

            // 重新获取分页元素，确保元素已经渲染
            this.paginationEl = document.getElementById('pagination');

            if (this.paginationEl) {
                if (totalPages > 1) {
                    this.paginationEl.style.display = 'block';
                    this.paginationEl.setAttribute('total-pages', totalPages);
                    this.paginationEl.setAttribute('current-page', 1);
                    this.bindPaginationEvents(handle);
                } else {
                    this.paginationEl.style.display = 'none';
                }
            }
        }
        /**
         * 绑定分页点击事件
         * @param {String} handle - 当前collection的handle
         */
        bindPaginationEvents(handle) {
            if (!this.paginationEl) {
                return;
            }

            if (this.paginationHandler) {
                this.paginationEl.removeEventListener('page-change', this.paginationHandler);
            }

            this.paginationHandler = (e) => {
                const page = e.detail.page;
                this.fetchProducts(handle, page);
            };

            this.paginationEl.addEventListener('page-change', this.paginationHandler);
        }
        /**
         * 获取指定页面的产品
         * @param {String} handle - collection的handle
         * @param {Number} page - 页码
         */
        fetchProducts(handle, page) {
            fetch(`/collections/${handle}/products.json?limit=${this.productsPerPage}&page=${page}`).then(res=>{
                return res.json()
            }).then(data=>{

                this.renderProducts(data.products);
                if (this.paginationEl) {
                    this.paginationEl.setAttribute('current-page', page);
                }
            }).catch(e=> {
                console.log(e)
            })
        }
        /**
         * 生成Shopify产品卡片HTML结构
         * @param {Object} item - 单个产品接口返回数据
         * @returns {String} 拼接好的产品卡片HTML字符串
         */
        generateProductCard(item) {
            const variant = item.variants[0];
            const mainImage = item.images[0];

            const currentPrice = this.parsePrice(variant.price);
            const comparePrice = this.parsePrice(variant.compare_at_price);

            // 状态判断
            const isSoldOut = !variant.available; // 是否售罄

            // 图片链接与Alt
            const imageSrc = mainImage?.src || '';
            const imageAlt = mainImage?.alt || item.title || 'Product Image';

            const productUrl = `/products/${item.handle}`;

            let badgeHtml = '';
            if (isSoldOut) {
                badgeHtml = `<span class="catalog-page__card-badge">${this.soldOut}</span>`;
            } else {
                badgeHtml = `<span class="catalog-page__card-badge">${this.sale}</span>`;
            }


            const priceHtml =
                `<span class="product-price" style="text-decoration: line-through; opacity: 0.6;">${comparePrice.toLocaleString()}</span><span class="product-price">${currentPrice.toLocaleString()}</span>`

            let imageHtml = '';
            if (imageSrc) {
                imageHtml = `
            <img 
                src="${imageSrc}?width=400" 
                srcset="${imageSrc}?width=300 300w, ${imageSrc}?width=400 400w"
                sizes="(max-width: 749px) 100vw, (max-width: 1199px) 33vw, 25vw"
                loading="lazy"
                class="catalog-page__card-img" 
                alt="${imageAlt}"
            >
        `;
            } else {
                imageHtml = '<svg class="catalog-page__placeholder">Placeholder</svg>';
            }

            return `
        <div class="catalog-page__card">
            <div class="catalog-page__card-image">
                ${badgeHtml}
                ${imageHtml}
            </div>
            <div class="catalog-page__card-content">
                <h3 class="catalog-page__card-title">${item.title}</h3>
                <div class="catalog-page__card-price">
                    ${priceHtml}
                </div>
                <a href="${productUrl}" class="catalog-page__card-button">
                    View Product
                </a>
            </div>
        </div>
    `;
        }
        parsePrice(price){
            const currency = this.moneyCurrency.replace(/[0-9.,\s]/g, '')
            const currencyPrefix = currency.slice(0,1);
            const currencySuffix = currency.slice(1);
            return currencyPrefix+price+currencySuffix
        }
        connectedCallback() {
            this.tabsEl.forEach(tab => {
                tab.addEventListener('click',this.changeCatalogTab.bind(this));
            })

            // 绑定显示更多/显示更少按钮事件
            this.bindShowMoreEvents();

            // 组件连接到DOM后，获取分页元素并绑定事件
            this.initTimeout = setTimeout(() => {
                this.paginationEl = document.getElementById('pagination');
                if (this.paginationEl) {
                    // 获取当前激活的分类handle
                    const activeTab = this.querySelector('.catalog-tab.is-active');
                    if (activeTab) {
                        const handle = activeTab.dataset['handle'];
                        this.bindPaginationEvents(handle);
                    }
                }
            }, 100);
        }

        /**
         * 绑定显示更多/显示更少按钮事件
         */
        bindShowMoreEvents() {
            const showMoreBtn = this.querySelector('.catalog-tab--more');
            const showLessBtn = this.querySelector('.catalog-tab--less');
            const dropdownContainer = this.querySelector('.catalog-tabs-more-dropdown');

            if (showMoreBtn) {
                showMoreBtn.addEventListener('click', (e) => {
                    e.stopPropagation(); // 阻止事件冒泡
                    if (dropdownContainer) {
                        dropdownContainer.style.display = 'block';
                    }
                });
            }

            if (showLessBtn) {
                showLessBtn.addEventListener('click', () => {
                    if (dropdownContainer) {
                        dropdownContainer.style.display = 'none';
                    }
                });
            }

            // 为动态添加的tab绑定点击事件
            const moreTabs = this.querySelectorAll('.catalog-tabs-more .catalog-tab');
            moreTabs.forEach(tab => {
                tab.addEventListener('click', (e) => {
                    // 点击tab后关闭下拉框
                    if (dropdownContainer) {
                        dropdownContainer.style.display = 'none';
                    }
                    this.changeCatalogTab(e);
                });
            });

            // 为下拉框添加点击事件，阻止冒泡
            if (dropdownContainer) {
                dropdownContainer.addEventListener('click', (e) => {
                    e.stopPropagation();
                });
            }

            // 为文档添加点击事件，点击外部区域关闭下拉框
            document.addEventListener('click', () => {
                if (dropdownContainer) {
                    dropdownContainer.style.display = 'none';
                }
            });
        }
        disconnectedCallback() {
            this.tabsEl.forEach(tab => {
                tab.removeEventListener('click',this.changeCatalogTab.bind(this));
            })
            if (this.paginationEl && this.paginationHandler) {
                this.paginationEl.removeEventListener('page-change', this.paginationHandler);
            }
            // 清除显示更多/显示更少按钮事件
            const showMoreBtn = this.querySelector('.catalog-tab--more');
            const showLessBtn = this.querySelector('.catalog-tab--less');
            const dropdownContainer = this.querySelector('.catalog-tabs-more-dropdown');
            if (showMoreBtn) {
                showMoreBtn.removeEventListener('click', () => {});
            }
            if (showLessBtn) {
                showLessBtn.removeEventListener('click', () => {});
            }
            if (dropdownContainer) {
                dropdownContainer.removeEventListener('click', () => {});
            }
            const moreTabs = this.querySelectorAll('.catalog-tabs-more .catalog-tab');
            moreTabs.forEach(tab => {
                tab.removeEventListener('click', this.changeCatalogTab.bind(this));
            });
            // 清除文档点击事件
            document.removeEventListener('click', () => {});
            // 清除定时器，防止内存泄漏
            if (this.initTimeout) {
                clearTimeout(this.initTimeout);
                this.initTimeout = null;
            }
        }
    }

    customElements.define('catalog-tabs',CatalogTabs)
}
