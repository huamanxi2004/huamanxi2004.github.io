document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.container');
    const overlay = document.querySelector('.image-container');
    const secondPage = document.querySelector('.second-page');
    const pageTransition = document.querySelector('.page-transition');
    let hasClicked = false;

    function updateFlashlight(e) {
        if (hasClicked) return;
        
        const rect = container.getBoundingClientRect();
        const x = ((e.pageX - window.pageXOffset - rect.left) / rect.width) * 100;
        const y = ((e.pageY - window.pageYOffset - rect.top) / rect.height) * 100;

        const boundedX = Math.max(0, Math.min(100, x));
        const boundedY = Math.max(0, Math.min(100, y));

        const gradient = `radial-gradient(circle at ${boundedX}% ${boundedY}%, transparent 150px, black 250px)`;
        overlay.style.setProperty('mask-image', gradient);
        overlay.style.setProperty('-webkit-mask-image', gradient);
    }

    async function loadNextPage() {
        try {
            window.location.href = './page3.html';
        } catch (error) {
            console.error('跳转页面时出错:', error);
        }
    }

    function switchToSecondImage() {
        if (hasClicked) return;
        hasClicked = true;

        // 第一步：激活过渡遮罩
        pageTransition.classList.add('active');

        // 第二步：显示第二页
        setTimeout(async () => {
            secondPage.classList.add('visible');
            container.style.display = 'none';
            
            // 第三步：等第二页完全显示后，淡出遮罩层
            setTimeout(() => {
                pageTransition.style.transition = 'opacity 0.5s ease';
                pageTransition.style.opacity = '0';
                // 完全淡出后移除遮罩层并加载下一页
                setTimeout(async () => {
                    pageTransition.style.display = 'none';
                    await loadNextPage();
                }, 500);
            }, 700);
        }, 700);

        // 移除事件监听
        document.removeEventListener('mousemove', updateFlashlight);
        container.removeEventListener('click', switchToSecondImage);
        container.removeEventListener('touchend', handleTouchEnd);
    }

    function handleTouchEnd(e) {
        e.preventDefault();
        switchToSecondImage();
    }

    // 设置初始位置
    const initialEvent = {
        pageX: window.innerWidth / 2 + window.pageXOffset,
        pageY: window.innerHeight / 2 + window.pageYOffset
    };
    updateFlashlight(initialEvent);

    // 事件监听
    document.addEventListener('mousemove', updateFlashlight);
    container.addEventListener('click', switchToSecondImage);
    container.addEventListener('touchend', handleTouchEnd);
});