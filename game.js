<!DOCTYPE html>
<html lang="uk">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Minecraft Clone</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
    <style>
        body { margin: 0; overflow: hidden; }
        #health { position: absolute; top: 10px; right: 10px; color: red; font-size: 24px; }
        #inventory { position: absolute; bottom: 10px; left: 10px; font-size: 18px; color: white; }
        #trading { position: absolute; top: 50px; left: 10px; color: white; font-size: 18px; }
        #totem { position: absolute; top: 100px; left: 10px; color: yellow; font-size: 18px; }
    </style>
</head>
<body>
      const socket = io();

document.addEventListener("keydown", (event) => {
    if (event.key === "B") {  // Наприклад, натискання B поставить верстак
        let x = Math.floor(Math.random() * 500);
        let y = Math.floor(Math.random() * 500);
        socket.emit("placeBlock", { type: "crafting_table", x, y });
    }
});

socket.on("blockPlaced", (block) => {
    console.log(`Блок ${block.type} розміщено на (${block.x}, ${block.y})`);
});

socket.on("currentBlocks", (blocks) => {
    blocks.forEach(block => {
        console.log(`Завантажено блок ${block.type} на (${block.x}, ${block.y})`);
    });
});
    <div id="health">❤️❤️❤️</div>
    <div id="inventory">Інвентар: Пусто</div>
    <div id="trading">Торгівля: Немає активної торгівлі</div>
    <div id="totem">Тотем безсмертя: Немає</div>

    <script>
        let health = 3;
        let inventory = [];  // Масив для інвентаря
        let currentTrade = null;  // Містить інформацію про поточну торгівлю
        let isInVillage = false;  // Флаг для перевірки, чи в селі
        let raiders = [];  // Масив для зберігання розбійників
        let raidersDefeated = 0;  // Лічильник вбитих розбійників

        // Типи кирок
        const tools = {
            woodPickaxe: { name: 'Дерев’яна кирка', level: 1 },
            stonePickaxe: { name: 'Кам’яна кирка', level: 2 },
            ironPickaxe: { name: 'Залізна кирка', level: 3 },
            diamondPickaxe: { name: 'Алмазна кирка', level: 4 },
        };

        // Поточна кирка, яку використовує гравець
        let currentPickaxe = tools.woodPickaxe;

        // Three.js: сцена, камера, рендерер
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 2, 5);
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(10, 10, 10);
        scene.add(light);

        // Текстури для руд та інструментів
        const textureLoader = new THREE.TextureLoader();
        const textures = {
            grass: textureLoader.load('https://example.com/grass.jpg'),
            stone: textureLoader.load('https://example.com/stone.jpg'),
            ironOre: textureLoader.load('https://example.com/iron_ore.jpg'),
            diamondOre: textureLoader.load('https://example.com/diamond_ore.jpg'),
            emeraldOre: textureLoader.load('https://example.com/emerald_ore.jpg'),
            coalOre: textureLoader.load('https://example.com/coal_ore.jpg'),
            woodPickaxe: textureLoader.load('https://example.com/wood_pickaxe.jpg'),
            stonePickaxe: textureLoader.load('https://example.com/stone_pickaxe.jpg'),
            ironPickaxe: textureLoader.load('https://example.com/iron_pickaxe.jpg'),
            diamondPickaxe: textureLoader.load('https://example.com/diamond_pickaxe.jpg'),
        };

        // Генерація руд
        function generateOre(x, y, z, oreType) {
            let texture;
            if (oreType === 'iron') texture = textures.ironOre;
            else if (oreType === 'diamond') texture = textures.diamondOre;
            else if (oreType === 'emerald') texture = textures.emeraldOre;
            else if (oreType === 'coal') texture = textures.coalOre;
            
            const geometry = new THREE.BoxGeometry(1, 1, 1);
            const material = new THREE.MeshStandardMaterial({ map: texture });
            const oreBlock = new THREE.Mesh(geometry, material);
            oreBlock.position.set(x, y, z);
            oreBlock.userData = { type: 'ore', oreType: oreType };
            scene.add(oreBlock);
        }

        // Обробка добування руд
        function mineOre(oreBlock) {
            if (oreBlock.userData.type === 'ore') {
                // Перевіряємо, чи гравець має достатньо сильну кирку для цієї руди
                const oreType = oreBlock.userData.oreType;

                let canMine = false;
                if (oreType === 'iron' && currentPickaxe.level >= 2) canMine = true;
                else if (oreType === 'diamond' && currentPickaxe.level >= 4) canMine = true;
                else if (oreType === 'emerald' && currentPickaxe.level >= 4) canMine = true;
                else if (oreType === 'coal' && currentPickaxe.level >= 1) canMine = true;

                if (canMine) {
                    // Додаємо руду до інвентаря
                    inventory.push(oreType);
                    document.getElementById('inventory').innerText = 'Інвентар: ' + inventory.join(', ');
                    scene.remove(oreBlock);
                } else {
                    alert('Ваша кирка не може добувати цю руду!');
                }
            }
        }

        // Логіка для вибору кирки
        window.addEventListener('keydown', (event) => {
            if (event.key === '1') {
                currentPickaxe = tools.woodPickaxe;
            } else if (event.key === '2') {
                currentPickaxe = tools.stonePickaxe;
            } else if (event.key === '3') {
                currentPickaxe = tools.ironPickaxe;
            } else if (event.key === '4') {
                currentPickaxe = tools.diamondPickaxe;
            }
        });

        // Взаємодія з об’єктами на сцені (наприклад, руда)
        window.addEventListener('click', (event) => {
            const raycaster = new THREE.Raycaster();
            const mouse = new THREE.Vector2(0, 0);
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects([scene.children]);

            if (intersects.length > 0) {
                const object = intersects[0].object;

                // Взаємодія з рудою
                if (object.userData.type === 'ore') {
                    mineOre(object);
                }
            }
        });

        // Оновлення здоров'я
        function updateHealth() {
            document.getElementById('health').innerText = '❤️'.repeat(health);
            if (health <= 0) {
                alert("Ви загинули! Гра закінчена.");
                location.reload();
            }
        }

        // Генерація світу
        function generateWorld() {
            for (let x = -10; x <= 10; x++) {
                for (let z = -10; z <= 10; z++) {
                    const y = Math.floor(Math.random() * 5);  // Висота для генерування руд
                    const oreType = Math.random() > 0.7 ? 'iron' :
                                    Math.random() > 0.5 ? 'diamond' :
                                    Math.random() > 0.3 ? 'emerald' : 'coal';
                    generateOre(x * 5, y, z * 5, oreType);
                }
            }
let isSneaking = false;

document.addEventListener('keydown', (event) => {
    if (event.key === 'Shift') {
        isSneaking = true;
        player.speed = 0.5; // Уповільнення
        socket.emit('playerSneak', true);
    }
});

document.addEventListener('keyup', (event) => {
    if (event.key === 'Shift') {
        isSneaking = false;
        player.speed = 1; // Повернення швидкості
        socket.emit('playerSneak', false);
    }
});
         const socket = io();
let inventory = Array(36).fill(null);
let armor = { helmet: null, chestplate: null, leggings: null, boots: null };
let offHand = null;

document.addEventListener("keydown", (event) => {
    if (event.key === "E") {
        openUI("inventoryUI");
        renderInventory();
    }
});

function openUI(id) {
    document.getElementById(id).style.display = "block";
}

function closeUI(id) {
    document.getElementById(id).style.display = "none";
}

function renderInventory() {
    let grid = document.getElementById("inventoryGrid");
    grid.innerHTML = "";
    
    inventory.forEach((item, index) => {
        let slot = document.createElement("div");
        slot.classList.add("slot");
        slot.innerText = item ? item : "";
        slot.onclick = () => moveToOffHand(index);
        grid.appendChild(slot);
    });

    document.getElementById("helmetSlot").innerText = armor.helmet || "Ш";
    document.getElementById("chestplateSlot").innerText = armor.chestplate || "Н";
    document.getElementById("leggingsSlot").innerText = armor.leggings || "П";
    document.getElementById("bootsSlot").innerText = armor.boots || "Б";
    document.getElementById("offHandSlot").innerText = offHand || "🖐";
}

function moveToOffHand(index) {
    if (inventory[index]) {
        offHand = inventory[index];
        inventory[index] = null;
        renderInventory();
    }
}

document.addEventListener("keydown", (event) => {
    if (event.key === "E" && interactingBlock) {
        openUI(interactingBlock.type);
    }
});

function openUI(type) {
    const ui = document.getElementById(type + "UI");
    if (ui) ui.style.display = "block";
}

function closeUI(id) {
    document.getElementById(id).style.display = "none";
}

function craftItem(item) {
    console.log(`Крафтимо: ${item}`);
    socket.emit("craftItem", item);
} 
        }
