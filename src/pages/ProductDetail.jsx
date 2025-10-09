import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { mockApi } from '../api/mockApi'

export default function ProductDetail({ onAdd }){
  const { id } = useParams()
  const [product,setProduct] = useState(null)
  const [selectedImg,setSelectedImg] = useState(0)

  useEffect(()=>{ load() },[id])
  async function load(){
    try{ const p = await mockApi.getProductById(id); setProduct(p); setSelectedImg(0) }catch(e){ }
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
    </div>
  )
}
