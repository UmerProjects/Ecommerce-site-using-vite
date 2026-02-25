import { supabase } from './supabaseClient'

// Fetch paginated list of active products for listing page
export async function getProducts({ page = 1, perPage = 20, categoryId, search } = {}) {
  let query = supabase
    .from('products')
    .select(
      `
        id,
        title,
        slug,
        description,
        price_cents,
        sale_price_cents,
        currency,
        image_url,
        image_urls,
        stock_quantity,
        is_active,
        is_featured
      `,
      { count: 'exact' }
    )
    .eq('is_active', true)

  if (categoryId) {
    // Filter by category via join table
    const { data: pc, error: pcError } = await supabase
      .from('product_categories')
      .select('product_id')
      .eq('category_id', categoryId)
    if (pcError) throw pcError
    const productIds = (pc || []).map(r => r.product_id)
    if (productIds.length === 0) return { items: [], count: 0 }
    query = query.in('id', productIds)
  }

  if (search && search.trim()) {
    query = query.ilike('title', `%${search.trim()}%`)
  }

  const from = (page - 1) * perPage
  const to = from + perPage - 1
  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range(from, to)
  if (error) throw error
  return { items: data || [], count: count || 0 }
}

// Fetch a single product with full details
export async function getProductById(id) {
  const { data, error } = await supabase
    .from('products')
    .select(
      `
        *,
        product_categories (
          category:categories(name, slug)
        )
      `
    )
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function getCategories() {
  const { data, error } = await supabase.from('categories').select('*').order('name')
  if (error) throw error
  return data || []
}

export async function getProductsByCategory(categoryId, { page = 1, perPage = 20 } = {}) {
  const { data: pc, error: errPc } = await supabase
    .from('product_categories')
    .select('product_id')
    .eq('category_id', categoryId)
  if (errPc) throw errPc
  const productIds = (pc || []).map(r => r.product_id)
  if (productIds.length === 0) return { items: [], count: 0 }
  const from = (page - 1) * perPage
  const to = from + perPage - 1
  const { data, error, count } = await supabase
    .from('products')
    .select('*', { count: 'exact' })
    .in('id', productIds)
    .order('created_at', { ascending: false })
    .range(from, to)
  if (error) throw error
  return { items: data || [], count: count || 0 }
}

// Capture stock notification email for an out-of-stock product
export async function createStockNotification({ productId, email }) {
  const { error } = await supabase.from('stock_notifications').insert({
    product_id: productId,
    email,
  })
  if (error) throw error
}

export async function searchProducts(query, { page = 1, perPage = 20 } = {}) {
  if (!query) return { items: [], count: 0 }
  const from = (page - 1) * perPage
  const to = from + perPage - 1
  const { data, error, count } = await supabase
    .from('products')
    .select('*', { count: 'exact' })
    .ilike('title', `%${query}%`)
    .order('created_at', { ascending: false })
    .range(from, to)
  if (error) throw error
  return { items: data || [], count: count || 0 }
}
