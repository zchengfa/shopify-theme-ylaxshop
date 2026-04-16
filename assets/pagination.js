/**
 * 通用分页自定义元素
 * 使用方式: <universal-pagination total-pages="10" current-page="1"></universal-pagination>
 */
class UniversalPagination extends HTMLElement {
    static observedAttributes = ['total-pages', 'current-page', 'visible-count', 'prev-text', 'next-text'];

    constructor() {
        super();
        this.render();
    }

    connectedCallback() {
        this.bindEvents();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.render();
            this.bindEvents();
        }
    }

    get totalPages() {
        return parseInt(this.getAttribute('total-pages')) || 1;
    }

    get currentPage() {
        return parseInt(this.getAttribute('current-page')) || 1;
    }

    get visibleCount() {
        return parseInt(this.getAttribute('visible-count')) || 5;
    }

    get prevText() {
        return this.getAttribute('prev-text') || '上一页';
    }

    get nextText() {
        return this.getAttribute('next-text') || '下一页';
    }

    render() {
        if (this.totalPages <= 1) {
            this.innerHTML = '';
            return;
        }

        let items = [];

        // 上一页
        items.push(`
            <div class="universal-pagination__item universal-pagination__prev ${this.currentPage <= 1 ? 'disabled' : ''}"
                 data-page="${this.currentPage - 1}">
                ${this.prevText}
            </div>
        `);

        // 页码逻辑（带省略号）
        if (this.totalPages <= this.visibleCount) {
            for (let i = 1; i <= this.totalPages; i++) {
                items.push(`
                    <div class="universal-pagination__item ${i === this.currentPage ? 'active' : ''}" data-page="${i}">
                        ${i}
                    </div>
                `);
            }
        } else {
            // 左侧
            items.push(`<div class="universal-pagination__item ${1 === this.currentPage ? 'active' : ''}" data-page="1">1</div>`);

            // 省略号
            if (this.currentPage > 3) {
                items.push(`<div class="universal-pagination__item ellipsis" data-page="...">...</div>`);
            }

            // 中间
            let start = Math.max(2, this.currentPage - 1);
            let end = Math.min(this.totalPages - 1, this.currentPage + 1);
            for (let i = start; i <= end; i++) {
                items.push(`
                    <div class="universal-pagination__item ${i === this.currentPage ? 'active' : ''}" data-page="${i}">
                        ${i}
                    </div>
                `);
            }

            // 省略号
            if (this.currentPage < this.totalPages - 2) {
                items.push(`<div class="universal-pagination__item ellipsis" data-page="...">...</div>`);
            }

            // 右侧
            items.push(`
                <div class="universal-pagination__item ${this.totalPages === this.currentPage ? 'active' : ''}" data-page="${this.totalPages}">
                    ${this.totalPages}
                </div>
            `);
        }

        // 下一页
        items.push(`
            <div class="universal-pagination__item universal-pagination__next ${this.currentPage >= this.totalPages ? 'disabled' : ''}"
                 data-page="${this.currentPage + 1}">
                ${this.nextText}
            </div>
        `);

        this.innerHTML = `
            <div class="universal-pagination-container">
                ${items.join('')}
            </div>
        `;
    }

    bindEvents() {
        const container = this.querySelector('.universal-pagination-container');
        if (!container) return;

        container.addEventListener('click', (e) => {
            const target = e.target.closest('.universal-pagination__item');
            
            if (!target || target.classList.contains('disabled') || target.classList.contains('ellipsis')) {
                return;
            }

            const page = parseInt(target.dataset.page);
            
            if (!isNaN(page)) {
                this.dispatchEvent(new CustomEvent('page-change', {
                    detail: { page }
                }));
            }
        });
    }
}

// 注册自定义元素
if(!customElements.get('universal-pagination')) {
    customElements.define('universal-pagination', UniversalPagination);
}
