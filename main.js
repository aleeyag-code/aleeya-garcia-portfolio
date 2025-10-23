// Global variables
let scene, camera, renderer, neuralNetwork;
let brainwaveSketch;
let skillsChart;

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeLoadingScreen();
    initializeNeuralNetwork();
    initializeTypedText();
    initializeSkillsChart();
    initializeBrainwaveAnalyzer();
    initializeScrollAnimations();
    initializeSmoothScrolling();
});

// Loading Screen Management
function initializeLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    
    // Simulate loading process
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 2000);
}

// 3D Neural Network Background
function initializeNeuralNetwork() {
    const canvas = document.getElementById('neural-canvas');
    
    // Scene setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    // Neural network nodes
    const nodes = [];
    const connections = [];
    const nodeCount = 150;
    const connectionDistance = 0.8;
    
    // Create nodes
    for (let i = 0; i < nodeCount; i++) {
        const geometry = new THREE.SphereGeometry(0.02, 8, 8);
        const material = new THREE.MeshBasicMaterial({ 
            color: new THREE.Color().setHSL(0.5 + Math.random() * 0.2, 1, 0.5 + Math.random() * 0.3)
        });
        const node = new THREE.Mesh(geometry, material);
        
        // Random position in 3D space
        node.position.x = (Math.random() - 0.5) * 4;
        node.position.y = (Math.random() - 0.5) * 4;
        node.position.z = (Math.random() - 0.5) * 4;
        
        // Add velocity for animation
        node.velocity = {
            x: (Math.random() - 0.5) * 0.002,
            y: (Math.random() - 0.5) * 0.002,
            z: (Math.random() - 0.5) * 0.002
        };
        
        nodes.push(node);
        scene.add(node);
    }
    
    // Create connections between nearby nodes
    for (let i = 0; i < nodeCount; i++) {
        for (let j = i + 1; j < nodeCount; j++) {
            const distance = nodes[i].position.distanceTo(nodes[j].position);
            if (distance < connectionDistance && Math.random() < 0.3) {
                const geometry = new THREE.BufferGeometry().setFromPoints([
                    nodes[i].position,
                    nodes[j].position
                ]);
                const material = new THREE.LineBasicMaterial({ 
                    color: 0x00f5d4,
                    opacity: 0.3,
                    transparent: true
                });
                const line = new THREE.Line(geometry, material);
                connections.push({ line, node1: i, node2: j });
                scene.add(line);
            }
        }
    }
    
    // Camera position
    camera.position.z = 3;
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Rotate camera slowly
        camera.position.x = Math.sin(Date.now() * 0.0001) * 0.5;
        camera.position.y = Math.cos(Date.now() * 0.0001) * 0.5;
        camera.lookAt(scene.position);
        
        // Animate nodes
        nodes.forEach((node, index) => {
            node.position.x += node.velocity.x;
            node.position.y += node.velocity.y;
            node.position.z += node.velocity.z;
            
            // Bounce off boundaries
            if (Math.abs(node.position.x) > 2) node.velocity.x *= -1;
            if (Math.abs(node.position.y) > 2) node.velocity.y *= -1;
            if (Math.abs(node.position.z) > 2) node.velocity.z *= -1;
            
            // Pulse effect
            const scale = 1 + Math.sin(Date.now() * 0.001 + index) * 0.2;
            node.scale.setScalar(scale);
        });
        
        // Update connections
        connections.forEach(connection => {
            const positions = connection.line.geometry.attributes.position.array;
            positions[0] = nodes[connection.node1].position.x;
            positions[1] = nodes[connection.node1].position.y;
            positions[2] = nodes[connection.node1].position.z;
            positions[3] = nodes[connection.node2].position.x;
            positions[4] = nodes[connection.node2].position.y;
            positions[5] = nodes[connection.node2].position.z;
            connection.line.geometry.attributes.position.needsUpdate = true;
            
            // Fade effect based on distance
            const distance = nodes[connection.node1].position.distanceTo(nodes[connection.node2].position);
            const opacity = Math.max(0, 1 - distance / connectionDistance);
            connection.line.material.opacity = opacity * 0.3;
        });
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// Typed Text Effect
function initializeTypedText() {
    const typed = new Typed('#typed-text', {
        strings: [
            'Neuroscientist-turned-AI-Engineer',
            'Building brains for machines',
            'Bridging neuroscience and artificial intelligence',
            'Creating intelligent systems that learn and adapt'
        ],
        typeSpeed: 50,
        backSpeed: 30,
        backDelay: 2000,
        loop: true,
        showCursor: true,
        cursorChar: '|'
    });
}

// Skills Radar Chart
function initializeSkillsChart() {
    const chartDom = document.getElementById('skillsChart');
    skillsChart = echarts.init(chartDom);
    
    const option = {
        backgroundColor: 'transparent',
        radar: {
            indicator: [
                { name: 'Machine Learning', max: 100 },
                { name: 'Computer Vision', max: 100 },
                { name: 'Neural Networks', max: 100 },
                { name: 'Python', max: 100 },
                { name: 'MLOps', max: 100 },
                { name: 'Data Science', max: 100 },
                { name: 'Deep Learning', max: 100 },
                { name: 'Research', max: 100 }
            ],
            shape: 'polygon',
            splitNumber: 4,
            axisName: {
                color: '#00f5d4',
                fontSize: 12,
                fontFamily: 'JetBrains Mono'
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(0, 245, 212, 0.2)'
                }
            },
            splitArea: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: 'rgba(0, 245, 212, 0.3)'
                }
            }
        },
        series: [{
            name: 'Skills',
            type: 'radar',
            data: [{
                value: [95, 90, 88, 92, 75, 85, 87, 93],
                name: 'Current Level',
                areaStyle: {
                    color: 'rgba(0, 245, 212, 0.1)'
                },
                lineStyle: {
                    color: '#00f5d4',
                    width: 2
                },
                itemStyle: {
                    color: '#00f5d4',
                    borderColor: '#00f5d4',
                    borderWidth: 2
                }
            }],
            animationDuration: 2000,
            animationEasing: 'cubicOut'
        }]
    };
    
    skillsChart.setOption(option);
    
    // Handle window resize
    window.addEventListener('resize', () => {
        skillsChart.resize();
    });
}

