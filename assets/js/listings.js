/**
 * JO4 Real Estate - Property Listings and Filtering
 * Last updated: 2025-08-26 22:03:27 UTC
 * Author: JRoetscyber
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize property filters
    initPropertyFilters();
    
    // Initialize property gallery
    initPropertyGallery();
    
    // Initialize property maps
    initPropertyMaps();
    
    // Initialize property comparisons
    initPropertyComparison();
    
    // Initialize property favorites
    initPropertyFavorites();
    
    // Initialize property sort
    initPropertySort();
    
    // Log initialization
    console.log('JO4 Listings scripts initialized | ' + new Date().toISOString());
});

/**
 * Initialize property filtering functionality
 */
function initPropertyFilters() {
    const filterForm = document.getElementById('property-filter-form');
    if (!filterForm) return;
    
    const propertyCards = document.querySelectorAll('.property-card');
    const resultCount = document.getElementById('result-count');
    const noResultsMessage = document.querySelector('.no-results-message');
    const searchResultsInfo = document.querySelector('.search-results-info');
    
    // Set up auto filtering if enabled
    const autoFilter = filterForm.getAttribute('data-auto-filter') === 'true';
    
    // Listen for filter form inputs if auto-filter is enabled
    if (autoFilter) {
        const filterInputs = filterForm.querySelectorAll('select, input:not([type="text"])');
        filterInputs.forEach(input => {
            input.addEventListener('change', applyFilters);
        });
        
        // Add debounce to text search
        const textSearch = filterForm.querySelector('input[type="text"]');
        if (textSearch) {
            textSearch.addEventListener('input', debounce(applyFilters, 300));
        }
    }
    
    // Apply filters button
    const applyFiltersBtn = document.getElementById('apply-filters');
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', applyFilters);
    }
    
    // Reset filters button
    const resetFiltersBtn = document.getElementById('reset-filters');
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', resetFilters);
    }
    
    // Apply filters function
    function applyFilters() {
        const propertyType = getFilterValue('property-type');
        const location = getFilterValue('location');
        const status = getFilterValue('property-status');
        const priceRange = getFilterValue('price-range');
        const bedrooms = getFilterValue('bedrooms');
        const bathrooms = getFilterValue('bathrooms');
        const searchQuery = getFilterValue('property-search', true);
        
        let visibleCount = 0;
        
        // Process each property card
        propertyCards.forEach(card => {
            const cardType = card.getAttribute('data-type');
            const cardLocation = card.getAttribute('data-location');
            const cardPrice = parseInt(card.getAttribute('data-price'));
            const cardBedrooms = parseInt(card.getAttribute('data-bedrooms'));
            const cardBathrooms = parseFloat(card.getAttribute('data-bathrooms'));
            const cardStatus = card.getAttribute('data-status');
            
            // Get text content for search
            const cardText = card.textContent.toLowerCase();
            
            // Check if card matches all filters
            let isVisible = true;
            
            // Property type filter
            if (propertyType !== 'all' && cardType !== propertyType) {
                isVisible = false;
            }
            
            // Location filter
            if (location !== 'all' && cardLocation !== location) {
                isVisible = false;
            }
            
            // Status filter
            if (status !== 'all' && cardStatus !== status) {
                isVisible = false;
            }
            
            // Price range filter
            if (priceRange !== 'all') {
                const [minPrice, maxPrice] = priceRange.split('-').map(p => {
                    if (p === 'plus') return Infinity;
                    return parseInt(p);
                });
                
                // Skip price filter for rentals if the data-price is 0 (special case)
                if (!(cardStatus === 'for-rent' && cardPrice === 0)) {
                    if (cardPrice < minPrice || cardPrice > maxPrice) {
                        isVisible = false;
                    }
                }
            }
            
            // Bedrooms filter
            if (bedrooms !== 'any' && cardBedrooms < parseInt(bedrooms)) {
                isVisible = false;
            }
            
            // Bathrooms filter
            if (bathrooms !== 'any' && cardBathrooms < parseInt(bathrooms)) {
                isVisible = false;
            }
            
            // Search query filter
            if (searchQuery && !cardText.includes(searchQuery.toLowerCase())) {
                isVisible = false;
            }
            
            // Show or hide property card
            card.style.display = isVisible ? 'block' : 'none';
            
            // Increment visible count
            if (isVisible) {
                visibleCount++;
            }
        });
        
        // Update result count
        if (resultCount) {
            resultCount.textContent = visibleCount;
        }
        
        // Show/hide no results message
        if (noResultsMessage) {
            noResultsMessage.style.display = visibleCount === 0 ? 'block' : 'none';
        }
        
        // Show/hide results info
        if (searchResultsInfo) {
            searchResultsInfo.style.display = visibleCount > 0 ? 'block' : 'none';
        }
        
        // Trigger custom event
        filterForm.dispatchEvent(new CustomEvent('filtersApplied', { 
            detail: { visibleCount } 
        }));
    }
    
    // Reset filters function
    function resetFilters() {
        filterForm.reset();
        
        // Show all property cards
        propertyCards.forEach(card => {
            card.style.display = 'block';
        });
        
        // Update result count
        if (resultCount) {
            resultCount.textContent = propertyCards.length;
        }
        
        // Hide no results message
        if (noResultsMessage) {
            noResultsMessage.style.display = 'none';
        }
        
        // Hide results info if initial state is hidden
        if (searchResultsInfo && window.getComputedStyle(searchResultsInfo).display === 'none') {
            searchResultsInfo.style.display = 'none';
        }
        
        // Trigger custom event
        filterForm.dispatchEvent(new CustomEvent('filtersReset'));
    }
    
    // Helper function to get filter value
    function getFilterValue(fieldId, isText = false) {
        const field = document.getElementById(fieldId);
        if (!field) return isText ? '' : 'all';
        return field.value;
    }
    
    // Helper function to debounce input events
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }
}

