// JavaScript 用於添加互動效果

// 平滑滾動到指定區域
document.querySelectorAll('.nav a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// 表單提交後顯示訊息
const form = document.querySelector('.footer form');
form.addEventListener('submit', function (e) {
    e.preventDefault();
    alert('感謝您的聯絡！我們將盡快回覆您。');
    form.reset(); // 重置表單
});
