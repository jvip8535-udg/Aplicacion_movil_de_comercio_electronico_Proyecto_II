Avances Sprint 4

ECOM-11: Recomendaciones
(Como usuario quiero recomendaciones personalizadas al iniciar sesión.)
Avance: Esta funcionalidad se ha implementado en la página de catálogo.
Componentes React:
src/api/mockApi.js: Se creó la nueva función getPersonalizedRecommendations(token). Esta función simula la personalización analizando el historial de pedidos del usuario (ORDERS_KEY), contando las categorías de sus compras pasadas, e identificando su categoría más frecuente.
src/pages/Catalog.jsx: Se modificó para llamar a la nueva función getPersonalizedRecommendations si un token de usuario existe. Los resultados se muestran en una nueva sección "Recomendado para ti" en la parte superior de la página, reutilizando el ProductCard.jsx.
ECOM-12: Admin
(Como administrador quiero un panel básico para manejar productos y ver órdenes)
Avance: Esta historia se ha completado, incluyendo la refactorización más importante del proyecto.
Componentes React:
src/api/mockApi.js: Refactorización Crítica: La base de datos de productos se migró de un archivo estático (products.js) a localStorage (PRODUCTS_KEY). products.js ahora solo se usa una vez para inicializar la base de datos si está vacía.
src/api/mockApi.js: Se crearon las funciones saveProduct (para crear/editar) y deleteProduct (para eliminar), que modifican directamente el PRODUCTS_KEY.
src/utils/auth.js: Se añadió la función isAdmin() que simula un rol de administrador si el email es admin@demo.com.
src/components/AdminRoute.jsx: Se creó un nuevo componente de ruta protegida que usa auth.isAdmin() para bloquear el acceso a usuarios no autorizados.
src/pages/admin/: Se creó una nueva carpeta con tres componentes: AdminDashboard.jsx (layout), AdminOrders.jsx (lee todas las órdenes de ORDERS_KEY) y AdminProducts.jsx (un panel con formulario para Crear, Leer, Editar y Eliminar (CRUD) productos).
src/App.jsx: Se añadió el enlace "Panel Admin" (visible solo para administradores) y las nuevas rutas protegidas.
ECOM-14: Cupones
(Como usuario quiero aplicar descuentos con cupones en el checkout)
Avance: Esta funcionalidad se ha completado en el flujo de pago.
Componentes React:
src/api/mockApi.js: Se añadió una lista de cupones válidos (PROMO10) y una nueva función validateCoupon(code) que simula la validación de un cupón.
src/pages/Checkout.jsx: Se modificó la UI para incluir un campo de texto "Aplicar Cupón" y un botón.
src/pages/Checkout.jsx: La lógica del componente ahora guarda el porcentaje de descuento en el estado (discount). El cálculo del total se actualizó para restar el discountAmount del subTotal, mostrando el precio final al usuario en tiempo real.
src/api/mockApi.js: La función placeOrder se actualizó para guardar el discount y el couponCode en los detalles del pedido, asegurando que el descuento quede registrado en el historial (ECOM-9).

Avances Sprint 3

ECOM-9: Historial-Pedidos
(Como usuario quiero ver mi historial de pedidos y detales de cada pedido)
Avances: esta historia se ha completado.
Componentes React:
src/api/mockApi.js: la función placeOrder del Sprint 2 fue modificada para ser persistente. Ahora, guarda una copia completa del pedido en una nueva clave de localStorage (ORDERS_KEY).
src/api/mockApi.js: se creó la nueva función getOrders(token), que lee ORDERS_KEY y filtra los pedidos que pertenecen al usuario autenticado.
src/pages/Profile.jsx: se creó esta nueva página (accesible desde “Mi Perfil” en la navegación) que llama a getOrders y muestra una lista detallada de todas las compras pasadas del usuario.
ECOM-10: Perfil
(Como usuario quiero manejar mi perfil (direcciones, métodos de pago guardados))
Avance: esta historia se ha completado.
Componentes React:
src/App.jsx: se añadió un enlace <Link to=”/profile”>Mi Perfil</Link> en la barra de navegación, visible solo si el usuario ha iniciado sesión.
src/pages/Profile.jsx: se incluyó una segunda sección para “Manejar Métodos de Pago”. Es un formulario simulado que permite al usuario añadir un tipo de tarjeta y los últimos cuatro dígitos, que se guardan en su perfil.
src/api/mockApi.js: se crearon las funciones getUserProfile(token) y updateUserProfile(token, data) que leen y escriben los datos del perfil en la entrada del usuario dentro de USERS_KEY en localStorage.
ECOM-13: Reseñas
(Como usuario quiero ver valoraciones y dejar reseñas en productos)
Avance: esta historia se ha completado.
Componentes React:
src/api/mockApi.js: se creó una nueva clave de localStorage (REVIEWS_KEY) para almacenar todas las reseñas. Se añadieron dos funciones: getReviews(productId) (para obtener reseñas de un producto) y addReview(token,reviewData) (para publicar una nueva reseña).
src/pages/ProductDetail.jsx: esta página fue modificada. Ahora debajo de la información del producto, muestra dos nuevas secciones:
1.	Formulario de reseñas: visible solo si el usuario está logueado (token existe). Permite seleccionar una calificación (1-5 estrellas) y escribir un comentario.
2.	Lista de reseñas: muestra todas las reseñas existentes para ese producto, incluyendo la calificación en estrellas, el comentario y el email del autor.

