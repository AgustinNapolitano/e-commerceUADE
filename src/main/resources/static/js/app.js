const API_URL = '/api';
let currentUser = null;
let cart = [];
let allProducts = [];
let allCategories = [];

document.addEventListener('DOMContentLoaded', async () => {
    await fetchCategories();
    fetchProducts();
    updateCartUI();
});

async function fetchCategories() {
    try {
        const response = await fetch(`${API_URL}/categorias`);
        if (response.ok) {
            allCategories = await response.json();
            populateCategorySelects();
        }
    } catch (error) {
        console.error('Error cargando categorías:', error);
    }
}

function populateCategorySelects() {
    const options = allCategories.map(c => `<option value="${c.id}">${c.nombre}</option>`).join('');
    const newProdCat = document.getElementById('newProdCategory');
    const editProdCat = document.getElementById('editProdCategory');
    if (newProdCat) newProdCat.innerHTML = options || '<option value="1">Categoría General</option>';
    if (editProdCat) editProdCat.innerHTML = options || '<option value="1">Categoría General</option>';
}

async function fetchProducts() {
    try {
        const response = await fetch(`${API_URL}/productos`);
        if (!response.ok) throw new Error('Fallo al cargar');
        allProducts = await response.json();
        renderProducts(allProducts);
    } catch (error) {
        console.error('Error cargando productos:', error);
    }
}

function renderProducts(products) {
    const grid = document.getElementById('productGrid');
    if (!grid) return;
    grid.innerHTML = products.map(p => `
        <div class="product-card">
            <div class="product-img">
                ${p.imageUrl ? `<img src="${p.imageUrl}" style="width:100%;height:100%;object-fit:cover">` : '📦'}
            </div>
            <div class="product-info">
                <div style="display:flex; justify-content:space-between">
                    <h3>${p.nombre}</h3>
                    <div style="display:${currentUser && currentUser.role === 'ADMIN' ? 'flex' : 'none'}; gap: 0.5rem;">
                        <button onclick="editProductPrompt(${p.id})" style="background:none; border:none; cursor:pointer; color:#3b82f6; font-size:1.2rem;" title="Editar">✏️</button>
                        <button onclick="deleteProduct(${p.id})" style="background:none; border:none; cursor:pointer; color:#ef4444; font-size:1.2rem;" title="Eliminar">🗑️</button>
                    </div>
                </div>
                <p>${p.descripcion}</p>
                <div class="price-row">
                    <span class="price">$${p.precio.toLocaleString()}</span>
                    <button class="add-btn" onclick="addToCart(${p.id})" ${p.stock <= 0 ? 'disabled style="background:#475569"' : ''}>
                        ${p.stock <= 0 ? 'Sin Stock' : 'Agregar'}
                    </button>
                </div>
                <small style="color:var(--text-muted)">Stock: ${p.stock} | Categoría: ${p.categoriaNombre || 'Gral'}</small>
            </div>
        </div>
    `).join('');
}

// LÓGICA DEL CARRITO
function toggleCart() {
    const sidebar = document.getElementById('cartSidebar');
    sidebar.style.display = sidebar.style.display === 'flex' ? 'none' : 'flex';
}

function addToCart(id) {
    const product = allProducts.find(p => p.id === id);
    if (!product) return;

    const existing = cart.find(item => item.id === id);
    if (existing) {
        if (existing.cantidad < product.stock) {
            existing.cantidad++;
        } else {
            alert('No hay más stock disponible');
        }
    } else {
        cart.push({ ...product, cantidad: 1 });
    }
    updateCartUI();
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
}

function updateCartUI() {
    const container = document.getElementById('cartItems');
    const countSpan = document.getElementById('cartCount');
    const totalSpan = document.getElementById('cartTotal');
    
    if (!container) return;

    let total = 0;
    let count = 0;

    container.innerHTML = cart.map(item => {
        total += item.precio * item.cantidad;
        count += item.cantidad;
        return `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; background:#0f172a; padding:10px; border-radius:8px">
                <div>
                    <div style="font-weight:bold">${item.nombre}</div>
                    <div style="color:var(--text-muted)">${item.cantidad} x $${item.precio.toLocaleString()}</div>
                </div>
                <button onclick="removeFromCart(${item.id})" style="background:none; border:none; color:#ef4444; cursor:pointer">Eliminar</button>
            </div>
        `;
    }).join('');

    if (cart.length === 0) container.innerHTML = '<p style="text-align:center; color:var(--text-muted)">El carrito está vacío</p>';
    
    if (countSpan) countSpan.innerText = count;
    if (totalSpan) totalSpan.innerText = `$${total.toLocaleString()}`;
}

// LÓGICA DE LOGIN / AUTH (JWT)
async function login() {
    // Tomamos lo que el usuario escribió en las cajas de texto de email y contraseña
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPass').value;

    try {
        // Hacemos una petición POST al backend para iniciar sesión enviando el email y la clave
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            // Si el backend dice OK (200), extraemos el JSON de la respuesta
            const data = await response.json();
            // Guardamos el token JWT (la "llave" mágica que prueba quiénes somos)
            const token = data.token;
            
            // Hacemos OTRA petición para traernos la lista de usuarios. 
            // IMPORTANTE: Aquí mandamos el token en la cabecera 'Authorization' para demostrar que tenemos permiso
            const usersResponse = await fetch(`${API_URL}/usuarios`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const users = await usersResponse.json();
            // Buscamos en la lista al usuario que tenga nuestro mismo email
            const user = users.find(u => u.email === email);

            if (user) {
                // Guardamos en la variable global "currentUser" los datos del usuario MÁS su token
                currentUser = { ...user, token };
                // Actualizamos la pantalla (ocultamos botones o mostramos el panel de admin)
                updateUI();
                closeModals(); // Cerramos la ventanita del login
                alert('¡Bienvenido ' + user.nombre + '!');
            }
        } else {
            alert('Credenciales incorrectas');
        }
    } catch (e) {
        console.error(e);
        alert('Error de conexión');
    }
}

