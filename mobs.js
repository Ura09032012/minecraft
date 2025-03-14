class Skeleton {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.health = 20;
        this.attackDamage = 5;
    }

    shoot() {
        console.log("Скелет стріляє!");
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) this.die();
    }

    die() {
        console.log("Скелет помер");
    }
}

class Zombie {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.health = 30;
        this.attackDamage = 8;
    }

    attack(player) {
        console.log("Зомбі атакує гравця!");
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) this.die();
    }

    die() {
        console.log("Зомбі помер");
    }
}

class Dragon {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.health = 200;
        this.attackDamage = 15;
    }

    breatheFire() {
        console.log("Дракон атакує вогнем!");
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) this.die();
    }

    die() {
        console.log("Дракон помер!");
    }
}

module.exports = { Skeleton, Zombie, Dragon };
