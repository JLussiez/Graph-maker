let myChart = null;
let categoryChart = null;

// Enregistrer le plugin DataLabels
Chart.register(ChartDataLabels);

// Fonction pour créer une nouvelle catégorie
function createCategoryRow(name = '', color = '#4CAF50') {
    const row = document.createElement('div');
    row.className = 'category-row';
    row.innerHTML = `
        <input type="text" placeholder="Nom de la catégorie" class="category-input" value="${name}">
        <input type="color" class="category-color" value="${color}">
        <button class="remove-btn category-remove">×</button>
    `;
    
    row.querySelector('.category-remove').addEventListener('click', () => {
        row.remove();
        updateCategorySelects();
        updateCharts();
    });
    
    return row;
}

// Fonction pour créer une nouvelle ligne de données
function createDataRow(label = '', value = '', color = '#4CAF50', category = '') {
    const row = document.createElement('div');
    row.className = 'data-row';
    row.innerHTML = `
        <input type="text" placeholder="Label" class="label-input" value="${label}">
        <input type="number" placeholder="Valeur" class="value-input" value="${value}">
        <input type="color" class="color-input" value="${color}">
        <select class="category-select">
            <option value="">Sélectionner une catégorie</option>
        </select>
        <button class="remove-btn">×</button>
    `;
    
    row.querySelector('.remove-btn').addEventListener('click', () => {
        row.remove();
        updateCharts();
    });

    // Mettre à jour les sélecteurs de catégories
    const select = row.querySelector('.category-select');
    const categories = getCategories();
    
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.name;
        option.textContent = cat.name;
        option.style.color = cat.color;
        select.appendChild(option);
    });

    // Définir la catégorie sélectionnée après avoir ajouté toutes les options
    if (category) {
        select.value = category;
    }
    
    return row;
}

// Mettre à jour les sélecteurs de catégories
function updateCategorySelects() {
    const categories = getCategories();
    const selects = document.querySelectorAll('.category-select');
    
    selects.forEach(select => {
        const currentValue = select.value;
        select.innerHTML = '<option value="">Sélectionner une catégorie</option>';
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.name;
            option.textContent = category.name;
            option.style.color = category.color;
            if (category.name === currentValue) {
                option.selected = true;
            }
            select.appendChild(option);
        });
    });
}

// Obtenir les catégories
function getCategories() {
    const categories = [];
    document.querySelectorAll('.category-row').forEach(row => {
        const name = row.querySelector('.category-input').value;
        const color = row.querySelector('.category-color').value;
        if (name) {
            categories.push({ name, color });
        }
    });
    return categories;
}

// Mettre à jour les graphiques
function updateCharts() {
    const labels = [];
    const values = [];
    const colors = [];
    const categories = getCategories();
    const categoryData = {};
    
    // Initialiser les données des catégories
    categories.forEach(category => {
        categoryData[category.name] = {
            total: 0,
            color: category.color
        };
    });
    
    // Collecter les données
    document.querySelectorAll('.data-row').forEach(row => {
        const label = row.querySelector('.label-input').value;
        const value = parseFloat(row.querySelector('.value-input').value);
        const color = row.querySelector('.color-input').value;
        const category = row.querySelector('.category-select').value;
        
        if (label && !isNaN(value)) {
            labels.push(label);
            values.push(value);
            colors.push(color);
            
            // Ajouter à la catégorie
            if (category && categoryData[category]) {
                categoryData[category].total += value;
            }
        }
    });
    
    const title = document.getElementById('graphTitle').value;
    
    // Mettre à jour le graphique principal
    updateMainChart(labels, values, colors, title);
    
    // Mettre à jour le graphique des catégories
    updateCategoryChart(categoryData, title);
}

