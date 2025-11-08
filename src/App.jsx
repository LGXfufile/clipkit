import React, { useState, useEffect, useCallback } from 'react';
import ClipboardItem from './components/ClipboardItem';
import { ClipboardManager } from './utils/clipboard';

function App() {
  const [history, setHistory] = useState([]);
  const [isSupported, setIsSupported] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [lastClipboardCheck, setLastClipboardCheck] = useState('');

  // 初始化
  useEffect(() => {
    const supported = ClipboardManager.isClipboardAPISupported();
    setIsSupported(supported);
    
    const savedHistory = ClipboardManager.getHistory();
    setHistory(savedHistory);
    setShowWelcome(savedHistory.length === 0);
  }, []);

  // 监听剪贴板变化
  const checkClipboard = useCallback(async () => {
    if (!isSupported) return;
    
    try {
      const currentClipboard = await ClipboardManager.readFromClipboard();
      if (currentClipboard && currentClipboard !== lastClipboardCheck && currentClipboard.trim()) {
        ClipboardManager.addItem(currentClipboard);
        const updatedHistory = ClipboardManager.getHistory();
        setHistory(updatedHistory);
        setLastClipboardCheck(currentClipboard);
        setShowWelcome(false);
      }
    } catch (error) {
      // 静默处理错误，避免过多提示
    }
  }, [isSupported, lastClipboardCheck]);

  // 定期检查剪贴板（需要用户交互后才能工作）
  useEffect(() => {
    let interval;
    
    const startMonitoring = () => {
      interval = setInterval(checkClipboard, 1000);
    };

    // 用户首次点击后开始监听
    const handleUserInteraction = () => {
      startMonitoring();
      document.removeEventListener('click', handleUserInteraction);
    };

    if (isSupported) {
      document.addEventListener('click', handleUserInteraction);
    }

    return () => {
      if (interval) clearInterval(interval);
      document.removeEventListener('click', handleUserInteraction);
    };
  }, [checkClipboard, isSupported]);

  // 复制到剪贴板
  const handleCopyToClipboard = async (text) => {
    return await ClipboardManager.copyToClipboard(text);
  };

  // 清空历史记录
  const handleClearHistory = () => {
    ClipboardManager.clearHistory();
    setHistory([]);
    setShowWelcome(true);
  };

  if (!isSupported) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">ClipKit</h1>
          <p className="text-gray-600">
            Your browser doesn't support the Clipboard API. Please use a modern browser like Chrome, Firefox, or Safari.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-2 tracking-tight">
              ClipKit
            </h1>
            <p className="text-lg text-gray-600 font-light">
              Your clipboard, beautifully simple.
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {showWelcome ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h2 className="text-2xl font-light text-gray-900 mb-4">
              Welcome to ClipKit
            </h2>
            <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
              Copy any text and it will appear here automatically. 
              Click on any item to copy it back to your clipboard.
            </p>
            <div className="mt-8 p-4 bg-blue-50 rounded-xl max-w-md mx-auto">
              <p className="text-sm text-blue-800">
                🔒 All data stays on your device. Nothing is sent to our servers.
              </p>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-medium text-gray-900">
                Recent Clips ({history.length}/30)
              </h2>
              {history.length > 0 && (
                <button
                  onClick={handleClearHistory}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-red-600 border border-gray-300 hover:border-red-300 rounded-lg transition-colors duration-200"
                >
                  Clear All
                </button>
              )}
            </div>

            <div className="space-y-3">
              {history.map((item) => (
                <ClipboardItem
                  key={item.id}
                  item={item}
                  onCopy={handleCopyToClipboard}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-gray-50 mt-20">
        <div className="max-w-4xl mx-auto px-6 py-8 text-center">
          <p className="text-sm text-gray-500">
            © 2025 ClipKit · Privacy-first clipboard manager
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Built with ❤️ for digital workers
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
