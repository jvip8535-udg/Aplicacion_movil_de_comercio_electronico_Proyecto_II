export const PRODUCTS = Array.from({ length: 20 }).map((_, i) => {
  const id = i + 1
  const categories = ['Electrónica', 'Ropa', 'Hogar', 'Accesorios','Mascotas']
  const category = categories[i % categories.length]
  return {
    id,
    name: `${category} Producto ${id}`,
    price: Math.round(100 + Math.random() * 900),
    category,
    sku: `Código de Referencia-${1000 + id}`,
    stock: Math.floor(Math.random() * 10) + 1,
    images: [
      `https://picsum.photos/seed/${id}/600/400`,
      `https://picsum.photos/seed/${id}-2/600/400`,
      `https://picsum.photos/seed/${id}-3/600/400`
    ],
    description: `Descripción del producto ${id}. Demo-sin descripción.`
  }
})
