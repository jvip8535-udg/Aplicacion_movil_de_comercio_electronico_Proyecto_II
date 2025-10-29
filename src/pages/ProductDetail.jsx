import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { mockApi } from '../api/mockApi'
import { auth } from '../utils/auth'

function StarRating({ rating }) {
  return (
    <div>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} style={{ color: i < rating ? '#ffc107' : '#e0e0e0', fontSize: '1.2em' }}>
          ★
        </span>
      ))}
    </div>
  )
}

export default function ProductDetail({ onAdd }){
  const { id } = useParams()
  const [product,setProduct] = useState(null)
  const [selectedImg,setSelectedImg] = useState(0)
  const token = auth.getToken()

  const [reviews, setReviews] = useState([])
  const [newRating, setNewRating] = useState(5)
  const [newComment, setNewComment] = useState('')
  const [loadingReviews, setLoadingReviews] = useState(false)

  useEffect(()=>{
    load()
    window.scrollTo(0, 0)
  },[id])
  
  async function load(){
    setLoadingReviews(true)
    try{ 
      const [p, r] = await Promise.all([
        mockApi.getProductById(id),
        mockApi.getReviews(id)
      ])
      setProduct(p)
      setReviews(r)
      setSelectedImg(0)
    } catch(e){ 
      console.error("Error al cargar", e)
    }
    setLoadingReviews(false)
  }

  async function handleSubmitReview(e) {
    e.preventDefault()
    if (!newComment.trim()) {
      alert("Por favor escribe un comentario.")
      return
    }
    setLoadingReviews(true)
    try {
      await mockApi.addReview(token, {
        productId: id,
        rating: newRating,
        comment: newComment
      })
      setNewComment('')
      setNewRating(5)
      const r = await mockApi.getReviews(id)
      setReviews(r)
    } catch (err) {
      alert("Error al enviar reseña: " + err.message)
    }
    setLoadingReviews(false)
  }

  if(!product) return <div className="container">Cargando...</div>

  return (
    <div className="container">
      <div className="header">
        <h2>{product.name}</h2>
        <div className="small">{product.sku} • {product.category}</div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 320px',gap:16}}>
        <div>
          <div className="card product-gallery">
            <img src={product.images[selectedImg]} alt="main" />
            <div style={{display:'flex',gap:8,marginTop:8}}>
              {product.images.map((im,i)=> (
                <img key={i} src={im} alt={i} style={{width:80,height:60,objectFit:'cover',cursor:'pointer',opacity:i===selectedImg?1:0.7}} onClick={()=>setSelectedImg(i)} />
              ))}
            </div>
          </div>
        </div>
        <div>
          <div className="card">
            <p>{product.description}</p>
            <div style={{marginTop:12}}>
              <div><strong>Precio: ${product.price}</strong></div>
              <div className="small">En existencia: {product.stock}</div>
              <div style={{marginTop:12}}>
                <button className="button" onClick={()=>onAdd(product)}>Agregar al carrito</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{marginTop: 24}}>
        <hr />
        <h3 style={{marginTop: 16}}>Valoraciones y Reseñas</h3>

        {token && (
          <form onSubmit={handleSubmitReview} className="card" style={{ marginBottom: 16, display: 'grid', gap: 12 }}>
            <h4>Deja tu reseña</h4>
            <div>
              <label>Calificación</label>
              <select className="input" value={newRating} onChange={e => setNewRating(e.target.value)}>
                <option value={5}>5 Estrellas</option>
                <option value={4}>4 Estrellas</option>
                <option value={3}>3 Estrellas</option>
                <option value={2}>2 Estrellas</option>
                <option value={1}>1 Estrella</option>
              </select>
            </div>
            <div>
              <label>Comentario</label>
              <textarea 
                className="input" 
                rows="3" 
                value={newComment} 
                onChange={e => setNewComment(e.target.value)}
                placeholder="Escribe tu opinión sobre el producto..."
              ></textarea>
            </div>
            <button className="button" type="submit" disabled={loadingReviews} style={{justifySelf: 'start'}}>
              {loadingReviews ? "Enviando..." : "Enviar Reseña"}
            </button>
          </form>
        )}

        {loadingReviews && reviews.length === 0 && <div className="card">Cargando reseñas...</div>}
        {!loadingReviews && reviews.length === 0 && <div className="card">Este producto aún no tiene reseñas.</div>}
        
        <div style={{ display: 'grid', gap: 12 }}>
          {reviews.map(review => (
            <div key={review.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong>{review.email}</strong>
                <span className="small">{new Date(review.date).toLocaleDateString()}</span>
              </div>
              <StarRating rating={review.rating} />
              <p style={{ margin: '8px 0 0' }}>{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}