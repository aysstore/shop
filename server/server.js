const app = require('./app');
const { connectDB, getConnectionStatus } = require('./config/database');

// دریافت پورت از محیط
const PORT = process.env.PORT || 5000;

// شروع سرور
const startServer = async () => {
  try {
    // اتصال به پایگاه داده
    await connectDB();
    console.log(`📊 Database Status: ${getConnectionStatus()}`);

    // شروع سرور
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 API URL: ${process.env.API_URL || `http://localhost:${PORT}/api`}`);
    });

    // مدیریت خطاهای سرور
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use`);
      } else {
        console.error('❌ Server error:', error);
      }
      process.exit(1);
    });

    // مدیریت سیگنال‌های سیستم
    const shutdown = () => {
      console.log('🔄 Shutting down gracefully...');
      server.close(async () => {
        console.log('👋 HTTP server closed');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);

    return server;
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// شروع برنامه
startServer();

// صادر کردن برای تست
module.exports = { startServer };
