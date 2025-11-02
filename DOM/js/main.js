const recetasIniciales = [
    { id: 1, nombre: "Arroz con Leche Clásico", ingredientes: ["Arroz", "Leche entera", "Azúcar", "Canela"], imagenUrl: "https://via.placeholder.com/400x200/507D3B/fff?text=Arroz+con+Leche", time: 45, destacado: true },
    { id: 2, nombre: "Salmón a la Plancha Fácil", ingredientes: ["Lomo de salmón", "Aceite de oliva", "Sal", "Pimienta", "Limón"], imagenUrl: "https://via.placeholder.com/400x200/FF5100/fff?text=Salmón+Fácil", time: 20, destacado: true },
    { id: 3, nombre: "Ensalada de Quinoa", ingredientes: ["Quinoa", "Tomate", "Pepino", "Cebolla", "Aguacate"], imagenUrl: "https://via.placeholder.com/400x200/CD9C8A/fff?text=Ensalada+Quinoa", time: 15, destacado: false },
    { id: 4, nombre: "Pasta Cremosa", ingredientes: ["Pasta", "Crema", "Champiñones", "Ajo", "Mantequilla"], imagenUrl: "https://via.placeholder.com/400x200/507D3B/fff?text=Pasta+Cremosa", time: 30, destacado: false },
];

const recetasListContainer = document.querySelector('#recetas-list');
const featuredListContainer = document.querySelector('#featured-list'); 
const recipeForm = document.querySelector('#recipe-form');
const feedbackMessage = document.querySelector('#form-feedback');


function createRecipeCard(receta) {
    const card = document.createElement('article');
    card.classList.add('recipe-card');
    card.setAttribute('data-recipe-id', receta.id);
    card.setAttribute('tabindex', '0'); 
    
    card.innerHTML = `
        <img src="${receta.imagenUrl}" alt="Imagen de ${receta.nombre}" loading="lazy">
        <div class="card-content">
            <h3>${receta.nombre}</h3>
            <p><strong>Tiempo:</strong> ${receta.time} min</p>
            <p><strong>Ingredientes:</strong> <small>${receta.ingredientes.join(', ')}</small></p>
            <button type="button" class="delete-btn">Eliminar</button>
        </div>
    `;

    return card;
}

function renderAllRecipes() {
    recetasListContainer.innerHTML = '';
    const featuredRecipes = [];
    const regularRecipes = [];

    recetasIniciales.forEach(receta => {
        if (receta.destacado) {
            featuredRecipes.push(receta);
        }
        regularRecipes.push(receta);
    });

    featuredListContainer.innerHTML = '';
    featuredRecipes.forEach(receta => {
        const card = createRecipeCard(receta);
        featuredListContainer.append(card); 
    });

    regularRecipes.forEach(receta => {
        const card = createRecipeCard(receta);
        recetasListContainer.append(card); 
    });
}


function validateInput(input) {
    const errorSpan = input.nextElementSibling;
    const minLength = input.dataset.minLength;
    let isValid = true;
    let message = '';

    if (input.required && input.value.trim() === '') {
        isValid = false;
        message = 'Este campo es obligatorio.';
    } else if (minLength && input.value.length < parseInt(minLength) && input.value.trim() !== '') {
        isValid = false;
        message = `Mínimo ${minLength} caracteres.`;
    } else if (input.id === 'imagen-url' && input.value.trim() !== '') {
        try { new URL(input.value); } catch (e) {
            isValid = false;
            message = 'Formato de URL inválido.';
        }
    }

    if (isValid) {
        input.classList.remove('input-error');
        errorSpan.textContent = '';
    } else {
        input.classList.add('input-error');
        errorSpan.textContent = message;
    }

    return isValid;
}

recipeForm.addEventListener('change', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        validateInput(e.target);
    }
});

recipeForm.addEventListener('submit', function(e) {
    e.preventDefault(); 
    
    const inputs = recipeForm.querySelectorAll('input[required], textarea[required], input[type="url"]');
    let allValid = true;
    inputs.forEach(input => {
        if (!validateInput(input)) {
            allValid = false;
            if (!document.querySelector('.input-error:focus')) input.focus(); 
        }
    });
    
    if (allValid) {
        const nombre = document.querySelector('#nombre-receta').value;
        const ingredientes = document.querySelector('#ingredientes').value.split(',').map(i => i.trim());
        let imagenUrl = document.querySelector('#imagen-url').value || document.querySelector('#imagen-url').getAttribute('value');
        const newId = recetasIniciales.length > 0 ? Math.max(...recetasIniciales.map(r => r.id)) + 1 : 1;
        
        const nuevaReceta = { id: newId, nombre, ingredientes, imagenUrl, time: 25, destacado: false };
        recetasIniciales.push(nuevaReceta);
        
        renderAllRecipes();

        feedbackMessage.textContent = ` Receta "${nombre}" añadida.`;
        feedbackMessage.style.color = 'var(--color-principal)';
        recipeForm.reset();

        const newCard = document.querySelector(`#recetas-list [data-recipe-id="${newId}"]`);
        if (newCard) {
            newCard.classList.add('highlight');
            setTimeout(() => newCard.classList.remove('highlight'), 3000);
        }
        
    } else {
        feedbackMessage.textContent = ' Por favor, corrige los errores.';
        feedbackMessage.style.color = 'var(--color-error)';
    }
});


document.querySelector('main').addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
        const cardToRemove = e.target.closest('.recipe-card'); 
        if (cardToRemove) {
            const recipeId = parseInt(cardToRemove.getAttribute('data-recipe-id'));
            
            const indexToRemove = recetasIniciales.findIndex(r => r.id === recipeId);
            if (indexToRemove !== -1) {
                const nombreEliminado = recetasIniciales[indexToRemove].nombre;
                recetasIniciales.splice(indexToRemove, 1);
                
                renderAllRecipes(); 
                feedbackMessage.textContent = `🗑️ Receta "${nombreEliminado}" eliminada.`;
                feedbackMessage.style.color = 'var(--color-error)';
            }
        }
    }
});


document.querySelector('main').addEventListener('keydown', (e) => {
    if (e.target.classList.contains('recipe-card') && e.key === 'Enter') {
        e.preventDefault(); 

        const card = e.target;
        card.classList.toggle('highlight'); 

        const isHighlighted = card.classList.contains('highlight');
        const nombreReceta = card.querySelector('h3').textContent;
        
        if (isHighlighted) {
            feedbackMessage.textContent = ` Receta "${nombreReceta}" resaltada.`;
            feedbackMessage.style.color = 'var(--color-acento)';
        } else {
             feedbackMessage.textContent = `Resaltado de "${nombreReceta}" desactivado.`;
             feedbackMessage.style.color = 'var(--color-principal)';
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    renderAllRecipes();
});