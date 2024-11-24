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


// 確保 DOM 已完全載入後初始化
document.addEventListener('DOMContentLoaded', () => {
    // 初始化場景 (Scene)
    const scene = new THREE.Scene();

    // 建立相機 (Camera)
    const camera = new THREE.PerspectiveCamera(
        75, // 視角
        window.innerWidth / window.innerHeight, // 長寬比
        0.1, // 近端距離
        1000 // 遠端距離
    );
    camera.position.z = 5; // 將相機從中心移開

    // 建立渲染器 (Renderer)
    const canvas = document.getElementById('backgroundCanvas');
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas, // 綁定到 canvas
        alpha: true, // 背景透明
    });
    renderer.setSize(window.innerWidth, window.innerHeight); // 設置渲染器大小
    renderer.setPixelRatio(window.devicePixelRatio);

    // 建立幾何體 (Geometry)
    const geometry = new THREE.TorusGeometry(1, 0.4, 16, 100);

    // 建立材質 (Material)
    const material = new THREE.MeshStandardMaterial({
        color: 0x007bff, // 顏色
        emissive: 0x111111, // 自發光
        metalness: 0.5, // 金屬光澤
        roughness: 0.2, // 粗糙程度
    });

    // 建立網格 (Mesh)
    const torus = new THREE.Mesh(geometry, material);
    scene.add(torus);

    // 增加光源
    const pointLight = new THREE.PointLight(0xffffff, 1, 100);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // 增加環境光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // 儲存滑鼠位置
    const mouse = { x: 0, y: 0 };

    // 滑鼠移動事件
    window.addEventListener('mousemove', (event) => {
        // 將滑鼠位置轉換為歸一化座標 (-1 到 1)
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        // 使用滑鼠位置影響物體變形 (簡單縮放示例)
        torus.scale.x = 1 + mouse.x * 0.5; // 根據 x 軸縮放
        torus.scale.y = 1 + mouse.y * 0.5; // 根據 y 軸縮放
    });

    // 動畫函式
    function animate() {
        requestAnimationFrame(animate);

        // 旋轉幾何體
        torus.rotation.x += 0.01;
        torus.rotation.y += 0.01;

        // 渲染場景
        renderer.render(scene, camera);
    }

    // 調整視窗大小事件
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // 啟動動畫
    animate();
});