// Brainwave Analyzer with P5.js
function initializeBrainwaveAnalyzer() {
    brainwaveSketch = function(p) {
        let frequency = 10;
        let amplitude = 50;
        let noiseLevel = 10;
        let time = 0;
        let waves = [];
        
        p.setup = function() {
            const canvas = p.createCanvas(800, 400);
            canvas.parent('brainwaveCanvas');
            
            // Initialize multiple wave layers
            for (let i = 0; i < 3; i++) {
                waves.push({
                    frequency: frequency * (0.5 + i * 0.3),
                    amplitude: amplitude * (0.7 + i * 0.2),
                    phase: i * p.PI / 3,
                    color: i === 0 ? [0, 245, 212] : i === 1 ? [0, 102, 255] : [139, 0, 255]
                });
            }
        };
        
        p.draw = function() {
            p.background(0);
            
            // Grid overlay
            p.stroke(255, 255, 255, 20);
            p.strokeWeight(1);
            for (let i = 0; i < p.width; i += 40) {
                p.line(i, 0, i, p.height);
            }
            for (let i = 0; i < p.height; i += 40) {
                p.line(0, i, p.width, i);
            }
            
            // Draw brainwaves
            waves.forEach((wave, index) => {
                p.stroke(wave.color[0], wave.color[1], wave.color[2], 150);
                p.strokeWeight(2 + index);
                p.noFill();
                
                p.beginShape();
                for (let x = 0; x < p.width; x += 2) {
                    const y = p.height / 2 + 
                        p.sin((x * wave.frequency / 100) + time + wave.phase) * 
                        wave.amplitude * (1 + p.sin(time * 0.5) * 0.2) +
                        p.random(-noiseLevel, noiseLevel);
                    p.vertex(x, y);
                }
                p.endShape();
            });
            
            // Add particle effects
            for (let i = 0; i < 20; i++) {
                const x = p.random(p.width);
                const y = p.height / 2 + p.sin((x * frequency / 100) + time) * amplitude;
                
                p.fill(0, 245, 212, 100);
                p.noStroke();
                p.circle(x, y + p.random(-20, 20), 3);
            }
            
            time += 0.05;
        };
        
        // Update parameters from sliders
        p.updateFrequency = function(val) {
            waves.forEach((wave, i) => {
                wave.frequency = val * (0.5 + i * 0.3);
            });
        };
        
        p.updateAmplitude = function(val) {
            waves.forEach((wave, i) => {
                wave.amplitude = val * (0.7 + i * 0.2);
            });
        };
        
        p.updateNoise = function(val) {
            noiseLevel = val;
        };
    };
    
    // Initialize P5.js sketch
    new p5(brainwaveSketch);
    
    // Connect sliders to sketch
    document.getElementById('frequencySlider').addEventListener('input', (e) => {
        brainwaveSketch.updateFrequency(parseInt(e.target.value));
    });
    
    document.getElementById('amplitudeSlider').addEventListener('input', (e) => {
        brainwaveSketch.updateAmplitude(parseInt(e.target.value));
    });
    
    document.getElementById('noiseSlider').addEventListener('input', (e) => {
        brainwaveSketch.updateNoise(parseInt(e.target.value));
    });
}

