import React, { useState, useEffect } from "react";
import { fetchLogsData, fetchLogStats } from "./api/elasticsearch";
import EventTypeChart from "./components/EventTypeChart";
import StatusOverTime from "./components/StatusOverTime";
import UserActivityPie from "./components/UserActivityPie";
import "./styles/App.css";

function App() {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const fetchData = async () => {
    try {
      setLoading(true);
      const [logsData, statsData] = await Promise.all([
        fetchLogsData(),
        fetchLogStats(),
      ]);
      setLogs(logsData);
      setStats(statsData);
      setError(null);
      setLastUpdate(new Date());
    } catch (err) {
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app-container">
      <header className="header">
        <div className="header-content">
          <h1>📊 DataFlow Dashboard</h1>
          <div className="header-info">
            <span className="status-badge">
              {loading ? "🔄 Loading..." : "✅ Live"}
            </span>
            <span className="last-update">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </span>
            <button className="refresh-btn" onClick={fetchData} disabled={loading}>
              🔄 Refresh
            </button>
          </div>
        </div>
      </header>
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <h3>Total Logs</h3>
            <p className="stat-value">{stats?.total || 0}</p>
          </div>
        </div>
        <div className="stat-card error">
          <div className="stat-icon">❌</div>
          <div className="stat-content">
            <h3>Errors</h3>
            <p className="stat-value">{stats?.errors || 0}</p>
          </div>
        </div>
        <div className="stat-card warning">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <h3>Warnings</h3>
            <p className="stat-value">{stats?.warnings || 0}</p>
          </div>
        </div>
        <div className="stat-card success">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>Info</h3>
            <p className="stat-value">{stats?.info || 0}</p>
          </div>
        </div>
      </div>
      {error && (
        <div className="error-banner">
          <span>⚠️ {error}</span>
          <button onClick={fetchData}>Retry</button>
        </div>
      )}
      <div className="charts-grid">
        <div className="chart-card">
          <h2>📈 Log Levels Over Time</h2>
          <StatusOverTime data={logs} loading={loading} />
        </div>
        <div className="chart-card">
          <h2>🥧 Log Level Distribution</h2>
          <UserActivityPie data={logs} loading={loading} />
        </div>
        <div className="chart-card full-width">
          <h2>📊 Logs by Source</h2>
          <EventTypeChart data={logs} loading={loading} />
        </div>
      </div>
      <footer className="footer">
        <p>DataFlow Dashboard © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

export default App;
