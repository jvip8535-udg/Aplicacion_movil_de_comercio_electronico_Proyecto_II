import React, { useEffect, useState } from 'react'
import { mockApi } from '../../api/mockApi'

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    setLoading(true)
    try {
      const allOrders = await mockApi.getAllOrders()
      setOrders(allOrders)
    } catch (err) {
      alert("Error: " + err.message)
    }
    setLoading(false)
  }

  if (loading) return <div>Cargando órdenes...</div>

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <h2>Viendo {orders.length} Órdenes</h2>
      {orders.map(order => (
        <div key={order.id} className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <strong>Pedido: {order.id}</strong>
            <span className="small">Usuario ID: {order.userKey}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span className="small">Fecha: {new Date(order.date).toLocaleString()}</span>
            <span className="small">Total: ${order.total}</span>
          </div>
          {order.details.cart.lines.map(line => (
            <div key={line.product.id} className="small" style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #eee', padding: '4px 0' }}>
              <span>{line.product.name} (x{line.qty})</span>
              <span>${line.product.price * line.qty}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}