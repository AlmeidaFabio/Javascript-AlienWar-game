const yourShip = document.querySelector('.player-shooter');
const playArea = document.querySelector('#main-play-area');
const aliens = ['img/monster-1.png', 'img/monster-2.png', 'img/monster-3.png'];
const instructions = document.querySelector('.game-instructions');
const start = document.querySelector('.start');
let alienInterval;

function flyShip(event) {
    if(event.key === 'ArrowUp') {
        event.preventDefault();
        moveUp();
    } else if(event.key === 'ArrowDown') {
        event.preventDefault();
        moveDown();
    } else if(event.key === " ") {
        event.preventDefault();
        laser();
    }
}

function moveUp() {
    let top = getComputedStyle(yourShip).getPropertyValue('top');

    if(top === '0px') {
        return
    } else {
       let position = parseInt(top); 
       position -= 50;
       yourShip.style.top = `${position}px`;
    }
}

function moveDown() {
    let top = getComputedStyle(yourShip).getPropertyValue('top');

    if(top === '510px') {
        return;
    } else {
        let position = parseInt(top);
        position += 50;
        yourShip.style.top = `${position}px`;
    }
}

function laser() {
    let l = createLaserElement();
    playArea.appendChild(l);
    moveLaser(l);
}

function createLaserElement() {
    let xPosition = parseInt(window.getComputedStyle(yourShip).getPropertyValue('left'));
    let yPosition = parseInt(window.getComputedStyle(yourShip).getPropertyValue('top'));
    let newLaser = document.createElement('img');
    newLaser.src = 'img/shoot.png';
    newLaser.classList.add('laser');
    newLaser.style.left = `${xPosition}px`;
    newLaser.style.top = `${yPosition - 10}px`;
    return newLaser;
}

function moveLaser(laser) {
    setInterval(() => {
        let xPosition = parseInt(laser.style.left);
        let enemys = document.querySelectorAll('.alien');
        enemys.forEach((alien) => {
            if(colision(laser, alien)) {
                alien.src = 'img/explosion.png';
                alien.classList.remove('alien');
                alien.classList.add('dead-alien');
            }
        });

        if(xPosition === 340) {
            laser.remove()
        } else {
            laser.style.left = `${xPosition + 8}px`
        }
    }, 10);
}

function createAliens() {
    let newAlien = document.createElement('img');
    let alien = aliens[Math.floor(Math.random() * aliens.length)];
    newAlien.src = alien;
    newAlien.classList.add('alien');
    newAlien.classList.add('alien-transition');
    newAlien.style.left = '370px';
    newAlien.style.top = `${Math.floor(Math.random() * 330) + 30}px`;
    playArea.appendChild(newAlien);
    moveAlien(newAlien);
}

function moveAlien(alien) {
    setInterval(() => {
        let xPosition = parseInt(window.getComputedStyle(alien).getPropertyValue('left'));
        if(xPosition <= 50) {
            if(Array.from(alien.classList).includes('dead-alien')) {
                alien.remove();
            } else {
                gameOver();
            }
        } else {
            alien.style.left = `${xPosition - 4}px`;
        }
    }, 30);
}

function colision(laser, alien) {
    let laserTop = parseInt(laser.style.top);
    let laserLeft = parseInt(laser.style.left);
    let laserBottom = laserTop - 20;

    let alienTop = parseInt(alien.style.top);
    let alienLeft = parseInt(alien.style.left);
    let alienBottom = alienTop - 30;

    if(laserLeft != 340 && laserLeft + 40 >= alienLeft) {
        if(laserTop <= alienTop && laserTop >= alienBottom) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

start.addEventListener('click', (event) => {
    playGame();
});

function playGame() {
    start.style.display = 'none';
    instructions.style.display = 'none';
    window.addEventListener('keydown', flyShip);
    alienInterval = setInterval(() => {
        createAliens();
    }, 2000);
}

function gameOver() {
    window.removeEventListener('keydown', flyShip);
    clearInterval(alienInterval);
    let enemys = document.querySelectorAll('.alien');
    enemys.forEach((alien) => alien.remove());
    let lasers = document.querySelectorAll('.laser');
    lasers.forEach((l) => l.remove());
    setTimeout(() => {
        alert('Game Over');
        yourShip.style.top = '255px';
        start.style.display = 'block';
        instructions.style.display = 'block';
    })
}