// Mettre à jour le graphique principal
function updateMainChart(labels, values, colors, title) {
    const ctx = document.getElementById('myChart').getContext('2d');
    
    if (myChart) {
        myChart.destroy();
    }
    
    const total = values.reduce((a, b) => a + b, 0);
    
    myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                label: title,
                data: values,
                backgroundColor: colors.map(color => `${color}80`),
                borderColor: colors,
                borderWidth: 2,
                hoverOffset: 15,
                hoverBorderWidth: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: title,
                    font: {
                        size: 20,
                        weight: 'bold',
                        family: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif"
                    },
                    padding: {
                        top: 10,
                        bottom: 20
                    }
                },
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        font: {
                            size: 12,
                            family: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif"
                        },
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: {
                        size: 14,
                        weight: 'bold',
                        family: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif"
                    },
                    bodyFont: {
                        size: 13,
                        family: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif"
                    },
                    callbacks: {
                        label: function(context) {
                            const value = context.raw;
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${context.label}: ${value} (${percentage}%)`;
                        }
                    }
                },
                datalabels: {
                    color: '#fff',
                    font: {
                        weight: 'bold',
                        size: 12,
                        family: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif"
                    },
                    formatter: function(value) {
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `${percentage}%\n${value}`;
                    },
                    display: function(context) {
                        return context.dataset.data[context.dataIndex] > 0;
                    }
                }
            },
            animation: {
                animateScale: true,
                animateRotate: true,
                duration: 1000,
                easing: 'easeOutQuart'
            }
        }
    });
}

// Mettre à jour le graphique des catégories
function updateCategoryChart(categoryData, title) {
    const ctx = document.getElementById('categoryChart').getContext('2d');
    
    if (categoryChart) {
        categoryChart.destroy();
    }
    
    const categoryLabels = [];
    const categoryValues = [];
    const categoryColors = [];
    
    Object.entries(categoryData).forEach(([name, data]) => {
        if (data.total > 0) {
            categoryLabels.push(name);
            categoryValues.push(data.total);
            categoryColors.push(data.color);
        }
    });
    
    const total = categoryValues.reduce((a, b) => a + b, 0);
    
    categoryChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: categoryLabels,
            datasets: [{
                label: 'Par catégorie',
                data: categoryValues,
                backgroundColor: categoryColors.map(color => `${color}80`),
                borderColor: categoryColors,
                borderWidth: 2,
                hoverOffset: 15,
                hoverBorderWidth: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Récapitulatif par catégorie',
                    font: {
                        size: 20,
                        weight: 'bold',
                        family: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif"
                    },
                    padding: {
                        top: 10,
                        bottom: 20
                    }
                },
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        font: {
                            size: 12,
                            family: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif"
                        },
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: {
                        size: 14,
                        weight: 'bold',
                        family: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif"
                    },
                    bodyFont: {
                        size: 13,
                        family: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif"
                    },
                    callbacks: {
                        label: function(context) {
                            const value = context.raw;
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${context.label}: ${value} (${percentage}%)`;
                        }
                    }
                },
                datalabels: {
                    color: '#fff',
                    font: {
                        weight: 'bold',
                        size: 12,
                        family: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif"
                    },
                    formatter: function(value) {
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `${percentage}%\n${value}`;
                    },
                    display: function(context) {
                        return context.dataset.data[context.dataIndex] > 0;
                    }
                }
            },
            animation: {
                animateScale: true,
                animateRotate: true,
                duration: 1000,
                easing: 'easeOutQuart'
            }
        }
    });
}

