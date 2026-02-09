import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import useAuthStore from './stores/authStore';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Deals from './pages/Deals';
import CreateDeal from './pages/CreateDeal';
import DealDetail from './pages/DealDetail';
import Chat from './pages/Chat';
import ChatWindow from './pages/ChatWindow';
import Wallet from './pages/Wallet';
import TopUp from './pages/TopUp';
import Withdraw from './pages/Withdraw';
import Search from './pages/Search';
import Disputes from './pages/Disputes';
import History from './pages/History';
import Profile from './pages/Profile';
import MainLayout from './components/Layout/MainLayout';
import ProtectedRoute from './components/Layout/ProtectedRoute';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  // User session is automatically loaded from sessionStorage in authStore
  
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected Routes */}
          <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/deals" element={<Deals />} />
            <Route path="/deals/create" element={<CreateDeal />} />
            <Route path="/deals/:id" element={<DealDetail />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/chat/:userId" element={<ChatWindow />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/wallet/topup" element={<TopUp />} />
            <Route path="/wallet/withdraw" element={<Withdraw />} />
            <Route path="/search" element={<Search />} />
            <Route path="/disputes" element={<Disputes />} />
            <Route path="/history" element={<History />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
          
          {/* Redirect root to dashboard or login */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
        
        <Toaster 
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#fff',
              color: '#111827',
              borderRadius: '12px',
              padding: '16px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;

