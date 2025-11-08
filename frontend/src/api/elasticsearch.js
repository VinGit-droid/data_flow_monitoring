// Dummy/mock data provider for dashboard with seamless switch to real data (just change fetchLogsData/fetchLogStats to request API)

export const fetchLogsData = async () => {
  // 100 dummy logs
  const levels = ['INFO', 'WARNING', 'ERROR', 'DEBUG'];
  const sources = ['api-service', 'db-service', 'auth-service', 'worker'];
  const messages = [
    'Request processed',
    'Connection timeout',
    'Memory spike',
    'Login failed',
    'Password changed',
    'Cron executed',
    'Resource exhausted',
    'Query completed',
  ];
  const now = new Date();
  let data = [];
  for (let i = 0; i < 100; i++) {
    data.push({
      id: `mock-${i}`,
      timestamp: new Date(now - Math.random() * 3 * 24 * 60 * 60 * 1000).toISOString(),
      level: levels[Math.floor(Math.random() * levels.length)],
      source: sources[Math.floor(Math.random() * sources.length)],
      message: messages[Math.floor(Math.random() * messages.length)],
      duration_ms: Math.floor(Math.random() * 5000)
    });
  }
  return data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

export const fetchLogStats = async () => {
  // Calculate from dummy logs
  const logs = await fetchLogsData();
  const levelCounts = logs.reduce((acc, log) => {
    acc[log.level] = (acc[log.level] || 0) + 1;
    return acc;
  }, {});
  return {
    total: logs.length,
    errors: levelCounts['ERROR'] || 0,
    warnings: levelCounts['WARNING'] || 0,
    info: levelCounts['INFO'] || 0
  };
};
