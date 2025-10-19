import { useState, useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { searchProducts } from '../lib/api'
import { formatPriceCents } from '../utils/format'

export default function Search() {
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const q = params.get('q') || ''

  const { data, isLoading, error } = useQuery({
    queryKey: ['search', q],
    queryFn: () => searchProducts(q, { page: 1, perPage: 24 }),
    enabled: !!q,
  })

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Search</h1>
      {!q && <div>Type in the search box in the header.</div>}
      {q && isLoading && <div>Searching...</div>}
      {error && <div className="text-red-600">{error.message}</div>}
      {q && data?.items?.length === 0 && <div>No results found for "{q}".</div>}
      {q && data?.items?.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {data.items.map(p => (
            <Link key={p.id} to={`/products/${p.id}`} className="border rounded p-3 hover:shadow">
              {p.image_url ? <img src={p.image_url} alt={p.title} className="aspect-square object-cover rounded mb-2" /> : <div className="aspect-square bg-slate-100 rounded mb-2" />}
              <div className="font-medium line-clamp-1">{p.title}</div>
              <div className="text-sm text-slate-600">{formatPriceCents(p.price_cents, p.currency)}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
