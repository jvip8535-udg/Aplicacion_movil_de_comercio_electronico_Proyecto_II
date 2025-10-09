import React from 'react'

export default function Pagination({ page, perPage, total, onChange }){
  const pages = Math.max(1, Math.ceil(total / perPage) || 1)
  return (
    <div className="pager">
      <button className="button" disabled={page<=1} onClick={()=>onChange(page-1)}>Anterior</button>
      <div className="small">Página {page} de {pages}</div>
      <button className="button" disabled={page>=pages} onClick={()=>onChange(page+1)}>Siguiente</button>
    </div>
  )
}
