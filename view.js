let myChart = null;
let categoryChart = null;

// Enregistrer le plugin DataLabels
Chart.register(ChartDataLabels);

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
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: title,
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                },
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = context.raw;
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${context.label}: ${value} (${percentage}%)`;
                        }
                    }
                },
                datalabels: {
                    color: '#000',
                    font: {
                        weight: 'bold'
                    },
                    formatter: function(value) {
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `${percentage}%\n${value}`;
                    },
                    display: function(context) {
                        return context.dataset.data[context.dataIndex] > 0;
                    }
                }
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
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Récapitulatif par catégorie',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                },
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = context.raw;
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${context.label}: ${value} (${percentage}%)`;
                        }
                    }
                },
                datalabels: {
                    color: '#000',
                    font: {
                        weight: 'bold'
                    },
                    formatter: function(value) {
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `${percentage}%\n${value}`;
                    },
                    display: function(context) {
                        return context.dataset.data[context.dataIndex] > 0;
                    }
                }
            }
        }
    });
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    const graphId = new URLSearchParams(window.location.search).get('id');
    if (graphId !== null) {
        const graphs = JSON.parse(localStorage.getItem('savedGraphs') || '[]');
        const graph = graphs[graphId];
        
        if (graph) {
            // Mettre à jour le titre de la page
            document.title = `Visualiser - ${graph.title}`;
            
            // Créer les données pour le graphique des catégories
            const categoryData = {};
            graph.definedCategories.forEach(category => {
                categoryData[category.name] = {
                    total: 0,
                    color: category.color
                };
            });
            
            // Calculer les totaux par catégorie
            graph.labels.forEach((label, index) => {
                const category = graph.selectedCategories[index];
                if (category && categoryData[category]) {
                    categoryData[category].total += graph.values[index];
                }
            });
            
            // Afficher les graphiques
            updateMainChart(graph.labels, graph.values, graph.colors, graph.title);
            updateCategoryChart(categoryData, graph.title);
        }
    }
}); 