import React from 'react';
import { Button } from './button';
import { 
  FileText, 
  DollarSign,
  Plus,
  Wrench,
  Bell,
  User,
  Settings,
  HelpCircle,
  LayoutDashboard
} from 'lucide-react';
import Link from 'next/link';

const QuickActions = () => {
  const actions = [
    { title: 'My Dashboard', href: '/student/dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
    { title: 'New Application', href: '/student/applications/new', icon: <Plus className="h-4 w-4" /> },
    { title: 'My Applications', href: '/student/applications', icon: <FileText className="h-4 w-4" /> },
    { title: 'Payments', href: '/student/payments', icon: <DollarSign className="h-4 w-4" /> },
    { title: 'Maintenance', href: '/student/maintenance', icon: <Wrench className="h-4 w-4" /> },
    { title: 'Documents', href: '/student/documents', icon: <FileText className="h-4 w-4" /> },
    { title: 'Settings', href: '/student/settings', icon: <Settings className="h-4 w-4" /> },
    { title: 'Help', href: '/student/help', icon: <HelpCircle className="h-4 w-4" /> }
  ];

  return (
    <nav className="fixed top-16 left-0 right-0 bg-white border-b border-gray-200 px-4 py-3 z-40">
      <div className="flex items-center justify-center space-x-4">
        {actions.map((action) => (
          <Link
            key={action.href}
            className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 rounded-lg"
            href={action.href}
          >
            {action.icon}
            <span className="text-sm font-medium text-gray-700">{action.title}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default QuickActions;
 