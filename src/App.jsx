import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import Layout from '../pages/Layout'
import Home from '../pages/Home'
import NotFound from '../pages/NotFound'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout/>,
    children: [
      {index:true, element:<Home/>},
      // {path:'search', element:<Search/>},
      // {path:'fav', element:<Favorites/>},
      // {path: "user", element: <User/>, children:[
        // {path:'login', element:<Login/>},
        // {path:'register', element:<Register/>},
        // {path:'profile', element:<Profile/>}
      // ]},
      {path:'*', element:<NotFound/>},
    ]
  }])

function App() {
  
  return <RouterProvider router={router}/>
}

export default App
