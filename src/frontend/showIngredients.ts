declare const axios: any;

document.addEventListener("DOMContentLoaded", async () => {
    const result = await axios.get(`http://localhost:3000/api/v1/inventory/`);
    let htmlIngredients = "<table><thead><td>Name</td><td>Format</td><td>Actualizar</td><td>Eliminar</td></thead>";
    result.data.forEach((ingredients:any)=>{htmlIngredients += `<tr><td>${ingredients.name}</td><td>${ingredients.format}</td><td><a class="update-button" href="http://localhost:3000/inventory/${ingredients.id}"><img  width="8px" src="../../media/icon/lapiz.png"></a></td><td><img class="delete-button" id="delete-${ingredients.id}" width="8px" src="../../media/icon/basura.png"></td></tr>`});
    htmlIngredients += "</table>";
    document.getElementById("storage")!.innerHTML = htmlIngredients;

    document.querySelectorAll(".delete-button").forEach((button)=>{button.addEventListener("click", async (e)=>{
        const id = (e.target as HTMLElement).id.split("-")[1];
        const result = await axios.delete(`http://localhost:3000/api/v1/ingredients/${id}`);
        location.reload();
    })})
});