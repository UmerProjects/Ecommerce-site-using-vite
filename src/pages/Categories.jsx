import { useQuery } from '@tanstack/react-query'
import { getCategories } from '../lib/api'
import { Link } from 'react-router-dom'

export default function Categories() {
  const { data: categories, isLoading, error } = useQuery({ queryKey: ['categories'], queryFn: getCategories })
  if (isLoading) return <div>Loading...</div>
  if (error) return <div className="text-red-600">{error.message}</div>

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Categories</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {(categories || []).map(c => (
          <Link key={c.id} to={`/categories/${c.id}`} className="border rounded p-3 hover:shadow">
            <div className="font-medium">{c.name}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
