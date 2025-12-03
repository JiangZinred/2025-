$(document).ready(function() {
    // 获取书本容器
    const book = $('#book');
    
    // 生成66张图片页面
    for (let i = 1; i <= 66; i++) {
        // 格式化页码，确保是4位数字
        const pageNumber = String(i).padStart(4, '0');
        const imageName = `2025_pages-to-jpg-${pageNumber}.jpg`;
        const imagePath = `图片/${imageName}`;
        
        // 创建页面div
        const page = $('<div>').addClass('page');
        
        // 设置背景图片（使用CSS变量）
        page.css('--page-background', `url(${imagePath})`);
        
        // 添加奇数/偶数页类并设置相应的渐变方向
        if (i % 2 === 0) {
            page.addClass('even');
            page.css('background-image', `linear-gradient(to right, rgba(255, 255, 255, 0) 95%, rgba(224, 224, 224, 0.5) 100%), var(--page-background)`);
        } else {
            page.addClass('odd');
            page.css('background-image', `linear-gradient(to left, rgba(255, 255, 255, 0) 95%, rgba(224, 224, 224, 0.5) 100%), var(--page-background)`);
        }
        
        // 添加到书本中
        book.append(page);
    }
    
    // 获取容器尺寸
    function getContainerSize() {
        const container = $('.book-container');
        return {
            width: container.width(),
            height: container.height()
        };
    }
    
    // 初始化翻书效果
    const size = getContainerSize();
    book.turn({
        width: size.width,
        height: size.height,
        autoCenter: true,
        elevation: 50,
        gradients: true,
        turnCorners: "tl,tr,bl,br", // 允许从四个角拖拽翻页
        turnPockets: "15px", // 增加可拖拽区域大小
        duration: 600, // 翻页动画持续时间
        display: "double", // 双页显示
        acceleration: true, // 启用加速效果
        enableMouseEvents: true, // 启用鼠标事件
        click: false, // 禁用点击翻页，避免与拖拽冲突
        tap: true, // 启用触摸翻页
        when: {
            turned: function(event, page, view) {
                console.log('翻到第', page, '页');
            }
        }
    });
    
    // 确保页面元素不会阻止鼠标事件
    $('.page').css({
        'pointer-events': 'auto',
        'cursor': 'default'
    });
    
    // 窗口大小变化时重新调整翻书尺寸
    $(window).resize(function() {
        const newSize = getContainerSize();
        book.turn('size', newSize.width, newSize.height);
    });
    
    // 翻页按钮事件
    $('#prev-btn').click(function() {
        book.turn('previous');
    });
    
    $('#next-btn').click(function() {
        book.turn('next');
    });
    
    // 页码跳转功能
    $('#jump-btn').click(function() {
        const pageInput = $('#page-input');
        let pageNumber = parseInt(pageInput.val());
        
        // 验证页码有效性
        if (isNaN(pageNumber) || pageNumber < 1 || pageNumber > 66) {
            alert('请输入1-66之间的有效页码');
            return;
        }
        
        // 执行跳转
        book.turn('page', pageNumber);
        
        // 清空输入框
        pageInput.val('');
    });
    
    // 回车键触发跳转
    $('#page-input').keypress(function(e) {
        if (e.which === 13) {
            $('#jump-btn').click();
        }
    });
    
    // 背景音乐控制
    const music = document.getElementById('background-music');
    const musicBtn = document.getElementById('music-btn');
    let isPlaying = false;
    
    // 确保在用户交互后才能播放音乐
    function playMusic() {
        music.play().then(function() {
            console.log('音乐开始播放');
        }).catch(function(error) {
            console.log('播放音乐失败：', error);
        });
    }
    
    musicBtn.addEventListener('click', function() {
        if (isPlaying) {
            music.pause();
            musicBtn.textContent = '音乐开关';
        } else {
            playMusic();
            musicBtn.textContent = '关闭音乐';
        }
        isPlaying = !isPlaying;
    });
    
    // 添加页面点击事件，允许用户点击页面任意位置后播放音乐
    document.addEventListener('click', function() {
        if (!isPlaying) {
            // 只在首次点击时尝试播放
            music.play().catch(function(error) {
                // 忽略错误，用户可以通过按钮手动播放
            });
        }
    }, { once: true });
    
    // 尝试自动播放音乐（注意：现代浏览器通常不允许自动播放）
    try {
        music.play().catch(function(error) {
            console.log('自动播放被阻止，请手动点击音乐开关或页面任意位置：', error);
        });
        isPlaying = true;
        musicBtn.textContent = '关闭音乐';
    } catch (error) {
        console.log('播放音乐时出错：', error);
    }
});