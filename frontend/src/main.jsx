import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes,Route } from 'react-router-dom'
import { QueryClientProvider, QueryClient } from 'react-query'
import { Header } from './components/header'
const queryClient = new QueryClient()


ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Header/>}>
        </Route>
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
)
