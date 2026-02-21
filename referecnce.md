<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JASON. | Independent Developer</title>
    <style>
        /* ==========================================================================
           AESTHETIC FOUNDATION & TYPOGRAPHY
           ========================================================================== */
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@100;400;700&family=Syne:wght@400;700;800&display=swap');

        :root {
            --bg-color: #030303;
            --text-primary: #FFFFFF;
            --text-secondary: #666666;
            --accent: #E52A2A; /* Stark Crimson */
            --font-display: 'Syne', sans-serif;
            --font-mono: 'JetBrains Mono', monospace;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            cursor: none; /* Custom cursor */
        }

        body, html {
            width: 100%;
            height: 100%;
            background-color: var(--bg-color);
            color: var(--text-primary);
            font-family: var(--font-mono);
            overflow: hidden;
            -webkit-font-smoothing: antialiased;
        }

        /* Custom Cursor */
        #cursor {
            position: fixed;
            top: 0;
            left: 0;
            width: 12px;
            height: 12px;
            background-color: var(--accent);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transform: translate(-50%, -50%);
            transition: width 0.3s, height 0.3s, background-color 0.3s;
            mix-blend-mode: difference;
        }
        #cursor.hover {
            width: 40px;
            height: 40px;
            background-color: var(--text-primary);
        }

        /* Background Noise Texture */
        .noise {
            position: fixed;
            top: 0; left: 0; width: 100vw; height: 100vh;
            pointer-events: none;
            z-index: 10;
            opacity: 0.04;
            background: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }

        /* ==========================================================================
           CANVAS & UI LAYERS
           ========================================================================== */
        #webgl-container {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            z-index: 1;
        }

        #ui-layer {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            z-index: 20;
            pointer-events: none; /* Let clicks pass through to 3D */
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 2rem 3rem;
        }

        /* Interactive elements inside UI must be clickable */
        a, button, .clickable { pointer-events: auto; }

        header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
        }

        .logo {
            font-family: var(--font-display);
            font-weight: 800;
            font-size: 2.5rem;
            letter-spacing: -0.05em;
            text-transform: uppercase;
            line-height: 0.8;
            position: relative;
        }
        
        .logo span {
            display: block;
            font-family: var(--font-mono);
            font-size: 0.7rem;
            font-weight: 400;
            letter-spacing: 0.2em;
            color: var(--text-secondary);
            margin-top: 0.5rem;
        }

        nav ul {
            list-style: none;
            display: flex;
            gap: 3rem;
        }

        nav a {
            color: var(--text-primary);
            text-decoration: none;
            font-size: 0.8rem;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            position: relative;
            transition: color 0.3s;
        }

        nav a:hover { color: var(--accent); }

        .scroll-indicator {
            position: absolute;
            bottom: 3rem;
            left: 3rem;
            display: flex;
            align-items: center;
            gap: 1rem;
            font-size: 0.7rem;
            text-transform: uppercase;
            letter-spacing: 0.2em;
            color: var(--text-secondary);
            transform: rotate(-90deg);
            transform-origin: left bottom;
        }

        .scroll-line {
            width: 40px;
            height: 1px;
            background-color: var(--text-secondary);
            position: relative;
            overflow: hidden;
        }

        .scroll-line::after {
            content: '';
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            background-color: var(--accent);
            transform: translateX(-100%);
            animation: scrollLine 2s infinite ease-in-out;
        }

        @keyframes scrollLine {
            0% { transform: translateX(-100%); }
            50% { transform: translateX(0); }
            100% { transform: translateX(100%); }
        }

        .hero-title {
            position: absolute;
            top: 50%; left: 3rem;
            transform: translateY(-50%);
            font-family: var(--font-display);
            font-size: clamp(3rem, 8vw, 8rem);
            font-weight: 800;
            line-height: 0.9;
            letter-spacing: -0.02em;
            pointer-events: none;
            mix-blend-mode: exclusion;
            color: rgba(255,255,255,0.1);
            -webkit-text-stroke: 1px rgba(255,255,255,0.3);
        }

        /* ==========================================================================
           DETAIL OVERLAY (BRUTALIST INVERSION)
           ========================================================================== */
        #detail-overlay {
            position: fixed;
            top: 0; right: 0;
            width: 45vw;
            height: 100vh;
            background-color: var(--text-primary);
            color: var(--bg-color);
            z-index: 30;
            padding: 4rem;
            display: flex;
            flex-direction: column;
            justify-content: center;
            transform: translateX(100%);
            transition: transform 0.8s cubic-bezier(0.19, 1, 0.22, 1);
            pointer-events: none; /* Initially hidden */
        }

        #detail-overlay.active {
            transform: translateX(0);
            pointer-events: auto;
        }

        .close-btn {
            position: absolute;
            top: 3rem; right: 3rem;
            background: none;
            border: none;
            font-family: var(--font-mono);
            font-size: 0.9rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: var(--bg-color);
            display: flex;
            align-items: center;
            gap: 0.5rem;
            overflow: hidden;
        }

        .close-btn::before {
            content: '';
            display: block;
            width: 20px; height: 2px;
            background-color: var(--accent);
            transition: width 0.3s;
        }
        .close-btn:hover::before { width: 40px; }

        .detail-client {
            font-size: 0.8rem;
            color: var(--accent);
            text-transform: uppercase;
            letter-spacing: 0.2em;
            margin-bottom: 1rem;
        }

        .detail-title {
            font-family: var(--font-display);
            font-size: 4rem;
            font-weight: 800;
            line-height: 1;
            letter-spacing: -0.03em;
            margin-bottom: 2rem;
        }

        .detail-desc {
            font-size: 1rem;
            line-height: 1.6;
            margin-bottom: 3rem;
            max-width: 80%;
        }

        .detail-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 1rem;
            margin-bottom: 4rem;
        }

        .tag {
            padding: 0.5rem 1rem;
            border: 1px solid var(--bg-color);
            font-size: 0.7rem;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            border-radius: 50px;
        }

        .launch-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 1rem 3rem;
            background-color: var(--bg-color);
            color: var(--text-primary);
            text-decoration: none;
            font-family: var(--font-mono);
            font-size: 0.8rem;
            text-transform: uppercase;
            letter-spacing: 0.2em;
            transition: background-color 0.3s, color 0.3s;
        }

        .launch-btn:hover {
            background-color: var(--accent);
            color: var(--text-primary);
        }

        /* Mobile Adjustments */
        @media (max-width: 1024px) {
            #detail-overlay { width: 60vw; }
            .hero-title { font-size: 4rem; }
        }
        @media (max-width: 768px) {
            #detail-overlay { width: 100vw; padding: 2rem; }
            .detail-title { font-size: 2.5rem; }
            nav ul { display: none; /* Hide nav on small screens for minimal look */ }
            .hero-title { font-size: 3rem; top: 20%; left: 2rem; transform: none; }
        }
        
        /* Intro Overlay */
        #intro {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: var(--bg-color); z-index: 100;
            display: flex; justify-content: center; align-items: center;
            transition: opacity 1.5s ease-in-out, visibility 1.5s;
        }
        .intro-text {
            font-family: var(--font-display); font-size: 2rem; font-weight: 800;
            letter-spacing: 0.5em; text-transform: uppercase;
            animation: pulse 2s infinite alternate;
        }
        @keyframes pulse {
            0% { opacity: 0.3; } 100% { opacity: 1; text-shadow: 0 0 20px rgba(255,255,255,0.5); }
        }
    </style>
