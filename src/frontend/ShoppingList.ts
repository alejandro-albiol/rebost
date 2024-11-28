export class ShoppingList {
    private static instance: ShoppingList;
    private items: Map<string, number> = new Map();

    private constructor() {}

    public static getInstance(): ShoppingList {
        if (!ShoppingList.instance) {
            ShoppingList.instance = new ShoppingList();
        }
        return ShoppingList.instance;
    }

    public addItem(name: string, quantity: number = 1): void {
        const currentQuantity = this.items.get(name) || 0;
        this.items.set(name, currentQuantity + quantity);
        this.updateDisplay();
    }

    public removeItem(name: string): void {
        this.items.delete(name);
        this.updateDisplay();
    }

    private updateDisplay(): void {
        const container = document.getElementById('shopping-list-container');
        if (!container) return;

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
