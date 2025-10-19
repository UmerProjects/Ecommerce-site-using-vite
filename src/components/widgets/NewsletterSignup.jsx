import { useState } from 'react'
import { Mail, CheckCircle } from 'lucide-react'
import { useToast } from '../ui/Toast'
import Button from '../ui/Button'

export default function NewsletterSignup({ className = "" }) {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const { success, error } = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!email) {
      error('Please enter your email address')
      return
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      error('Please enter a valid email address')
      return
    }

    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setIsSubscribed(true)
      success('Successfully subscribed to our newsletter!')
      setEmail('')
    } catch (err) {
      error('Failed to subscribe. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubscribed) {
    return (
      <div className={`bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-8 text-center ${className}`}>
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Thank you for subscribing!</h3>
        <p className="text-gray-600 mb-4">
          You'll receive our latest updates and exclusive offers in your inbox.
        </p>
        <button
          onClick={() => setIsSubscribed(false)}
          className="text-green-600 hover:text-green-700 font-medium transition-colors"
        >
          Subscribe another email
        </button>
      </div>
    )
  }

  return (
    <div className={`bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-8 ${className}`}>
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Stay in the Loop</h3>
        <p className="text-gray-600">
          Get the latest updates, exclusive deals, and new product announcements delivered to your inbox.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            disabled={isLoading}
          />
          <Mail className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
        
        <Button
          type="submit"
          loading={isLoading}
          className="w-full"
          size="lg"
        >
          Subscribe Now
        </Button>
      </form>

      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>

      {/* Benefits */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mb-2">
            <span className="text-blue-600 text-sm font-bold">🎁</span>
          </div>
          <p className="text-xs text-gray-600">Exclusive Offers</p>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mb-2">
            <span className="text-blue-600 text-sm font-bold">📢</span>
          </div>
          <p className="text-xs text-gray-600">New Arrivals</p>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mb-2">
            <span className="text-blue-600 text-sm font-bold">💡</span>
          </div>
          <p className="text-xs text-gray-600">Tips & Tricks</p>
        </div>
      </div>
    </div>
  )
}
