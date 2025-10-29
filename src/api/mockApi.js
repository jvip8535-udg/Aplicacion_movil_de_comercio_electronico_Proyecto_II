import { PRODUCTS } from '../data/products'

const wait = (ms = 200) => new Promise(r => setTimeout(r, ms))
const USERS_KEY = 'ecom_demo_users'
const CARTS_KEY = 'ecom_demo_carts'
const ORDERS_KEY = 'ecom_demo_orders'
const REVIEWS_KEY = 'ecom_demo_reviews'

function loadUsers(){ return JSON.parse(localStorage.getItem(USERS_KEY) || '[]') }
function saveUsers(u){ localStorage.setItem(USERS_KEY, JSON.stringify(u)) }

export const mockApi = {
  async register({ email, password }){
    await wait(250)
    const users = loadUsers()
    if(users.find(x => x.email === email)) throw { message: 'Email ya registrado' }

    const user = { 
      id: Date.now(), 
      email, 
      password, 
      profile: { name: '', address: '', paymentMethods: [] }
    }
    
    users.push(user); saveUsers(users)
    const token = btoa(`${email}:${user.id}`)
    return { token, user: { id: user.id, email } }
  },

  async login({ email, password }){
    await wait(200)
    const users = loadUsers()
    const user = users.find(x => x.email === email && x.password === password)
    if(!user) throw { message: 'Credenciales inválidas' }
    const token = btoa(`${email}:${user.id}`)
    return { token, user: { id: user.id, email } }
  },

  async getProducts({ page = 1, perPage = 10, category = null, search = null } = {}){
    await wait(150)
    let items = PRODUCTS.slice()
    if(category) items = items.filter(p => p.category === category)
    if(search) items = items.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    const total = items.length
    const start = (page - 1) * perPage
    const paged = items.slice(start, start + perPage)
    const categories = Array.from(new Set(PRODUCTS.map(p => p.category)))
    return { products: paged, total, categories }
  },

  async getProductById(id){
    await wait(120)
    const p = PRODUCTS.find(x => x.id === Number(id))
    if(!p) throw { message: 'Producto no encontrado' }
    return p
  },

  async getCart(token){
    await wait(100)
    const all = JSON.parse(localStorage.getItem(CARTS_KEY) || '{}')
    const userKey = token ? atob(token).split(':')[1] : 'guest'
    return all[userKey] || { lines: [] }
  },

  async updateCart(token, cart){
    await wait(50)
    const all = JSON.parse(localStorage.getItem(CARTS_KEY) || '{}')
    const userKey = token ? atob(token).split(':')[1] : 'guest'
    all[userKey] = cart
    localStorage.setItem(CARTS_KEY, JSON.stringify(all))
    return true
  },

  async placeOrder(token, orderDetails){
    await wait(1000) 
    
    if(!orderDetails.shipping.address) {
      throw { message: 'La dirección es requerida' }
    }
    
    const userKey = token ? atob(token).split(':')[1] : 'guest'

    const allCarts = JSON.parse(localStorage.getItem(CARTS_KEY) || '{}')
    allCarts[userKey] = { lines: [] } 
    localStorage.setItem(CARTS_KEY, JSON.stringify(allCarts))

    const orderId = `ECOM-${Date.now()}`
    const total = orderDetails.cart.lines.reduce((s, l) => s + (l.product.price * l.qty), 0)
    const newOrder = {
      id: orderId,
      userKey: userKey,
      date: new Date().toISOString(),
      details: orderDetails,
      total: total
    }
    
    const allOrders = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]')
    allOrders.push(newOrder)
    localStorage.setItem(ORDERS_KEY, JSON.stringify(allOrders))
    
    console.log("Pedido guardado (simulado):", orderId, orderDetails)
    
    return { orderId }
  },
  
  async getUserProfile(token) {
    await wait(100)
    const userKey = token ? atob(token).split(':')[1] : null
    if (!userKey) throw { message: 'Token inválido' }
    const users = loadUsers()
    const user = users.find(u => u.id === Number(userKey))
    if (!user) throw { message: 'Usuario no encontrado' }

    const profile = user.profile || { name: '', address: '', paymentMethods: [] }
    
    return {
      email: user.email,
      ...profile
    }
  },
  
  async updateUserProfile(token, profileData) {
    await wait(300)
    const userKey = token ? atob(token).split(':')[1] : null
    if (!userKey) throw { message: 'Token inválido' }
    
    const users = loadUsers()
    const userIndex = users.findIndex(u => u.id === Number(userKey))
    if (userIndex === -1) throw { message: 'Usuario no encontrado' }
    
    users[userIndex].profile = { ...users[userIndex].profile, ...profileData }
    saveUsers(users)
    
    return users[userIndex].profile
  },
  
  async getOrders(token) {
    await wait(200)
    const userKey = token ? atob(token).split(':')[1] : null
    if (!userKey) throw { message: 'Token inválido' }
    
    const allOrders = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]')
    const userOrders = allOrders
      .filter(o => o.userKey === userKey)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      
    return userOrders
  },
  
  async getReviews(productId) {
    await wait(100)
    const allReviews = JSON.parse(localStorage.getItem(REVIEWS_KEY) || '[]')
    const productReviews = allReviews
      .filter(r => r.productId === Number(productId))
      .sort((a, b) => new Date(b.date) - new Date(a.date))
    return productReviews
  },
  
  async addReview(token, { productId, rating, comment }) {
    await wait(300)
    const userKey = token ? atob(token).split(':')[1] : null
    if (!userKey) throw { message: 'Debes iniciar sesión para dejar una reseña' }
    
    const allReviews = JSON.parse(localStorage.getItem(REVIEWS_KEY) || '[]')
    const newReview = {
      id: Date.now(),
      productId: Number(productId),
      userKey: userKey,
      email: atob(token).split(':')[0],
      rating: Number(rating),
      comment: comment,
      date: new Date().toISOString()
    }
    
    allReviews.push(newReview)
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(allReviews))
    return newReview
  }
}