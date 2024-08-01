document.addEventListener('DOMContentLoaded', function() {
    const movieContainer = document.getElementById('movieContainer');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const filterActor = document.getElementById('filterActor');
    const filterGenre = document.getElementById('filterGenre');
    const searchMovie = document.getElementById('searchMovie');
    const movieDetailsModal = new bootstrap.Modal(document.getElementById('movieDetailsModal'));
    const movieDetailsModalLabel = document.getElementById('movieDetailsModalLabel');
    const movieDetailsModalBody = document.querySelector('#movieDetailsModal .modal-body');
    let movies = [];
    let currentIndex = 0;
    const itemsPerPage = 12;



//     // script.js
// document.querySelectorAll('nav a').forEach(anchor => {
//     anchor.addEventListener('click', function(e) {
//         e.preventDefault();

//         const targetId = this.getAttribute('href').substring(1);
//         const targetSection = document.getElementById(targetId);

//         window.scrollTo({
//             top: targetSection.offsetTop - document.querySelector('nav').offsetHeight,
//             behavior: 'smooth'
//         });
//     });
// });



    function fetchMovies() {
        fetch('movies.json') // Replace with your API endpoint or local file
            .then(response => response.json())
            .then(data => {
                movies = data;
                populateFilters();
                displayMovies(movies);
            });
    }

    function populateFilters() {
        const actors = [...new Set(movies.map(movie => movie.actor))];
        filterActor.innerHTML += actors.map(actor => `<option value="${actor}">${actor}</option>`).join('');
    }

    function displayMovies(moviesToShow) {
        movieContainer.innerHTML = '';
        moviesToShow.slice(currentIndex, currentIndex + itemsPerPage).forEach(movie => {
            const card = document.createElement('div');
            card.className = 'col-md-4';
            card.innerHTML = `
                <div class="card" data-id="${movie.id}">
                    <img src="${movie.image}" class="card-img-top" alt="${movie.title}">
                    <div class="card-body">
                        <h5 class="card-title">${movie.title}</h5>
                        <p class="card-text">Actor: ${movie.actor}</p>
                        <p class="card-text">Genre: ${movie.genre}</p>
                        <a href="${movie.link}" class="btn btn-primary">Go to Website</a>
                    </div>
                </div>
            `;
            card.querySelector('.card').addEventListener('click', () => showMovieDetails(movie.id));
            movieContainer.appendChild(card);
        });
        currentIndex += itemsPerPage;
        loadMoreBtn.style.display = currentIndex >= movies.length ? 'none' : 'block';
    }

    function showMovieDetails(movieId) {
        const movie = movies.find(m => m.id === movieId);
        movieDetailsModalLabel.textContent = movie.title;
        movieDetailsModalBody.innerHTML = `
            <img src="${movie.image}" class="img-fluid" alt="${movie.title}">
            <p><strong>Actor:</strong> ${movie.actor}</p>
            <p><strong>Genre:</strong> ${movie.genre}</p>
            <p><strong>Description:</strong> ${movie.description}</p>
            <a href="${movie.link}" class="btn btn-primary">Go to Website</a>
        `;
        movieDetailsModal.show();
    }

    function filterMovies() {
        const actor = filterActor.value;
        const genre = filterGenre.value;
        const query = searchMovie.value.toLowerCase();
        const filteredMovies = movies.filter(movie => 
            (actor === '' || movie.actor === actor) &&
            (genre === '' || movie.genre === genre) &&
            (query === '' || movie.title.toLowerCase().includes(query) || movie.actor.toLowerCase().includes(query))
        );
        currentIndex = 0;
        displayMovies(filteredMovies);
    }

    filterActor.addEventListener('change', filterMovies);
    filterGenre.addEventListener('change', filterMovies);
    searchMovie.addEventListener('input', filterMovies);
    loadMoreBtn.addEventListener('click', () => displayMovies(movies));

    fetchMovies();
});