/**
 * Initialize property gallery and lightbox
 */
function initPropertyGallery() {
    const galleryButtons = document.querySelectorAll('.view-gallery-btn');
    if (!galleryButtons.length) return;
    
    // Create lightbox elements if they don't exist
    if (!document.getElementById('property-lightbox')) {
        const lightbox = document.createElement('div');
        lightbox.id = 'property-lightbox';
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <button class="lightbox-close">&times;</button>
                <div class="lightbox-slides"></div>
                <button class="lightbox-prev"><i class="fas fa-chevron-left"></i></button>
                <button class="lightbox-next"><i class="fas fa-chevron-right"></i></button>
                <div class="lightbox-counter"></div>
            </div>
        `;
        document.body.appendChild(lightbox);
        
        // Close button functionality
        const closeBtn = lightbox.querySelector('.lightbox-close');
        closeBtn.addEventListener('click', closeLightbox);
        
        // Close on outside click
        lightbox.addEventListener('click', function(e) {
            if (e.target === this) {
                closeLightbox();
            }
        });
        
        // Close on ESC key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            } else if (e.key === 'ArrowRight' && lightbox.classList.contains('active')) {
                nextSlide();
            } else if (e.key === 'ArrowLeft' && lightbox.classList.contains('active')) {
                prevSlide();
            }
        });
        
        // Navigation buttons
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        
        prevBtn.addEventListener('click', prevSlide);
        nextBtn.addEventListener('click', nextSlide);
    }
    
    // Get lightbox elements
    const lightbox = document.getElementById('property-lightbox');
    const slidesContainer = lightbox.querySelector('.lightbox-slides');
    const counter = lightbox.querySelector('.lightbox-counter');
    
    // Global variables for lightbox
    let currentIndex = 0;
    let slides = [];
    
    // Add click event to all gallery buttons
    galleryButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const propertyId = this.getAttribute('data-property-id');
            
            // Fetch property images
            fetchPropertyImages(propertyId)
                .then(images => {
                    // Populate slides
                    slidesContainer.innerHTML = '';
                    slides = images;
                    
                    images.forEach((image, index) => {
                        const slide = document.createElement('div');
                        slide.className = 'lightbox-slide';
                        
                        const img = document.createElement('img');
                        img.src = image.url;
                        img.alt = image.caption || `Property image ${index + 1}`;
                        
                        if (image.caption) {
                            const caption = document.createElement('div');
                            caption.className = 'lightbox-caption';
                            caption.textContent = image.caption;
                            slide.appendChild(caption);
                        }
                        
                        slide.appendChild(img);
                        slidesContainer.appendChild(slide);
                    });
                    
                    // Reset to first slide
                    currentIndex = 0;
                    showSlide(0);
                    
                    // Open lightbox
                    openLightbox();
                })
                .catch(error => {
                    console.error('Error loading property images:', error);
                });
        });
    });
    
    // Open lightbox
    function openLightbox() {
        lightbox.classList.add('active');
        document.body.classList.add('lightbox-open');
    }
    
    // Close lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.classList.remove('lightbox-open');
    }
    
    // Show specific slide
    function showSlide(index) {
        const slideElements = slidesContainer.querySelectorAll('.lightbox-slide');
        
        slideElements.forEach((slide, i) => {
            slide.style.display = i === index ? 'block' : 'none';
        });
        
        // Update counter
        counter.textContent = `${index + 1} / ${slides.length}`;
        
        // Update current index
        currentIndex = index;
    }
    
    // Go to previous slide
    function prevSlide() {
        let newIndex = currentIndex - 1;
        if (newIndex < 0) {
            newIndex = slides.length - 1;
        }
        showSlide(newIndex);
    }
    
    // Go to next slide
    function nextSlide() {
        let newIndex = currentIndex + 1;
        if (newIndex >= slides.length) {
            newIndex = 0;
        }
        showSlide(newIndex);
    }
    
    // Fetch property images (simulated with timeout)
    function fetchPropertyImages(propertyId) {
        return new Promise((resolve, reject) => {
            // This would normally be an API call
            setTimeout(() => {
                // Sample image data - in a real app, this would come from an API
                const images = [
                    { 
                        url: `assets/images/realestate/${propertyId}/image1.jpg`, 
                        caption: 'Front View' 
                    },
                    { 
                        url: `assets/images/realestate/${propertyId}/image2.jpg`, 
                        caption: 'Living Room' 
                    },
                    { 
                        url: `assets/images/realestate/${propertyId}/image3.jpg`, 
                        caption: 'Kitchen' 
                    },
                    { 
                        url: `assets/images/realestate/${propertyId}/image4.jpg`, 
                        caption: 'Master Bedroom' 
                    },
                    { 
                        url: `assets/images/realestate/${propertyId}/image5.jpg`, 
                        caption: 'Bathroom' 
                    }
                ];
                
                // Fallback to property cards if specific images aren't available
                if (propertyId === 'prop001') {
                    resolve([
                        { url: 'assets/images/realestate/property1.jpg', caption: 'Luxury Apartment' },
                        { url: 'assets/images/realestate/property1-living.jpg', caption: 'Modern Living Room' },
                        { url: 'assets/images/realestate/property1-kitchen.jpg', caption: 'Kitchen with Ocean View' },
                        { url: 'assets/images/realestate/property1-bedroom.jpg', caption: 'Master Bedroom' },
                        { url: 'assets/images/realestate/property1-bathroom.jpg', caption: 'En-suite Bathroom' }
                    ]);
                } else if (propertyId === 'prop002') {
                    resolve([
                        { url: 'assets/images/realestate/property2.jpg', caption: 'Modern Villa' },
                        { url: 'assets/images/realestate/property2-living.jpg', caption: 'Spacious Living Area' },
                        { url: 'assets/images/realestate/property2-kitchen.jpg', caption: 'Gourmet Kitchen' },
                        { url: 'assets/images/realestate/property2-pool.jpg', caption: 'Private Pool' },
                        { url: 'assets/images/realestate/property2-garden.jpg', caption: 'Landscaped Garden' }
                    ]);
                } else {
                    resolve(images);
                }
            }, 300);
        });
    }
}

/**
 * Initialize property maps
 */
function initPropertyMaps() {
    const mapContainers = document.querySelectorAll('.property-map');
    if (!mapContainers.length) return;
    
    // Check if the Google Maps API is loaded
    if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
        console.warn('Google Maps API not loaded');
        return;
    }
    
    mapContainers.forEach(container => {
        const lat = parseFloat(container.getAttribute('data-lat'));
        const lng = parseFloat(container.getAttribute('data-lng'));
        const zoom = parseInt(container.getAttribute('data-zoom') || '15');
        const title = container.getAttribute('data-title') || 'Property Location';
        
        if (isNaN(lat) || isNaN(lng)) {
            console.warn('Invalid coordinates for map', container);
            return;
        }
        
        // Create map
        const mapOptions = {
            center: { lat, lng },
            zoom: zoom,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            scrollwheel: false,
            styles: [
                {
                    "featureType": "administrative",
                    "elementType": "labels.text.fill",
                    "stylers": [{"color": "#444444"}]
                },
                {
                    "featureType": "landscape",
                    "elementType": "all",
                    "stylers": [{"color": "#f2f2f2"}]
                },
                {
                    "featureType": "poi",
                    "elementType": "all",
                    "stylers": [{"visibility": "off"}]
                },
                {
                    "featureType": "road",
                    "elementType": "all",
                    "stylers": [{"saturation": -100}, {"lightness": 45}]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "all",
                    "stylers": [{"visibility": "simplified"}]
                },
                {
                    "featureType": "road.arterial",
                    "elementType": "labels.icon",
                    "stylers": [{"visibility": "off"}]
                },
                {
                    "featureType": "transit",
                    "elementType": "all",
                    "stylers": [{"visibility": "off"}]
                },
                {
                    "featureType": "water",
                    "elementType": "all",
                    "stylers": [{"color": "#a3ccff"}, {"visibility": "on"}]
                }
            ]
        };
        
        const map = new google.maps.Map(container, mapOptions);
        
        // Add marker
        const marker = new google.maps.Marker({
            position: { lat, lng },
            map: map,
            title: title,
            animation: google.maps.Animation.DROP
        });
        
        // Optional info window
        const infoContent = container.getAttribute('data-info');
        if (infoContent) {
            const infoWindow = new google.maps.InfoWindow({
                content: infoContent
            });
            
            marker.addListener('click', function() {
                infoWindow.open(map, marker);
            });
            
            // Open info window by default if specified
            if (container.getAttribute('data-info-open') === 'true') {
                infoWindow.open(map, marker);
            }
        }
        
        // Nearby amenities if specified
        const showAmenities = container.getAttribute('data-show-amenities') === 'true';
        if (showAmenities) {
            // Add buttons for different amenity types
            const amenityTypes = [
                { type: 'school', label: 'Schools' },
                { type: 'restaurant', label: 'Restaurants' },
                { type: 'shopping_mall', label: 'Shopping' },
                { type: 'hospital', label: 'Healthcare' },
                { type: 'transit_station', label: 'Transport' }
            ];
            
            // Create amenities control div
            const amenitiesDiv = document.createElement('div');
            amenitiesDiv.className = 'amenities-control';
            
            amenityTypes.forEach(amenity => {
                const button = document.createElement('button');
                button.textContent = amenity.label;
                button.className = 'amenity-button';
                button.setAttribute('data-type', amenity.type);
                
                button.addEventListener('click', function() {
                    const type = this.getAttribute('data-type');
                    findNearbyPlaces(map, { lat, lng }, type);
                    
                    // Toggle active class
                    document.querySelectorAll('.amenity-button').forEach(btn => {
                        btn.classList.remove('active');
                    });
                    this.classList.add('active');
                });
                
                amenitiesDiv.appendChild(button);
            });
            
            map.controls[google.maps.ControlPosition.TOP_CENTER].push(amenitiesDiv);
        }
    });
    
    // Function to find nearby places
    function findNearbyPlaces(map, location, type) {
        // Clear existing markers
        if (window.amenityMarkers) {
            window.amenityMarkers.forEach(marker => marker.setMap(null));
        }
        window.amenityMarkers = [];
        
        const service = new google.maps.places.PlacesService(map);
        
        service.nearbySearch({
            location: location,
            radius: 1000, // 1km radius
            type: [type]
        }, function(results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                results.forEach(place => {
                    createAmenityMarker(map, place);
                });
            }
        });
    }
    
    // Function to create amenity markers
    function createAmenityMarker(map, place) {
        const marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location,
            title: place.name,
            icon: {
                url: place.icon,
                scaledSize: new google.maps.Size(20, 20)
            }
        });
        
        window.amenityMarkers.push(marker);
        
        const infoWindow = new google.maps.InfoWindow({
            content: `
                <div class="amenity-info">
                    <h4>${place.name}</h4>
                    <p>${place.vicinity}</p>
                    <p>Rating: ${place.rating ? place.rating + '/5' : 'No ratings'}</p>
                </div>
            `
        });
        
        marker.addListener('click', function() {
            infoWindow.open(map, marker);
        });
    }
}

/**
 * Initialize property comparison functionality
 */
function initPropertyComparison() {
    const compareButtons = document.querySelectorAll('.compare-property');
    if (!compareButtons.length) return;
    
    // Create comparison bar if it doesn't exist
    if (!document.getElementById('comparison-bar')) {
        const comparisonBar = document.createElement('div');
        comparisonBar.id = 'comparison-bar';
        comparisonBar.className = 'comparison-bar';
        comparisonBar.innerHTML = `
            <div class="comparison-content">
                <h3>Compare Properties <span class="comparison-count">(0)</span></h3>
                <div class="comparison-items"></div>
                <div class="comparison-actions">
                    <button class="btn compare-now" disabled>Compare</button>
                    <button class="btn btn-outline clear-comparison">Clear All</button>
                </div>
            </div>
            <button class="comparison-toggle">
                <i class="fas fa-balance-scale"></i>
            </button>
        `;
        document.body.appendChild(comparisonBar);
        
        // Toggle comparison bar
        const toggleButton = comparisonBar.querySelector('.comparison-toggle');
        toggleButton.addEventListener('click', function() {
            comparisonBar.classList.toggle('open');
        });
        
        // Clear comparison
        const clearButton = comparisonBar.querySelector('.clear-comparison');
        clearButton.addEventListener('click', clearComparison);
        
        // Compare now button
        const compareButton = comparisonBar.querySelector('.compare-now');
        compareButton.addEventListener('click', function() {
            const propertyIds = getComparedPropertyIds();
            if (propertyIds.length > 1) {
                window.location.href = `property-comparison.html?ids=${propertyIds.join(',')}`;
            }
        });
    }
    
    // Initialize from localStorage
    initComparisonFromStorage();
    
    // Add click events to compare buttons
    compareButtons.forEach(button => {
        button.addEventListener('click', function() {
            const propertyId = this.getAttribute('data-property-id');
            const propertyTitle = this.getAttribute('data-property-title');
            const propertyImage = this.getAttribute('data-property-image');
            const propertyPrice = this.getAttribute('data-property-price');
            
            togglePropertyComparison(propertyId, propertyTitle, propertyImage, propertyPrice);
        });
    });
    
    // Toggle property in comparison
    function togglePropertyComparison(id, title, image, price) {
        const comparedProperties = getComparedProperties();
        const comparisonItems = document.querySelector('.comparison-items');
        const comparisonCount = document.querySelector('.comparison-count');
        const compareNowButton = document.querySelector('.compare-now');
        
        // Check if property is already in comparison
        const existingIndex = comparedProperties.findIndex(p => p.id === id);
        
        if (existingIndex !== -1) {
            // Remove property from comparison
            comparedProperties.splice(existingIndex, 1);
            
            // Remove from UI
            const propertyItem = document.getElementById(`comparison-item-${id}`);
            if (propertyItem) {
                propertyItem.remove();
            }
            
            // Update button state
            const button = document.querySelector(`.compare-property[data-property-id="${id}"]`);
            if (button) {
                button.classList.remove('active');
                button.textContent = 'Add to Compare';
            }
        } else {
            // Maximum 4 properties
            if (comparedProperties.length >= 4) {
                alert('You can compare up to 4 properties at a time. Please remove a property before adding another.');
                return;
            }
            
            // Add property to comparison
            comparedProperties.push({ id, title, image, price });
            
            // Add to UI
            const propertyItem = document.createElement('div');
            propertyItem.id = `comparison-item-${id}`;
            propertyItem.className = 'comparison-item';
            propertyItem.innerHTML = `
                <img src="${image}" alt="${title}">
                <div class="comparison-item-details">
                    <div class="comparison-item-title">${title}</div>
                    <div class="comparison-item-price">${price}</div>
                </div>
                <button class="comparison-item-remove" data-property-id="${id}">&times;</button>
            `;
            comparisonItems.appendChild(propertyItem);
            
            // Add remove event
            const removeButton = propertyItem.querySelector('.comparison-item-remove');
            removeButton.addEventListener('click', function() {
                const propertyId = this.getAttribute('data-property-id');
                togglePropertyComparison(propertyId);
            });
            
            // Update button state
            const button = document.querySelector(`.compare-property[data-property-id="${id}"]`);
            if (button) {
                button.classList.add('active');
                button.textContent = 'Remove from Compare';
            }
        }
        
        // Update count
        comparisonCount.textContent = `(${comparedProperties.length})`;
        
        // Enable/disable compare button
        compareNowButton.disabled = comparedProperties.length < 2;
        
        // Update localStorage
        localStorage.setItem('jo4-compared-properties', JSON.stringify(comparedProperties));
        
        // Show comparison bar if at least one property
        const comparisonBar = document.getElementById('comparison-bar');
        if (comparedProperties.length > 0) {
            comparisonBar.classList.add('has-properties');
            
            // Open bar if first property added
            if (comparedProperties.length === 1) {
                comparisonBar.classList.add('open');
            }
        } else {
            comparisonBar.classList.remove('has-properties', 'open');
        }
    }
    
    // Clear all properties from comparison
    function clearComparison() {
        localStorage.removeItem('jo4-compared-properties');
        
        // Clear UI
        const comparisonItems = document.querySelector('.comparison-items');
        comparisonItems.innerHTML = '';
        
        // Update count
        document.querySelector('.comparison-count').textContent = '(0)';
        
        // Disable compare button
        document.querySelector('.compare-now').disabled = true;
        
        // Reset button states
        document.querySelectorAll('.compare-property').forEach(button => {
            button.classList.remove('active');
            button.textContent = 'Add to Compare';
        });
        
        // Hide comparison bar
        document.getElementById('comparison-bar').classList.remove('has-properties', 'open');
    }
    
    // Initialize comparison from localStorage
    function initComparisonFromStorage() {
        const comparedProperties = getComparedProperties();
        
        comparedProperties.forEach(property => {
            // Add to UI without toggling
            const comparisonItems = document.querySelector('.comparison-items');
            
            const propertyItem = document.createElement('div');
            propertyItem.id = `comparison-item-${property.id}`;
            propertyItem.className = 'comparison-item';
            propertyItem.innerHTML = `
                <img src="${property.image}" alt="${property.title}">
                <div class="comparison-item-details">
                    <div class="comparison-item-title">${property.title}</div>
                    <div class="comparison-item-price">${property.price}</div>
                </div>
                <button class="comparison-item-remove" data-property-id="${property.id}">&times;</button>
            `;
            comparisonItems.appendChild(propertyItem);
            
            // Add remove event
            const removeButton = propertyItem.querySelector('.comparison-item-remove');
            removeButton.addEventListener('click', function() {
                const propertyId = this.getAttribute('data-property-id');
                togglePropertyComparison(propertyId);
            });
            
            // Update button state
            const button = document.querySelector(`.compare-property[data-property-id="${property.id}"]`);
            if (button) {
                button.classList.add('active');
                button.textContent = 'Remove from Compare';
            }
        });
        
        // Update count
        document.querySelector('.comparison-count').textContent = `(${comparedProperties.length})`;
        
        // Enable/disable compare button
        document.querySelector('.compare-now').disabled = comparedProperties.length < 2;
        
        // Show comparison bar if at least one property
        const comparisonBar = document.getElementById('comparison-bar');
        if (comparedProperties.length > 0) {
            comparisonBar.classList.add('has-properties');
        }
    }
    
    // Get compared properties from localStorage
    function getComparedProperties() {
        const storedProperties = localStorage.getItem('jo4-compared-properties');
        return storedProperties ? JSON.parse(storedProperties) : [];
    }
    
    // Get compared property IDs
    function getComparedPropertyIds() {
        return getComparedProperties().map(property => property.id);
    }
}

/**
 * Initialize property favorites functionality
 */
function initPropertyFavorites() {
    const favoriteButtons = document.querySelectorAll('.favorite-property');
    if (!favoriteButtons.length) return;
    
    // Initialize from localStorage
    initFavoritesFromStorage();
    
    // Add click events to favorite buttons
    favoriteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const propertyId = this.getAttribute('data-property-id');
            const propertyTitle = this.getAttribute('data-property-title');
            const propertyImage = this.getAttribute('data-property-image');
            const propertyPrice = this.getAttribute('data-property-price');
            
            togglePropertyFavorite(propertyId, propertyTitle, propertyImage, propertyPrice);
        });
    });
    
    // Toggle property in favorites
    function togglePropertyFavorite(id, title, image, price) {
        const favoriteProperties = getFavoriteProperties();
        
        // Check if property is already in favorites
        const existingIndex = favoriteProperties.findIndex(p => p.id === id);
        
        if (existingIndex !== -1) {
            // Remove property from favorites
            favoriteProperties.splice(existingIndex, 1);
            
            // Update button state
            const button = document.querySelector(`.favorite-property[data-property-id="${id}"]`);
            if (button) {
                button.classList.remove('active');
                button.innerHTML = '<i class="far fa-heart"></i>';
                button.setAttribute('aria-label', 'Add to favorites');
            }
        } else {
            // Add property to favorites
            favoriteProperties.push({ id, title, image, price, dateAdded: new Date().toISOString() });
            
            // Update button state
            const button = document.querySelector(`.favorite-property[data-property-id="${id}"]`);
            if (button) {
                button.classList.add('active');
                button.innerHTML = '<i class="fas fa-heart"></i>';
                button.setAttribute('aria-label', 'Remove from favorites');
            }
        }
        
        // Update localStorage
        localStorage.setItem('jo4-favorite-properties', JSON.stringify(favoriteProperties));
        
        // Update favorites count if it exists
        const favoritesCount = document.querySelector('.favorites-count');
        if (favoritesCount) {
            favoritesCount.textContent = favoriteProperties.length;
        }
    }
    
    // Initialize favorites from localStorage
    function initFavoritesFromStorage() {
        const favoriteProperties = getFavoriteProperties();
        
        // Update button states
        favoriteProperties.forEach(property => {
            const button = document.querySelector(`.favorite-property[data-property-id="${property.id}"]`);
            if (button) {
                button.classList.add('active');
                button.innerHTML = '<i class="fas fa-heart"></i>';
                button.setAttribute('aria-label', 'Remove from favorites');
            }
        });
        
        // Update favorites count if it exists
        const favoritesCount = document.querySelector('.favorites-count');
        if (favoritesCount) {
            favoritesCount.textContent = favoriteProperties.length;
        }
    }
    
    // Get favorite properties from localStorage
    function getFavoriteProperties() {
        const storedProperties = localStorage.getItem('jo4-favorite-properties');
        return storedProperties ? JSON.parse(storedProperties) : [];
    }
}

/**
 * Initialize property sorting functionality
 */
function initPropertySort() {
    const sortSelect = document.getElementById('property-sort');
    if (!sortSelect) return;
    
    sortSelect.addEventListener('change', function() {
        const sortValue = this.value;
        const propertyContainer = document.querySelector('.property-listings-grid');
        
        if (!propertyContainer) return;
        
        const propertyCards = Array.from(propertyContainer.querySelectorAll('.property-card'));
        
        // Sort the cards
        propertyCards.sort((a, b) => {
            if (sortValue === 'price-low-high') {
                const priceA = parseInt(a.getAttribute('data-price'));
                const priceB = parseInt(b.getAttribute('data-price'));
                return priceA - priceB;
            } else if (sortValue === 'price-high-low') {
                const priceA = parseInt(a.getAttribute('data-price'));
                const priceB = parseInt(b.getAttribute('data-price'));
                return priceB - priceA;
            } else if (sortValue === 'bedrooms') {
                const bedroomsA = parseInt(a.getAttribute('data-bedrooms'));
                const bedroomsB = parseInt(b.getAttribute('data-bedrooms'));
                return bedroomsB - bedroomsA;
            } else if (sortValue === 'newest') {
                const dateA = a.getAttribute('data-date') || '2025-01-01';
                const dateB = b.getAttribute('data-date') || '2025-01-01';
                return new Date(dateB) - new Date(dateA);
            }
            return 0;
        });
        
        // Re-append sorted cards
        propertyCards.forEach(card => {
            propertyContainer.appendChild(card);
        });
    });
}