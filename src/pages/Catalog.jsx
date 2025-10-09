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

  useEffect(()=>{ load() },[page,cat])
  async function load(){
    const res = await mockApi.getProducts({ page, perPage, category: cat || null })
    setProducts(res.products); setTotal(res.total); setCategories(res.categories)
  }

  return (
    <div className="container">
      <div className="header">
        <h2>Catálogo</h2>
        <div>
          <select className="input" value={cat} onChange={e=>{setCat(e.target.value); setPage(1)}}>
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
