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
  
  const [couponCode, setCouponCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [discountMessage, setDiscountMessage] = useState('')
  
  const token = auth.getToken()
  const navigate = useNavigate()

  useEffect(() => {
    load()
  }, [token])

  async function load() {
    try {
      const c = await mockApi.getCart(token)
      setCart(c)

      if (token) {
        const p = await mockApi.getUserProfile(token)
        if (p.address) {
          setAddress(p.address)
        }
      }
    } catch (err) {
      console.error("Error al cargar datos de checkout:", err)
      alert("Hubo un error al cargar tu perfil: " + err.message)
    }
  }
  
  async function handleApplyCoupon() {
    setLoading(true)
    setDiscountMessage('')
    try {
      const { success, discount, message } = await mockApi.validateCoupon(couponCode)
      if (success) {
        setDiscount(discount)
        setDiscountMessage(`Cupón '${couponCode}' aplicado: ${discount}% de descuento.`)
      } else {
        setDiscount(0)
        setDiscountMessage(message)
      }
    } catch (err) {
      setDiscountMessage("Error al validar cupón.")
    }
    setLoading(false)
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
        payment: { method: paymentMethod },
        coupon: discount > 0 ? couponCode : null,
        discount: discount
      }
      const confirmation = await mockApi.placeOrder(token, orderDetails)
      
      if (typeof onOrderPlaced === 'function') {
        onOrderPlaced()
      }
      
      navigate(`/confirmation/${confirmation.orderId}`)

    } catch (err) {
      let errorMsg = "Error al procesar el pago."
      if (err && err.message) {
        errorMsg = err.message
      } else if (typeof err === 'string') {
        errorMsg = err
      } else {
        errorMsg = "Ocurrió un error desconocido al procesar el pago."
        console.error("Error no capturado:", err)
      }
      alert(errorMsg)
      setLoading(false)
    }
  }

  const subTotal = cart.lines.reduce((s, l) => s + (l.product.price * l.qty), 0)
  const discountAmount = subTotal * (discount / 100)
  const total = subTotal - discountAmount

  return (
    <div className="container">
      <div className="header"><h2>Checkout</h2></div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 16 }}>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
          <h4>Dirección de Envío</h4>
          <input className="input" value={address} onChange={e => setAddress(e.target.value)} placeholder="Dirección" required />
          <input className="input" value={city} onChange={e => setCity(e.target.value)} placeholder="Ciudad" required />
          <input className="input" value={zip} onChange={e => setZip(e.target.value)} placeholder="Código Postal" required />

          <h4>Método de Pago</h4>
          <select className="input" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
            <option value="tarjeta">Tarjeta de Crédito/Débito </option>
            <option value="paypal">PayPal </option>
          </select>

          <button className="button" type="submit" disabled={loading}>
            {loading ? "Procesando pago..." : `Pagar $${total.toFixed(2)}`}
          </button>
        </form>

        <div>
          <div className="card" style={{ marginBottom: 16 }}>
            <h4>Cupón de Descuento</h4>
            <div style={{ display: 'flex', gap: 8 }}>
              <input className="input" value={couponCode} onChange={e => setCouponCode(e.target.value)} placeholder="PROMO10" />
              <button onClick={handleApplyCoupon} disabled={loading} style={{flexShrink: 0}}>Aplicar</button>
            </div>
            {discountMessage && <div className="small" style={{marginTop: 8, color: discount > 0 ? 'green' : 'red'}}>{discountMessage}</div>}
          </div>

          <div className="card">
            <h4>Resumen del Pedido</h4>
            {cart.lines.map(line => (
              <div key={line.product.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.9em' }}>
                <span>{line.product.name} (x{line.qty})</span>
                <strong>${line.product.price * line.qty}</strong>
              </div>
            ))}
            <hr />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Subtotal</span>
              <strong>${subTotal.toFixed(2)}</strong>
            </div>
            {discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'green' }}>
                <span>Descuento ({discount}%)</span>
                <strong>-${discountAmount.toFixed(2)}</strong>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginTop: 8 }}>
              <span>Total</span>
              <strong>${total.toFixed(2)}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}