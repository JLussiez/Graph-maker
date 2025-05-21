document.addEventListener('DOMContentLoaded', () => {
    const savedGraphs = document.getElementById('savedGraphs');
    const exportBtn = document.getElementById('exportBtn');
    const importInput = document.getElementById('importInput');
    
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
                <div class="actions actions-centered">
                    <a href="view.html?id=${index}" class="btn btn-flat">Voir</a>
                    <a href="create.html?id=${index}" class="btn btn-flat">Modifier</a>
                    <button onclick="deleteGraph(${index})" class="btn btn-flat btn-danger">Supprimer</button>
                </div>
            </div>
        `).join('');
    }
    
    // Exporter les graphiques
    exportBtn.addEventListener('click', () => {
        const graphs = JSON.parse(localStorage.getItem('savedGraphs') || '[]');
        if (graphs.length === 0) {
            alert('Aucun graphique à exporter.');
            return;
        }
        
        const dataStr = JSON.stringify(graphs, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = 'graphiques.json';
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    });
    
    // Importer des graphiques
    importInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedGraphs = JSON.parse(e.target.result);
                
                // Vérifier que les données importées sont valides
                if (!Array.isArray(importedGraphs)) {
                    throw new Error('Format de fichier invalide');
                }
                
                // Vérifier la structure de chaque graphique
                importedGraphs.forEach(graph => {
                    if (!graph.title || !graph.labels || !graph.values || !graph.colors) {
                        throw new Error('Structure de graphique invalide');
                    }
                });
                
                // Demander confirmation avant de fusionner
                if (confirm(`Voulez-vous importer ${importedGraphs.length} graphique(s) ?`)) {
                    const currentGraphs = JSON.parse(localStorage.getItem('savedGraphs') || '[]');
                    const mergedGraphs = [...currentGraphs, ...importedGraphs];
                    localStorage.setItem('savedGraphs', JSON.stringify(mergedGraphs));
                    loadSavedGraphs();
                    alert('Importation réussie !');
                }
            } catch (error) {
                alert('Erreur lors de l\'importation : ' + error.message);
            }
            
            // Réinitialiser l'input
            event.target.value = '';
        };
        
        reader.readAsText(file);
    });
    
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