</head>
<body>

    <!-- Intro Loading Screen -->
    <div id="intro">
        <div class="intro-text">Initializing</div>
    </div>

    <!-- Custom Cursor -->
    <div id="cursor"></div>
    <div class="noise"></div>

    <!-- Three.js Canvas Container -->
    <div id="webgl-container"></div>

    <!-- UI Overlay (Gallery View) -->
    <div id="ui-layer">
        <header>
            <div class="logo clickable">
                JASON.
                <span>Creative Engineer</span>
            </div>
            <nav>
                <ul>
                    <li><a href="#" class="clickable">Index</a></li>
                    <li><a href="#" class="clickable">Studio</a></li>
                    <li><a href="#" class="clickable">Contact</a></li>
                </ul>
            </nav>
        </header>

        <div class="hero-title">DIGITAL<br>ARCHITECT</div>

        <div class="scroll-indicator">
            Scroll to explore <div class="scroll-line"></div>
        </div>
    </div>

    <!-- Detail Overlay (Project View) -->
    <div id="detail-overlay">
        <button class="close-btn clickable" id="close-detail">Return</button>
        <div class="detail-content">
            <div class="detail-client" id="dt-client">Client Name</div>
            <h2 class="detail-title" id="dt-title">Project Title</h2>
            <p class="detail-desc" id="dt-desc">Detailed description of the project goes here. Explaining the problem, the architectural approach, and the execution to deliver a high-end digital experience.</p>
            <div class="detail-tags" id="dt-tags">
                <span class="tag">React</span>
                <span class="tag">WebGL</span>
            </div>
            <a href="#" class="launch-btn clickable">View Live Project</a>
        </div>
    </div>

    <!-- Three.js Library -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>

    <script>
        /**
         * PORTFOLIO DATA
         */
        const portfolioData = [
            { id: '01', title: 'AURA', client: 'LVMH', desc: 'A sensuous, WebGL-driven product exploration platform for a new luxury fragrance line. Focused on fluid dynamics and glass refraction.', tags: ['Three.js', 'GLSL', 'Vue'] },
            { id: '02', title: 'NEXUS', client: 'FinTech Startup', desc: 'Real-time data visualization dashboard turning complex market metrics into beautiful, understandable geometric patterns.', tags: ['React', 'D3.js', 'WebSockets'] },
            { id: '03', title: 'VOID', client: 'Music Label', desc: 'An immersive, audio-reactive promotional website for an upcoming electronic album release. Heavily utilizes post-processing.', tags: ['WebAudio API', 'Three.js'] },
            { id: '04', title: 'SYNTH', client: 'Architecture Firm', desc: 'Minimalist portfolio platform showcasing concrete and brutalist structures through stark black-and-white photography and smooth typography.', tags: ['Next.js', 'GSAP'] },
            { id: '05', title: 'KINETIC', client: 'Sportswear Brand', desc: 'High-performance e-commerce experience with scroll-tied 3D product turnarounds and micro-interactions.', tags: ['Shopify Plus', 'WebGL'] },
            { id: '06', title: 'QUANTUM', client: 'Research Lab', desc: 'Interactive educational tool explaining quantum computing concepts through playful, tactile 3D physics simulations.', tags: ['Cannon.js', 'React Three Fiber'] },
            { id: '07', title: 'ECLIPSE', client: 'Fashion Editorial', desc: 'Digital magazine experience breaking traditional grid layouts. Asymmetric scrolling and experimental typography.', tags: ['HTML5', 'CSS Grid', 'Locomotive Scroll'] },
            { id: '08', title: 'MONOLITH', client: 'SaaS Platform', desc: 'Dark-mode only marketing site focused on security and scale. Utilizes dramatic lighting and 3D primitives to convey strength.', tags: ['Three.js', 'Tailwind'] },
            { id: '09', title: 'FLUX', client: 'Art Gallery', desc: 'Virtual exhibition space allowing users to walk through curated digital art pieces with spatial audio.', tags: ['WebXR', 'Three.js'] },
            { id: '10', title: 'AETHER', client: 'Crypto Protocol', desc: 'Landing page featuring a complex, generative particle system representing decentralized nodes in a network.', tags: ['Canvas API', 'Math'] },
            { id: '11', title: 'CHROMA', client: 'Design Agency', desc: 'Vibrant, maximalist agency portfolio defying the current minimalist trend. Over-the-top animations and loud colors.', tags: ['WebGL', 'GSAP'] },
            { id: '12', title: 'STEALTH', client: 'Cybersecurity', desc: 'A terminal-inspired interface disguised as a corporate website. Rewards users who explore with hidden content.', tags: ['React', 'Framer Motion'] },
        ];

        /**
         * CORE SETUP
         */
        const container = document.getElementById('webgl-container');
        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x030303, 0.025); // Deep fog blending into background

        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        // Initial camera position looking at the spiral
        camera.position.set(0, 0, 45);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Performance optimization
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        container.appendChild(renderer.domElement);

        /**
         * LIGHTING (Dramatic, moody)
         */
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        scene.add(ambientLight);

        const spotLight = new THREE.SpotLight(0xffffff, 3);
        spotLight.position.set(20, 50, 30);
        spotLight.angle = Math.PI / 4;
        spotLight.penumbra = 0.5;
        spotLight.castShadow = true;
        scene.add(spotLight);

        const redAccentLight = new THREE.PointLight(0xE52A2A, 2, 50);
        redAccentLight.position.set(-15, -10, 10);
        scene.add(redAccentLight);

        /**
         * GENERATIVE CANVAS TEXTURES
         * Instead of loading images, we draw sleek tech/design graphics on canvas
         * to serve as textures for our 3D cards.
         */
        function createProjectTexture(project, index) {
            const canvas = document.createElement('canvas');
            canvas.width = 800;
            canvas.height = 1000;
            const ctx = canvas.getContext('2d');

            // Background
            ctx.fillStyle = '#0a0a0a';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Subtle Grid
            ctx.strokeStyle = '#1a1a1a';
            ctx.lineWidth = 1;
            for(let i=0; i<canvas.width; i+=40) {
                ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
            }
            for(let i=0; i<canvas.height; i+=40) {
                ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
            }

            // Abstract Geometric Art based on index
            ctx.fillStyle = index % 3 === 0 ? '#E52A2A' : '#ffffff';
            ctx.save();
            ctx.translate(canvas.width/2, canvas.height/2 - 100);
            ctx.rotate(index * 0.5);
            if (index % 2 === 0) {
                ctx.fillRect(-150, -150, 300, 300);
            } else {
                ctx.beginPath();
                ctx.arc(0, 0, 180, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();

            // Overlay noise/scratches
            ctx.fillStyle = 'rgba(255,255,255,0.03)';
            for(let i=0; i<500; i++) {
                ctx.fillRect(Math.random()*canvas.width, Math.random()*canvas.height, Math.random()*3, Math.random()*100);
            }

            // Typography
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 120px "Syne", sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText(project.title, 60, canvas.height - 180);

            ctx.font = '400 30px "JetBrains Mono", monospace';
            ctx.fillStyle = '#888888';
            ctx.fillText(`NO. ${project.id} // ${project.client}`, 60, canvas.height - 80);

            const texture = new THREE.CanvasTexture(canvas);
            texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
            return texture;
        }

        /**
         * SPIRAL CONSTRUCTION
         * Upward spiral: narrow at bottom, wide at top.
         */
        const spiralGroup = new THREE.Group();
        scene.add(spiralGroup);

        const cards = [];
        const numItems = portfolioData.length;
        
        // Dimensions of the cards
        const cardWidth = 6;
        const cardHeight = 7.5;
        const geometry = new THREE.PlaneGeometry(cardWidth, cardHeight, 32, 32);

        for (let i = 0; i < numItems; i++) {
            const data = portfolioData[i];
            const texture = createProjectTexture(data, i);
            
            // Material: Standard to react to lights, DoubleSide so we see it from all angles
            const material = new THREE.MeshStandardMaterial({
                map: texture,
                side: THREE.DoubleSide,
                roughness: 0.4,
                metalness: 0.1,
            });

            const mesh = new THREE.Mesh(geometry, material);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            
            // Data attachment for raycasting
            mesh.userData = {
                id: i,
                project: data,
                baseScale: 1,
                targetScale: 1
            };

            // Calculate position along the specific spiral
            // t goes from 0 (bottom) to 1 (top)
            const t = i / (numItems - 1);
            
            // Height (y) ranges from -15 to +15
            const y = -15 + (t * 30);
            
            // Radius (r) narrow at bottom (4), wide at top (18)
            const r = 4 + (t * 14);
            
            // Angle (theta) - let's do 2.5 full rotations
            const theta = t * Math.PI * 5;

            const x = Math.cos(theta) * r;
            const z = Math.sin(theta) * r;

            mesh.position.set(x, y, z);

            // Make the card face slightly outward from the center axis, but tilted up slightly
            const lookTarget = new THREE.Vector3(x * 1.5, y + 2, z * 1.5);
            mesh.lookAt(lookTarget);

            spiralGroup.add(mesh);
            cards.push(mesh);
        }

        // Add a central core (optional, adds depth)
        const coreGeo = new THREE.CylinderGeometry(0.1, 0.5, 40, 16);
        const coreMat = new THREE.MeshBasicMaterial({ color: 0x111111, transparent: true, opacity: 0.5 });
        const core = new THREE.Mesh(coreGeo, coreMat);
        spiralGroup.add(core);

        /**
         * INTERACTION & STATE
         */
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        
        let targetRotationY = 0;
        let targetRotationX = 0; // Slight tilt
        
        // State Machine
        const STATE = {
            GALLERY: 'gallery',
            TRANSITIONING: 'transitioning',
            DETAIL: 'detail'
        };
        let currentState = STATE.GALLERY;
        
        // Camera Anim Targets
        let camTargetPos = new THREE.Vector3(0, 0, 45);
        let camTargetLook = new THREE.Vector3(0, 0, 0);
        let currentLookAt = new THREE.Vector3(0, 0, 0);

        // UI Elements
        const detailOverlay = document.getElementById('detail-overlay');
        const dtTitle = document.getElementById('dt-title');
        const dtClient = document.getElementById('dt-client');
        const dtDesc = document.getElementById('dt-desc');
        const dtTags = document.getElementById('dt-tags');
        const btnClose = document.getElementById('close-detail');

        // Mouse Move for Parallax and Raycasting
        window.addEventListener('mousemove', (event) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            // Custom cursor tracking
            const cursor = document.getElementById('cursor');
            cursor.style.left = event.clientX + 'px';
            cursor.style.top = event.clientY + 'px';

            // Parallax effect on spiral when in gallery mode
            if (currentState === STATE.GALLERY) {
                targetRotationY += event.movementX * 0.001;
                targetRotationX = mouse.y * 0.1; 
            }
        });

        // Scroll for rotating the spiral
        window.addEventListener('wheel', (event) => {
            if (currentState === STATE.GALLERY) {
                // Scroll down rotates one way, up the other
                targetRotationY += event.deltaY * 0.005;
            }
        });

        // Click Logic
        window.addEventListener('click', () => {
            if (currentState !== STATE.GALLERY) return;

            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(cards);

            if (intersects.length > 0) {
                const object = intersects[0].object;
                openDetailView(object);
            }
        });

        btnClose.addEventListener('click', () => {
            closeDetailView();
        });

        function openDetailView(card) {
            currentState = STATE.TRANSITIONING;
            
            // Populate UI
            const data = card.userData.project;
            dtTitle.innerText = data.title;
            dtClient.innerText = data.client;
            dtDesc.innerText = data.desc;
            dtTags.innerHTML = data.tags.map(t => `<span class="tag">${t}</span>`).join('');

            // Calculate new camera position
            // We want the camera to be directly in front of the card.
            // First, get the card's global position and rotation.
            const globalPos = new THREE.Vector3();
            card.getWorldPosition(globalPos);
            
            // Get normal vector of the card to place camera in front
            const normal = new THREE.Vector3(0, 0, 1);
            normal.applyQuaternion(card.getWorldQuaternion(new THREE.Quaternion()));
            
            // Offset camera 12 units away along the normal
            // Shift slightly to the left (-X relative to camera) to account for UI on the right
            camTargetPos.copy(globalPos).add(normal.multiplyScalar(15));
            // Shift left using cross product with UP vector
            const leftDir = new THREE.Vector3().crossVectors(new THREE.Vector3(0,1,0), normal).normalize();
            camTargetPos.add(leftDir.multiplyScalar(-3)); 

            camTargetLook.copy(globalPos);

            // Show UI
            detailOverlay.classList.add('active');

            setTimeout(() => { currentState = STATE.DETAIL; }, 800);
        }

        function closeDetailView() {
            currentState = STATE.TRANSITIONING;
            detailOverlay.classList.remove('active');

            // Reset camera to overview
            camTargetPos.set(0, 0, 45);
            camTargetLook.set(0, 0, 0);

            setTimeout(() => { currentState = STATE.GALLERY; }, 800);
        }

        // Hover effect styling
        const cursor = document.getElementById('cursor');

        /**
         * ANIMATION LOOP
         */
        const clock = new THREE.Clock();

        function animate() {
            requestAnimationFrame(animate);
            const delta = clock.getDelta();

            // Raycasting for hover states
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(cards);
            
            let hoveredCard = null;
            if (intersects.length > 0 && currentState === STATE.GALLERY) {
                hoveredCard = intersects[0].object;
                cursor.classList.add('hover');
            } else {
                cursor.classList.remove('hover');
            }

            // Smoothly animate card scales
            cards.forEach(card => {
                card.userData.targetScale = (card === hoveredCard) ? 1.15 : 1.0;
                // Lerp scale
                const currentScale = card.scale.x;
                const newScale = currentScale + (card.userData.targetScale - currentScale) * 0.1;
                card.scale.set(newScale, newScale, newScale);
                
                // If hovered, slightly elevate emissive color for glow
                if(card === hoveredCard) {
                    card.material.emissive.setHex(0x220000);
                } else {
                    card.material.emissive.setHex(0x000000);
                }
            });

            // Handle States
            if (currentState === STATE.GALLERY) {
                // Auto rotate slowly
                targetRotationY += delta * 0.1;
                
                // Smoothly apply rotation to spiral group
                spiralGroup.rotation.y += (targetRotationY - spiralGroup.rotation.y) * 0.05;
                spiralGroup.rotation.x += (targetRotationX - spiralGroup.rotation.x) * 0.05;

                // Make spiral float up and down slightly
                spiralGroup.position.y = Math.sin(clock.getElapsedTime() * 0.5) * 1.5;
            }

            // Camera Interpolation (Smooth transition between Gallery and Detail)
            camera.position.lerp(camTargetPos, 0.04);
            currentLookAt.lerp(camTargetLook, 0.04);
            camera.lookAt(currentLookAt);

            renderer.render(scene, camera);
        }

        /**
         * RESIZE HANDLER
         */
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        /**
         * INIT
         */
        window.onload = () => {
            // Remove intro screen
            setTimeout(() => {
                const intro = document.getElementById('intro');
                intro.style.opacity = '0';
                setTimeout(() => intro.style.display = 'none', 1500);
            }, 1000);

            animate();
        };

    </script>
</body>
</html> 