import React from 'react';
import { useWebSocket } from '../context/WebSocketContext';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, CheckCircle, Info, Sparkles, X } from 'lucide-react';

export const LiveNotificationToasts: React.FC = () => {
  const { toastNotifications, dismissToast } = useWebSocket();

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      <AnimatePresence>
        {toastNotifications.map((notif) => {
          let bgClass = 'bg-slate-900 border-slate-700 text-white';
          let icon = <Info className="w-5 h-5 text-sky-400 shrink-0" />;

          if (notif.severity === 'danger') {
            bgClass = 'bg-rose-950/95 border-rose-500/50 text-rose-100 shadow-rose-950/50 shadow-xl';
            icon = <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 animate-bounce" />;
          } else if (notif.severity === 'success') {
            bgClass = 'bg-emerald-950/95 border-emerald-500/50 text-emerald-100 shadow-emerald-950/50 shadow-xl';
            icon = <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />;
          } else if (notif.type === 'QUIZ_SUBMISSION') {
            bgClass = 'bg-indigo-950/95 border-indigo-500/50 text-indigo-100 shadow-indigo-950/50 shadow-xl';
            icon = <Sparkles className="w-5 h-5 text-amber-300 shrink-0 animate-pulse" />;
          }

          return (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.9 }}
              transition={{ duration: 0.25 }}
              className={`pointer-events-auto p-4 rounded-xl border backdrop-blur-md shadow-2xl flex items-start gap-3 ${bgClass}`}
            >
              {icon}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-semibold text-sm tracking-tight">{notif.title}</h4>
                  <span className="text-[10px] opacity-60 shrink-0 font-mono">
                    {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-xs mt-1 opacity-90 leading-relaxed font-normal">{notif.message}</p>
                {notif.type === 'LOW_STOCK' && (
                  <span className="inline-block mt-2 text-[11px] font-medium bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded border border-rose-500/30">
                    WebSocket Live Inventory Feed
                  </span>
                )}
              </div>
              <button
                onClick={() => dismissToast(notif.id)}
                className="text-slate-400 hover:text-white p-1 rounded-md transition-colors shrink-0"
                aria-label="Dismiss notification"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
