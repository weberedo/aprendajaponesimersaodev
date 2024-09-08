// Carrega os dados do JSON jpanimedata ao DOMContentLoaded e armazena-os em uma variável global
document.addEventListener('DOMContentLoaded', function() {
    fetch('jpanimedata.json')
        .then(response => response.json())
        .then(data => {
            window.animeData = data; // Armazena os dados em uma variável global para uso na busca
        })
        .catch(error => console.error('Erro ao carregar o JSON:', error));
});

// Função para buscar animes e exibir os resultados
function searchAnime() {
    const searchQuery = document.getElementById('searchbar').value.toLowerCase();
    const resultsDiv = document.getElementById('result');
    const searchSection = document.getElementById('search-section'); // Referência à seção de busca
    const hideButton = document.getElementById('hideButton'); // Referência ao botão de ocultar

    resultsDiv.innerHTML = ''; // Limpa os resultados anteriores

    const foundAnime = window.animeData.filter(anime =>
        anime['JP Title'].toLowerCase().includes(searchQuery) ||
        anime['ENG Title'].toLowerCase().includes(searchQuery)
    );

    if (foundAnime.length === 0) {
        resultsDiv.innerHTML = '<p>Nenhum anime encontrado.</p>';
        return;
    }

    // Limita o número de resultados para evitar travar o navegador
    const maxResults = 10;
    const displayedAnime = foundAnime.slice(0, maxResults);

    displayedAnime.forEach(anime => {
        const imagePath = `imeeji/${anime['JP Title']
            .replace(/\s*-\s*/g, '')              // Remove espaços ao redor do hífen " - "
            .replace(/\s*&\s*/g, 'And')           // Substitui " & " por "And"
            .replace(/['’]/g, '')                 // Remove apóstrofos
            .replace(/[^a-zA-Z0-9]/g, '')         // Remove todos os caracteres não alfanuméricos (incluindo espaços)
            .replace(/([a-z])([A-Z])/g, '$1$2')   // Remove espaços desnecessários ao redor do camel case
        }.jpg`;
        
        const resultHTML = `
            <div class="anime-result">
                <img src="${imagePath}" alt="${anime['JP Title']}" class="anime-image">
                <h2>${anime['ENG Title']}</h2>
                <p><strong>Nota do MyAnimeList:</strong> ${anime['MAL Rating']}</p>
                <p><strong>Link para baixar o baralho do Anki:</strong> ${anime['Anki Deck Link'] ? `<a href="${anime['Anki Deck Link']}" target="_blank">Baixar</a>` : 'Não disponível'}</p>
                <p><strong>Título japonês:</strong> ${anime['JP Title']}</p>
                <p><strong>Título em Inglês:</strong> ${anime['ENG Title']}</p>
                <p><strong>Nível de dificuldade:</strong> ${anime['Difficulty']}</p>
            </div>
        `;
        resultsDiv.innerHTML += resultHTML;
    });

    // Mostra uma mensagem se houver mais resultados
    if (foundAnime.length > maxResults) {
        resultsDiv.innerHTML += '<h3><strong>Você pode refinar sua busca para ver mais resultados! &#128521; </strong></h3>';
    }

    // Exibe o botão de ocultar
    hideButton.style.display = 'block';
}

// Função para ocultar os resultados da busca e o botão em si
function hideResults() {
    const resultsDiv = document.getElementById('result');
    const hideButton = document.getElementById('hideButton');

    // Limpa os resultados da busca
    resultsDiv.innerHTML = '';

    // Oculta o botão de ocultar
    hideButton.style.display = 'none';
}

// Vincula a função de busca ao botão e à tecla Enter
document.querySelector('.button').addEventListener('click', searchAnime);
document.getElementById('searchbar').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        searchAnime();
    }
});

// Função para alternar a exibição do conteúdo de um acordeão
function toggleAccordion(element) {
    var content = element.nextElementSibling;
    if (content.style.display === "block") {
        content.style.display = "none";
    } else {
        content.style.display = "block";
    }
}
