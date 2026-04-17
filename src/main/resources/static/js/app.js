const API_URL = 'http://localhost:8080/api';
let currentUser = null;
let cart = [];
let allProducts = [];

document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    updateCartUI();
});

async function fetchProducts() {
    try {
        const response = await fetch(`${API_URL}/productos`);
        allProducts = await response.json();
        renderProducts(allProducts);
    } catch (error) {
        console.error('Error cargando productos:', error);
    }
}

function renderProducts(products) {
    const grid = document.getElementById('productGrid');
    grid.innerHTML = products.map(p => `
        <div class="product-card">
            <div class="product-img">
                ${p.imageUrl ? `<img src="${p.imageUrl}" style="width:100%;height:100%;object-fit:cover">` : '📦'}
            </div>
            <div class="product-info">
                <div style="display:flex; justify-content:space-between">
                    <h3>${p.nombre}</h3>
                    <button onclick="deleteProduct(${p.id})" style="background:none; border:none; cursor:pointer; color:#ef4444; font-size:1.2rem; display:${currentUser && currentUser.role === 'ADMIN' ? 'block' : 'none'}">🗑️</button>
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
    
    countSpan.innerText = count;
    totalSpan.innerText = `$${total.toLocaleString()}`;
}

// LÓGICA DE LOGIN / AUTH
async function login() {
    const email = document.getElementById('loginEmail').value;
    const pass = document.getElementById('loginPass').value;
    const authHeader = 'Basic ' + btoa(email + ':' + pass);

    try {
        const response = await fetch(`${API_URL}/usuarios`, { headers: { 'Authorization': authHeader } });
        if (response.ok) {
            const users = await response.json();
            const user = users.find(u => u.email === email);
            
            if (user) {
                console.log("Usuario logueado:", user); // Para ver el rol en la consola (F12)
                currentUser = { ...user, authHeader };
                updateUI();
                closeModals();
                alert('¡Bienvenido ' + user.nombre + '! (Rol: ' + user.role + ')');
            }
        } else { alert('Credenciales incorrectas'); }
    } catch (e) { alert('Error de conexión'); }
}

function updateUI() {
    const nav = document.getElementById('navActions');
    const adminSec = document.getElementById('adminSection');
    
    if (!currentUser) return;

    nav.innerHTML = `
        <button onclick="toggleCart()">🛒 Carrito (<span id="cartCount">${cart.reduce((a,b)=>a+b.cantidad,0)}</span>)</button>
        <span style="margin-left:1rem">Hola, ${currentUser.nombre}</span>
        <button class="btn-primary" onclick="location.reload()">Cerrar Sesión</button>
    `;
    
    // Solo mostrar sección de admin si el usuario es ADMIN
    if (currentUser.role && currentUser.role.toUpperCase() === 'ADMIN') {
        adminSec.style.display = 'block';
    } else {
        adminSec.style.display = 'none';
    }
    
    renderProducts(allProducts); // Refrescar para ver botones de borrar
}

// LÓGICA DE COMPRA (CHECKOUT)
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
                'Authorization': currentUser.authHeader 
            },
            body: JSON.stringify(pedidoRequest)
        });

        if (response.ok) {
            alert('¡Compra realizada con éxito! El stock ha sido actualizado.');
            cart = [];
            updateCartUI();
            toggleCart();
            fetchProducts(); // Recargar productos para ver el nuevo stock
        } else {
            const error = await response.json();
            alert('Error en la compra: ' + (error.message || 'Stock insuficiente'));
        }
    } catch (e) { alert('Error al procesar el pedido'); }
}

// GESTIÓN DE PRODUCTOS
async function createProduct() {
    const product = {
        nombre: document.getElementById('newProdName').value,
        precio: parseFloat(document.getElementById('newProdPrice').value),
        stock: parseInt(document.getElementById('newProdStock').value),
        descripcion: document.getElementById('newProdDesc').value,
        imageUrl: document.getElementById('newProdImg').value,
        categoriaId: 1 // Por simplicidad usamos la categoría 1
    };

    try {
        const response = await fetch(`${API_URL}/productos`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': currentUser.authHeader 
            },
            body: JSON.stringify(product)
        });

        if (response.ok) {
            alert('Producto publicado correctamente');
            fetchProducts();
        }
    } catch (e) { alert('Error al crear producto'); }
}

async function deleteProduct(id) {
    if (!confirm('¿Seguro que quieres eliminar este producto?')) return;
    try {
        const response = await fetch(`${API_URL}/productos/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': currentUser.authHeader }
        });
        if (response.ok) fetchProducts();
    } catch (e) { alert('Error al eliminar'); }
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
            alert('¡Cuenta creada con éxito! Ahora puedes iniciar sesión.');
            closeModals();
            showLogin();
        } else {
            alert('Error al registrar usuario. Verifica los datos.');
        }
    } catch (e) {
        alert('Error de conexión');
    }
}
