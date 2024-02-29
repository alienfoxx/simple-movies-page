document.addEventListener('DOMContentLoaded', function () {
    let moviesData = []; 
    let currentPage = 1; 
    // Create a new XMLHttpRequest object
    var movies = new XMLHttpRequest();


    movies.open('GET', 'movies.json', true);


    movies.onreadystatechange = function() {
    if (movies.readyState === XMLHttpRequest.DONE) {
        if (movies.status === 200) {
            // Parse the JSON response
            var data = JSON.parse(movies.responseText);
            
            renderTable(data);
            renderPagination(data); 
        } else {
            
            console.error('Error fetching data:', movies.status);
        }
    }
};

// Send the request
movies.send();

    function renderTable(movies){
        const filmsTableBody = document.getElementById('moviesContainer');
        const searchInput = document.getElementById('searchInput');
        const itemsPerPage = 7; 

        searchInput.addEventListener('input', updateTable);

        renderRows(getMoviesForPage(movies, currentPage));

        function updateTable(){
            const searchTerm = searchInput.value.trim().toLowerCase();
            const filteredFilms = movies.filter(movie => movie.titre.toLowerCase().includes(searchTerm));
            renderRows(getMoviesForPage(filteredFilms, currentPage));
        }

        function renderRows(filteredFilms){
            filmsTableBody.innerHTML = '';
            
            filteredFilms.forEach(movie => {
                const row = document.createElement('tr');
                row.innerHTML=`
                
                <td>${movie.titre}</td>
                <td>${movie.realisateur}</td>
                <td>${movie.duree}</td>
                <td>${movie.annee_de_production}</td>
                <td><img src="${movie.poster}" alt="${movie.titre}" style="max-width: 100px; max-height: 100px;"></td>
                <td>${movie.festivals.join(', ')}</td>
                <td>${movie.acteurs.map(actor => actor.nom + ' ' + actor.prenom).join(', ')}</td>
                `;
                

                filmsTableBody.appendChild(row);
            });
        }

        function getMoviesForPage(movies, page) {
            const startIndex = (page - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            return movies.slice(startIndex, endIndex);
        }
    }

    function renderPagination(movies) {
        const paginationContainer = document.getElementById('paginationContainer');
        const itemsPerPage = 7; 
        const totalPages = Math.ceil(movies.length / itemsPerPage);
    
        const paginationList = document.createElement('ul');
        paginationList.classList.add('pagination');
    
        for (let i = 1; i <= totalPages; i++) {
            const pageItem = document.createElement('li');
            pageItem.classList.add('page-item');
    
            const pageLink = document.createElement('a');
            pageLink.classList.add('page-link');
            pageLink.href = '#';
            pageLink.textContent = i;
    
            pageLink.addEventListener('click', function(event) {
                 event.preventDefault(); 
                currentPage = i;
                renderTable(movies); 
            });
    
            pageItem.appendChild(pageLink);
            paginationList.appendChild(pageItem);
        }
    
        paginationContainer.innerHTML = ''; 
        paginationContainer.appendChild(paginationList);
    
        // Add Bootstrap classes for pagination styling
        paginationContainer.classList.add('d-flex', 'justify-content-center');
        paginationList.classList.add('pagination-lg');
    }
    
});
