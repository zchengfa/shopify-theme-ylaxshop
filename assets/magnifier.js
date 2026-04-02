/**
 * @description 放大镜效果自定义元素
 */
class MagnifierImage extends HTMLElement {
    constructor() {
        super();
        this.showInMagnifier = this.dataset['showInMagnifier']; // 是否在放大镜中显示
        this.magnifierTimes = parseFloat(this.dataset['magnifierTimes']) || 2; // 放大倍数
        this.showDelay = parseInt(this.dataset['showDelay']) || 200; // 显示延迟时间(毫秒)
        this.hideDelay = parseInt(this.dataset['hideDelay']) || 100; // 隐藏延迟时间(毫秒)
        this.transitionDuration = parseInt(this.dataset['transitionDuration']) || 200; // 过渡动画时间(毫秒)
        this.showTimer = null; // 显示计时器
        this.hideTimer = null; // 隐藏计时器
        this.isMagnifierVisible = false; // 放大镜是否可见
        this.isAnimating = false; // 是否正在动画中
        this.eventHandlers = []; // 事件处理器数组，用于清理
        this.lastMouseMoveTime = 0; // 上次鼠标移动时间
        this.throttleDelay = 16; // 节流延迟(毫秒)，约60fps
        this.isTouchDevice = false; // 是否为触摸设备
        this.currentImageSrc = null; // 当前图片源
        this.preloadedImages = new Set(); // 已预加载的图片集合
        this.viewportThreshold = 600; // 视口阈值
    }

    closeMedia() {
        const video = this.querySelector('video');
        if (video) {
            video.pause();
            video.currentTime = 0;
        }
        const videoBox = this.querySelector('.main-video-box');
        const closeBtn = this.querySelector('.close-media-btn');
        if (videoBox) videoBox.style.display = 'none';
        if (closeBtn) closeBtn.style.display = 'none';
    }

    showMedia() {
        const closeBtn = this.querySelector('.close-media-btn');
        const videoBox = this.querySelector('.main-video-box');
        if (closeBtn) closeBtn.style.display = 'flex';
        if (videoBox) {
            videoBox.style.display = "block";
            videoBox.style.zIndex = "30";
        }
    }

    connectedCallback() {
        // 检测是否为触摸设备
        this.isTouchDevice = 'ontouchstart' in window && navigator.maxTouchPoints > 0;

        const mask = this.querySelector('#MagnifierMask');
        const originalBox = this.querySelector('.magnifier-img-container');
        const magnifierBox = this.querySelector('.magnifier-img-box');

        // 初始化放大镜图片
        this.initMagnifierImage(magnifierBox);

        // 设置过渡动画
        this.setupTransitions(mask, magnifierBox);

        if (this.dataset['zoomType'] === 'hover') {
            this.listenBox(".original-img-box", {
                mask, originalBox, magnifierBox
            });
        }

        // 监听图片切换事件
        this.observeImageChanges();

        const closeMediaBtn = this.querySelector('.close-media-btn');
        if (closeMediaBtn) {
            const closeHandler = () => this.closeMedia();
            closeMediaBtn.addEventListener('click', closeHandler);
            this.eventHandlers.push({ element: closeMediaBtn, event: 'click', handler: closeHandler });
        }

        const playBtn = this.querySelector('.play-media-btn');
        if (playBtn) {
            const playHandler = () => this.showMedia();
            playBtn.addEventListener('click', playHandler);
            this.eventHandlers.push({ element: playBtn, event: 'click', handler: playHandler });
        }
    }

    disconnectedCallback() {
        // 清理所有事件监听器
        this.eventHandlers.forEach(({ element, event, handler }) => {
            element.removeEventListener(event, handler);
        });
        this.eventHandlers = [];
        // 清除所有计时器
        this.clearTimers();
        // 清理观察器
        if (this.imageObserver) {
            this.imageObserver.disconnect();
        }
    }

    clearTimers() {
        if (this.showTimer) {
            clearTimeout(this.showTimer);
            this.showTimer = null;
        }
        if (this.hideTimer) {
            clearTimeout(this.hideTimer);
            this.hideTimer = null;
        }
    }

    // 初始化放大镜图片
    initMagnifierImage(magnifierBox) {
        if (!magnifierBox) return;

        const activeImage = this.querySelector('.main-product-img:not([style*="display: none"])');
        if (activeImage) {
            this.currentImageSrc = activeImage.src;
            magnifierBox.style.backgroundImage = `url(${this.currentImageSrc})`;
            this.preloadImage(this.currentImageSrc);
        }
    }

    // 预加载图片
    preloadImage(src) {
        if (!src || this.preloadedImages.has(src)) return;

        const img = new Image();
        img.onload = () => {
            this.preloadedImages.add(src);
        };
        img.src = src;
    }

    // 设置过渡动画
    setupTransitions(mask, magnifierBox) {
        const transition = `opacity ${this.transitionDuration}ms ease-in-out`;
        if (mask) {
            mask.style.transition = transition;
            // 确保初始状态为隐藏
            mask.style.display = 'none';
            mask.style.opacity = '0';
        }
        if (magnifierBox) {
            magnifierBox.style.transition = transition;
            // 确保初始状态为隐藏
            magnifierBox.style.display = 'none';
            magnifierBox.style.opacity = '0';
        }
    }

