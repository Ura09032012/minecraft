class CraftingTable {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.type = "crafting_table";
    }

    open() {
        console.log("Відкрито меню крафту");
    }
}

class Furnace {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.type = "furnace";
    }

    smelt(ore) {
        console.log(`Переплавка ${ore}...`);
    }
}

class Chest {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.type = "chest";
        this.items = [];
    }

    open() {
        console.log("Відкрито скриню");
    }

    addItem(item) {
        this.items.push(item);
        console.log(`Додано предмет: ${item}`);
    }
}

class Bed {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.type = "bed";
    }

    sleep() {
        console.log("Гравець спить...");
    }
}

class Smoker {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.type = "smoker";
    }

    cook(food) {
        console.log(`Готується ${food}...`);
    }
}

class EnchantmentTable {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.type = "enchantment_table";
    }

    enchant(item) {
        console.log(`Зачаровуємо ${item}...`);
    }
}

class Anvil {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.type = "anvil";
    }

    repair(item) {
        console.log(`Ремонт ${item}...`);
    }
}

module.exports = { CraftingTable, Furnace, Chest, Bed, Smoker, EnchantmentTable, Anvil };
