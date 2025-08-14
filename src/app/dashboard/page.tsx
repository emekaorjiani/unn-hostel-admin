'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
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
  LineChart
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
import { DashboardService, DashboardMetrics, DashboardFilters } from '../../lib/dashboardService';
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
  const [dashboardData, setDashboardData] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics'>('overview');
  const [filters, setFilters] = useState<DashboardFilters>({});
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch dashboard data
  const fetchDashboardData = async (refresh = false) => {
    try {
      if (refresh) setIsRefreshing(true);
      setError(null);
      
      const data = await DashboardService.getDashboardData(filters);
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

  // Real-time updates
  useEffect(() => {
    if (!dashboardData) return;

    const stopPolling = DashboardService.startRealTimeUpdates(
      filters,
      (data) => {
        setDashboardData(data);
      },
      30000 // 30 seconds
    );

    return stopPolling;
  }, [filters]);

  // Handle refresh
  const handleRefresh = () => {
    fetchDashboardData(true);
  };

  // Handle export
  const handleExport = () => {
    if (dashboardData) {
      try {
        DashboardService.exportToCSV(dashboardData, `dashboard-report-${new Date().toISOString().split('T')[0]}.csv`);
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
              <RefreshCw className="h-8 w-8 animate-spin text-green-600 mx-auto mb-4" />
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

  // Chart configurations
  const occupancyChartData = {
    labels: dashboardData.hostelOccupancy?.map(h => h.hostelName) || [],
    datasets: [
      {
        label: 'Occupancy Rate (%)',
        data: dashboardData.hostelOccupancy?.map(h => h.occupancyPercentage || h.occupancyRate || 0) || [],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Helper function to convert API chart data to Chart.js format
  const convertChartData = (chartData: Array<{label: string, value: number}> | { labels: string[]; datasets: Array<{ label: string; data: number[] }> }) => {
    if (Array.isArray(chartData)) {
      // API format: Array<{label: string, value: number}>
      return {
        labels: chartData.map(item => item.label),
        datasets: [{
          label: 'Value',
          data: chartData.map(item => item.value),
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
          borderColor: 'rgb(59, 130, 246)',
          borderWidth: 1,
        }]
      };
    }
    // Chart.js format: {labels: string[], datasets: Array<{label: string, data: number[]}>}
    return chartData;
  };

  // Use charts data from backend if available, otherwise create simple charts
  const revenueChart = dashboardData.charts?.find(chart => chart.type === 'line' && chart.title.includes('Revenue'));
  const revenueChartData = revenueChart ? convertChartData(revenueChart.data) : {
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

  const applicationsChart = dashboardData.charts?.find(chart => chart.type === 'bar' && chart.title.includes('Application'));
  const applicationsChartData = applicationsChart ? convertChartData(applicationsChart.data) : {
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

  const hostelDistributionData = {
    labels: dashboardData.hostelOccupancy?.map(h => h.hostelName) || [],
    datasets: [
      {
        data: dashboardData.hostelOccupancy?.map(h => h.occupancyPercentage || h.occupancyRate || 0) || [],
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
  const QuickOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(dashboardData.generalMetrics?.totalStudents || 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardData.studentMetrics?.activeStudents || 0} active
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
            <Building2 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{DashboardService.formatPercentage(dashboardData.occupancy?.averageOccupancyRate || 0)}</div>
            <p className="text-xs text-muted-foreground">
              Average across {dashboardData.occupancy?.totalHostels || 0} hostels
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <FileText className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(dashboardData.generalMetrics?.totalApplications || 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardData.applicationMetrics?.pendingApplications || 0} pending
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{DashboardService.formatCurrency(dashboardData.generalMetrics.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardData.financialMetrics.successfulPayments} successful payments
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
            {/* Show recent activities from backend */}
            {dashboardData.recentActivities.slice(0, 5).map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg border">
                <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                  {activity.type === 'login' && <Activity className="h-4 w-4" />}
                  {activity.type === 'application' && <FileText className="h-4 w-4" />}
                  {activity.type === 'payment' && <DollarSign className="h-4 w-4" />}
                  {activity.type === 'maintenance' && <Building2 className="h-4 w-4" />}
                  {!['login', 'application', 'payment', 'maintenance'].includes(activity.type) && <Activity className="h-4 w-4" />}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{activity.title}</h4>
                  <p className="text-sm text-gray-600">{activity.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
                <Badge variant={activity.status === 'completed' ? 'default' : 'secondary'}>
                  {activity.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Analytics Component
  const Analytics = () => (
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
              <PieChart className="h-5 w-5 mr-2" />
              Hostel Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Doughnut data={hostelDistributionData} options={doughnutOptions} />
          </CardContent>
        </Card>
      </div>

      {/* Detailed Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Hostel Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dashboardData.hostelOccupancy.map((hostel) => (
                <div key={hostel.hostelId} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{hostel.hostelName}</h4>
                    <p className="text-sm text-gray-600">
                      {hostel.occupiedBeds} / {hostel.totalBeds} beds
                    </p>
                  </div>
                  <Badge variant="outline">
                    {DashboardService.formatPercentage(hostel.occupancyRate)}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Application Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Total Applications</h4>
                  <p className="text-sm text-gray-600">
                    {dashboardData.applicationMetrics.totalApplications} applications
                  </p>
                </div>
                <Badge variant="outline">
                  {dashboardData.applicationMetrics.totalApplications}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Pending Applications</h4>
                  <p className="text-sm text-gray-600">
                    {dashboardData.applicationMetrics.pendingApplications} applications
                  </p>
                </div>
                <Badge variant="outline">
                  {dashboardData.applicationMetrics.pendingApplications}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Approved Applications</h4>
                  <p className="text-sm text-gray-600">
                    {dashboardData.applicationMetrics.approvedApplications} applications
                  </p>
                </div>
                <Badge variant="outline">
                  {dashboardData.applicationMetrics.approvedApplications}
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
      <div className="max-w-7xl mx-auto">
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
        {activeTab === 'overview' ? <QuickOverview /> : <Analytics />}
      </div>
    </DashboardLayout>
  );
}
