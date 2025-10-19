import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { Suspense, lazy } from 'react'
import Navbar from './components/Navbar'
import { PageLoader } from './components/ui/LoadingSpinner'
import FloatingActionButton from './components/ui/FloatingActionButton'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <PageLoader />
  if (!user) return <Navigate to="/login" replace />
  return children
}

const Home = lazy(() => import('./pages/Home'))
const Login = lazy(() => import('./pages/auth/Login'))
const Register = lazy(() => import('./pages/auth/Register'))
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'))
const VerifyEmail = lazy(() => import('./pages/auth/VerifyEmail'))
const Logout = lazy(() => import('./pages/auth/Logout'))
const Products = lazy(() => import('./pages/Products'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const Categories = lazy(() => import('./pages/Categories'))
const CategoryDetail = lazy(() => import('./pages/CategoryDetail'))
const Search = lazy(() => import('./pages/Search'))
const Profile = lazy(() => import('./pages/Profile'))
const Cart = lazy(() => import('./pages/Cart'))

function AppLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <Navbar />
      </header>
      <main className="flex-1">
        <div className="container py-6">{children}</div>
      </main>
      <footer className="border-t">
        <div className="container py-4 text-sm text-slate-500">© {new Date().getFullYear()}</div>
      </footer>
      <FloatingActionButton />
    </div>
  )
}

export function AppRouter() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <AppLayout>
          <Suspense fallback={<PageLoader />}>
            <Home />
          </Suspense>
        </AppLayout>
      ),
    },
    { path: '/login', element: <Suspense fallback={<PageLoader />}><Login /></Suspense> },
    { path: '/register', element: <Suspense fallback={<PageLoader />}><Register /></Suspense> },
    { path: '/reset-password', element: <Suspense fallback={<PageLoader />}><ResetPassword /></Suspense> },
    { path: '/verify-email', element: <Suspense fallback={<PageLoader />}><VerifyEmail /></Suspense> },
    { path: '/logout', element: <Suspense fallback={<PageLoader />}><Logout /></Suspense> },

    { path: '/products', element: <AppLayout><Suspense fallback={<PageLoader />}><Products /></Suspense></AppLayout> },
    { path: '/products/:id', element: <AppLayout><Suspense fallback={<PageLoader />}><ProductDetail /></Suspense></AppLayout> },
    { path: '/categories', element: <AppLayout><Suspense fallback={<PageLoader />}><Categories /></Suspense></AppLayout> },
    { path: '/categories/:id', element: <AppLayout><Suspense fallback={<PageLoader />}><CategoryDetail /></Suspense></AppLayout> },
    { path: '/search', element: <AppLayout><Suspense fallback={<PageLoader />}><Search /></Suspense></AppLayout> },

    { path: '/profile', element: <AppLayout><ProtectedRoute><Suspense fallback={<PageLoader />}><Profile /></Suspense></ProtectedRoute></AppLayout> },
    { path: '/cart', element: <AppLayout><Suspense fallback={<PageLoader />}><Cart /></Suspense></AppLayout> },
  ])

  return <RouterProvider router={router} />
}
