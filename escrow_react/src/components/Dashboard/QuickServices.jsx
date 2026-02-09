import { useNavigate } from 'react-router-dom';
import createDealImg from '../../assets/create_deal.png';
import escrowChatImg from '../../assets/escrow_chat.png';
import withdrawalImg from '../../assets/withdrawal.png';
import searchUserImg from '../../assets/search_user.png';
import activeDealsImg from '../../assets/active_deals.png';
import disputesImg from '../../assets/dispputes.png';
import walletBalanceImg from '../../assets/wallet_balance.png';
import historyImg from '../../assets/history.png';

export default function QuickServices() {
  const navigate = useNavigate();
  
  const services = [
    {
      id: 1,
      image: createDealImg,
      label: 'Create Deal',
      path: '/deals/create',
      color: 'bg-orange-500',
    },
    {
      id: 2,
      image: escrowChatImg,
      label: 'Escrow Chat',
      path: '/chat',
      color: 'bg-blue-500',
    },
    {
      id: 3,
      image: withdrawalImg,
      label: 'Withdraw',
      path: '/wallet/withdraw',
      color: 'bg-teal-600',
    },
    {
      id: 4,
      image: searchUserImg,
      label: 'Search User',
      path: '/search',
      color: 'bg-blue-400',
    },
    {
      id: 5,
      image: activeDealsImg,
      label: 'Active Deals',
      path: '/deals',
      color: 'bg-indigo-500',
    },
    {
      id: 6,
      image: disputesImg,
      label: 'Disputes',
      path: '/disputes',
      color: 'bg-red-500',
    },
    {
      id: 7,
      image: walletBalanceImg,
      label: 'Wallet Balance',
      path: '/wallet',
      color: 'bg-amber-500',
    },
    {
      id: 8,
      image: historyImg,
      label: 'History',
      path: '/history',
      color: 'bg-teal-500',
    },
  ];
  
  return (
    <div className="grid grid-cols-3 gap-3">
      {services.map((service) => {
        return (
          <button
            key={service.id}
            onClick={() => navigate(service.path)}
            className="flex flex-col items-center gap-2 bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow active:scale-95"
          >
            <div className={`w-14 h-14 ${service.color} rounded-2xl flex items-center justify-center p-2`}>
              <img src={service.image} alt={service.label} className="w-full h-full object-contain" />
            </div>
            <span className="text-xs font-medium text-gray-700 text-center leading-tight">
              {service.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
