import React from 'react';
import { motion } from 'framer-motion';
import { Maximize2, ExternalLink, RefreshCw, AlertCircle, Globe } from 'lucide-react';

export const PreviewWindow = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const iframeRef = React.useRef<HTMLIFrameElement>(null);

  const handleRefresh = () => {
    window.open('https://whimsical-ganache-7f13fd.netlify.app/', '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-[#1E2A37]/80 to-[#1E2A37]/50 backdrop-blur-lg rounded-xl md:rounded-3xl p-4 md:p-6 text-white relative overflow-hidden border border-white/5 shadow-xl"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#2D9CDB]/5 to-transparent" />
      
      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/50" />
            </div>
            <h3 className="text-sm font-mono text-gray-400">preview.chatearn.app</h3>
          </div>
          
          <a
            href="https://whimsical-ganache-7f13fd.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-gray-400" />
          </a>
        </div>

        {/* Preview Window */}
        <div className="relative rounded-lg overflow-hidden bg-[#141F2A] aspect-[16/9] group">
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#141F2A] p-6 text-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="w-16 h-16 rounded-full bg-[#2D9CDB]/10 flex items-center justify-center mb-4"
            >
              <Globe className="w-8 h-8 text-[#2D9CDB]" />
            </motion.div>
            
            <h3 className="text-xl font-semibold text-white mb-2">
              Preview Available
            </h3>
            
            <p className="text-gray-400 mb-6 max-w-md">
              Due to security restrictions, the preview needs to be opened in a new window.
            </p>

            <motion.a
              href="https://whimsical-ganache-7f13fd.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#2D9CDB] text-white rounded-lg hover:bg-[#2D9CDB]/90 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Open Preview</span>
              <ExternalLink className="w-4 h-4" />
            </motion.a>

            <div className="absolute inset-0 bg-gradient-to-t from-[#141F2A] to-transparent opacity-50 pointer-events-none" />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between text-sm">
          <p className="text-gray-400">Interactive preview of the platform</p>
          <a
            href="https://whimsical-ganache-7f13fd.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[#2D9CDB] hover:text-[#2D9CDB]/80 transition-colors"
          >
            <span>Open in new window</span>
            <Maximize2 className="w-4 h-4" />
          </a>
        </div>
      </div>
    </motion.div>
  );
};