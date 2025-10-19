import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getProductById } from '../lib/api'
import { formatPriceCents } from '../utils/format'
import { useCartStore } from '../store/cart'

export default function ProductDetail() {
  const { id } = useParams()
  const addItem = useCartStore(s => s.addItem)
  const { data: product, isLoading, error } = useQuery({ queryKey: ['product', id], queryFn: () => getProductById(id) })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div className="text-red-600">{error.message}</div>
  if (!product) return <div>Not found</div>

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        {product.image_url ? (
          <img src={product.image_url} alt={product.title} className="w-full rounded" />
        ) : (
          <div className="aspect-square bg-slate-100 rounded" />
        )}
      </div>
      <div>
        <h1 className="text-2xl font-semibold mb-2">{product.title}</h1>
        <div className="text-lg text-slate-700 mb-4">{formatPriceCents(product.price_cents, product.currency)}</div>
        <p className="mb-6 whitespace-pre-wrap">{product.description}</p>
        <button onClick={() => addItem({ product_id: product.id, quantity: 1 })} className="bg-black text-white px-4 py-2 rounded">Add to cart</button>
      </div>
    </div>
  )
}
