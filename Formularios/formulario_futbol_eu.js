 // Datos de fútbol basados en tu estructura JSON
        const productosFutbol = [
            {
                "id": 214,
                "equipo": "FC Barcelona",
                "version": ["Fan", "Player"],
                "temporada": "2025-2026",
                "tallas": ["S", "M", "L", "XL"],
                "precio": 20000,
                "imagen": "https://i.ibb.co/MkLm9sX5/fc-barcelona-25-26-copy.png",
                "descripcion": "Camisa oficial del Fc Barcelona 2025-26 | LOCAL",
                "disponible": true
            },
            {
                "id": 227,
                "equipo": "Real Madrid",
                "version": ["Fan", "Player"],
                "temporada": "2025-2026",
                "tallas": ["S", "M", "L", "XL"],
                "precio": 20000,
                "imagen": "https://via.placeholder.com/400x500/ffffff/000000?text=Real+Madrid",
                "descripcion": "Camisa oficial del Real Madrid 2025-26 | VISITA",
                "disponible": true
            },
            {
                "id": 205,
                "equipo": "Argentina",
                "version": ["Fan", "Player"],
                "temporada": "2022",
                "tallas": ["S", "M", "L", "XL"],
                "precio": 20000,
                "imagen": "https://via.placeholder.com/400x500/75aadb/ffffff?text=Argentina",
                "descripcion": "Camisa oficial de la seleccion argentina 2022 | LOCAL",
                "disponible": true
            },
            {
                "id": 210,
                "equipo": "Chelsea FC",
                "version": ["Fan", "Player"],
                "temporada": "2025-2026",
                "tallas": ["S", "M", "L", "XL"],
                "precio": 20000,
                "imagen": "https://via.placeholder.com/400x500/0000dd/ffffff?text=Chelsea",
                "descripcion": "Camisa oficial del Chelsea FC 2025-26 | LOCAL",
                "disponible": true
            },
            {
                "id": 223,
                "equipo": "Portugal",
                "version": ["Fan", "Player"],
                "temporada": "2025",
                "tallas": ["S", "M", "L", "XL"],
                "precio": 20000,
                "imagen": "https://via.placeholder.com/400x500/c00/ffffff?text=Portugal",
                "descripcion": "Camisa oficial de la seleccion de portugal 2025 | LOCAL",
                "disponible": true
            },
            {
                "id": 225,
                "equipo": "Paris Saint German",
                "version": ["Fan", "Player"],
                "temporada": "2025-2026",
                "tallas": ["S", "M", "L", "XL"],
                "precio": 20000,
                "imagen": "https://via.placeholder.com/400x500/000072/ffffff?text=PSG",
                "descripcion": "Camisa oficial del PSG 2025-26 | VISITA",
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
                if (quantityInput.value > 99) quantityInput.value = 99;
                updateOrderSummary();
            });
            
            // Cambios en versión
            document.querySelectorAll('input[name="version"]').forEach(radio => {
                radio.addEventListener('change', updateOrderSummary);
            });
            
            // Cambios en personalización
            document.getElementById('playerName').addEventListener('input', updateOrderSummary);
            document.getElementById('playerNumber').addEventListener('input', updateOrderSummary);
            
            // Cambios en talla
            document.getElementById('size').addEventListener('change', updateOrderSummary);
            
            // Cambios en parches
            document.querySelectorAll('input[name="patchOption"]').forEach(radio => {
                radio.addEventListener('change', function() {
                    // Actualizar estilos visuales
                    document.querySelectorAll('.patch-option').forEach(option => {
                        option.classList.remove('selected');
                    });
                    this.closest('.patch-option').classList.add('selected');
                    
                    // Mostrar/ocultar campo personalizado
                    if (this.value === 'personalizado') {
                        document.getElementById('customPatchContainer').style.display = 'block';
                    } else {
                        document.getElementById('customPatchContainer').style.display = 'none';
                    }
                    
                    updateSelectedPatches();
                    updateOrderSummary();
                });
            });
            
            // Cambios en parche personalizado
            document.getElementById('customPatchText').addEventListener('input', function() {
                updateSelectedPatches();
                updateOrderSummary();
            });
            
            // Add to cart functionality
            document.getElementById('addToCartBtn').addEventListener('click', function() {
                if (!document.getElementById('size').value) {
                    alert('Por favor selecciona una talla');
                    return;
                }
                
                const productId = document.getElementById('selectedProductId').value;
                const product = productosFutbol.find(p => p.id == productId);
                
                if (!product) {
                    alert('Error: Producto no encontrado');
                    return;
                }
                
                const cartItem = {
                    id: product.id,
                    name: `${product.equipo} - ${product.temporada}`,
                    price: getSelectedVersionPrice(),
                    quantity: parseInt(document.getElementById('quantity').value),
                    size: document.getElementById('size').value,
                    version: document.querySelector('input[name="version"]:checked').value,
                    playerName: document.getElementById('playerName').value,
                    playerNumber: document.getElementById('playerNumber').value,
                    patches: document.getElementById('selectedPatches').value,
                    image: product.imagen
                };
                
                console.log('Producto agregado al carrito:', cartItem);
                
                const currentCount = parseInt(document.getElementById('cartCount').innerText);
                document.getElementById('cartCount').innerText = currentCount + cartItem.quantity;
                
                // Mostrar notificación flotante
                const notification = document.getElementById('floatingNotification');
                notification.style.display = 'block';
                
                setTimeout(() => {
                    notification.style.display = 'none';
                }, 3000);
            });
            
            // Order via WhatsApp
            document.getElementById('orderNowBtn').addEventListener('click', function() {
                if (!document.getElementById('size').value) {
                    alert('Por favor selecciona una talla');
                    return;
                }
                
                const productId = document.getElementById('selectedProductId').value;
                const product = productosFutbol.find(p => p.id == productId);
                
                if (!product) {
                    alert('Error: Producto no encontrado');
                    return;
                }
                
                const quantity = document.getElementById('quantity').value;
                const size = document.getElementById('size').value;
                const version = document.querySelector('input[name="version"]:checked').value;
                const playerName = document.getElementById('playerName').value;
                const playerNumber = document.getElementById('playerNumber').value;
                const selectedPatch = document.getElementById('selectedPatches').value;
                
                let message = "¡Hola! Me interesa comprar la siguiente camiseta de fútbol:%0A%0A";
                message += "*Producto:* " + product.equipo + "%0A";
                message += "*Temporada:* " + product.temporada + "%0A";
                message += "*Versión:* " + (version === 'fan' ? 'Fan' : 'Player') + "%0A";
                message += "*Cantidad:* " + quantity + "%0A";
                message += "*Talla:* " + size + "%0A";
                
                if (playerName || playerNumber) {
                    message += "*Personalización:* " + (playerName || '') + " " + (playerNumber ? '#' + playerNumber : '') + "%0A";
                }
                
                if (selectedPatch && selectedPatch !== 'ninguno') {
                    const patchNames = {
                        'liga': 'Liga Nacional',
                        'champions': 'Champions League', 
                        'europa-league': 'Europa League',
                        'personalizado': document.getElementById('customPatchText').value || 'Parche personalizado'
                    };
                    message += "*Parche:* " + (patchNames[selectedPatch] || selectedPatch) + "%0A";
                }
                
                const totalPrice = getSelectedVersionPrice() * quantity;
                
                message += "%0A*Precio total:* ₡" + totalPrice.toLocaleString('es-CR') + "%0A%0A";
                message += "Por favor confirmar disponibilidad y proceso de pago.";
                
                window.open('https://wa.me/50686755791?text=' + message, '_blank');
            });
            
            // Reset form
            document.getElementById('resetBtn').addEventListener('click', function() {
                document.querySelectorAll('.patch-option').forEach(option => {
                    option.classList.remove('selected');
                });
                document.getElementById('patchNone').closest('.patch-option').classList.add('selected');
                document.getElementById('customPatchContainer').style.display = 'none';
                document.getElementById('customPatchText').value = '';
                updateSelectedPatches();
                updateOrderSummary();
            });
        });

        function loadProducts() {
            const productGrid = document.getElementById('productGrid');
            productGrid.innerHTML = '';
            
            productosFutbol.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'col';
                productCard.innerHTML = `
                    <div class="card product-info-card h-100" data-id="${product.id}">
                        <div class="image-container">
                            <img src="${product.imagen}" class="card-img-top product-thumb" alt="${product.equipo}">
                        </div>
                        <div class="card-body">
                            <h5 class="card-title">${product.equipo}</h5>
                            <h6 class="card-subtitle mb-2 text-muted">${product.temporada}</h6>
                            <p class="card-text text-muted">${product.descripcion}</p>
                            <p class="price-tag">₡${product.precio.toLocaleString('es-CR')}</p>
                            ${product.disponible ? 
                                '<span class="badge bg-success">Disponible</span>' : 
                                '<span class="badge bg-danger">Agotado</span>'}
                        </div>
                        <div class="card-footer bg-transparent">
                            <small class="text-muted"><i class="fa-solid fa-mouse-pointer me-1"></i> Haz clic para personalizar</small>
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
            
            document.getElementById('productName').textContent = `${product.equipo} - ${product.temporada}`;
            document.getElementById('productImage').src = product.imagen;
            document.getElementById('productDescription').textContent = product.descripcion;
            document.getElementById('productPrice').textContent = `₡${product.precio.toLocaleString('es-CR')}`;
            document.getElementById('selectedProductId').value = product.id;
            
            const featuresList = document.getElementById('productFeatures');
            featuresList.innerHTML = `
                <li><i class="fa-solid fa-people-group"></i> Equipo: ${product.equipo}</li>
                <li><i class="fa-solid fa-calendar"></i> Temporada: ${product.temporada}</li>
                <li><i class="fa-solid fa-star"></i> Versiones: ${product.version.join(', ')}</li>
                <li><i class="fa-solid fa-shirt"></i> Material: Poliéster de alta calidad</li>
                <li><i class="fa-solid fa-certificate"></i> Calidad: Diseño oficial</li>
            `;
            
            const availabilityElement = document.getElementById('productAvailability');
            availabilityElement.innerHTML = product.disponible ? 
                '<span class="badge bg-success p-2"><i class="fa-solid fa-check me-1"></i> Disponible</span>' : 
                '<span class="badge bg-danger p-2"><i class="fa-solid fa-x me-1"></i> Agotado</span>';
            
            const sizeSelect = document.getElementById('size');
            sizeSelect.innerHTML = '<option value="" selected disabled>Selecciona una talla</option>';
            
            product.tallas.forEach(size => {
                const option = document.createElement('option');
                option.value = size;
                option.textContent = size;
                sizeSelect.appendChild(option);
            });
            
            document.getElementById('summaryProduct').textContent = `${product.equipo} - ${product.temporada}`;
            
            document.getElementById('formSection').classList.remove('d-none');
            document.getElementById('formSection').scrollIntoView({ behavior: 'smooth' });
            
            updateOrderSummary();
        }

        function getSelectedVersionPrice() {
            const version = document.querySelector('input[name="version"]:checked').value;
            return version === 'fan' ? 20000 : 22000;
        }

        function updateSelectedPatches() {
            const selectedPatch = document.querySelector('input[name="patchOption"]:checked');
            let patchValue = selectedPatch ? selectedPatch.value : 'ninguno';
            
            if (patchValue === 'personalizado') {
                const customText = document.getElementById('customPatchText').value;
                patchValue = customText ? `personalizado:${customText}` : 'personalizado';
            }
            
            document.getElementById('selectedPatches').value = patchValue;
        }

        function updateOrderSummary() {
            const productId = document.getElementById('selectedProductId').value;
            if (!productId) return;
            
            const product = productosFutbol.find(p => p.id == productId);
            if (!product) return;
            
            const quantity = parseInt(document.getElementById('quantity').value) || 1;
            const version = document.querySelector('input[name="version"]:checked').value;
            const playerName = document.getElementById('playerName').value;
            const playerNumber = document.getElementById('playerNumber').value;
            const selectedPatch = document.querySelector('input[name="patchOption"]:checked');
            
            const unitPrice = getSelectedVersionPrice();
            const totalPrice = unitPrice * quantity;
            
            document.getElementById('summaryVersion').textContent = version === 'fan' ? 'Fan (₡20,000)' : 'Player (₡22,000)';
            document.getElementById('summaryPersonalization').textContent = 
                (playerName || playerNumber) ? 'Sí' : 'No';
            
            if (selectedPatch) {
                const patchValue = selectedPatch.value;
                if (patchValue === 'ninguno') {
                    document.getElementById('summaryPatches').textContent = 'Ninguno';
                } else if (patchValue === 'personalizado') {
                    const customText = document.getElementById('customPatchText').value;
                    document.getElementById('summaryPatches').textContent = customText || 'Personalizado';
                } else {
                    const patchNames = {
                        'liga': 'Liga Nacional',
                        'champions': 'Champions League', 
                        'libertadores': 'Copa Libertadores',
                        'copa': 'Copa del Rey'
                    };
                    document.getElementById('summaryPatches').textContent = patchNames[patchValue] || patchValue;
                }
            } else {
                document.getElementById('summaryPatches').textContent = 'Ninguno';
            }
            
            document.getElementById('summaryTotal').textContent = `₡${totalPrice.toLocaleString('es-CR')}`;
        }