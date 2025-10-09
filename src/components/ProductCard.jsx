import React from 'react'
import { Link } from 'react-router-dom'

export default function ProductCard({ p, onAdd }){
  return (
    <div className="card">
      <img src={p.images[0]} alt={p.name} style={{width:'100%',height:140,objectFit:'cover',borderRadius:6}} />
      <h3 style={{margin:'8px 0 4px'}}>{p.name}</h3>
      <div className="small">{p.category} • {p.sku}</div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:8}}>
        <strong>${p.price}</strong>
        <div>
          <button className="button" onClick={()=>onAdd(p)}>Agregar</button>
        </div>
      </div>
      <div style={{marginTop:8}}><Link to={`/product/${p.id}`}>Ver detalle</Link></div>
    </div>
  )
}
