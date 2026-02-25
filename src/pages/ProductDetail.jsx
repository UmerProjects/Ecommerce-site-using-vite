import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getProductById, createStockNotification } from '../lib/api'
import { formatPriceCents } from '../utils/format'
import { useCartStore } from '../store/cart'
import { useState } from 'react'
import { Heart } from 'lucide-react'

export default function ProductDetail() {
  const { id } = useParams()
  const addItem = useCartStore(s => s.addItem)

  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [qtyError, setQtyError] = useState('')
  const [wishlistAdded, setWishlistAdded] = useState(false)
  const [notifyEmail, setNotifyEmail] = useState('')
  const [notifyMessage, setNotifyMessage] = useState('')
  const [notifyError, setNotifyError] = useState('')

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductById(id),
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div className="text-red-600">{error.message}</div>
  if (!product) return <div>Not found</div>

  const images =
    (product.image_urls && product.image_urls.length > 0 && product.image_urls) ||
    (product.image_url ? [product.image_url] : [])
  const mainImage = images[activeImageIndex] || images[0]

  const stock = typeof product.stock_quantity === 'number' ? product.stock_quantity : 0
  const hasDiscount =
    typeof product.sale_price_cents === 'number' &&
    product.sale_price_cents > 0 &&
    product.sale_price_cents < product.price_cents
  const discountPercent = hasDiscount
    ? Math.round(100 - (product.sale_price_cents / product.price_cents) * 100)
    : null

  let stockLabel = 'Out of Stock'
  let stockClass = 'bg-red-100 text-red-700'
  if (stock > 10) {
    stockLabel = 'In Stock'
    stockClass = 'bg-green-100 text-green-700'
  } else if (stock > 0) {
    stockLabel = 'Low Stock'
    stockClass = 'bg-orange-100 text-orange-700'
  }

  const primaryCategory = product.product_categories?.[0]?.category

  const clampQuantity = value => {
    const max = stock || 1
    let next = Number(value) || 1
    if (next < 1) next = 1
    if (next > max) {
      next = max
      setQtyError('Cannot exceed available stock.')
    } else {
      setQtyError('')
    }
    setQuantity(next)
  }

  const handleDecrease = () => clampQuantity(quantity - 1)
  const handleIncrease = () => clampQuantity(quantity + 1)
  const handleQtyInput = event => clampQuantity(event.target.value)

  const handleAddToCart = () => {
    if (stock === 0) return
    addItem({ product_id: product.id, quantity })
  }

  const handleToggleWishlist = () => {
    setWishlistAdded(prev => !prev)
  }

  const handleNotify = async event => {
    event.preventDefault()
    setNotifyError('')
    setNotifyMessage('')

    const email = notifyEmail.trim()
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setNotifyError('Please enter a valid email address.')
      return
    }

    try {
      await createStockNotification({ productId: product.id, email })
      setNotifyMessage('You will be notified when this product is back in stock.')
      setNotifyEmail('')
    } catch (err) {
      setNotifyError(err.message || 'Failed to save notification.')
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Image gallery */}
      <div>
        <div className="relative aspect-square bg-slate-100 rounded-lg overflow-hidden group">
          {mainImage ? (
            <img
              src={mainImage}
              alt={product.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-slate-100" />
          )}
        </div>

        {images.length > 1 && (
          <div className="mt-4 flex gap-3">
            {images.slice(0, 5).map((img, index) => (
              <button
                key={img + index}
                type="button"
                onClick={() => setActiveImageIndex(index)}
                className={`w-16 h-16 rounded-md overflow-hidden border ${
                  activeImageIndex === index ? 'border-blue-600' : 'border-transparent'
                }`}
              >
                <img src={img} alt={product.title} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product info */}
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold mb-3">{product.title}</h1>

        {/* Price & discount */}
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl font-bold text-slate-900">
            {formatPriceCents(
              hasDiscount ? product.sale_price_cents : product.price_cents,
              product.currency
            )}
          </span>
          {hasDiscount && (
            <>
              <span className="text-lg text-slate-400 line-through">
                {formatPriceCents(product.price_cents, product.currency)}
              </span>
              {discountPercent !== null && (
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                  -{discountPercent}%
                </span>
              )}
            </>
          )}
        </div>

        {/* Stock status */}
        <div className="flex items-center gap-3 mb-4">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${stockClass}`}>
            {stockLabel}
          </span>
          <span className="text-sm text-slate-500">
            {stock > 0 ? `${stock} available` : 'Currently unavailable'}
          </span>
        </div>

        {/* Meta info */}
        <div className="space-y-1 text-sm text-slate-600 mb-6">
          {product.sku && (
            <div>
              <span className="font-medium">SKU:</span> {product.sku}
            </div>
          )}
          {primaryCategory && (
            <div>
              <span className="font-medium">Category:</span> {primaryCategory.name}
            </div>
          )}
          {product.brand && (
            <div>
              <span className="font-medium">Brand:</span> {product.brand}
            </div>
          )}
        </div>

        {/* Description */}
        {product.description && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <p className="text-sm text-slate-700 whitespace-pre-wrap">{product.description}</p>
          </div>
        )}

        {/* Specifications / features from tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Features</h2>
            <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
              {product.tags.map(tag => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Quantity selector & actions */}
        <div className="mb-6 space-y-3">
          <div className="flex items-center gap-3">
            <div>
              <span className="block text-sm font-medium text-slate-700 mb-1">Quantity</span>
              <div className="inline-flex items-center border rounded-full overflow-hidden">
                <button
                  type="button"
                  onClick={handleDecrease}
                  className="w-9 h-9 flex items-center justify-center text-lg text-slate-700 hover:bg-slate-100"
                >
                  -
                </button>
                <input
                  type="number"
                  min={1}
                  max={stock || 1}
                  value={quantity}
                  onChange={handleQtyInput}
                  className="w-14 text-center border-x border-slate-200 h-9 text-sm"
                />
                <button
                  type="button"
                  onClick={handleIncrease}
                  className="w-9 h-9 flex items-center justify-center text-lg text-slate-700 hover:bg-slate-100"
                >
                  +
                </button>
              </div>
              {qtyError && <p className="text-xs text-red-600 mt-1">{qtyError}</p>}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={stock === 0}
              className={`px-6 py-2 rounded-full text-sm font-semibold flex items-center justify-center gap-2 ${
                stock === 0
                  ? 'bg-slate-300 text-slate-600 cursor-not-allowed'
                  : 'bg-black text-white hover:bg-slate-900'
              }`}
            >
              Add to Cart
            </button>

            <button
              type="button"
              onClick={handleToggleWishlist}
              className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 border ${
                wishlistAdded
                  ? 'border-red-500 text-red-600 bg-red-50'
                  : 'border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Heart
                className={`w-4 h-4 ${
                  wishlistAdded ? 'fill-red-500 text-red-500' : 'text-slate-600'
                }`}
              />
              <span>{wishlistAdded ? 'Added to Wishlist' : 'Add to Wishlist'}</span>
            </button>
          </div>
        </div>

        {/* Notify when available */}
        {stock === 0 && (
          <div className="border-t pt-4 mt-4">
            <h2 className="text-sm font-semibold mb-2">Notify When Available</h2>
            <p className="text-xs text-slate-600 mb-3">
              This product is currently out of stock. Enter your email and we&apos;ll let you know
              when it&apos;s back.
            </p>
            <form onSubmit={handleNotify} className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                required
                value={notifyEmail}
                onChange={event => setNotifyEmail(event.target.value)}
                placeholder="Your email address"
                className="flex-1 border rounded-full px-3 py-2 text-sm"
              />
              <button
                type="submit"
                className="px-5 py-2 rounded-full bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
              >
                Notify Me
              </button>
            </form>
            {notifyError && <p className="text-xs text-red-600 mt-1">{notifyError}</p>}
            {notifyMessage && <p className="text-xs text-green-700 mt-1">{notifyMessage}</p>}
          </div>
        )}
      </div>
    </div>
  )
}
