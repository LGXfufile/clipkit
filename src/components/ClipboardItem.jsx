import React, { useState, useEffect } from 'react';

const ClipboardItem = ({ item, onCopy }) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = async () => {
    const success = await onCopy(item.text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateText = (text, maxLength = 100) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div 
      onClick={handleCopy}
      className="group relative bg-white border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-all duration-200 hover:shadow-sm"
    >
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-gray-900 text-sm leading-relaxed whitespace-pre-wrap break-words">
            {truncateText(item.text)}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs text-gray-500">
            {formatTime(item.timestamp)}
          </span>
          {copied ? (
            <span className="text-green-500 text-xs font-medium flex items-center gap-1">
              ✓ Copied!
            </span>
          ) : (
            <span className="text-gray-400 group-hover:text-apple-blue text-xs transition-colors">
              Click to copy
            </span>
          )}
        </div>
      </div>
      
      {copied && (
        <div className="absolute inset-0 bg-green-50 border border-green-200 rounded-lg flex items-center justify-center">
          <div className="text-green-600 font-medium">✓ Copied to clipboard!</div>
        </div>
      )}
    </div>
  );
};

export default ClipboardItem;