// Scroll Animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe all fade-in elements
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
    
    // Animate project cards on scroll
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
    });
}

// Smooth Scrolling
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Project Interaction Functions
function showProjectDetails(projectId) {
    const projectDetails = {
        'hedge-fund': {
            title: 'AI Hedge Fund - Deep Dive',
            content: `
                <h3>Project Evolution</h3>
                <p>Started by cloning an open-source AI hedge fund repository, then transformed it into a production-ready system:</p>
                <ul>
                    <li><strong>Poetry Integration:</strong> Migrated from requirements.txt to pyproject.toml for deterministic builds</li>
                    <li><strong>Docker Optimization:</strong> Multi-stage builds reducing image size by 68%</li>
                    <li><strong>Redis Caching:</strong> Implemented API rate limiting and 500% throughput improvement</li>
                    <li><strong>Neuroscience Integration:</strong> Added Prospect Theory utility curves for behavioral finance</li>
                    <li><strong>CI/CD Pipeline:</strong> GitHub Actions for automated testing and deployment</li>
                </ul>
                <p><strong>Performance:</strong> Sharpe ratio of 2.14 in paper trading, max drawdown -3.8%</p>
            `
        },
        'tesla-detection': {
            title: 'Tesla Vehicle Detection System',
            content: `
                <h3>Technical Implementation</h3>
                <p>Real-time object detection system specifically trained for Tesla vehicle recognition:</p>
                <ul>
                    <li><strong>Model:</strong> YOLOv5 with custom training on Tesla vehicle dataset</li>
                    <li><strong>Performance:</strong> 89% mAP with sub-100ms inference time</li>
                    <li><strong>Deployment:</strong> Docker container on AWS EC2 with auto-scaling</li>
                    <li><strong>Optimization:</strong> TensorRT optimization for edge deployment</li>
                    <li><strong>Monitoring:</strong> Real-time performance metrics and alerting</li>
                </ul>
                <p><strong>Impact:</strong> Successfully deployed in production environment with 99.9% uptime</p>
            `
        },
        'loan-risk': {
            title: 'Loan Default Risk Predictor',
            content: `
                <h3>Model Architecture</h3>
                <p>Advanced machine learning system for credit risk assessment:</p>
                <ul>
                    <li><strong>Algorithm:</strong> XGBoost with hyperparameter optimization</li>
                    <li><strong>Data Processing:</strong> SMOTE for imbalanced dataset handling</li>
                    <li><strong>Performance:</strong> 0.92 AUC-ROC, 85% accuracy</li>
                    <li><strong>API:</strong> FastAPI with async request handling</li>
                    <li><strong>Testing:</strong> Comprehensive PyTest coverage (>90%)</li>
                </ul>
                <p><strong>Deployment:</strong> Dockerized with GitHub Actions CI/CD pipeline</p>
            `
        }
    };
    
    const project = projectDetails[projectId];
    if (project) {
        // Create modal or overlay with project details
        showModal(project.title, project.content);
    }
}

function openGitHub(repoName) {
    // Simulate opening GitHub repository
    const githubUrl = `https://github.com/aleeya-garcia/${repoName}`;
    window.open(githubUrl, '_blank');
}

function downloadResume() {
    // Create download link for resume
    const link = document.createElement('a');
    link.href = 'resources/Aleeya_Garcia_Resume.pdf';
    link.download = 'Aleeya_Garcia_Resume.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Modal Function
function showModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>${title}</h2>
                <button class="modal-close" onclick="closeModal()">&times;</button>
            </div>
            <div class="modal-body">${content}</div>
        </div>
    `;
    
    // Add modal styles
    const style = document.createElement('style');
    style.textContent = `
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            backdrop-filter: blur(10px);
        }
        .modal-content {
            background: #0a0a0a;
            border: 1px solid #00f5d4;
            border-radius: 12px;
            max-width: 600px;
            max-height: 80vh;
            overflow-y: auto;
            padding: 2rem;
            position: relative;
        }
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
        }
        .modal-close {
            background: none;
            border: none;
            color: #00f5d4;
            font-size: 2rem;
            cursor: pointer;
        }
        .modal-body {
            color: #b0b0b0;
            line-height: 1.6;
        }
        .modal-body h3 {
            color: #00f5d4;
            margin-bottom: 1rem;
        }
        .modal-body ul {
            margin: 1rem 0;
            padding-left: 1.5rem;
        }
        .modal-body li {
            margin-bottom: 0.5rem;
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(modal);
    
    // Close modal on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    window.closeModal = function() {
        document.body.removeChild(modal);
        document.head.removeChild(style);
    };
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Performance optimization
const debouncedResize = debounce(() => {
    if (skillsChart) {
        skillsChart.resize();
    }
}, 250);

window.addEventListener('resize', debouncedResize);
