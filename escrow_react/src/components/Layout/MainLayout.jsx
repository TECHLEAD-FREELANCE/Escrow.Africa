import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home, FileText, PlusCircle, MessageCircle, User } from 'lucide-react';

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const navItems = [
    { icon: Home, label: 'Home', path: '/dashboard' },
    { icon: FileText, label: 'Deals', path: '/deals' },
    { icon: PlusCircle, label: 'Create', path: '/deals/create' },
    { icon: MessageCircle, label: 'Chat', path: '/chat' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];
  
  const isActive = (path) => location.pathname === path;
  
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Main Content */}
      <div className="pb-4">
        <Outlet />
      </div>
      
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-inset-bottom z-50">
        <div className="grid grid-cols-5 h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                  active ? 'text-[#0d9488]' : 'text-gray-600'
                }`}
              >
                {item.label === 'Create' ? (
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center -mt-6 shadow-lg ${
                    active ? 'bg-[#0d9488]' : 'bg-[#0d9488]'
                  }`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                ) : (
                  <>
                    <Icon className={`w-6 h-6 ${active ? 'fill-[#0d9488]' : ''}`} />
                    <span className="text-xs font-medium">{item.label}</span>
                  </>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
