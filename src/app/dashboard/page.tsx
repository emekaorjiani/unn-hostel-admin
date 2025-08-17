'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Building2, 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  TrendingUp, 
  DollarSign,
  Download,
  RefreshCw,
  Filter,
  Activity,
  BarChart3,
  PieChart,
  LineChart,
  Wrench,
  Shield,
  Bell
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  RadialLinearScale,
} from 'chart.js';
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';
import { dashboardService, DashboardOverview } from '../../lib/dashboardService';
import { formatCurrency, formatPercentage } from '../../lib/utils';
import DashboardLayout from '../../components/layout/dashboard-layout';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  RadialLinearScale
);

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics'>('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch dashboard data
  const fetchDashboardData = async (refresh = false) => {
    try {
      if (refresh) setIsRefreshing(true);
      setError(null);
      
      const data = await dashboardService.getOverview();
      setDashboardData(data);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Handle refresh
  const handleRefresh = () => {
    fetchDashboardData(true);
  };

  // Handle export
  const handleExport = () => {
    if (dashboardData) {
      try {
        // Export functionality can be implemented here
        console.log('Exporting dashboard data:', dashboardData);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to export data';
        setError(errorMessage);
      }
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin text-unn-primary mx-auto mb-4" />
              <p className="text-gray-600">Loading dashboard data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center">
              <XCircle className="h-6 w-6 text-red-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-red-800">Error Loading Dashboard</h3>
                <p className="text-red-600 mt-1">{error}</p>
                <Button 
                  onClick={() => fetchDashboardData(true)} 
                  className="mt-3"
                  variant="outline"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  const { overview, charts, recent_activities } = dashboardData;

  // Chart configurations
  const occupancyChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Occupancy Rate (%)',
        data: [85, 87, 89, 88, 90, 92],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Helper function to convert API chart data to Chart.js format
  const convertChartData = (chartData: any) => {
    if (Array.isArray(chartData)) {
      return {
        labels: chartData.map((item: any) => item.label),
        datasets: [{
          label: 'Value',
          data: chartData.map((item: any) => item.value),
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
          borderColor: 'rgb(59, 130, 246)',
          borderWidth: 1,
        }]
      };
    }
    return chartData;
  };

  // Use charts data from backend if available, otherwise create simple charts
  const revenueChartData = charts?.revenue_trend ? convertChartData(charts.revenue_trend) : {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue (₦)',
        data: [0, 0, 0, 0, 0, 0],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
    ],
  };

  const applicationsChartData = charts?.applications_trend ? convertChartData(charts.applications_trend) : {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Applications',
        data: [0, 0, 0, 0, 0, 0],
        backgroundColor: 'rgba(168, 85, 247, 0.8)',
        borderColor: 'rgb(168, 85, 247)',
        borderWidth: 1,
      },
    ],
  };

  const maintenanceChartData = charts?.maintenance_trend ? convertChartData(charts.maintenance_trend) : {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Maintenance Tickets',
        data: [0, 0, 0, 0, 0, 0],
        backgroundColor: 'rgba(251, 146, 60, 0.8)',
        borderColor: 'rgb(251, 146, 60)',
        borderWidth: 1,
      },
    ],
  };

  const hostelDistributionData = {
    labels: ['Zik Hall', 'Mariere Hall', 'Kuti Hall', 'Mellanby Hall', 'Alvan Ikoku Hall', 'Eni Njoku Hall'],
    datasets: [
      {
        data: [88, 90, 94, 85, 85, 86],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(251, 146, 60, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(16, 185, 129, 0.8)',
        ],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      animation: {
        duration: 2000,
        easing: 'easeInOutQuart',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      animation: {
        duration: 2000,
        easing: 'easeInOutQuart',
      },
    },
  };

  // Quick Overview Component
  const QuickOverview = ({ overview }: { overview: any }) => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-unn-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview?.total_students?.toLocaleString() || '0'}</div>
            <p className="text-xs text-muted-foreground">
              Active students in the system
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hostels</CardTitle>
            <Building2 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview?.total_hostels?.toLocaleString() || '0'}</div>
            <p className="text-xs text-muted-foreground">
              {formatPercentage(overview?.occupancy_rate || 0)} occupancy rate
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <FileText className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview?.total_applications?.toLocaleString() || '0'}</div>
            <p className="text-xs text-muted-foreground">
              {overview?.pending_applications || 0} pending review
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-unn-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(parseFloat(overview?.total_revenue || '0'))}</div>
            <p className="text-xs text-muted-foreground">
              ₦{(overview?.monthly_revenue || 0).toLocaleString()} this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance Tickets</CardTitle>
            <Wrench className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview?.maintenance_tickets?.toLocaleString() || '0'}</div>
            <p className="text-xs text-muted-foreground">
              Active maintenance requests
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Incidents</CardTitle>
            <Shield className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview?.security_incidents?.toLocaleString() || '0'}</div>
            <p className="text-xs text-muted-foreground">
              Reported this month
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visitor Passes</CardTitle>
            <Users className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview?.active_visitor_passes?.toLocaleString() || '0'}</div>
            <p className="text-xs text-muted-foreground">
              Currently active
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notifications</CardTitle>
            <Bell className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview?.unread_notifications?.toLocaleString() || '0'}</div>
            <p className="text-xs text-muted-foreground">
              Unread notifications
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Recent Activities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recent_activities && recent_activities.length > 0 ? (
              recent_activities.slice(0, 5).map((activity: any, index: number) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg border">
                  <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                    {activity.type === 'login' && <Activity className="h-4 w-4" />}
                    {activity.type === 'application' && <FileText className="h-4 w-4" />}
                    {activity.type === 'payment' && <DollarSign className="h-4 w-4" />}
                    {activity.type === 'maintenance' && <Wrench className="h-4 w-4" />}
                    {!['login', 'application', 'payment', 'maintenance'].includes(activity.type) && <Activity className="h-4 w-4" />}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{activity.title || 'Activity'}</h4>
                    <p className="text-sm text-gray-600">{activity.description || 'No description available'}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {activity.timestamp ? new Date(activity.timestamp).toLocaleString() : 'Recent'}
                    </p>
                  </div>
                  <Badge variant={activity.status === 'completed' ? 'default' : 'secondary'}>
                    {activity.status || 'unknown'}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">No recent activities</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Analytics Component
  const Analytics = ({ overview }: { overview: any }) => (
    <div className="space-y-6">
      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <LineChart className="h-5 w-5 mr-2" />
              Occupancy Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Line data={occupancyChartData} options={chartOptions} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Revenue Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Bar data={revenueChartData} options={chartOptions} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Application Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Bar data={applicationsChartData} options={chartOptions} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Maintenance Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Bar data={maintenanceChartData} options={chartOptions} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="h-5 w-5 mr-2" />
              Hostel Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Doughnut data={hostelDistributionData} options={doughnutOptions} />
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Total Students</h4>
                  <p className="text-sm text-gray-600">
                    {overview?.total_students || 0} students
                  </p>
                </div>
                <Badge variant="outline">
                  {overview?.total_students || 0}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Total Applications</h4>
                  <p className="text-sm text-gray-600">
                    {overview?.total_applications || 0} applications
                  </p>
                </div>
                <Badge variant="outline">
                  {overview?.total_applications || 0}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Approved Applications</h4>
                  <p className="text-sm text-gray-600">
                    {overview?.approved_applications || 0} applications
                  </p>
                </div>
                <Badge variant="outline">
                  {overview?.approved_applications || 0}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Pending Applications</h4>
                  <p className="text-sm text-gray-600">
                    {overview?.pending_applications || 0} applications
                  </p>
                </div>
                <Badge variant="outline">
                  {overview?.pending_applications || 0}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Maintenance Tickets</h4>
                  <p className="text-sm text-gray-600">
                    {overview?.maintenance_tickets || 0} active tickets
                  </p>
                </div>
                <Badge variant="outline">
                  {overview?.maintenance_tickets || 0}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Security Incidents</h4>
                  <p className="text-sm text-gray-600">
                    {overview?.security_incidents || 0} incidents
                  </p>
                </div>
                <Badge variant="outline">
                  {overview?.security_incidents || 0}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Visitor Passes</h4>
                  <p className="text-sm text-gray-600">
                    {overview?.active_visitor_passes || 0} active passes
                  </p>
                </div>
                <Badge variant="outline">
                  {overview?.active_visitor_passes || 0}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Unread Notifications</h4>
                  <p className="text-sm text-gray-600">
                    {overview?.unread_notifications || 0} notifications
                  </p>
                </div>
                <Badge variant="outline">
                  {overview?.unread_notifications || 0}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Real-time overview of hostel management system
            </p>
          </div>
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <Button
              onClick={handleRefresh}
              disabled={isRefreshing}
              variant="outline"
              size="sm"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              onClick={handleExport}
              variant="outline"
              size="sm"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm mb-6">
          <Button
            onClick={() => setActiveTab('overview')}
            variant={activeTab === 'overview' ? 'default' : 'ghost'}
            className="flex-1"
          >
            <Activity className="h-4 w-4 mr-2" />
            Quick Overview
          </Button>
          <Button
            onClick={() => setActiveTab('analytics')}
            variant={activeTab === 'analytics' ? 'default' : 'ghost'}
            className="flex-1"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </Button>
        </div>

        {/* Content */}
        {activeTab === 'overview' ? <QuickOverview overview={overview} /> : <Analytics overview={overview} />}
      </div>
    </DashboardLayout>
  );
}
