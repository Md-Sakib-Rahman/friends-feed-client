import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router'
import router from './routes/Router'
import store from './store';
import { Provider } from 'react-redux';
import { SocketProvider } from "./Context/SocketContext";
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <SocketProvider>
    <RouterProvider router={router} />
    </SocketProvider>
    </Provider>
  </StrictMode>,
)
