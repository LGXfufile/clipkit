import React, { useState, useEffect } from 'react';

const ClipboardItem = ({ item, onCopy }) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = async () => {
    const success = await onCopy(item.text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return '刚刚';
    if (diffInMinutes < 60) return `${diffInMinutes}分钟前`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}小时前`;
    
    return date.toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateText = (text, maxLength = 100) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const getContentTypeIcon = (text) => {
    const urlPattern = /^(https?:\/\/)|(www\.)/i;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (urlPattern.test(text.trim())) return '🔗';
    if (emailPattern.test(text.trim())) return '📧';
    if (text.includes('\n')) return '📄';
    if (/^\d+$/.test(text.trim())) return '🔢';
    return '📝';
  };

  return (
    <div 
      onClick={handleCopy}
      className={`
        relative cursor-pointer group
        bg-white border border-gray-200 rounded-lg p-4 
        hover:border-blue-300 hover:shadow-sm 
        transition-all duration-200 ease-out
        ${copied ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}
      `}
    >
      <div className="flex items-start gap-3">
        {/* 内容类型图标 */}
        <div className="flex-shrink-0 mt-1">
          <span className="text-lg">{getContentTypeIcon(item.text)}</span>
        </div>
        
        <div className="flex-1 min-w-0">
          {/* 文本内容 */}
          <p className="text-gray-900 text-sm leading-relaxed whitespace-pre-wrap break-words mb-2">
            {truncateText(item.text)}
          </p>
          
          {/* 时间戳 */}
          <p className="text-xs text-gray-500">
            {formatTime(item.timestamp)}
          </p>
        </div>
        
        {/* 复制状态指示 */}
        <div className="flex-shrink-0">
          {copied ? (
            <div className="flex items-center text-green-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          ) : (
            <div className="text-gray-400 group-hover:text-blue-600 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>
      </div>
      
      {/* 复制成功提示 */}
      {copied && (
        <div className="absolute inset-0 bg-green-50 border border-green-200 rounded-lg flex items-center justify-center">
          <div className="flex items-center gap-2 text-green-700">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm font-medium">已复制</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClipboardItem;