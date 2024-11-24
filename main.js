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
    // 初始化場景 (Scene)
    const scene = new THREE.Scene();

    // 建立相機 (Camera)
    const camera = new THREE.PerspectiveCamera(
        75, // 視角
        window.innerWidth / window.innerHeight, // 長寬比
        0.1, // 近端距離
        1000 // 遠端距離
    );
    camera.position.z = 5;

    // 建立渲染器 (Renderer)
    const canvas = document.getElementById('backgroundCanvas');
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true, // 背景透明
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // 粒子幾何
    const particleCount = 10000; // 粒子數量
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3); // 每個粒子 3 個座標 (x, y, z)
    const velocities = new Float32Array(particleCount * 3); // 每個粒子的速度

    // 初始化粒子位置和速度
    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 10; // X
        positions[i * 3 + 1] = (Math.random() - 0.5) * 10; // Y
        positions[i * 3 + 2] = (Math.random() - 0.5) * 10; // Z

        velocities[i * 3] = (Math.random() - 0.5) * 0.02; // X 速度
        velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02; // Y 速度
        velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02; // Z 速度
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));

    // 粒子材質
    const particlesMaterial = new THREE.PointsMaterial({
        color: 0xffffff, // 粒子顏色
        size: 0.05, // 粒子大小
        transparent: true,
        opacity: 0.8,
    });

    // 粒子系統
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // 滑鼠交互
    const mouse = { x: 0, y: 0 };
    window.addEventListener('mousemove', (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    // 動畫函式
    function animate() {
        requestAnimationFrame(animate);

        const positions = particlesGeometry.attributes.position.array;
        const velocities = particlesGeometry.attributes.velocity.array;

        // 更新粒子位置
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] += velocities[i * 3];
            positions[i * 3 + 1] += velocities[i * 3 + 1];
            positions[i * 3 + 2] += velocities[i * 3 + 2];

            // 碰到邊界時反彈
            if (positions[i * 3] > 5 || positions[i * 3] < -5) velocities[i * 3] *= -1;
            if (positions[i * 3 + 1] > 5 || positions[i * 3 + 1] < -5) velocities[i * 3 + 1] *= -1;
            if (positions[i * 3 + 2] > 5 || positions[i * 3 + 2] < -5) velocities[i * 3 + 2] *= -1;
        }

        particlesGeometry.attributes.position.needsUpdate = true; // 更新粒子位置
        particles.rotation.x += mouse.y * 0.01; // 粒子系統旋轉
        particles.rotation.y += mouse.x * 0.01;

        // 渲染場景
        renderer.render(scene, camera);
    }

    // 調整視窗大小
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    animate();
});
