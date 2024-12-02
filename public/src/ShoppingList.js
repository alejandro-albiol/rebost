export class ShoppingList {
    constructor() {
        this.items = new Map();
    }
    static getInstance() {
        if (!ShoppingList.instance) {
            ShoppingList.instance = new ShoppingList();
        }
        return ShoppingList.instance;
    }
    addItem(name, quantity = 1) {
        const currentQuantity = this.items.get(name) || 0;
        this.items.set(name, currentQuantity + quantity);
        this.updateDisplay();
    }
    removeItem(name) {
        this.items.delete(name);
        this.updateDisplay();
    }
    updateDisplay() {
        const container = document.getElementById('shopping-list-container');
        if (!container)
            return;
        container.innerHTML = '';
        this.items.forEach((quantity, name) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'shopping-list-item';
            itemElement.innerHTML = `
                <span>${name} - Cantidad: ${quantity}</span>
                <button onclick="ShoppingList.getInstance().removeItem('${name}')">Eliminar</button>
            `;
            container.appendChild(itemElement);
        });
    }
}