Avances Sprint 2:

ECOM-5: Checkout
(Como usuario quiero completar la compra ingresando dirección y seleccionando método de envío)
Avance: esta funcionalidad se ha implementado en su totalidad.
Componentes React:
src/pages/Checkout.jsx: se creó este nuevo archivo que contiene el formulario de pago. Utiliza useState para gestionar los campos (dirección, ciudad, código postal y método de pago). También, obtiene el carrito actual desde la mockApi para mostrar un resumen del pedido. 
src/pages/Cart.jsx: el botón “Ir a Checkout” fue modificado. Ahora es un componente <Link> de react-router-dom que redirige activamente al usuario a la nueva ruta /checkout.
src/App.jsx: se actualizó el enrutador principal para incluir la nueva ruta (<Route path=”/checkout”…/>), haciéndola accesible dentro de la aplicación.
ECOM-6: Pago
(Como usuario quiero pagar con tarjetas electrónicas)
Avance: esta historia se ha completado con éxito, simulando el flujo post-pago.
Componentes React:
src/api/mockApi.js: se extendió la API simulada con una nueva función placeOrder. Esta función simula un retraso de red, limpia el carrito del usuario en localStorage para simular una compra exitosa y devuelve un número de pedido (orderId) único.
src/pages/Checkout.jsx: la lógica handleSumit del formulario ahora es asíncrona. Llama a mockApi.placeOrder y al recibir una respuesta exitosa, utiliza el hook useNavigate para redirigir al usuario a la página de confirmación.
src/App.jsx: se añadió la ruta /confirmation/:orderId. También, se implementó la función handleOrderPlaced que se pasa como prop a Checkout para limpiar el estado del carrito en el componente App y actualizar el contador del carrito en el encabezado “0”.
ECOM-7: Búsqueda y filtros
(Como usuario quiero buscar productos por texto y filtrar por precio, marca y categoría)
Avance: esta funcionalidad se ha implementado en la página de catálogo.
Componentes React:
src/pages/Catalog.jsx: se añadió un nuevo estado search y un campo <input> en la UI. El useEffect principal ahora tiene search como dependencia, por lo que cada vez que el usuario escribe, la función load() se vuelve a ejecutar. El filtro se aplica en tiempo real.
src/api/mockApi.js: la función getProducts fue modificada para aceptar un nuevo parámetro search. Ahora, la lógica interna filtra los productos por nombre antes de aplicar la paginación, simulando una búsqueda de Backend.

Avances Sprint 1:

ECOM-1: Registro e inicio de sesión
(Como usuario quiero registrarme e iniciar sesión con correo/contraseña y redes sociales para acceder a mi cuenta)
Avance: esta funcionalidad se ha implementado en su núcleo.
Componentes React:
src/pages/Login.jsx: gestiona el formulario de inicio de sesión. Llama a mockApi.login y, en caso de éxito, guarda el token usando auth.save y redirige al usuario al catálogo.
src/pages/Register.jsx: gestiona el formulario de registro. Llama a mockApi.register y realizar la misma lógica de autenticación que el login.
src/utils/auth.js: módulo de utilidad que abstrae el manejo del localStorage para guardar y recuperar el token y la información del usuario (save, getToken, getUser, logout).
src/App.jsx: lee el token al cargar y muestra condicionalmente los enlaces de Entrar/Registro o el email del usuario y el botón de Cerrar sesión.

ECOM-2: Catálogo
(Como usuario quiero navegar el catálogo por categorías y ver una lista paginada de los productos)
Avance: esta historia se ha completado con éxito.
Componentes React:
src/pages/Catalog.jsx: es la página principal. Carga la lista de los productos desde la mockApi. Incluye un menú que permite filtrar la lista por categorías. El estado de la categoría seleccionada (cat) y la página actual (page) se utilizan para volver a cargar los datos.
src/components/ProductCard.jsx: componente reutilizable que muestra la vista previa de cada producto en la cuadrícula del catálogo.
src/components/Pagination.jsx: componente reutilizable que recibe el total de productos y la página actual, renderizando los botones Anterior y Siguiente y deshabilitándose cuando corresponde.

ECOM-3: Detalle de producto
(Como usuario quiero ver la página de detalle del producto con imágenes, precio, descripción y reseñas)
Avance: esta funcionalidad se ha implementado en su mayor parte.
Componentes React:
src/pages/ProductDetail.jsx: utiliza el hook useParams de react-router-dom para obtener el id del producto. Llama a mockApi.getProductById para obtener los datos completos del producto. Muestra el nombre, precio, descripción e imágenes.
El componente también recibe la función onAdd del App.jsx para permitir al usuario añadir el producto al carrito directamente desde la página.

ECOM-4: Carrito de compras
(Como usuario quiero añadir productos al carrito y ver el resumen del carrito)
Avances: esta historia se ha completado con éxito.
Componentes React:
src/App.jsx: mantiene el estado principal del carrito (cart) y la función addToCart. Esta función maneja la lógica de negocio para añadir un nuevo producto o incrementar la cantidad de uno existente.
src/pages/Cart.jsx: esta página consume la mockApi para obtener el carrito actual del usuario. Muestra un resumen detallado de las líneas del carrito, permitiendo al usuario incrementar (inc), decrementar (dec) o eliminar (remove) productos. Calcula y muestra el subtotal por línea y el total general.
