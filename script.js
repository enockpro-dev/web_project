const API_BASE_URL = 'http://localhost:8000';
const API_PRODUCTS_ENDPOINT = `${API_BASE_URL}/api/products/`;

let productsData = [];

const fallbackProductsData = [
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
        name: 'Laptop',
        description: 'Intel i5, 8GB RAM, 256GB SSD, perfect for students.',
        price: 'TSH 800,000',
        location: 'Dar',
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
        name: 'JBL Bluetooth earphones',
        description: 'Good for personal use.',
        price: 'TSH 20,000',
        location: 'Dar es Salaam',
        category: 'Music',
        images: ['W.jpeg', 'https://via.placeholder.com/300x200?text=JBL+Earphones+2', 'https://via.placeholder.com/300x200?text=JBL+Earphones+3'],
        email: 'seller4@studentmarket.com',
        phone: '+255998877665'
    },
    {
        id: 7,
        name: 'SURVAY photocopy and printing services',
        description: 'Photocopy and printing services.',
        price: 'TSH 50 @ page',
        location: 'Survay',
        category: 'Stationary',
        image: 'https://via.placeholder.com/300x200?text=Printing+Services',
        email: 'seller4@studentmarket.com',
        phone: '+255998877665'
    }
];

function formatProductPrice(price) {
    const numericPrice = Number(price);
    if (Number.isNaN(numericPrice)) {
        return typeof price === 'string' ? price : 'TSH 0';
    }
    return `TSH ${numericPrice.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

function transformProductFromApi(product) {
    const imageUrl = product.image || `https://via.placeholder.com/300x200?text=${encodeURIComponent(product.name)}`;
    const images = Array.isArray(product.images) && product.images.length > 0
        ? product.images
        : [imageUrl];

    return {
        id: product.id,
        name: product.name,
        description: product.description || 'No description available.',
        price: formatProductPrice(product.price),
        location: 'Tanzania',
        category: product.category?.name || 'Other',
        image: imageUrl,
        images,
        email: 'seller@example.com',
        phone: '+255000000000'
    };
}

async function loadProducts() {
    try {
        const response = await fetch(API_PRODUCTS_ENDPOINT);
        if (!response.ok) {
            throw new Error(`Failed to load products from API: ${response.status}`);
        }
        const data = await response.json();
        const products = Array.isArray(data) ? data : (Array.isArray(data.results) ? data.results : []);

        if (products.length > 0) {
            productsData = products.map(transformProductFromApi);
            return;
        }

        throw new Error('Backend returned no products.');
    } catch (error) {
        console.warn('Could not load products from backend API, using local data.', error);
    }

    try {
        const response = await fetch('products.json');
        if (!response.ok) {
            throw new Error(`Failed to load products: ${response.status}`);
        }
        productsData = await response.json();
    } catch (error) {
        console.warn('Could not load products.json, using fallback data.', error);
        productsData = fallbackProductsData;
    }
}

function getProductImage(product) {
    if (Array.isArray(product.images) && product.images.length > 0) {
        return product.images[0];
    }
    return product.image || '';
}

function renderProductGallery(product) {
    const mainImage = document.getElementById('product-image');
    const gallery = document.getElementById('product-image-gallery');
    const imageSources = Array.isArray(product.images) && product.images.length > 0
        ? product.images
        : [product.image || ''];

    if (mainImage && imageSources[0]) {
        mainImage.src = imageSources[0];
        mainImage.alt = product.name;
    }

    if (!gallery) return;

    gallery.innerHTML = imageSources.map((src, index) => `
        <img
            class="product-gallery-image${index === 0 ? ' active' : ''}"
            src="${src}"
            alt="${product.name} image ${index + 1}"
            data-src="${src}"
        />
    `).join('');

    gallery.querySelectorAll('img').forEach(image => {
        image.addEventListener('click', () => {
            if (mainImage) {
                mainImage.src = image.dataset.src;
                mainImage.alt = `${product.name} image`;
            }
            gallery.querySelectorAll('img').forEach(img => img.classList.remove('active'));
            image.classList.add('active');
        });
    });
}

function renderMarketplace(products) {
    const grid = document.getElementById('product-grid');
    if (!grid) return;

    if (products.length === 0) {
        grid.innerHTML = '<div class="no-results">No matching listings found  Try again.</div>';
        return;
    }

    grid.innerHTML = products.map(product => `
        <article class="card" data-id="${product.id}">
            <img src="${getProductImage(product)}" alt="${product.name}" />
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
    renderProductGallery(product);
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

async function initializePage() {
    await loadProducts();

    if (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/') || window.location.pathname.endsWith('/STUDENT_MARKETPLACE')) {
        renderMarketplace(productsData);
        setupSearch();
    } else if (window.location.pathname.endsWith('product.html')) {
        fillProductDetails();
    } else {
        renderMarketplace(productsData);
        setupSearch();
        fillProductDetails();
    }
}

document.addEventListener('DOMContentLoaded', initializePage);
