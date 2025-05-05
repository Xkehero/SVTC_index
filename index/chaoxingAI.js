(function () {
    function sendRequest(url) {
        const params = new URL(url);
        const searchParams = new URLSearchParams(params.search);
        const path = params.origin;
        const fid = searchParams.get('fid');
        const appId = searchParams.get('appId');
        const xhr = new XMLHttpRequest();
        const data = JSON.stringify({ fid: fid, app_id: appId });
        xhr.open('POST', path + '/api/pc/system/page/getAppExternalConfig');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function () {
            // 当请求完成并且状态码为 200 时，表示请求成功
            if (xhr.readyState === 4 && xhr.status === 200) {
                // 解析响应数据
                const response = JSON.parse(xhr.responseText);
                imgInit(params.origin, appId, response.data.content);
            } else if (xhr.readyState === 4) {
                // 请求完成但状态码不是 200，表示请求失败
                console.error('请求失败，状态码:', xhr.status);
            }
        };
        xhr.onerror = function () {
            console.error('网络错误');
        };
        xhr.send(data);
    }

    // 公开的初始化方法
    function init(url) {
        if (!url) {
            console.error("错误：缺少参数");
            return;
        }
        sendRequest(url);
    }

    window.YxRobotSdkJs = { init };
})();

function imgInit(url, appId, data) {
    const YxRobotContent = document.createElement('div');
    YxRobotContent.id = 'YxRobotContent';
    YxRobotContent.style.position = 'relative'; // 设置为 relative，方便气泡定位

    const img = document.createElement('img');
    img.src = data.url;
    img.alt = 'Floating Image';
    img.draggable = false;

    YxRobotContent.appendChild(img);
    document.body.appendChild(YxRobotContent);

    // 初始样式（右上角固定，稍微朝下 30px）
    Object.assign(YxRobotContent.style, {
        position: 'fixed',
        top: (parseInt(data.bottom) + 65) + 'px', // 在原来的 top 值基础上增加 30px
        right: data.right + 'px',
        width: data.width + 'px',
        height: data.height + 'px',
        zIndex: '9999',
        borderRadius: '8px',
        cursor: 'move',
        transition: 'top 0.1s ease, left 0.1s ease',
    });

    Object.assign(img.style, {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        borderRadius: '8px',
        pointerEvents: 'none',
    });

    // 创建对话气泡
    const bubble = document.createElement('div');
    bubble.id = 'YxRobotBubble';
    Object.assign(bubble.style, {
        position: 'absolute',
        top: '-40px', // 调整气泡出现的位置
        right: '0px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        color: '#333',
        padding: '10px 15px',
        borderRadius: '8px',
        fontSize: '16px', // 稍微大一点的文字
        whiteSpace: 'nowrap', // 防止文字换行
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
        opacity: '0',
        transition: 'opacity 0.3s ease-in-out',
    });
    YxRobotContent.appendChild(bubble);

    const bubbleText = document.createElement('p');
    bubbleText.id = 'YxRobotBubbleText';
    bubbleText.style.margin = '0';
    bubble.appendChild(bubbleText);

    const getCoords = (e) => {
        if (e.touches) {
            return { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
        return { x: e.clientX, y: e.clientY };
    };

    let isMouseDown = false;
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let initialLeft = 0;
    let initialTop = 0;

    const maxX = () => window.innerWidth - YxRobotContent.offsetWidth;
    const maxY = () => window.innerHeight - YxRobotContent.offsetHeight;

    function onStart(e) {
        if (e.type === 'mousedown' && e.button !== 0) return;

        isMouseDown = true;
        isDragging = false;

        const coords = getCoords(e);
        startX = coords.x;
        startY = coords.y;

        const rect = YxRobotContent.getBoundingClientRect();
        initialLeft = rect.left;
        initialTop = rect.top;

        // 监听全局
        document.addEventListener(e.type === 'mousedown' ? 'mousemove' : 'touchmove', onMove, { passive: false });
        document.addEventListener(e.type === 'mousedown' ? 'mouseup' : 'touchend', onEnd);
        hideBubble(); // 开始拖拽时隐藏气泡
    }

    function onMove(e) {
        if (!isMouseDown) return;

        const coords = getCoords(e);
        const deltaX = coords.x - startX;
        const deltaY = coords.y - startY;

        if (!isDragging && (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5)) {
            isDragging = true;

            // 首次拖动时切换为 left/top 模式
            const rect = YxRobotContent.getBoundingClientRect();
            YxRobotContent.style.left = rect.left + 'px';
            YxRobotContent.style.top = rect.top + 'px';
            YxRobotContent.style.right = 'auto';
            YxRobotContent.style.bottom = 'auto';
        }

        if (!isDragging) return;

        e.preventDefault();

        let newLeft = initialLeft + deltaX;
        let newTop = initialTop + deltaY;

        newLeft = Math.max(0, Math.min(newLeft, maxX()));
        newTop = Math.max(0, Math.min(newTop, maxY()));

        YxRobotContent.style.left = newLeft + 'px';
        YxRobotContent.style.top = newTop + 'px';
    }

    function onEnd(e) {
        if (!isMouseDown) return;
        isMouseDown = false;

        // 清除监听
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onEnd);
        document.removeEventListener('touchmove', onMove);
        document.removeEventListener('touchend', onEnd);

        // 点击行为
        if (!isDragging) {
            // 使用 window.open 方法在新标签页中打开链接
            window.open(url + '/h5/ai/' + appId, '_blank');
        } else {
            showBubble(); // 拖拽结束后显示气泡
        }
        isDragging = false; // 重置拖拽状态
    }

    // 绑定拖拽
    YxRobotContent.addEventListener('mousedown', onStart);
    YxRobotContent.addEventListener('touchstart', onStart, { passive: false });
    YxRobotContent.addEventListener('mouseup', onEnd);
    YxRobotContent.addEventListener('touchend', onEnd);

    // 对话气泡轮播文字
    let bubbleSentences = [
        "你好呀,我叫闪闪智!",
        "我是陕西职业技术学院的AI智能助手!",
        "我知道的可多啦",
        "有什么问题,尽管问我吧!",
        "希望我们能成为好朋友!",
        "点我点我点我!!"
    ];
    let currentBubbleIndex = 0;

    function showBubble() {
        bubble.style.opacity = '1';
        bubbleText.textContent = bubbleSentences[currentBubbleIndex];
        currentBubbleIndex = (currentBubbleIndex + 1) % bubbleSentences.length;
    }

    function hideBubble() {
        bubble.style.opacity = '0';
    }

    // 初始显示气泡
    showBubble();
    // 定时轮播气泡文字
    setInterval(showBubble, 3000);
}