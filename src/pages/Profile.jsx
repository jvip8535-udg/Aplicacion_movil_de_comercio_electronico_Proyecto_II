import React, { useEffect, useState } from 'react'
import { mockApi } from '../api/mockApi'
import { auth } from '../utils/auth'

export default function Profile() {
  const [profile, setProfile] = useState({ email: '', name: '', address: '', paymentMethods: [] })
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const token = auth.getToken()

  // Estados para el form de pago (ECOM-10)
  const [payType, setPayType] = useState('Visa')
  const [payLast4, setPayLast4] = useState('')

  useEffect(() => {
    load()
  }, [])

  async function load() {
    setLoading(true)
    try {
      const [profileData, ordersData] = await Promise.all([
        mockApi.getUserProfile(token),
        mockApi.getOrders(token)
      ])
      setProfile(profileData)
      setOrders(ordersData)
    } catch (err) {
      alert("Error al cargar datos: " + err.message)
    }
    setLoading(false)
  }

  function handleChange(e) {
    const { name, value } = e.target
    setProfile(prev => ({ ...prev, [name]: value }))
  }

  async function handleSaveProfile(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const updatedProfile = await mockApi.updateUserProfile(token, {
        name: profile.name,
        address: profile.address
      })
      setProfile(prev => ({ ...prev, ...updatedProfile }))
      alert("Perfil actualizado correctamente")
    } catch (err) {
      alert("Error al guardar: " + err.message)
    }
    setLoading(false)
  }

  async function handleAddPayment(e) {
    e.preventDefault()
    if (payLast4.length !== 4 || !isNaN(payLast4) === false) {
      alert("Por favor ingrese solo 4 números.")
      return
    }
    const newPaymentMethod = { id: Date.now(), type: payType, last4: payLast4 }
    const updatedPaymentMethods = [...profile.paymentMethods, newPaymentMethod]
    
    setLoading(true)
    try {
      const updatedProfile = await mockApi.updateUserProfile(token, {
        paymentMethods: updatedPaymentMethods
      })
      setProfile(prev => ({ ...prev, ...updatedProfile }))
      setPayLast4('') // Limpiar form
    } catch (err) {
      alert("Error al guardar: " + err.message)
    }
    setLoading(false)
  }

  if (loading && !profile.email) return <div className="container">Cargando...</div>

  return (
    <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
      
      {/* Columna de Perfil y Pagos (ECOM-10) */}
      <div>
        <h3>Mi Perfil</h3>
        <form onSubmit={handleSaveProfile} className="card" style={{ display: 'grid', gap: 12, marginBottom: 16 }}>
          <div>
            <label>Email (no se puede cambiar)</label>
            <input className="input" value={profile.email} disabled />
          </div>
          <div>
            <label>Nombre</label>
            <input className="input" name="name" value={profile.name} onChange={handleChange} placeholder="Tu nombre" />
          </div>
          <div>
            <label>Dirección</label>
            <textarea className="input" name="address" value={profile.address} onChange={handleChange} placeholder="Tu dirección de envío" rows="3"></textarea>
          </div>
          <button className="button" type="submit" disabled={loading}>
            {loading ? "Guardando..." : "Guardar Perfil"}
          </button>
        </form>

        <h4>Métodos de Pago Guardados</h4>
        <div className="card" style={{ marginBottom: 16 }}>
          {profile.paymentMethods.length === 0 ? (
            <div className="small">No hay métodos de pago guardados.</div>
          ) : (
            profile.paymentMethods.map(p => (
              <div key={p.id} className="small" style={{display:'flex', justifyContent:'space-between'}}>
                <span>{p.type} terminada en **** {p.last4}</span>
                {/* Lógica para borrar se puede añadir aquí */}
              </div>
            ))
          )}
        </div>
        <form onSubmit={handleAddPayment} className="card" style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
          <div style={{flexGrow:1}}>
            <label>Tipo</label>
            <select className="input" value={payType} onChange={e => setPayType(e.target.value)}>
              <option>Visa</option>
              <option>Mastercard</option>
            </select>
          </div>
          <div style={{flexGrow:1}}>
            <label>Últimos 4</label>
            <input className="input" value={payLast4} onChange={e => setPayLast4(e.target.value)} maxLength="4" placeholder="1234" />
          </div>
          <button className="button" type="submit" disabled={loading}>Añadir</button>
        </form>
      </div>

      {/* Columna de Historial de Pedidos (ECOM-9) */}
      <div>
        <h3>Historial de Pedidos</h3>
        {orders.length === 0 ? (
          <div className="card">No has realizado ningún pedido.</div>
        ) : (
          <div style={{ display: 'grid', gap: 12, maxHeight: 600, overflowY: 'auto' }}>
            {orders.map(order => (
              <div key={order.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <strong>Pedido: {order.id}</strong>
                  <span className="small">{new Date(order.date).toLocaleDateString()}</span>
                </div>
                <div>
                  {order.details.cart.lines.map(line => (
                    <div key={line.product.id} className="small" style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>{line.product.name} (x{line.qty})</span>
                      <span>${line.product.price * line.qty}</span>
                    </div>
                  ))}
                </div>
                <hr style={{ margin: '8px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                  <span>Total</span>
                  <span>${order.total}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}