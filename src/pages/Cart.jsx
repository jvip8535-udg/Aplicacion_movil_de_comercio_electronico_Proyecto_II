import React, { useEffect, useState } from 'react'
import { mockApi } from '../api/mockApi'
import { auth } from '../utils/auth'

export default function Cart({ onCartChange }){
  const [cart,setCart]=useState({ lines: [] })
  const token = auth.getToken()

  useEffect(()=>{ load() },[])
  async function load(){
    const c = await mockApi.getCart(token)
    setCart(c)
    if (typeof onCartChange === 'function') onCartChange(c)
  }

  async function save(c){
    setCart(c)
    if (typeof onCartChange === 'function') onCartChange(c)
    // update persistent storage but don't block UI
    await mockApi.updateCart(token, c)
  }

  function inc(line){
    const newLines = cart.lines.map(l=> l.product.id===line.product.id ? { ...l, qty: l.qty+1 } : l)
    save({ ...cart, lines: newLines })
  }
  function dec(line){
    const newLines = cart.lines.map(l=> l.product.id===line.product.id ? { ...l, qty: Math.max(1,l.qty-1) } : l)
    save({ ...cart, lines: newLines })
  }
  function remove(line){
    const newLines = cart.lines.filter(l=> l.product.id!==line.product.id)
    save({ ...cart, lines: newLines })
  }

  const total = cart.lines.reduce((s,l)=> s + (l.product.price * l.qty), 0)

  if(!cart) return <div className="container">Cargando...</div>

  return (
    <div className="container">
      <div className="header"><h2>Carrito</h2></div>
      {cart.lines.length===0 ? <div>Tu carrito está vacío</div> : (
        <div style={{display:'grid',gap:8}}>
          {cart.lines.map(line => (
            <div key={line.product.id} className="card cart-line">
              <div style={{display:'flex',gap:12,alignItems:'center'}}>
                <img src={line.product.images[0]} alt="thumb" style={{width:80,height:60,objectFit:'cover'}} />
                <div>
                  <div><strong>{line.product.name}</strong></div>
                  <div className="small">Precio: ${line.product.price}</div>
                </div>
              </div>
              <div style={{textAlign:'right'}}>
                <div style={{marginBottom:8}}>
                  Cantidad:
                  <button onClick={()=>dec(line)} style={{marginLeft:8}}>-</button>
                  <strong style={{margin:'0 8px'}}>{line.qty}</strong>
                  <button onClick={()=>inc(line)}>+</button>
                </div>
                <div className="small">Subtotal: ${line.product.price * line.qty}</div>
                <div style={{marginTop:8}}><button onClick={()=>remove(line)}>Eliminar</button></div>
              </div>
            </div>
          ))}

          <div style={{textAlign:'right'}} className="card">
            <div><strong>Total: ${total}</strong></div>
            <div style={{marginTop:8}}><button className="button">Ir a Checkout (no implementado por el momento)</button></div>
          </div>
        </div>
      )}
    </div>
  )
}
