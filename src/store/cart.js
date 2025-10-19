import { create } from 'zustand'

const persistKey = 'ecommerce_cart_v1'

function loadInitialState() {
  try {
    const raw = localStorage.getItem(persistKey)
    return raw ? JSON.parse(raw) : { items: [] }
  } catch {
    return { items: [] }
  }
}

export const useCartStore = create((set, get) => ({
  ...loadInitialState(),
  addItem: (item) => {
    const items = [...get().items]
    const idx = items.findIndex(i => i.product_id === item.product_id && i.variant_id === item.variant_id)
    if (idx >= 0) items[idx] = { ...items[idx], quantity: items[idx].quantity + (item.quantity || 1) }
    else items.push({ ...item, quantity: item.quantity || 1 })
    set({ items })
    localStorage.setItem(persistKey, JSON.stringify({ items }))
  },
  removeItem: (productId, variantId) => {
    const items = get().items.filter(i => !(i.product_id === productId && i.variant_id === variantId))
    set({ items })
    localStorage.setItem(persistKey, JSON.stringify({ items }))
  },
  clear: () => {
    set({ items: [] })
    localStorage.setItem(persistKey, JSON.stringify({ items: [] }))
  },
}))
