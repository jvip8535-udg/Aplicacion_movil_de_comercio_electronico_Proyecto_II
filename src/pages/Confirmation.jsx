import React from 'react'
import { useParams, Link } from 'react-router-dom'

export default function Confirmation() {
  const { orderId } = useParams()

  return (
    <div className="container" style={{ textAlign: 'center' }}>
      <h2>¡Gracias por tu compra!</h2>
      <p>Tu pedido ha sido confirmado.</p>
      <p>Tu número de confirmación es: <strong>{orderId}</strong></p>
      <br />
      <Link to="/" className="button">
        Seguir comprando
      </Link>
    </div>
  )
}