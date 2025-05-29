import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAdminWebSocket } from '../hooks/useWebSocket';
import { useToast } from '../components/ToastProvider';
import { apiClient } from '../services/apiClient';
import { AUTH_CONFIG } from '../config';
import './DashboardStyles.css';

interface ConsentStats {
  total: number;
  activeConsents: number;
  revokedConsents: number;
  consentsByService: Record<string, number>;
  consentTrend: {
    date: string;
    count: number;
  }[];
}

// Mock data for development (will be replaced with real API data)
const mockStats: ConsentStats = {
  total: 1250,
  activeConsents: 980,
  revokedConsents: 270,
  consentsByService: {
    'Marketing': 750,
    'Analytics': 850,
    'Third Party': 420,
    'Essential': 1250,
    'Functional': 680
  },
  consentTrend: [
    { date: '2023-04-01', count: 120 },
    { date: '2023-04-08', count: 145 },
    { date: '2023-04-15', count: 165 },
    { date: '2023-04-22', count: 190 },
    { date: '2023-04-29', count: 220 },
    { date: '2023-05-06', count: 250 },
    { date: '2023-05-13', count: 280 }
  ]
};

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<ConsentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeFrame, setTimeFrame] = useState('week'); // 'week', 'month', 'year'
  const { refreshSession } = useAuth();
  const { isConnected, notifications, clearNotifications } = useAdminWebSocket();
  const toast = useToast();

  useEffect(() => {
    fetchConsentStats();
  }, [timeFrame]);

  // Handle real-time notifications
  useEffect(() => {
    notifications.forEach(notification => {
      switch (notification.type) {
        case 'NEW_CONSENT':
          toast.info('New Consent', 'A new consent record has been submitted.');
          // Refresh stats to show updated numbers
          fetchConsentStats();
          break;
        case 'CONSENT_UPDATED':
          toast.info('Consent Updated', 'A consent record has been updated.');
          fetchConsentStats();
          break;
        case 'CONSENT_STATS_UPDATE':
          // Silently refresh stats
          fetchConsentStats();
          break;
        case 'SYSTEM_ALERT':
          toast.warning('System Alert', notification.data?.message || 'System notification received.');
          break;
        default:
          break;
      }
    });

    // Clear notifications after processing
    if (notifications.length > 0) {
      clearNotifications();
    }
  }, [notifications, toast, clearNotifications]);

  const fetchConsentStats = async () => {
    try {
      setLoading(true);
      setError(null);
      refreshSession(); // Refresh the session on dashboard view

      // In a real app, we would fetch from the API
      // For now, use mock data with a slight delay to simulate API call
      setTimeout(() => {
        setStats(mockStats);
        setLoading(false);
      }, 800);

      // Commented out real API call for now
      /*
      const token = localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await apiClient.authRequest(`/admin/consents/stats?timeFrame=${timeFrame}`);
      setStats(response);
      */
    } catch (err) {
      setError('Failed to load dashboard statistics');
      console.error('Error fetching consent stats:', err);
      setLoading(false);
    }
  };

  // Simple canvas-based chart renderer for consent trends
  const renderTrendChart = () => {
    if (!stats?.consentTrend?.length) return null;

    const data = stats.consentTrend;
    const chartHeight = 200;
    const chartWidth = 600;
    const padding = 40;

    // Find max value for scaling
    const maxCount = Math.max(...data.map(item => item.count));

    // Calculate points
    const points = data.map((item, index) => {
      const x = padding + (index * ((chartWidth - padding * 2) / (data.length - 1)));
      const y = chartHeight - padding - ((item.count / maxCount) * (chartHeight - padding * 2));
      return { x, y, ...item };
    });

    // Create path data for line
    const pathData = points.map((point, i) =>
      `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
    ).join(' ');

    return (
      <svg width={chartWidth} height={chartHeight} className="trend-chart">
        {/* Y-axis */}
        <line
          x1={padding}
          y1={padding}
          x2={padding}
          y2={chartHeight - padding}
          stroke="#ddd"
          strokeWidth="1"
        />

        {/* X-axis */}
        <line
          x1={padding}
          y1={chartHeight - padding}
          x2={chartWidth - padding}
          y2={chartHeight - padding}
          stroke="#ddd"
          strokeWidth="1"
        />

        {/* Data points and line */}
        <path
          d={pathData}
          fill="none"
          stroke="#4caf50"
          strokeWidth="2"
        />

        {points.map((point, i) => (
          <g key={i}>
            <circle
              cx={point.x}
              cy={point.y}
              r="4"
              fill="#4caf50"
            />
            <text
              x={point.x}
              y={chartHeight - padding + 15}
              textAnchor="middle"
              fontSize="10"
              fill="#666"
            >
              {new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </text>
            <text
              x={point.x}
              y={point.y - 10}
              textAnchor="middle"
              fontSize="10"
              fill="#666"
            >
              {point.count}
            </text>
          </g>
        ))}
      </svg>
    );
  };

  // Render consent distribution chart
  const renderConsentDistributionChart = () => {
    if (!stats?.consentsByService) return null;

    const data = Object.entries(stats.consentsByService);
    const total = data.reduce((sum, [_, value]) => sum + value, 0);

    // Sort by value descending
    data.sort((a, b) => b[1] - a[1]);

    // Color palette for the chart
    const colors = ['#4caf50', '#2196f3', '#ff9800', '#e91e63', '#9c27b0', '#607d8b'];

    // Generate random color for services beyond our color palette
    const getColorForIndex = (index: number) => {
      if (index < colors.length) return colors[index];
      return `hsl(${Math.random() * 360}, 70%, 50%)`;
    };

    let startAngle = 0;
    const chartSize = 200;
    const centerX = chartSize / 2;
    const centerY = chartSize / 2;
    const radius = 80;

    return (
      <div className="distribution-chart-container">
        <svg width={chartSize} height={chartSize} viewBox={`0 0 ${chartSize} ${chartSize}`}>
          {data.map(([service, count], index) => {
            const percentage = count / total;
            const endAngle = startAngle + percentage * Math.PI * 2;

            // Calculate the path for the slice
            const x1 = centerX + radius * Math.cos(startAngle);
            const y1 = centerY + radius * Math.sin(startAngle);
            const x2 = centerX + radius * Math.cos(endAngle);
            const y2 = centerY + radius * Math.sin(endAngle);

            // Determine if the arc should be drawn as a large arc
            const largeArcFlag = percentage > 0.5 ? 1 : 0;

            // Create the path data for the slice
            const pathData = [
              `M ${centerX} ${centerY}`,
              `L ${x1} ${y1}`,
              `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              'Z'
            ].join(' ');

            const color = getColorForIndex(index);

            // Calculate position for the label
            const labelAngle = startAngle + (percentage * Math.PI);
            const labelRadius = radius * 0.7;
            const labelX = centerX + labelRadius * Math.cos(labelAngle);
            const labelY = centerY + labelRadius * Math.sin(labelAngle);

            // Update the start angle for the next slice
            const currentStartAngle = startAngle;
            startAngle = endAngle;

            return (
              <g key={service}>
                <path
                  d={pathData}
                  fill={color}
                  stroke="#fff"
                  strokeWidth="1"
                >
                  <title>{`${service}: ${count} (${Math.round(percentage * 100)}%)`}</title>
                </path>
                {percentage > 0.08 && (
                  <text
                    x={labelX}
                    y={labelY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#fff"
                    fontSize="10"
                    fontWeight="bold"
                  >
                    {Math.round(percentage * 100)}%
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        <div className="chart-legend">
          {data.map(([service, count], index) => (
            <div key={service} className="legend-item">
              <div
                className="legend-color"
                style={{ backgroundColor: getColorForIndex(index) }}
              />
              <span>{service} ({count})</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading && !stats) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <div>Loading dashboard data...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="dashboard-title-section">
          <h2>GDPR Consent Dashboard</h2>
          <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
            <span className="status-indicator"></span>
            {isConnected ? 'Real-time updates active' : 'Real-time updates unavailable'}
          </div>
        </div>
        <p>Welcome to the GDPR Consent Admin dashboard. Here's an overview of consent statistics.</p>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button
            onClick={fetchConsentStats}
            className="button button-secondary"
          >
            Retry
          </button>
        </div>
      )}

      <div className="time-filter">
        <span>Time frame: </span>
        <div className="button-group">
          <button
            className={`button ${timeFrame === 'week' ? 'button-primary' : 'button-secondary'}`}
            onClick={() => setTimeFrame('week')}
          >
            Week
          </button>
          <button
            className={`button ${timeFrame === 'month' ? 'button-primary' : 'button-secondary'}`}
            onClick={() => setTimeFrame('month')}
          >
            Month
          </button>
          <button
            className={`button ${timeFrame === 'year' ? 'button-primary' : 'button-secondary'}`}
            onClick={() => setTimeFrame('year')}
          >
            Year
          </button>
        </div>
      </div>

      <div className="stats-container">
        <div className="stat-card total">
          <div className="stat-icon">📊</div>
          <h3>Total Consents</h3>
          <div className="stat-value">{stats?.total || 0}</div>
          <div className="stat-trend trend-up">
            <span>↑ 12% from last {timeFrame}</span>
          </div>
        </div>

        <div className="stat-card active">
          <div className="stat-icon">✅</div>
          <h3>Active Consents</h3>
          <div className="stat-value">{stats?.activeConsents || 0}</div>
          <div className="stat-trend trend-up">
            <span>↑ 8% from last {timeFrame}</span>
          </div>
        </div>

        <div className="stat-card revoked">
          <div className="stat-icon">❌</div>
          <h3>Revoked Consents</h3>
          <div className="stat-value">{stats?.revokedConsents || 0}</div>
          <div className="stat-trend trend-down">
            <span>↓ 3% from last {timeFrame}</span>
          </div>
        </div>

        <div className="stat-card rate">
          <div className="stat-icon">📈</div>
          <h3>Consent Rate</h3>
          <div className="stat-value">
            {stats ? Math.round((stats.activeConsents / stats.total) * 100) : 0}%
          </div>
          <div className="stat-trend trend-up">
            <span>↑ 5% from last {timeFrame}</span>
          </div>
        </div>
      </div>

      <div className="chart-grid">
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Consent Trend</h3>
            <div className="chart-actions">
              <div className="tooltip">
                <span className="tooltip-icon">?</span>
                <span className="tooltip-text">This chart shows the trend of consents over time.</span>
              </div>
            </div>
          </div>
          {renderTrendChart()}
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Consent Distribution</h3>
            <div className="chart-actions">
              <div className="tooltip">
                <span className="tooltip-icon">?</span>
                <span className="tooltip-text">This chart shows the distribution of consents by service.</span>
              </div>
            </div>
          </div>
          {renderConsentDistributionChart()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;