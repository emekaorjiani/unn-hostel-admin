import React from 'react';
import { Button } from './button';
import { 
  Users, 
  Building2, 
  FileText, 
  DollarSign,
  Plus,
  BarChart3
} from 'lucide-react';

const QuickActions = () => {
  const actions = [
    { title: 'New App', href: '/applications/new', icon: <Plus className="h-4 w-4" /> },
    { title: 'Students', href: '/students', icon: <Users className="h-4 w-4" /> },
    { title: 'Hostels', href: '/hostels', icon: <Building2 className="h-4 w-4" /> },
    { title: 'Reports', href: '/reports', icon: <BarChart3 className="h-4 w-4" /> },
    { title: 'Payments', href: '/payments', icon: <DollarSign className="h-4 w-4" /> }
  ];

  return (
    <nav className="fixed top-16 left-0 right-0 bg-white border-b border-gray-200 px-4 py-3 z-40">
      <div className="flex items-center justify-center space-x-4">
        {actions.map((action) => (
          <Button
            key={action.href}
            variant="ghost"
            size="sm"
            className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 rounded-lg"
            onClick={() => window.location.href = action.href}
          >
            {action.icon}
            <span className="text-sm font-medium text-gray-700">{action.title}</span>
          </Button>
        ))}
      </div>
    </nav>
  );
};

export default QuickActions;
 