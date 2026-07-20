import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
// import { Provider } from 'react-redux'
import { AuthProvider } from './context/AuthContext.jsx'
import { MapDataProvider } from './context/MapDataContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <MapDataProvider>
      {/* <Provider store={store}> */}
        <App />
      {/* </Provider> */}
      </MapDataProvider>
    </AuthProvider>
  </StrictMode>
)
