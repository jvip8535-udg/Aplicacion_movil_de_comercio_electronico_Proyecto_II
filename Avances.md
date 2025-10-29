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

