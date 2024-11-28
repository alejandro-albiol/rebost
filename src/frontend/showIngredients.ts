declare const axios: any;

document.addEventListener("DOMContentLoaded", () => {
    const formContainer = document.getElementById("add-product-to-shopping-list");
    const productList = document.getElementById("productList");
    
    formContainer?.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        // Obtener los valores del formulario
        const formData = new FormData(e.target as HTMLFormElement);
        const ingredientData = {
            name: formData.get("ingredientName"),
            format: formData.get("quantity")
        };

        try {
            // Enviar datos al backend
            const response = await axios.post('http://localhost:3000/api/v1/homePage', ingredientData);
            
            if (response.status === 200 || response.status === 201) {
                // Crear nuevo elemento de lista con el ID del backend
                const listItem = document.createElement("li");
                listItem.innerHTML = `
                    <span>${ingredientData.name} - ${ingredientData.format}</span>
                    <button class="remove-ingredient" data-id="${response.data.id}">X</button>
                `;
                
                // Agregar el nuevo ingrediente a la lista
                productList?.appendChild(listItem);
                
                // Limpiar el formulario
                (e.target as HTMLFormElement).reset();
                
                // Agregar funcionalidad para eliminar ingrediente
                const removeButton = listItem.querySelector(".remove-ingredient");
                removeButton?.addEventListener("click", async () => {
                    const ingredientId = removeButton.getAttribute("data-id");
                    try {
                        await axios.delete(`http://localhost:3000/api/v1/ingredients/${ingredientId}`);
                        listItem.remove();
                    } catch (error) {
                        console.error("Error al eliminar ingrediente:", error);
                        alert("No se pudo eliminar el ingrediente");
                    }
                });
            }
        } catch (error) {
            console.error("Error al guardar ingrediente:", error);
            alert("No se pudo guardar el ingrediente");
        }
    });
});