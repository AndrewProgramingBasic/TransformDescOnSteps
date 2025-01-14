const inputText = document.querySelector(".insertedText");
const insertText = document.querySelector(".insertText");
const submitButton = document.querySelector(".miBotonCopiar");
const loadingIndicator = document.getElementById("loading"); // Obtener el indicador de carga

submitButton.addEventListener("click", async () => {
    const prompt = inputText.value;

    if (prompt.trim() === "") {
        alert("Por favor, ingresa un prompt.");
        return;
    }

    // Mostrar el indicador de carga ANTES de la petición
    loadingIndicator.style.display = "block";
    insertText.textContent = ""; // Limpiar el área de resultados

    try {
        const response = await fetch("http://localhost:3000/gemini", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ description: prompt })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Error en la petición: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        insertText.innerHTML = data.geminiResponse;

    } catch (error) {
        console.error("Error al comunicarse con el servidor:", error);
        insertText.textContent = "Error al comunicarse con el servidor. Por favor, inténtalo de nuevo.";
        alert(error.message);
    } finally {
        // Ocultar el indicador de carga DESPUÉS de la petición (éxito o error)
        loadingIndicator.style.display = "none";
    }
});



/*function seleccionarTexto() {
  const elemento = document.querySelector(".insertText");
  if (!elemento) {
    console.error("No se encontró el elemento con la clase .insertText");
    return;
  }

  if (document.body.createTextRange) { // Para IE < 9
    const range = document.body.createTextRange();
    range.moveToElementText(elemento);
    range.select();
  } else if (window.getSelection) { // Para navegadores modernos
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(elemento);
    selection.removeAllRanges();
    selection.addRange(range);
  } else {
    console.error("No se soporta la selección de texto en este navegador.");
  }
}

// Ejemplo de uso: Asignar la función a un evento onclick de un botón (recomendado)
const botonSeleccionar = document.getElementById("miBotonSeleccionar");
if (botonSeleccionar) {
  botonSeleccionar.onclick = seleccionarTexto;
} else {
    console.error("No se encontro el boton con el id miBotonSeleccionar");
}*/
