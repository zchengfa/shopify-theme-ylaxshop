if (!customElements.get('card-popover')) {
    customElements.define('card-popover',
        class CardPopover extends HTMLElement {
            constructor() {
                super();

                this.displayType = this.dataset.displayType || 'column';
                this.popoverDelay = Number(this.dataset.cardPopoverDelay) || 300;
                this.componentPopoverId = this.dataset.componentPopoverId;

                // 全局弹框 DOM（增加容错判断）
                this.globalPopEl = this.componentPopoverId
                    ? document.getElementById(this.componentPopoverId)
                    : null;

                this.titleEl = this.querySelector('.holiday-product-title');
                this.descriptionEl = this.querySelector('.holiday-product-desc');

                // 定时器
                this.showTimer = null;

                // 给元素设置 title 属性（安全判断）
                if (this.titleEl) this.titleEl.title = this.titleEl.textContent;
                if (this.descriptionEl) this.descriptionEl.title = this.descriptionEl.textContent;

                // 绑定事件（确保 this 指向正确）
                this.handleMouseEnter = this.handleMouseEnter.bind(this);
                this.handleMouseLeave = this.handleMouseLeave.bind(this);
                this.handleGlobalPopoverLeave = this.handleGlobalPopoverLeave.bind(this);

                this.addEventListener('mouseenter', this.handleMouseEnter);
                this.addEventListener('mouseleave', this.handleMouseLeave);

                if (this.globalPopEl) {
                    this.globalPopEl.addEventListener('mouseleave', this.handleGlobalPopoverLeave);
                }
            }

            // 鼠标进入
            handleMouseEnter(e) {
                if (window.innerWidth <= 750) return;
                if (!this.globalPopEl) return;

                this.clearTimer();

                // 延迟显示弹框
                this.showTimer = setTimeout(() => {
                    this.setPopoverContent();
                    this.updatePopoverPosition(e);
                    this.showPopover();
                }, this.popoverDelay);
            }

            // 鼠标离开
            handleMouseLeave(e) {
                if (!this.globalPopEl) return;
                this.hidePopoverIfLeaving(e);
                this.clearTimer();
            }

            // 全局弹框离开
            handleGlobalPopoverLeave(e) {
                this.hidePopoverIfLeaving(e);
            }

            // 隐藏弹框（安全判断）
            hidePopoverIfLeaving(e) {
                const isLeavingElement = !this.contains(e.relatedTarget) &&
                    !this.globalPopEl.contains(e.relatedTarget);

                if (isLeavingElement) {
                    this.hidePopover();
                    this.clearTimer();
                }
            }

            // 显示弹框
            showPopover() {
                if (!this.globalPopEl) return;
                this.globalPopEl.classList.remove('global-popover-hidden');
                this.globalPopEl.style.display = 'block';
            }

            // 隐藏弹框
            hidePopover() {
                if (!this.globalPopEl) return;
                this.globalPopEl.classList.add('global-popover-hidden');
                this.globalPopEl.style.display = 'none';
            }

            // 清除定时器
            clearTimer() {
                if (this.showTimer) {
                    clearTimeout(this.showTimer);
                    this.showTimer = null;
                }
            }

            // 更新弹框位置（防溢出窗口）
            updatePopoverPosition(e) {
                if (!this.globalPopEl) return;

                let { pageX, pageY } = e;
                const popoverWidth = this.globalPopEl.offsetWidth;
                const popoverHeight = this.globalPopEl.offsetHeight;

                // 右边界限制
                if (pageX + popoverWidth > window.innerWidth) {
                    pageX = window.innerWidth - popoverWidth - 10;
                }

                // 下边界限制
                if (pageY + popoverHeight > window.innerHeight) {
                    pageY = pageY - popoverHeight - this.offsetHeight - 10;
                }

                // 左边界限制
                if (pageX < 10) pageX = 10;
                if (pageY < 10) pageY = 10;

                this.globalPopEl.style.left = `${pageX}px`;
                this.globalPopEl.style.top = `${pageY}px`;
            }

            // 设置弹框内容
            setPopoverContent() {
                if (!this.globalPopEl) return;

                const { img, title, description, price, vendor, url } = this.dataset;
                const content = this.getPopoverContentData([img, title, description, price, vendor]);

                // 填充数据
                this.setElementAttr('.global-popover-link', 'href', url);
                this.setElementAttr('.popover-img', 'src', content[0]);
                this.setElementText('.popover-title', content[1]);
                this.setElementText('.popover-description', content[2]);
                this.setElementText('.popover-price', content[3]);
                this.setElementText('.popover-vendor', content[4]);

                // 布局切换
                this.updatePopoverLayout();
            }

            // 获取内容数据
            getPopoverContentData(targets) {
                return targets.map(item => {
                    const isImage = item?.includes('img');
                    return this.getElementValue(item, isImage ? 'src' : 'textContent') || '';
                });
            }

            // 更新布局
            updatePopoverLayout() {
                const container = this.globalPopEl.querySelector('.popover-container');
                if (!container) return;

                if (this.displayType === 'row') {
                    container.classList.remove('container-display-column');
                    this.globalPopEl.classList.add('popover-row');
                    this.globalPopEl.classList.remove('popover-column');
                } else {
                    container.classList.add('container-display-column');
                    this.globalPopEl.classList.add('popover-column');
                    this.globalPopEl.classList.remove('popover-row');
                }
            }

            // 获取元素值
            getElementValue(className, prop) {
                const el = this.querySelector(`.${className}`);
                return el ? el[prop] : '';
            }

            // 设置文本
            setElementText(selector, text) {
                const el = this.globalPopEl.querySelector(selector);
                if (el) el.textContent = text;
            }

            // 设置属性
            setElementAttr(selector, attr, value) {
                const el = this.globalPopEl.querySelector(selector);
                if (el) el.setAttribute(attr, value);
            }
        }
    )
}
