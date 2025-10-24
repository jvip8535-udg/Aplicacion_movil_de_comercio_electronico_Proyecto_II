import React, { useEffect, useState } from 'react'
import ProductCard from '../components/ProductCard'
import Pagination from '../components/Pagination'
import { mockApi } from '../api/mockApi'

export default function Catalog({ onAdd }){
  const [products,setProducts]=useState([])
  const [page,setPage]=useState(1)
  const [perPage]=useState(8)
  const [total,setTotal]=useState(0)
  const [categories,setCategories]=useState([])
  const [cat,setCat]=useState('')
  const [search, setSearch] = useState('')

  useEffect(()=>{ load() },[page, cat, search]) 
  
  async function load(){
    const res = await mockApi.getProducts({ page, perPage, category: cat || null, search: search || null }) 
    setProducts(res.products); setTotal(res.total); setCategories(res.categories)
  }

  return (
    <div className="container">
      <div className="header" style={{gap: 16, flexWrap: 'wrap'}}>
        <h2>Catálogo</h2>
        <div style={{display: 'flex', gap: 12, flexGrow: 1, justifyContent: 'flex-end'}}>
          <input 
            className="input" 
            style={{width: 250}}
            value={search} 
            onChange={e=>{setSearch(e.target.value); setPage(1)}} 
            placeholder="Buscar producto..." 
          />
          <select className="input" style={{width: 200}} value={cat} onChange={e=>{setCat(e.target.value); setPage(1)}}>
            <option value="">Todas las categorías</option>
            {categories.map(c=> <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="product-grid">
        {products.map(p=> <ProductCard key={p.id} p={p} onAdd={onAdd} />)}
      </div>

      <Pagination page={page} perPage={perPage} total={total} onChange={setPage} />
    </div>
  )
}