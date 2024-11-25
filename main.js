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


document.addEventListener('DOMContentLoaded', () => {
    // 初始化場景
    const scene = new THREE.Scene();

    // 初始化相機
    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.z = 5;

    // 初始化渲染器
    const canvas = document.getElementById('backgroundCanvas');
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // 主球體幾何與材質
    const mainSphereGeometry = new THREE.SphereGeometry(1, 32, 32);
    const mainSphereMaterial = new THREE.MeshBasicMaterial({
        color: 0xff5555, // 母球顏色
    });
    const mainSphere = new THREE.Mesh(mainSphereGeometry, mainSphereMaterial);
    scene.add(mainSphere);

    // 子球體數據
    const childSpheres = [];
    const maxChildSphereCount = 10;
    const animationParams = {
        isExpanding: false, // 是否正在分裂
        progress: 0, // 分裂/合併的進度 (0~1)
        mergeSpeed: 0.01, // 合併速度 (時間漸變)
    };

    for (let i = 0; i < maxChildSphereCount; i++) {
        const childGeometry = new THREE.SphereGeometry(
            Math.random() * 0.3 + 0.1, // 隨機大小
            16,
            16
        );
        const childMaterial = new THREE.MeshBasicMaterial({
            color: 0xff8888, // 子球顏色
        });
        const childSphere = new THREE.Mesh(childGeometry, childMaterial);
        childSphere.position.set(0, 0, 0); // 初始位置與母球重合
        childSphere.visible = false; // 初始隱藏
        childSphere.targetPosition = { x: 0, y: 0, z: 0 }; // 初始化目標位置
        childSpheres.push(childSphere);
        scene.add(childSphere);
    }

    // 光源 (可選)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // 滑鼠與主球體交互
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    window.addEventListener('mousemove', (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(mainSphere);

        if (intersects.length > 0 && !animationParams.isExpanding) {
            // 滑鼠進入主球體，開始分裂
            animationParams.isExpanding = true;
            animationParams.progress = 0; // 重置進度

            // 設定子球體隨機位置
            childSpheres.forEach((sphere) => {
                sphere.visible = true;
                sphere.targetPosition = {
                    x: Math.random() * 4 - 2, // 隨機X位置
                    y: Math.random() * 4 - 2, // 隨機Y位置
                    z: Math.random() * 2 - 1, // 隨機Z位置
                };
            });
        }
    });

    window.addEventListener('mouseout', () => {
        // 滑鼠離開畫面，開始合併
        animationParams.isExpanding = false;
    });

    // 動畫函式
    function animate() {
        requestAnimationFrame(animate);

        if (animationParams.isExpanding) {
            // 分裂過程
            animationParams.progress = Math.min(
                animationParams.progress + 0.02,
                1
            );
        } else {
            // 合併過程
            animationParams.progress = Math.max(
                animationParams.progress - animationParams.mergeSpeed,
                0
            );
        }

        // 更新子球體位置與母球縮放
        childSpheres.forEach((sphere) => {
            if (sphere.visible) {
                const target = animationParams.isExpanding
                    ? sphere.targetPosition
                    : { x: 0, y: 0, z: 0 };
                sphere.position.x +=
                    (target.x - sphere.position.x) * 0.1; // 平滑過渡
                sphere.position.y +=
                    (target.y - sphere.position.y) * 0.1;
                sphere.position.z +=
                    (target.z - sphere.position.z) * 0.1;

                // 當進度為0時隱藏子球體
                if (animationParams.progress === 0) {
                    sphere.visible = false;
                }
            }
        });

        // 更新母球縮放
        const mainScale = animationParams.isExpanding
            ? 1 - animationParams.progress * 0.5
            : 1;
        mainSphere.scale.set(mainScale, mainScale, mainScale);

        // 渲染場景
        renderer.render(scene, camera);
    }

    // 窗口大小調整
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // 啟動動畫
    animate();
});
