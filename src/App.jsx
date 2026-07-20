import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import Layout from './pages/Layout.jsx'
import Home from './pages/Home.jsx'
import NotFound from './pages/NotFound.jsx'
import Login from './pages/user/Login.jsx'
import Register from './pages/user/Register.jsx'
import Profile from './pages/user/Profile.jsx'
import Conversations from './pages/messages/Conversations.jsx'
import ConversationThread from './pages/messages/ConversationThread.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout/>,
    children: [
      {index:true, element:<Home/>},
      // {path:'search', element:<Search/>},
      // {path:'fav', element:<Favorites/>},
      {path:'login', element:<Login/>},
      {path:'register', element:<Register/>},
      {path:'profile', element:<Profile/>},
      {path:'messages', element:<Conversations/>},
      {path:'messages/:conversationId', element:<ConversationThread/>},
      {path:'*', element:<NotFound/>},
    ]
  }])

function App() {
  
  return <RouterProvider router={router}/>
}

export default App
