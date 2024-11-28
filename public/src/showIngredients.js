"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
document.addEventListener("DOMContentLoaded", () => {
    const formContainer = document.getElementById("add-product-to-shopping-list");
    const productList = document.getElementById("productList");
    formContainer === null || formContainer === void 0 ? void 0 : formContainer.addEventListener("submit", (e) => __awaiter(void 0, void 0, void 0, function* () {
        e.preventDefault();
        // Obtener los valores del formulario
        const formData = new FormData(e.target);
        const ingredientData = {
            name: formData.get("ingredientName"),
            format: formData.get("quantity")
        };
        try {
            // Enviar datos al backend
            const response = yield axios.post('http://localhost:3000/api/v1/homePage', ingredientData);
            if (response.status === 200 || response.status === 201) {
                // Crear nuevo elemento de lista con el ID del backend
                const listItem = document.createElement("li");
                listItem.innerHTML = `
                    <span>${ingredientData.name} - ${ingredientData.format}</span>
                    <button class="remove-ingredient" data-id="${response.data.id}">X</button>
                `;
                // Agregar el nuevo ingrediente a la lista
                productList === null || productList === void 0 ? void 0 : productList.appendChild(listItem);
                // Limpiar el formulario
                e.target.reset();
                // Agregar funcionalidad para eliminar ingrediente
                const removeButton = listItem.querySelector(".remove-ingredient");
                removeButton === null || removeButton === void 0 ? void 0 : removeButton.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
                    const ingredientId = removeButton.getAttribute("data-id");
                    try {
                        yield axios.delete(`http://localhost:3000/api/v1/ingredients/${ingredientId}`);
                        listItem.remove();
                    }
                    catch (error) {
                        console.error("Error al eliminar ingrediente:", error);
                        alert("No se pudo eliminar el ingrediente");
                    }
                }));
            }
        }
        catch (error) {
            console.error("Error al guardar ingrediente:", error);
            alert("No se pudo guardar el ingrediente");
        }
    }));
});
