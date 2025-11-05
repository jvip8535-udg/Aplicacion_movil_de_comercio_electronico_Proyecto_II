import React, { useEffect, useState } from 'react'
import { mockApi } from '../../api/mockApi'

// Estado inicial para el formulario de producto
const BLANK_PRODUCT = {
  id: null,
  name: '',
  price: '',
  category: 'Hogar',
  stock: 10,
  images: ['https://picsum.photos/seed/new/600/400'],
  description: ''
}

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingProduct, setEditingProduct] = useState(BLANK_PRODUCT)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    setLoading(true)
    try {
      // Pedir todos los productos (sin paginación)
      const { products } = await mockApi.getProducts({ perPage: 999 })
      setProducts(products)
    } catch (err) {
      alert("Error: " + err.message)
    }
    setLoading(false)
  }

  function handleEditClick(p) {
    setEditingProduct(p)
    window.scrollTo(0, 0) // Subir al formulario
  }

  async function handleDeleteClick(p) {
    if (window.confirm(`¿Estás seguro de que quieres eliminar "${p.name}"?`)) {
      setLoading(true)
      try {
        await mockApi.deleteProduct(p.id)
        load() // Recargar lista
      } catch (err) {
        alert("Error: " + err.message)
      }
      setLoading(false)
    }
  }

  async function handleFormSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      await mockApi.saveProduct(editingProduct)
      setEditingProduct(BLANK_PRODUCT) // Limpiar formulario
      load() // Recargar lista
    } catch (err) {
      alert("Error: " + err.message)
    }
    setLoading(false)
  }

  function handleFormChange(e) {
    const { name, value } = e.target
    setEditingProduct(prev => ({ ...prev, [name]: value }))
  }
  
  function handleCancelEdit() {
    setEditingProduct(BLANK_PRODUCT)
  }

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      {/* Formulario de Edición / Creación */}
      <form onSubmit={handleFormSubmit} className="card" style={{ display: 'grid', gap: 12 }}>
        <h3>{editingProduct.id ? 'Editando Producto' : 'Crear Nuevo Producto'}</h3>
        <input className="input" name="name" value={editingProduct.name} onChange={handleFormChange} placeholder="Nombre del Producto" required />
        <input className="input" name="price" value={editingProduct.price} onChange={handleFormChange} placeholder="Precio" type="number" required />
        <input className="input" name="stock" value={editingProduct.stock} onChange={handleFormChange} placeholder="Stock" type="number" />
        <select className="input" name="category" value={editingProduct.category} onChange={handleFormChange}>
          <option>Hogar</option>
          <option>Ropa</option>
          <option>Electrónica</option>
          <option>Accesorios</option>
          <option>Mascotas</option>
        </select>
        <textarea className="input" name="description" value={editingProduct.description} onChange={handleFormChange} placeholder="Descripción"></textarea>
        {/* Simulación de imagen: en un caso real esto sería un file upload */}
        <input className="input" name="images" value={editingProduct.images[0]} onChange={e => handleFormChange({target:{name:'images', value:[e.target.value]}})} placeholder="URL de Imagen" />
        
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="button" type="submit" disabled={loading}>
            {loading ? "Guardando..." : "Guardar Producto"}
          </button>
          {editingProduct.id && <button type="button" onClick={handleCancelEdit} disabled={loading}>Cancelar Edición</button>}
        </div>
      </form>

      {/* Lista de Productos */}
      <h2>{products.length} Productos en la Tienda</h2>
      {loading && <div>Cargando...</div>}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {products.map(p => (
          <div key={p.id} className="card">
            <strong>{p.name}</strong> (${p.price})
            <div className="small">{p.category} - Stock: {p.stock}</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <button onClick={() => handleEditClick(p)}>Editar</button>
              <button onClick={() => handleDeleteClick(p)}>Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}