// Fonction pour sauvegarder le graphique
function saveGraph() {
    const title = document.getElementById('graphTitle').value;
    const labels = [];
    const values = [];
    const colors = [];
    const selectedCategories = [];
    const definedCategories = [];
    
    // Sauvegarder les catégories définies
    document.querySelectorAll('.category-row').forEach(row => {
        const name = row.querySelector('.category-input').value;
        const color = row.querySelector('.category-color').value;
        if (name) {
            definedCategories.push({ name, color });
        }
    });
    
    // Sauvegarder les données avec leurs catégories sélectionnées
    document.querySelectorAll('.data-row').forEach(row => {
        const label = row.querySelector('.label-input').value;
        const value = parseFloat(row.querySelector('.value-input').value);
        const color = row.querySelector('.color-input').value;
        const category = row.querySelector('.category-select').value;
        
        if (label && !isNaN(value)) {
            labels.push(label);
            values.push(value);
            colors.push(color);
            selectedCategories.push(category);
        }
    });
    
    if (labels.length === 0) {
        alert('Veuillez ajouter au moins une donnée au graphique.');
        return;
    }
    
    const graph = {
        title,
        type: 'pie',
        labels,
        values,
        colors,
        definedCategories,
        selectedCategories
    };
    
    const graphs = JSON.parse(localStorage.getItem('savedGraphs') || '[]');
    const graphId = new URLSearchParams(window.location.search).get('id');
    
    if (graphId !== null) {
        graphs[graphId] = graph;
    } else {
        graphs.push(graph);
    }
    
    localStorage.setItem('savedGraphs', JSON.stringify(graphs));
    window.location.href = './index.html';
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    const dataContainer = document.getElementById('dataContainer');
    const categoriesContainer = document.getElementById('categoriesContainer');
    const addDataBtn = document.getElementById('addDataBtn');
    const addCategoryBtn = document.getElementById('addCategoryBtn');
    const saveBtn = document.getElementById('saveBtn');
    
    // Ajouter une catégorie
    addCategoryBtn.addEventListener('click', () => {
        categoriesContainer.appendChild(createCategoryRow());
        updateCategorySelects();
    });
    
    // Ajouter une ligne de données
    addDataBtn.addEventListener('click', () => {
        dataContainer.appendChild(createDataRow());
        updateCategorySelects();
    });
    
    // Charger un graphique existant si on est en mode édition
    const graphId = new URLSearchParams(window.location.search).get('id');
    if (graphId !== null) {
        const graphs = JSON.parse(localStorage.getItem('savedGraphs') || '[]');
        const graph = graphs[graphId];
        
        if (graph) {
            document.getElementById('graphTitle').value = graph.title;
            
            // Charger les catégories
            if (graph.definedCategories) {
                categoriesContainer.innerHTML = '';
                graph.definedCategories.forEach(category => {
                    categoriesContainer.appendChild(createCategoryRow(category.name, category.color));
                });
            }
            
            // Vider le conteneur de données
            dataContainer.innerHTML = '';
            
            // Ajouter les données existantes avec leurs catégories
            graph.labels.forEach((label, index) => {
                const row = createDataRow(
                    label, 
                    graph.values[index], 
                    graph.colors[index], 
                    graph.selectedCategories[index]
                );
                dataContainer.appendChild(row);
            });
            
            // Mettre à jour les sélecteurs de catégories
            updateCategorySelects();
        }
    }
    
    // Mettre à jour les graphiques lors des changements
    document.getElementById('graphTitle').addEventListener('input', updateCharts);
    
    // Mettre à jour les graphiques lors des changements dans les inputs
    dataContainer.addEventListener('input', (e) => {
        if (e.target.classList.contains('label-input') || 
            e.target.classList.contains('value-input') ||
            e.target.classList.contains('color-input') ||
            e.target.classList.contains('category-select')) {
            updateCharts();
        }
    });
    
    categoriesContainer.addEventListener('input', (e) => {
        if (e.target.classList.contains('category-input') || 
            e.target.classList.contains('category-color')) {
            updateCategorySelects();
            updateCharts();
        }
    });
    
    // Sauvegarder le graphique
    saveBtn.addEventListener('click', saveGraph);
    
    // Créer la première ligne de données si aucune n'existe
    if (dataContainer.children.length === 0) {
        dataContainer.appendChild(createDataRow());
    }
    
    // Créer la première catégorie si aucune n'existe
    if (categoriesContainer.children.length === 0) {
        categoriesContainer.appendChild(createCategoryRow());
    }
    
    // Initialiser les graphiques
    updateCharts();
}); 