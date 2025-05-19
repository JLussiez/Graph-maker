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
                <div class="graph-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 2a10 10 0 0 1 0 20"/>
                        <path d="M12 2a10 10 0 0 0 0 20"/>
                    </svg>
                </div>
                <h3>${graph.title}</h3>
                <div class="actions">
                    <a href="create.html?id=${index}" class="btn secondary">Modifier</a>
                    <button onclick="deleteGraph(${index})" class="btn primary">Supprimer</button>
                </div>
            </div>
        `).join('');
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