// Función que cambia la interfaz web dependiendo de quién inició sesión
function updateUI() {
    const nav = document.getElementById('navActions');
    const adminSec = document.getElementById('adminSection');
    
    if (!currentUser || !nav) return;

    // Si hay alguien logueado, le mostramos su nombre, el botón del carrito y el de cerrar sesión
    nav.innerHTML = `
        <button onclick="toggleCart()">🛒 Carrito (<span id="cartCount">${cart.reduce((a,b)=>a+b.cantidad,0)}</span>)</button>
        <span style="margin-left:1rem">Hola, ${currentUser.nombre}</span>
        <button class="btn-primary" onclick="location.reload()">Cerrar Sesión</button>
    `;
    
    // LA MAGIA DE LOS ROLES EN EL FRONTEND:
    // Si el usuario actual tiene el rol 'ADMIN', le mostramos (display: 'block') el panel de Crear Producto.
    // Si es un simple 'USER', lo dejamos oculto (display: 'none').
    if (adminSec) {
        adminSec.style.display = (currentUser.role && currentUser.role.toUpperCase() === 'ADMIN') ? 'block' : 'none';
    }
    
    // Volvemos a dibujar los productos para que aparezcan los botones de "Borrar/Editar" si es Admin
    renderProducts(allProducts);
}

async function checkout() {
    if (!currentUser) { alert('Debes iniciar sesión para comprar'); return showLogin(); }
    if (cart.length === 0) return alert('El carrito está vacío');

    const pedidoRequest = {
        usuarioId: currentUser.id,
        items: cart.map(item => ({ productoId: item.id, cantidad: item.cantidad }))
    };

    try {
        const response = await fetch(`${API_URL}/pedidos`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentUser.token}` 
            },
            body: JSON.stringify(pedidoRequest)
        });

        if (response.ok) {
            alert('¡Compra realizada con éxito!');
            cart = [];
            updateCartUI();
            toggleCart();
            fetchProducts();
        } else {
            alert('Error en la compra');
        }
    } catch (e) { alert('Error al procesar el pedido'); }
}

async function createProduct() {
    const product = {
        nombre: document.getElementById('newProdName').value,
        precio: parseFloat(document.getElementById('newProdPrice').value),
        stock: parseInt(document.getElementById('newProdStock').value),
        descripcion: document.getElementById('newProdDesc').value,
        imageUrl: document.getElementById('newProdImg').value,
        categoriaId: parseInt(document.getElementById('newProdCategory').value) || 1
    };

    try {
        const response = await fetch(`${API_URL}/productos`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentUser.token}` 
            },
            body: JSON.stringify(product)
        });

        if (response.ok) {
            alert('Producto creado');
            fetchProducts();
        }
    } catch (e) { alert('Error al crear producto'); }
}

async function deleteProduct(id) {
    if (!confirm('¿Seguro?')) return;
    try {
        const response = await fetch(`${API_URL}/productos/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${currentUser.token}` }
        });
        if (response.ok) fetchProducts();
    } catch (e) { alert('Error al eliminar'); }
}

function editProductPrompt(id) {
    const product = allProducts.find(p => p.id === id);
    if (!product) return;
    
    document.getElementById('editProdId').value = product.id;
    document.getElementById('editProdName').value = product.nombre;
    document.getElementById('editProdPrice').value = product.precio;
    document.getElementById('editProdStock').value = product.stock;
    document.getElementById('editProdImg').value = product.imageUrl || '';
    document.getElementById('editProdDesc').value = product.descripcion || '';
    document.getElementById('editProdCategory').value = product.categoriaId || 1;
    
    document.getElementById('editProductModal').style.display = 'flex';
}

async function updateProduct() {
    const id = document.getElementById('editProdId').value;
    const oldProduct = allProducts.find(p => p.id == id);
    const product = {
        nombre: document.getElementById('editProdName').value,
        precio: parseFloat(document.getElementById('editProdPrice').value),
        stock: parseInt(document.getElementById('editProdStock').value),
        descripcion: document.getElementById('editProdDesc').value,
        imageUrl: document.getElementById('editProdImg').value,
        categoriaId: parseInt(document.getElementById('editProdCategory').value) || 1
    };

    try {
        const response = await fetch(`${API_URL}/productos/${id}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentUser.token}` 
            },
            body: JSON.stringify(product)
        });

        if (response.ok) {
            alert('Producto actualizado');
            closeModals();
            fetchProducts();
        } else {
            alert('Error al actualizar producto');
        }
    } catch (e) { alert('Error de conexión'); }
}

function showLogin() { document.getElementById('loginModal').style.display = 'flex'; }
function showRegister() { document.getElementById('registerModal').style.display = 'flex'; }
function closeModals() { document.querySelectorAll('.modal').forEach(m => m.style.display = 'none'); }

async function register() {
    const user = {
        nombreUsuario: document.getElementById('regUser').value,
        email: document.getElementById('regEmail').value,
        nombre: document.getElementById('regNombre').value,
        apellido: document.getElementById('regApellido').value,
        password: document.getElementById('regPass').value,
        fechaNacimiento: document.getElementById('regFecha').value,
        sexo: document.getElementById('regSexo').value
    };

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        });

        if (response.ok) {
            alert('¡Cuenta creada!');
            closeModals();
            showLogin();
        } else {
            alert('Error al registrar');
        }
    } catch (e) { alert('Error de conexión'); }
}