    // 观察图片变化
    observeImageChanges() {
        const images = this.querySelectorAll('.main-product-img');
        images.forEach(img => {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                        const displayStyle = img.style.display;
                        if (displayStyle !== 'none' && img.src !== this.currentImageSrc) {
                            this.currentImageSrc = img.src;
                            const magnifierBox = this.querySelector('.magnifier-img-box');
                            if (magnifierBox) {
                                magnifierBox.style.backgroundImage = `url(${this.currentImageSrc})`;
                                this.preloadImage(this.currentImageSrc);
                            }
                        }
                    }
                });
            });
            observer.observe(img, { attributes: true });
            if (!this.imageObserver) {
                this.imageObserver = observer;
            }
        });
    }

    isVideoPlaying() {
        const videoBox = this.querySelector('.main-video-box');
        if (!videoBox) return false;
        return window.getComputedStyle(videoBox).display !== 'none';
    }

    listenBox(selector, elements, event) {
        const target = this.querySelector(selector);
        if (!target) {
            return;
        }

        // 触摸设备不支持hover放大镜
        if (this.isTouchDevice) {
            return;
        }

        const defaultEvent = ['mouseover', 'mousemove', 'mouseout'];
        const events = Array.isArray(event) ? event : (event || defaultEvent);

        const handleEvent = (e) => {
            // 如果视频正在播放，不显示放大镜
            if (this.isVideoPlaying()) {
                this.mouseoutEvent(elements);
                return;
            }

            switch (e.type) {
                case 'mouseover':
                    this.clearTimers();
                    this.showTimer = setTimeout(() => {
                        this.mouseoverEvent(elements);
                    }, this.showDelay);
                    break;
                case 'mouseout':
                    this.clearTimers();
                    // 立即隐藏放大镜，不使用延迟
                    this.mouseoutEvent(elements);
                    break;
                case 'mousemove':
                    // 使用节流优化mousemove事件
                    const now = Date.now();
                    if (now - this.lastMouseMoveTime > this.throttleDelay) {
                        this.lastMouseMoveTime = now;
                        if (this.isMagnifierVisible) {
                            this.mousemoveEvent(e, elements);
                        } else {
                            // 如果放大镜未显示，立即显示
                            this.mouseoverEvent(elements);
                        }
                    }
                    break;
            }
        };

        events.forEach(eventName => {
            if (defaultEvent.includes(eventName)) {
                target.addEventListener(eventName, handleEvent);
                this.eventHandlers.push({ element: target, event: eventName, handler: handleEvent });
            }
        });
    }

    mouseoverEvent({ mask, magnifierBox, originalBox }) {
        if (!mask || !magnifierBox || !originalBox || this.isAnimating) return;

        window.requestAnimationFrame(() => {
            // 使用视口阈值判断
            if (window.innerWidth > this.viewportThreshold) {
                this.isAnimating = true;

                // 先显示元素但保持透明
                mask.style.display = 'block';
                magnifierBox.style.display = 'block';

                // 设置背景大小
                magnifierBox.style.backgroundSize = `${originalBox.clientWidth * this.magnifierTimes}px`;
                if (this.showInMagnifier === 'true') {
                    mask.style.backgroundSize = `${originalBox.clientWidth * this.magnifierTimes}px`;
                }

                // 使用requestAnimationFrame确保过渡动画流畅
                requestAnimationFrame(() => {
                    mask.style.opacity = '1';
                    magnifierBox.style.opacity = '1';

                    // 动画完成后重置标志
                    setTimeout(() => {
                        this.isAnimating = false;
                    }, this.transitionDuration);
                });

                this.isMagnifierVisible = true;
            }
        });
    }

    mouseoutEvent({ mask, magnifierBox }) {
        if (!mask || !magnifierBox) return;

        this.clearTimers();

        // 先淡出
        mask.style.opacity = '0';
        magnifierBox.style.opacity = '0';

        // 动画完成后隐藏元素
        setTimeout(() => {
            mask.style.display = 'none';
            magnifierBox.style.display = 'none';
        }, this.transitionDuration);

        this.isMagnifierVisible = false;
    }

    mousemoveEvent(e, { mask, magnifierBox, originalBox }) {
        if (!mask || !magnifierBox || !originalBox || !this.isMagnifierVisible) return;

        window.requestAnimationFrame(() => {
            // 使用视口阈值判断
            if (window.innerWidth > this.viewportThreshold) {
                let x = e.pageX - originalBox.offsetLeft;
                let y = e.pageY - originalBox.offsetTop;
                const thresholdX = originalBox.clientWidth - mask.clientWidth;
                const thresholdY = originalBox.clientHeight - mask.clientHeight;

                // 中心化mask位置
                x -= mask.offsetWidth / 2;
                y -= mask.offsetHeight / 2;

                // 边界限制
                x = Math.max(0, Math.min(x, thresholdX));
                y = Math.max(0, Math.min(y, thresholdY));

                // 更新mask位置
                mask.style.left = x + 'px';
                mask.style.top = y + 'px';

                // 计算背景位置百分比
                const bgX = thresholdX > 0 ? (x / thresholdX) * 100 : 0;
                const bgY = thresholdY > 0 ? (y / thresholdY) * 100 : 0;

                if (this.showInMagnifier === 'true') {
                    mask.style.backgroundPosition = `${bgX}% ${bgY}%`;
                }

                magnifierBox.style.backgroundPosition = `${bgX}% ${bgY}%`;
            }
        });
    }
}
customElements.define('magnifier-image', MagnifierImage);
