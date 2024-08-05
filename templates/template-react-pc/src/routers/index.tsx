import { createBrowserRouter } from 'react-router-dom'
import ErrorPage from '@/components/errorPage'
import LayoutPage from '@/components/layout'
import {lazy, Suspense} from 'react'
import {Spin} from 'antd'

const About = lazy(() => import('@/pages/about'))
const Home = lazy(() => import('@/pages/home'))
const Login = lazy(() => import('@/pages/login'))
const Introduce = lazy(() => import('@/pages/introduce'))

const routers = createBrowserRouter([
  {
    path: '/',
    element: <LayoutPage />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '',
        index: true,
        element: (
          <Suspense fallback={<Spin spinning size='large' />}>
            <Introduce />
          </Suspense>
        )
      },
      {
        path: 'home',
        element: (
          <Suspense fallback={<Spin spinning size='large' />}>
            <Home />
          </Suspense>
        )
      },
      {
        path: 'about',
        element: (
          <Suspense fallback={<Spin spinning size='large' />}>
            <About />
          </Suspense>
        )
      }
    ]
  },
  {
    path: 'login',
    element: (
      <Suspense fallback={<p>Loading...</p>}>
        <Login />
      </Suspense>
    )
  }
])

export default routers