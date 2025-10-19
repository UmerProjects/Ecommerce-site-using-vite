import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getProductsByCategory } from '../lib/api'
import { Link } from 'react-router-dom'
import { formatPriceCents } from '../utils/format'

export default function CategoryDetail() {
  const { id } = useParams()
  const { data, isLoading, error } = useQuery({ queryKey: ['category-products', id], queryFn: () => getProductsByCategory(id, { page: 1, perPage: 24 }) })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div className="text-red-600">{error.message}</div>
  const items = data?.items || []

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Category</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map(p => (
          <Link key={p.id} to={`/products/${p.id}`} className="border rounded p-3 hover:shadow">
            {p.image_url ? <img src={p.image_url} alt={p.title} className="aspect-square object-cover rounded mb-2" /> : <div className="aspect-square bg-slate-100 rounded mb-2" />}
            <div className="font-medium line-clamp-1">{p.title}</div>
            <div className="text-sm text-slate-600">{formatPriceCents(p.price_cents, p.currency)}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
