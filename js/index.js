document.addEventListener('DOMContentLoaded', function() {
  const apiUrls = {
    characters: 'https://the-one-api.dev/v2/character',
    books: 'https://the-one-api.dev/v2/book',
    movies: 'https://the-one-api.dev/v2/movie'
  };
  const apiKey = '7G_AjehBpSqmDC4WVMdA';
  let allItems = [];
  let filteredItems = [];
  let currentPage = 1;
  let itemsPerPage = window.innerWidth <= 480 ? 4 : 8;

  window.addEventListener('resize', () => {
    itemsPerPage = window.innerWidth <= 480 ? 4 : 8;
    displayData(filteredItems, currentPage);
  });

  async function fetchData() {
    try {
      const responses = await Promise.all([
        fetch(apiUrls.characters, { headers: { 'Authorization': 'Bearer ' + apiKey } }),
        fetch(apiUrls.books, { headers: { 'Authorization': 'Bearer ' + apiKey } }),
        fetch(apiUrls.movies, { headers: { 'Authorization': 'Bearer ' + apiKey } })
      ]);

      const data = await Promise.all(responses.map(response => response.json()));

      const characters = data[0].docs.map(item => ({ type: 'character', title: item.name }));
      const books = data[1].docs.map(item => ({ type: 'book', title: item.name }));
      const movies = data[2].docs.map(item => ({ type: 'movie', title: item.name }));

      allItems = [...characters, ...books, ...movies];
      filteredItems = allItems;
      displayData(filteredItems, currentPage);
    } catch (error) {
      console.error('Erro:', error);
    }
  }

  function displayData(items, page) {
    const listElement = document.getElementById('content-list');
    listElement.innerHTML = '';

    // Separando os itens por categoria
    const characters = items.filter(item => item.type === 'character');
    const books = items.filter(item => item.type === 'book');
    const movies = items.filter(item => item.type === 'movie');


    if (page === 1) {
      const firstPageItems = [
        characters[0] || null,
        books[0] || null,
        movies[0] || null,
      ].filter(item => item !== null);

      // Exibindo os itens da primeira página
      firstPageItems.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'item';

        itemDiv.innerHTML = `
          <p>${item.type.charAt(0).toUpperCase() + item.type.slice(1)}</p>
          <h2>${item.title}</h2>
          <button onclick="alert('Mais informações sobre: ${item.title}')">View More</button>
        `;

        listElement.appendChild(itemDiv);
      });

      // Mostrar a quantidade restante de itens, subtraindo os já exibidos (1 de cada)
      const remainingItems = items.filter(item => !firstPageItems.includes(item)).slice(0, itemsPerPage - firstPageItems.length);
      remainingItems.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'item';

        itemDiv.innerHTML = `
          <p>${item.type.charAt(0).toUpperCase() + item.type.slice(1)}</p>
          <h2>${item.title}</h2>
          <button onclick="alert('Mais informações sobre: ${item.title}')">View More</button>
        `;

        listElement.appendChild(itemDiv);
      });
    } else {
      // Para as páginas subsequentes
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const itemsToShow = items.slice(startIndex, endIndex);

      itemsToShow.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'item';

        itemDiv.innerHTML = `
          <p>${item.type.charAt(0).toUpperCase() + item.type.slice(1)}</p>
          <h2>${item.title}</h2>
          <button onclick="alert('Mais informações sobre: ${item.title}')">View More</button>
        `;

        listElement.appendChild(itemDiv);
      });
    }

    updatePaginationButtons(items.length, page);
  }

  function updatePaginationButtons(totalItems, currentPage) {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
  }

  // Função de filtragem
  function filterByCategory(category) {
    if (category === 'all') {
      filteredItems = allItems;
    } else {
      filteredItems = allItems.filter(item => item.type === category);
    }
    currentPage = 1;
    displayData(filteredItems, currentPage);
  }

  // Adicionando eventos de clique nos botões de filtro
  const filterButtons = document.querySelectorAll('.filter-buttons button');
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      const filter = this.getAttribute('data-filter');
      filterByCategory(filter);
    });
  });

  function filterData(query) {
    filteredItems = allItems.filter(item =>
      item.title.toLowerCase().includes(query.toLowerCase())
    );
    currentPage = 1;
    displayData(filteredItems, currentPage);
  }

  const searchInput = document.getElementById('search-input');
  searchInput.addEventListener('input', (event) => {
    const searchQuery = event.target.value;
    filterData(searchQuery);
  });

  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');

  prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      displayData(filteredItems, currentPage);
    }
  });

  nextBtn.addEventListener('click', () => {
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    if (currentPage < totalPages) {
      currentPage++;
      displayData(filteredItems, currentPage);
    }
  });

  fetchData();
});




// Capturar todos os botões de filtro
const filterButtons = document.querySelectorAll('.filter-buttons button');

// Adicionar um evento de clique a cada botão
filterButtons.forEach(button => {
  button.addEventListener('click', function() {
      const filter = this.getAttribute('data-filter');
      
      // Remove a classe 'active' de todos os botões
      filterButtons.forEach(btn => btn.classList.remove('btn-active'));
      
      // Adiciona a classe 'active' ao botão clicado
      this.classList.add('btn-active');
      
      // Filtrar os itens com base na categoria selecionada
      filterByCategory(filter);
  });
});



function filterByCategory(category) {
    if (category === 'all') {
        
        displayData(allItems, currentPage);
    } else {
        const filtered = allItems.filter(item => item.type === category);
        displayData(filtered, currentPage);
    }
}


document.addEventListener("DOMContentLoaded", function() {
    // Verifica se a URL atual é "index.html"
    if (window.location.pathname.endsWith("index.html")) {
      // Seleciona o item correspondente e adiciona a classe "active"
      const homeItem = document.querySelector('.menu li a[href="index.html"]').parentElement;
      homeItem.classList.add('active');
    }
  });
