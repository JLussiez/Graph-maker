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

function renderMainDataTable(labels, values, colors, sortBy = 'label', sortDir = 'asc') {
    const table = document.getElementById('mainDataTable').querySelector('tbody');
    const total = values.reduce((a, b) => a + b, 0) || 1;
    let data = labels.map((label, i) => ({ label, value: values[i], color: colors[i], percent: (values[i] / total) * 100 }));
    data = sortTableData(data, sortBy, sortDir);
    table.innerHTML = data.map(row => `
        <tr>
            <td>${row.label}</td>
            <td>${row.value}</td>
            <td class="percent-cell">${row.percent.toFixed(1)}%</td>
            <td><span class="color-dot" style="background:${row.color}; border-color:${row.color}"></span></td>
        </tr>
    `).join('');
}

function renderCategoryDataTable(categoryData, sortBy = 'label', sortDir = 'asc') {
    const table = document.getElementById('categoryDataTable').querySelector('tbody');
    const total = Object.values(categoryData).reduce((a, d) => a + d.total, 0) || 1;
    let data = Object.entries(categoryData).map(([label, d]) => ({ label, value: d.total, color: d.color, percent: (d.total / total) * 100 }));
    data = sortTableData(data, sortBy, sortDir);
    table.innerHTML = data.map(row => `
        <tr>
            <td>${row.label}</td>
            <td>${row.value}</td>
            <td class="percent-cell">${row.percent.toFixed(1)}%</td>
            <td><span class="color-dot" style="background:${row.color}; border-color:${row.color}"></span></td>
        </tr>
    `).join('');
}

function sortTableData(data, sortBy, sortDir) {
    return data.slice().sort((a, b) => {
        if (sortBy === 'label') {
            return sortDir === 'asc' ? a.label.localeCompare(b.label) : b.label.localeCompare(a.label);
        } else if (sortBy === 'percent') {
            return sortDir === 'asc' ? a.percent - b.percent : b.percent - a.percent;
        } else {
            return sortDir === 'asc' ? a.value - b.value : b.value - a.value;
        }
    });
}

function setupTableSorting() {
    [
        { tableId: 'mainDataTable', render: renderMainDataTable },
        { tableId: 'categoryDataTable', render: renderCategoryDataTable }
    ].forEach(({ tableId, render }) => {
        const table = document.getElementById(tableId);
        let sortBy = 'label';
        let sortDir = 'asc';
        const ths = table.querySelectorAll('th[data-sort]');
        function updateSortEmojis() {
            ths.forEach(th => {
                const emojiSpan = th.querySelector('.sort-emoji');
                th.classList.remove('sorted');
                if (th.getAttribute('data-sort') === sortBy) {
                    th.classList.add('sorted');
                    emojiSpan.textContent = sortDir === 'asc' ? '▲' : '▼';
                } else {
                    emojiSpan.textContent = '⇅';
                }
            });
        }
        updateSortEmojis();
        ths.forEach(th => {
            th.addEventListener('click', () => {
                const newSortBy = th.getAttribute('data-sort');
                if (sortBy === newSortBy) {
                    sortDir = sortDir === 'asc' ? 'desc' : 'asc';
                } else {
                    sortBy = newSortBy;
                    sortDir = 'asc';
                }
                if (tableId === 'mainDataTable') {
                    renderMainDataTable(window._mainLabels, window._mainValues, window._mainColors, sortBy, sortDir);
                } else {
                    renderCategoryDataTable(window._categoryData, sortBy, sortDir);
                }
                updateSortEmojis();
            });
        });
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

            // Stocker pour le tri
            window._mainLabels = graph.labels;
            window._mainValues = graph.values;
            window._mainColors = graph.colors;
            window._categoryData = categoryData;

            // Afficher les tableaux
            renderMainDataTable(graph.labels, graph.values, graph.colors);
            renderCategoryDataTable(categoryData);
            setupTableSorting();
        }
    }
}); 