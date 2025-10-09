import React, { useEffect, useState } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import Catalog from './pages/Catalog'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Login from './pages/Login'
import Register from './pages/Register'
import { mockApi } from './api/mockApi'
import { auth } from './utils/auth'

export default function App(){
  const [cart, setCart] = useState({ lines: [] })
  const [token, setToken] = useState(auth.getToken())
  const navigate = useNavigate()

  useEffect(()=>{ loadCart() },[token])
  async function loadCart(){
    const c = await mockApi.getCart(token)
    setCart(c)
  }

  async function addToCart(product){
    const idx = cart.lines.findIndex(l=> l.product.id===product.id)
    let newCart
    if(idx>=0){
      const lines = cart.lines.slice()
      lines[idx].qty += 1
      newCart = { ...cart, lines }
    } else {
      newCart = { ...cart, lines: [...cart.lines, { product, qty: 1 }] }
    }
    setCart(newCart)
    await mockApi.updateCart(token, newCart)
    alert('Producto agregado al carrito')
  }

  function handleLogout(){ auth.logout(); setToken(null); navigate('/login') }

  return (
    <div>
      <div className="container header">
        <h1>Aplicación móvil de comercio electrónico - Proyecto II - Demo</h1>
        <nav>
          <Link to="/">Catálogo</Link>
          <Link to="/cart">Carrito ({cart.lines.length})</Link>
          {token ? (
            <><span style={{marginLeft:12}}>Hola {auth.getUser()?.email}</span> <button onClick={handleLogout} style={{marginLeft:8}}>Cerrar sesión</button></>
          ) : (
            <><Link to="/login">Entrar</Link> <Link to="/register">Registro</Link></>
          )}
        </nav>
      </div>

      <Routes>
        <Route path="/" element={<Catalog onAdd={addToCart} />} />
        <Route path="/product/:id" element={<ProductDetail onAdd={addToCart} />} />
        <Route path="/cart" element={<Cart onCartChange={(c) => setCart(c)} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  )
}