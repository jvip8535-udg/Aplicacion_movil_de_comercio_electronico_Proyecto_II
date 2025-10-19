Avances:

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
