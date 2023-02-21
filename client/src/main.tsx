import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import ReactDOM from 'react-dom/client'
import App from './App'
import { Provider } from 'react-redux'
import { store, persistor } from './redux/store'
import { PersistGate } from 'redux-persist/integration/react'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import MoviePage from './pages/movie-page'
import HomePage from './pages/home'
import SearchPage from './pages/search-results'
import './main.scss'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children:[
      {
        path: "movies",
        element: <HomePage />,
        children:[
          {
            path: "page/:pagenum",
            element: <HomePage />
          }
        ]
      },
      {
        path: "movies/:id",
        element: <MoviePage />,
      },
      {
        path: "search/:searchquery",
        element: <SearchPage />,
      }
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" />,
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <RouterProvider router={router} />
    </PersistGate>
  </Provider>
)
