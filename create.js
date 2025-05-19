let myChart = null;

// Enregistrer le plugin DataLabels
Chart.register(ChartDataLabels);

// Fonction pour créer une nouvelle ligne de données
function createDataRow(label = '', value = '', color = '#4CAF50') {
    const row = document.createElement('div');
    row.className = 'data-row';
    row.innerHTML = `
        <input type="text" placeholder="Label" class="label-input" value="${label}">
        <input type="number" placeholder="Valeur" class="value-input" value="${value}">
        <input type="color" class="color-input" value="${color}">
        <button class="remove-btn">×</button>
    `;
    
    row.querySelector('.remove-btn').addEventListener('click', () => {
        row.remove();
        updateChart();
    });
    
    return row;
}

// Fonction pour mettre à jour le graphique
function updateChart() {
    const labels = [];
    const values = [];
    const colors = [];
    
    document.querySelectorAll('.data-row').forEach(row => {
        const label = row.querySelector('.label-input').value;
        const value = parseFloat(row.querySelector('.value-input').value);
        const color = row.querySelector('.color-input').value;
        
        if (label && !isNaN(value)) {
            labels.push(label);
            values.push(value);
            colors.push(color);
        }
    });
    
    const ctx = document.getElementById('myChart').getContext('2d');
    const type = document.getElementById('graphType').value;
    const title = document.getElementById('graphTitle').value;
    
    if (myChart) {
        myChart.destroy();
    }

    // Calculer le total pour les pourcentages
    const total = values.reduce((a, b) => a + b, 0);
    
    // Options spécifiques selon le type de graphique
    const chartOptions = {
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
                formatter: function(value, context) {
                    const percentage = ((value / total) * 100).toFixed(1);
                    if (type === 'pie') {
                        return `${percentage}%\n${value}`;
                    }
                    return `${value}\n(${percentage}%)`;
                },
                display: function(context) {
                    return context.dataset.data[context.dataIndex] > 0;
                }
            }
        }
    };

    // Options spécifiques pour les graphiques en barres et en ligne
    if (type === 'bar' || type === 'line') {
        chartOptions.scales = {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Valeur'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Catégories'
                }
            }
        };
    }
    
    myChart = new Chart(ctx, {
        type: type,
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
        options: chartOptions
    });
}

// Fonction pour sauvegarder le graphique
function saveGraph() {
    const title = document.getElementById('graphTitle').value;
    const type = document.getElementById('graphType').value;
    const labels = [];
    const values = [];
    const colors = [];
    
    document.querySelectorAll('.data-row').forEach(row => {
        const label = row.querySelector('.label-input').value;
        const value = parseFloat(row.querySelector('.value-input').value);
        const color = row.querySelector('.color-input').value;
        
        if (label && !isNaN(value)) {
            labels.push(label);
            values.push(value);
            colors.push(color);
        }
    });
    
    if (labels.length === 0) {
        alert('Veuillez ajouter au moins une donnée au graphique.');
        return;
    }
    
    const graph = {
        title,
        type,
        labels,
        values,
        colors
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
    const addDataBtn = document.getElementById('addDataBtn');
    const saveBtn = document.getElementById('saveBtn');
    
    // Charger un graphique existant si on est en mode édition
    const graphId = new URLSearchParams(window.location.search).get('id');
    if (graphId !== null) {
        const graphs = JSON.parse(localStorage.getItem('savedGraphs') || '[]');
        const graph = graphs[graphId];
        
        if (graph) {
            document.getElementById('graphTitle').value = graph.title;
            document.getElementById('graphType').value = graph.type;
            
            // Vider le conteneur de données
            dataContainer.innerHTML = '';
            
            // Ajouter les données existantes
            graph.labels.forEach((label, index) => {
                dataContainer.appendChild(createDataRow(label, graph.values[index], graph.colors[index]));
            });
        }
    }
    
    // Ajouter une ligne de données
    addDataBtn.addEventListener('click', () => {
        dataContainer.appendChild(createDataRow());
    });
    
    // Mettre à jour le graphique lors des changements
    document.getElementById('graphType').addEventListener('change', updateChart);
    document.getElementById('graphTitle').addEventListener('input', updateChart);
    
    // Mettre à jour le graphique lors des changements dans les inputs
    dataContainer.addEventListener('input', (e) => {
        if (e.target.classList.contains('label-input') || 
            e.target.classList.contains('value-input') ||
            e.target.classList.contains('color-input')) {
            updateChart();
        }
    });
    
    // Sauvegarder le graphique
    saveBtn.addEventListener('click', saveGraph);
    
    // Créer la première ligne de données si aucune n'existe
    if (dataContainer.children.length === 0) {
        dataContainer.appendChild(createDataRow());
    }
    
    // Initialiser le graphique
    updateChart();
}); 