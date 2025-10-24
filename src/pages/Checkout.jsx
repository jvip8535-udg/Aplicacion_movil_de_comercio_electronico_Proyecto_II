import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { mockApi } from '../api/mockApi'
import { auth } from '../utils/auth'

export default function Checkout({ onOrderPlaced }) {
  const [cart, setCart] = useState({ lines: [] })
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [zip, setZip] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('tarjeta')
  const [loading, setLoading] = useState(false)
  const token = auth.getToken()
  const navigate = useNavigate()

  useEffect(() => {
    load()
  }, [])

  async function load() {
    const c = await mockApi.getCart(token)
    setCart(c)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (cart.lines.length === 0) {
      alert("Tu carrito está vacío")
      return
    }
    setLoading(true)
    try {
      const orderDetails = {
        cart,
        shipping: { address, city, zip },
        payment: { method: paymentMethod }
      }
      const confirmation = await mockApi.placeOrder(token, orderDetails)
      
      if (typeof onOrderPlaced === 'function') {
        onOrderPlaced()
      }
      
      navigate(`/confirmation/${confirmation.orderId}`)
    } catch (err) {
      alert("Error al procesar el pago: " + err.message)
      setLoading(false)
    }
  }

  const total = cart.lines.reduce((s, l) => s + (l.product.price * l.qty), 0)

  return (
    <div className="container">
      <div className="header"><h2>Checkout</h2></div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 16 }}>
        {/* Columna de Formulario */}
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
          <h4>Dirección de Envío</h4>
          <input className="input" value={address} onChange={e => setAddress(e.target.value)} placeholder="Dirección" required />
          <input className="input" value={city} onChange={e => setCity(e.target.value)} placeholder="Ciudad" required />
          <input className="input" value={zip} onChange={e => setZip(e.target.value)} placeholder="Código Postal" required />

          <h4>Método de Pago</h4>
          <select className="input" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
            <option value="tarjeta">Tarjeta de Crédito/Débito</option>
            <option value="paypal">PayPal</option>
          </select>

          <button className="button" type="submit" disabled={loading}>
            {loading ? "Procesando pago..." : `Pagar $${total}`}
          </button>
        </form>

        {/* Columna de Resumen */}
        <div className="card">
          <h4>Resumen del Pedido</h4>
          {cart.lines.map(line => (
            <div key={line.product.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.9em' }}>
              <span>{line.product.name} (x{line.qty})</span>
              <strong>${line.product.price * line.qty}</strong>
            </div>
          ))}
          <hr />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
            <span>Total</span>
            <strong>${total}</strong>
          </div>
        </div>
      </div>
    </div>
  )
}