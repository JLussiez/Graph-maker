let myChart = null;

// Fonction pour créer une nouvelle ligne de données
function createDataRow() {
    const row = document.createElement('div');
    row.className = 'data-row';
    row.innerHTML = `
        <input type="text" placeholder="Label" class="label-input">
        <input type="number" placeholder="Valeur" class="value-input">
        <input type="color" class="color-input" value="#4CAF50">
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
    
    myChart = new Chart(ctx, {
        type: type,
        data: {
            labels: labels,
            datasets: [{
                label: title,
                data: values,
                backgroundColor: colors.map(color => `${color}80`), // Ajoute de la transparence
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
                }
            }
        }
    });
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    const dataContainer = document.getElementById('dataContainer');
    const addDataBtn = document.getElementById('addDataBtn');
    
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
    
    // Créer la première ligne de données
    dataContainer.appendChild(createDataRow());
    
    // Initialiser le graphique
    updateChart();
}); 