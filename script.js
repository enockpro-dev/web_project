const productsData = [
    {
        id: 1,
        name: 'Samsung Galaxy A14',
        description: 'Used phone in good condition with charger and case.',
        price: 'TSH 220,000',
        location: 'Dar es Salaam',
        category: 'Phones & Tablets',
        image: 'https://via.placeholder.com/300x200?text=Samsung+Galaxy+A14',
        email: 'seller1@studentmarket.com',
        phone: '+255123456789'
    },
    {
        id: 2,
        name: 'Laptop ASUS VivoBook',
        description: 'Intel i5, 8GB RAM, 256GB SSD, perfect for students.',
        price: 'TSH 800,000',
        location: 'Mwanza',
        category: 'Laptop',
        image: 'https://via.placeholder.com/300x200?text=ASUS+VivoBook',
        email: 'seller2@studentmarket.com',
        phone: '+255987654321'
    },
    {
        id: 3,
        name: 'Calculus 101 Textbook',
        description: 'Nearly new, only used one semester.',
        price: 'TSH 40,000',
        location: 'Arusha',
        category: 'Books',
        image: 'https://via.placeholder.com/300x200?text=Calculus+101+Book',
        email: 'seller3@studentmarket.com',
        phone: '+255112233445'
    },
    {
        id: 4,
        name: 'Honda Civic 2015',
        description: 'Good condition, 150,000km, personal use.',
        price: 'TSH 5,500,000',
        location: 'Dar es Salaam',
        category: 'Vehicles',
        image: 'https://via.placeholder.com/300x200?text=Honda+Civic+2015',
        email: 'seller4@studentmarket.com',
        phone: '+255998877665'
    },
    {
        id: 5,
        name: 'Spacious 2-Bedroom Apartment',
        description: 'Near university, with balcony and Wi-Fi.',
        price: 'TSH 1,800,000',
        location: 'Dodoma',
        category: 'Property',
        image: 'https://via.placeholder.com/300x200?text=2-Bedroom+Apartment',
        email: 'seller5@studentmarket.com',
        phone: '+255776655443'
    },
     {
      id: 6,
        name: 'JBL  Bluetooth earphones',
        description: 'Good for personal use.',
        price: 'TSH 20,000',
        location: 'Dar es Salaam',
        category: 'Music',
        image: 'https://via.placeholder.com/300x200?text=Honda+Civic+2015',
        email: 'seller4@studentmarket.com',
        phone: '+255998877665'
    }
];

function renderMarketplace(products) {
    const grid = document.getElementById('product-grid');
    if (!grid) return;

    if (products.length === 0) {
        grid.innerHTML = '<div class="no-results">No matching listings found  Try again.</div>';
        return;
    }

    grid.innerHTML = products.map(product => `
        <article class="card" data-id="${product.id}">
            <img src="${product.image}" alt="${product.name}" />
            <div class="card-content">
                <h3>${product.name}</h3>
                <p>${product.price}</p>
                <p class="location">${product.location}</p>
                <p class="category">${product.category}</p>
                <a class="details-link" href="product.html?id=${product.id}">View details</a>
            </div>
        </article>`).join('');
}

function getProductById(id) {
    return productsData.find(p => p.id === Number(id));
}

function fillProductDetails() {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');
    const product = getProductById(productId);

    if (!product) return;

    document.getElementById('product-title').textContent = product.name;
    document.getElementById('product-image').src = product.image;
    document.getElementById('product-image').alt = product.name;
    document.getElementById('product-description').textContent = product.description;
    document.getElementById('product-price').textContent = product.price;
    document.getElementById('seller-email').textContent = product.email;
    document.getElementById('seller-email').href = `mailto:${product.email}`;
    document.getElementById('seller-phone').textContent = product.phone;
    document.getElementById('seller-phone').href = `tel:${product.phone}`;
}

function contactSeller() {
    const title = document.getElementById('product-title')?.textContent || 'Product';
    alert(`Thanks for your interest in '${title}'. Seller contact details are provided on the page.`);
}

function filterProducts(category = 'All') {
    const searchInput = document.getElementById('search');
    const locationSelect = document.getElementById('location');

    const searchTerm = (searchInput?.value || '').toLowerCase();
    const selectedLocation = (locationSelect?.value || 'All');

    const filtered = productsData.filter(product => {
        const matchesQuery =
            product.name.toLowerCase().includes(searchTerm) ||
            product.price.toLowerCase().includes(searchTerm) ||
            product.location.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm);

        const matchesLocation =
            selectedLocation === 'All' ||
            product.location === selectedLocation;

        const matchesCategory =
            category === 'All' ||
            product.category.toLowerCase() === category.toLowerCase();

        return matchesQuery && matchesLocation && matchesCategory;
    });

    renderMarketplace(filtered);
}

function setupSearch() {
    const searchInput = document.getElementById('search');
    const locationSelect = document.getElementById('location');
    const categoryCards = document.querySelectorAll('.cat-card');

    if (!searchInput || categoryCards.length === 0) return;

    searchInput.addEventListener('input', () => filterProducts(getActiveCategory()));

    if (locationSelect) {
        locationSelect.addEventListener('change', () => filterProducts(getActiveCategory()));
    }

    categoryCards.forEach(card => {
        card.addEventListener('click', function (event) {
            event.preventDefault();
            const selectedCategory = this.dataset.category;

            document.querySelectorAll('.cat-card.active').forEach(c => c.classList.remove('active'));
            this.classList.add('active');

            if (selectedCategory === 'All') {
                searchInput.value = '';
            }

            filterProducts(selectedCategory);
        });
    });

    // default active category state
    const defaultCard = document.querySelector('.cat-card[data-category="All"]');
    if (defaultCard) defaultCard.classList.add('active');
}

function getActiveCategory() {
    const active = document.querySelector('.cat-card.active');
    return (active && active.dataset.category) || 'All';
}

if (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/') || window.location.pathname.endsWith('/STUDENT_MARKETPLACE')) {
    document.addEventListener('DOMContentLoaded', () => {
        renderMarketplace(productsData);
        setupSearch();
    });
} else if (window.location.pathname.endsWith('product.html')) {
    document.addEventListener('DOMContentLoaded', fillProductDetails);
} else {
    document.addEventListener('DOMContentLoaded', () => {
        renderMarketplace(productsData);
        setupSearch();
        fillProductDetails();
    });
}
