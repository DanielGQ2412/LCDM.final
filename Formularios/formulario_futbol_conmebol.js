 // Datos de fútbol basados en la estructura que proporcionaste
        const productosFutbol = [

            {
                "id": 205,
                "equipo": "Argentina",
                "temporada": "2022",
                "tallas": ["S", "M", "L", "XL"],
                "precio": 20000,
                "imagen": "https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
                "descripcion": "Camisa oficial de la seleccion argentina 2022 | LOCAL",
                "disponible": true
            }
        ];

        document.addEventListener('DOMContentLoaded', function() {
            // Cargar productos en la cuadrícula
            loadProducts();
            
            // Obtener ID del producto desde la URL si existe
            const urlParams = new URLSearchParams(window.location.search);
            const productId = urlParams.get('id');
            if (productId) {
                // Simular clic en el producto con el ID de la URL
                setTimeout(() => {
                    const productElement = document.querySelector(`.product-info-card[data-id="${productId}"]`);
                    if (productElement) {
                        productElement.click();
                    }
                }, 500);
            }

            // Quantity controls
            const quantityInput = document.getElementById('quantity');
            document.getElementById('decrement').addEventListener('click', () => {
                if (quantityInput.value > 1) {
                    quantityInput.value = parseInt(quantityInput.value) - 1;
                    updateOrderSummary();
                }
            });
            document.getElementById('increment').addEventListener('click', () => {
                if (quantityInput.value < 10) {
                    quantityInput.value = parseInt(quantityInput.value) + 1;
                    updateOrderSummary();
                }
            });
            
            quantityInput.addEventListener('change', () => {
                if (quantityInput.value < 1) quantityInput.value = 1;
                if (quantityInput.value > 10) quantityInput.value = 10;
                updateOrderSummary();
            });
            
            // Version selection
            document.querySelectorAll('.version-option').forEach(option => {
                option.addEventListener('click', function() {
                    const radio = this.querySelector('input[type="radio"]');
                    radio.checked = true;
                    
                    // Update UI
                    document.querySelectorAll('.version-option').forEach(opt => {
                        opt.classList.remove('selected');
                    });
                    this.classList.add('selected');
                    
                    updateOrderSummary();
                });
            });
            
            // Patch selection
            document.querySelectorAll('.patch-option').forEach(option => {
                option.addEventListener('click', function() {
                    const checkbox = this.querySelector('input[type="checkbox"]');
                    checkbox.checked = !checkbox.checked;
                    
                    // Update UI
                    this.classList.toggle('selected');
                    
                    updateOrderSummary();
                });
            });
            
            // Cambios en personalización
            document.getElementById('playerName').addEventListener('input', updateOrderSummary);
            document.getElementById('playerNumber').addEventListener('input', updateOrderSummary);
            
            // Cambios en talla
            document.getElementById('size').addEventListener('change', updateOrderSummary);
            
            // Add to cart functionality
            document.getElementById('addToCartBtn').addEventListener('click', function() {
                // Validate form
                if (!document.getElementById('size').value) {
                    alert('Por favor selecciona una talla');
                    return;
                }
                
                // Obtener datos del producto
                const productId = document.getElementById('selectedProductId').value;
                const product = productosFutbol.find(p => p.id == productId);
                
                if (!product) {
                    alert('Error: Producto no encontrado');
                    return;
                }
                
                // Obtener versión seleccionada
                const version = document.querySelector('input[name="version"]:checked').value;
                const versionElement = document.querySelector(`.version-option[data-version="${version}"]`);
                const versionPrice = parseInt(versionElement.getAttribute('data-price'));
                
                // Obtener parches seleccionados
                const selectedPatches = [];
                let patchesCost = 0;
                document.querySelectorAll('.patch-option input[type="checkbox"]:checked').forEach(checkbox => {
                    selectedPatches.push(checkbox.value);
                    
                    // Calcular costo adicional de parches
                    if (checkbox.value === 'liga' || checkbox.value === 'conmebol') {
                        patchesCost += 1500;
                    } else if (checkbox.value === 'champions' || checkbox.value === 'libertadores') {
                        patchesCost += 2000;
                    }
                });
                
                // Crear objeto del item del carrito
                const cartItem = {
                    id: product.id,
                    name: `${product.equipo} - ${product.temporada}`,
                    basePrice: product.precio,
                    version: version,
                    versionPrice: versionPrice,
                    quantity: parseInt(document.getElementById('quantity').value),
                    size: document.getElementById('size').value,
                    playerName: document.getElementById('playerName').value,
                    playerNumber: document.getElementById('playerNumber').value,
                    patches: selectedPatches,
                    patchesCost: patchesCost,
                    image: product.imagen
                };
                
                // Aquí normalmente guardarías en localStorage o enviarías a tu backend
                console.log('Producto agregado al carrito:', cartItem);
                
                // Actualizar contador del carrito
                const currentCount = parseInt(document.getElementById('cartCount').innerText);
                document.getElementById('cartCount').innerText = currentCount + cartItem.quantity;
                
                // Show notification
                const notification = document.querySelector('.cart-notification');
                notification.style.display = 'block';
                
                // Hide notification after 3 seconds
                setTimeout(() => {
                    notification.style.display = 'none';
                }, 3000);
            });
            
            // Order via WhatsApp
            document.getElementById('orderNowBtn').addEventListener('click', function() {
                // Validate form
                if (!document.getElementById('size').value) {
                    alert('Por favor selecciona una talla');
                    return;
                }
                
                // Obtener datos del producto
                const productId = document.getElementById('selectedProductId').value;
                const product = productosFutbol.find(p => p.id == productId);
                
                if (!product) {
                    alert('Error: Producto no encontrado');
                    return;
                }
                
                // Obtener versión seleccionada
                const version = document.querySelector('input[name="version"]:checked').value;
                const versionElement = document.querySelector(`.version-option[data-version="${version}"]`);
                const versionPrice = parseInt(versionElement.getAttribute('data-price'));
                
                // Obtener parches seleccionados
                const selectedPatches = [];
                let patchesCost = 0;
                const patchNames = {
                    'liga': 'Liga Nacional',
                    'champions': 'Champions League',
                    'libertadores': 'Copa Libertadores',
                    'conmebol': 'Conmebol'
                };
                
                document.querySelectorAll('.patch-option input[type="checkbox"]:checked').forEach(checkbox => {
                    selectedPatches.push(patchNames[checkbox.value]);
                    
                    // Calcular costo adicional de parches
                    if (checkbox.value === 'liga' || checkbox.value === 'conmebol') {
                        patchesCost += 1500;
                    } else if (checkbox.value === 'champions' || checkbox.value === 'libertadores') {
                        patchesCost += 2000;
                    }
                });
                
                // Gather form data
                const quantity = document.getElementById('quantity').value;
                const size = document.getElementById('size').value;
                const playerName = document.getElementById('playerName').value;
                const playerNumber = document.getElementById('playerNumber').value;
                
                // Create WhatsApp message
                let message = "¡Hola! Me interesa comprar la siguiente camiseta de fútbol:%0A%0A";
                message += "*Producto:* " + product.equipo + "%0A";
                message += "*Temporada:* " + product.temporada + "%0A";
                message += "*Versión:* " + version + "%0A";
                message += "*Cantidad:* " + quantity + "%0A";
                message += "*Talla:* " + size + "%0A";
                
                if (playerName && playerNumber) {
                    message += "*Personalización:* " + playerName + " #" + playerNumber + "%0A";
                }
                
                if (selectedPatches.length > 0) {
                    message += "*Parches:* " + selectedPatches.join(', ') + "%0A";
                }
                
                const totalPrice = (versionPrice * quantity) + (patchesCost * quantity);
                
                message += "%0A*Precio total:* ₡" + totalPrice.toLocaleString('es-CR') + "%0A%0A";
                message += "Por favor confirmar disponibilidad y proceso de pago.";
                
                // Open WhatsApp (reemplaza el número con el real)
                window.open('https://wa.me/50612345678?text=' + message, '_blank');
            });
            
            // Reset form
            document.getElementById('resetBtn').addEventListener('click', function() {
                document.querySelectorAll('.version-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                document.querySelector('.version-option[data-version="player"]').classList.add('selected');
                
                document.querySelectorAll('.patch-option').forEach(opt => {
                    opt.classList.remove('selected');
                    opt.querySelector('input[type="checkbox"]').checked = false;
                });
                
                updateOrderSummary();
            });
            
            // Initialize version selection UI
            document.querySelector('.version-option[data-version="player"]').classList.add('selected');
        });

        function loadProducts() {
            const productGrid = document.getElementById('productGrid');
            productGrid.innerHTML = ''; // Limpiar loading
            
            productosFutbol.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'col';
                productCard.innerHTML = `
                    <div class="card product-info-card h-100" data-id="${product.id}">
                        <div class="image-container">
                            <img src="${product.imagen}" class="card-img-top product-thumb" alt="${product.equipo} - ${product.temporada}">
                        </div>
                        <div class="card-body">
                            <h5 class="card-title">${product.equipo}</h5>
                            <h6 class="card-subtitle mb-2 text-muted">${product.temporada}</h6>
                            <p class="card-text">${product.descripcion}</p>
                            <p class="price-tag">₡${product.precio.toLocaleString('es-CR')}</p>
                            ${product.disponible ? 
                                '<span class="badge bg-success">Disponible</span>' : 
                                '<span class="badge bg-danger">Agotado</span>'}
                        </div>
                        <div class="card-footer">
                            <small class="text-muted">Haz clic para personalizar</small>
                        </div>
                    </div>
                `;
                
                productCard.addEventListener('click', function() {
                    selectProduct(product.id);
                });
                
                productGrid.appendChild(productCard);
            });
        }

        function selectProduct(productId) {
            const product = productosFutbol.find(p => p.id == productId);
            if (!product) return;
            
            // Actualizar UI con la información del producto
            document.getElementById('productName').textContent = `${product.equipo} - ${product.temporada}`;
            document.getElementById('productImage').src = product.imagen;
            document.getElementById('productDescription').textContent = product.descripcion;
            document.getElementById('productPrice').textContent = `₡${product.precio.toLocaleString('es-CR')}`;
            document.getElementById('selectedProductId').value = product.id;
            
            // Actualizar características
            const featuresList = document.getElementById('productFeatures');
            featuresList.innerHTML = `
                <li><i class="fa-solid fa-check"></i> Equipo: ${product.equipo}</li>
                <li><i class="fa-solid fa-check"></i> Temporada: ${product.temporada}</li>
                <li><i class="fa-solid fa-check"></i> Material: 100% Poliéster de alta calidad</li>
                <li><i class="fa-solid fa-check"></i> Diseño oficial</li>
            `;
            
            // Actualizar disponibilidad
            const availabilityElement = document.getElementById('productAvailability');
            availabilityElement.innerHTML = product.disponible ? 
                '<span class="badge bg-success">Disponible</span>' : 
                '<span class="badge bg-danger">Agotado</span>';
            
            // Actualizar opciones de tallas
            const sizeSelect = document.getElementById('size');
            sizeSelect.innerHTML = '<option value="" selected disabled>Selecciona una talla</option>';
            
            product.tallas.forEach(size => {
                const option = document.createElement('option');
                option.value = size;
                option.textContent = size;
                sizeSelect.appendChild(option);
            });
            
            // Actualizar resumen del pedido
            document.getElementById('summaryProduct').textContent = `${product.equipo} - ${product.temporada}`;
            document.getElementById('summaryUnitPrice').textContent = `₡${product.precio.toLocaleString('es-CR')}`;
            
            // Mostrar sección del formulario
            document.getElementById('formSection').classList.remove('d-none');
            
            // Scroll to form
            document.getElementById('formSection').scrollIntoView({ behavior: 'smooth' });
            
            // Actualizar resumen
            updateOrderSummary();
        }

        function updateOrderSummary() {
            const productId = document.getElementById('selectedProductId').value;
            if (!productId) return;
            
            const product = productosFutbol.find(p => p.id == productId);
            if (!product) return;
            
            // Obtener versión seleccionada
            const version = document.querySelector('input[name="version"]:checked').value;
            const versionElement = document.querySelector(`.version-option[data-version="${version}"]`);
            const versionPrice = parseInt(versionElement.getAttribute('data-price'));
            
            // Obtener parches seleccionados
            let patchesCost = 0;
            document.querySelectorAll('.patch-option input[type="checkbox"]:checked').forEach(checkbox => {
                // Calcular costo adicional de parches
                if (checkbox.value === 'liga' || checkbox.value === 'conmebol') {
                    patchesCost += 1500;
                } else if (checkbox.value === 'champions' || checkbox.value === 'libertadores') {
                    patchesCost += 2000;
                }
            });
            
            const quantity = parseInt(document.getElementById('quantity').value) || 1;
            const totalPrice = (versionPrice * quantity) + (patchesCost * quantity);
            
            // Actualizar resumen
            document.getElementById('summaryVersion').textContent = version.charAt(0).toUpperCase() + version.slice(1);
            document.getElementById('summaryUnitPrice').textContent = `₡${versionPrice.toLocaleString('es-CR')}`;
            document.getElementById('summaryPatches').textContent = `₡${patchesCost.toLocaleString('es-CR')}`;
            document.getElementById('summaryTotal').textContent = `₡${totalPrice.toLocaleString('es-CR')}`;
        }