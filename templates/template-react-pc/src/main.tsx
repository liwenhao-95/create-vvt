import React from 'react'
import ReactDOM from 'react-dom/client'
import { ConfigProvider } from 'antd'
import routers from '@/routers'
import { RouterProvider } from 'react-router-dom'
import './styles/index.scss'
import {Provider} from 'react-redux'
import stores from './stores'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={stores}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#00b96b'
          }
        }}
      >
        <RouterProvider router={routers} />
      </ConfigProvider>
    </Provider>
  </React.StrictMode>,
)
