document.addEventListener('DOMContentLoaded', function() {
    const movieForm = document.getElementById('movieForm');
    const movieList = document.getElementById('movieList');
    const searchMovie = document.getElementById('searchMovie');
    let movieData = [];
    let movieIdCounter = 1;

    function fetchMovies() {
        movieData = JSON.parse(localStorage.getItem('movies')) || [];
        displayMovies(movieData);
    }

    function displayMovies(movies) {
        movieList.innerHTML = '';
        movies.forEach(movie => {
            const movieItem = document.createElement('div');
            movieItem.className = 'mb-3';
            movieItem.innerHTML = `
                <h5>${movie.title}</h5>
                <p>Actor: ${movie.actor}</p>
                <p>Genre: ${movie.genre}</p>
                <p>Image URL: ${movie.image}</p>
                <button class="btn btn-danger btn-sm" data-id="${movie.id}">Delete</button>
                <button class="btn btn-warning btn-sm" data-id="${movie.id}">Update</button>
            `;
            movieItem.querySelector('.btn-danger').addEventListener('click', () => deleteMovie(movie.id));
            movieItem.querySelector('.btn-warning').addEventListener('click', () => updateMovie(movie.id));
            movieList.appendChild(movieItem);
        });
    }

    function addMovie(movie) {
        movie.id = `mkida_${movieIdCounter++}`;
        movieData.push(movie);
        localStorage.setItem('movies', JSON.stringify(movieData));
        displayMovies(movieData);
    }

    function deleteMovie(id) {
        movieData = movieData.filter(movie => movie.id !== id);
        localStorage.setItem('movies', JSON.stringify(movieData));
        displayMovies(movieData);
    }

    function updateMovie(id) {
        const movie = movieData.find(m => m.id === id);
        document.getElementById('movieTitle').value = movie.title;
        document.getElementById('actorName').value = movie.actor;
        document.getElementById('movieGenre').value = movie.genre;
        document.getElementById('movieImage').value = movie.image;
        // Implement further update logic here
    }

    movieForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const title = document.getElementById('movieTitle').value;
        const actor = document.getElementById('actorName').value;
        const genre = document.getElementById('movieGenre').value;
        const imageUrl = document.getElementById('movieImage').value;

        const newMovie = {
            title: title,
            actor: actor,
            genre: genre,
            image: imageUrl,
            link: 'http://example.com',
            description: 'Sample movie description'
        };

        addMovie(newMovie);
        movieForm.reset();
    });

    searchMovie.addEventListener('input', function() {
        const query = searchMovie.value.toLowerCase();
        const filteredMovies = movieData.filter(movie => 
            movie.title.toLowerCase().includes(query) ||
            movie.actor.toLowerCase().includes(query)
        );
        displayMovies(filteredMovies);
    });

    fetchMovies();
});
