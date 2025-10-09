import { PRODUCTS } from '../data/products'

const wait = (ms = 200) => new Promise(r => setTimeout(r, ms))
const USERS_KEY = 'ecom_demo_users'
const CARTS_KEY = 'ecom_demo_carts'

function loadUsers(){ return JSON.parse(localStorage.getItem(USERS_KEY) || '[]') }
function saveUsers(u){ localStorage.setItem(USERS_KEY, JSON.stringify(u)) }

export const mockApi = {
  async register({ email, password }){
    await wait(250)
    const users = loadUsers()
    if(users.find(x => x.email === email)) throw { message: 'Email ya registrado' }
    const user = { id: Date.now(), email, password }
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

  async getProducts({ page = 1, perPage = 10, category = null } = {}){
    await wait(150)
    let items = PRODUCTS.slice()
    if(category) items = items.filter(p => p.category === category)
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
    const key = token || 'anon'
    return all[key] || { lines: [] }
  },

  async updateCart(token, cart){
    await wait(100)
    const all = JSON.parse(localStorage.getItem(CARTS_KEY) || '{}')
    const key = token || 'anon'
    all[key] = cart; localStorage.setItem(CARTS_KEY, JSON.stringify(all))
    return cart
  }
}
