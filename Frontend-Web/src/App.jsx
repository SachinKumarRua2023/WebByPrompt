import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './hooks/useAuth'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import PromptGenerator from './pages/PromptGenerator'
import PromptList from './pages/PromptList'
import PromptDetail from './pages/PromptDetail'

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/prompts" element={<PromptList />} />
            <Route 
              path="/generate" 
              element={
                <ProtectedRoute>
                  <PromptGenerator />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/prompts/:id" 
              element={
                <ProtectedRoute>
                  <PromptDetail />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  )
}

export default App
