interface Product {
    productName: string;
    quantity: number;
}

let productList: Product[] = [];

function addProduct() {
    const productName = (document.getElementById('ingredientName') as HTMLInputElement).value;
    const quantity = parseInt((document.getElementById('quantity') as HTMLInputElement).value);
    
    if (productName && quantity) {
        productList.push({ productName, quantity });
        updateProductList();
        clearInputs();
    }
}

function updateProductList() {
    const listContainer = document.getElementById('productStorage');
    if (!listContainer) return;

    listContainer.innerHTML = '';
    
    productList.forEach((product, index) => {
        const listItem = document.createElement('div');
        listItem.className = 'product-item';
        listItem.innerHTML = `
            <span>${product.productName} - Cantidad: ${product.quantity}</span>
            <div class="actions">
                <img src="media/icon/edit.png" alt="Editar" onclick="editProduct(${index})" class="icon">
                <img src="media/icon/trash.png" alt="Eliminar" onclick="deleteProduct(${index})" class="icon">
            </div>
        `;
        listContainer.appendChild(listItem);
    });
}

function editProduct(index: number) {
    const product = productList[index];
    const newName = prompt('Nuevo nombre del producto:', product.productName);
    const newQuantity = parseInt(prompt('Nueva cantidad:', product.quantity.toString()) || '0');
    
    if (newName && newQuantity) {
        productList[index] = { productName: newName, quantity: newQuantity };
        updateProductList();
    }
}

function deleteProduct(index: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
        productList.splice(index, 1);
        updateProductList();
    }
}

function clearInputs() {
    (document.getElementById('productName') as HTMLInputElement).value = '';
    (document.getElementById('quantity') as HTMLInputElement).value = '';
}