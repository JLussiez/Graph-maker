document.addEventListener('DOMContentLoaded', () => {
    const savedGraphs = document.getElementById('savedGraphs');
    
    // Charger les graphiques sauvegardés
    function loadSavedGraphs() {
        const graphs = JSON.parse(localStorage.getItem('savedGraphs') || '[]');
        
        if (graphs.length === 0) {
            savedGraphs.innerHTML = '<p class="no-graphs">Aucun graphique sauvegardé. Créez-en un nouveau !</p>';
            return;
        }
        
        savedGraphs.innerHTML = graphs.map((graph, index) => `
            <div class="graph-card">
                <h3>${graph.title}</h3>
                <canvas id="graph-${index}"></canvas>
                <div class="actions">
                    <a href="create.html?id=${index}" class="btn secondary">Modifier</a>
                    <button onclick="deleteGraph(${index})" class="btn primary">Supprimer</button>
                </div>
            </div>
        `).join('');
        
        // Créer les graphiques
        graphs.forEach((graph, index) => {
            const ctx = document.getElementById(`graph-${index}`).getContext('2d');
            new Chart(ctx, {
                type: graph.type,
                data: {
                    labels: graph.labels,
                    datasets: [{
                        label: graph.title,
                        data: graph.values,
                        backgroundColor: graph.colors.map(color => `${color}80`),
                        borderColor: graph.colors,
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });
        });
    }
    
    // Supprimer un graphique
    window.deleteGraph = (index) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce graphique ?')) {
            const graphs = JSON.parse(localStorage.getItem('savedGraphs') || '[]');
            graphs.splice(index, 1);
            localStorage.setItem('savedGraphs', JSON.stringify(graphs));
            loadSavedGraphs();
        }
    };
    
    // Charger les graphiques au démarrage
    loadSavedGraphs();
}); 