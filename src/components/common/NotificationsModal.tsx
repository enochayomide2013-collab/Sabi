import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  X, 
  Check, 
  Trash2, 
  Sparkles, 
  ShieldCheck, 
  TrendingUp, 
  AlertTriangle, 
  Award, 
  MessageSquare,
  ExternalLink,
  CheckCheck
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { AppNotification } from '../../types';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string, extraData?: any) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const [notifications, setNotifications] = useState<AppNotification[]>(storageService.getNotifications());
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'rewards'>('all');

  useEffect(() => {
    const unsubscribe = storageService.subscribe(() => {
      setNotifications(storageService.getNotifications());
    });
    return unsubscribe;
  }, []);

  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredNotifs = notifications.filter(n => {
    if (activeFilter === 'unread') return !n.read;
    if (activeFilter === 'rewards') return n.type === 'points_earned' || n.type === 'tier_upgrade';
    return true;
  });

  const handleMarkAsRead = (id: string) => {
    storageService.markNotificationAsRead(id);
  };

  const handleMarkAllRead = () => {
    storageService.markAllNotificationsAsRead();
  };

  const handleDeleteNotif = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    storageService.deleteNotification(id);
  };

  const handleClearAll = () => {
    storageService.clearAllNotifications();
  };

  const getNotifIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'points_earned':
        return <Sparkles className="w-4 h-4 text-amber-600" />;
      case 'tier_upgrade':
        return <Award className="w-4 h-4 text-purple-600" />;
      case 'report_verified':
        return <ShieldCheck className="w-4 h-4 text-emerald-600" />;
      case 'verification_request':
        return <TrendingUp className="w-4 h-4 text-blue-600" />;
      case 'system_alert':
      default:
        return <Bell className="w-4 h-4 text-[#0A3D2E]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in" id="notifications-info-modal">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[85vh] animate-scale-up">
        
        {/* MODAL HEADER WITH EXIT BUTTON */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#0A3D2E] to-[#0d4a38] text-white flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#FFD60A] text-[#0A3D2E] flex items-center justify-center shadow-xs">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg font-display text-white">
                  SABI Info & Messages
                </h3>
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {unreadCount} New
                  </span>
                )}
              </div>
              <p className="text-[11px] text-emerald-100/80">
                Verification updates, rewards & system alerts
              </p>
            </div>
          </div>

          {/* EXIT BUTTON */}
          <button
            id="exit-notifications-modal-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-all active:scale-90"
            title="Exit Notifications"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* CONTROLS & FILTER BAR */}
        <div className="p-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between gap-2 text-xs">
          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 font-bold">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-2.5 py-1 rounded-xl transition-all ${
                activeFilter === 'all'
                  ? 'bg-[#0A3D2E] text-white shadow-2xs'
                  : 'bg-white text-gray-700 hover:bg-gray-200/80 border border-gray-200'
              }`}
            >
              All ({notifications.length})
            </button>

            <button
              onClick={() => setActiveFilter('unread')}
              className={`px-2.5 py-1 rounded-xl transition-all ${
                activeFilter === 'unread'
                  ? 'bg-[#0A3D2E] text-white shadow-2xs'
                  : 'bg-white text-gray-700 hover:bg-gray-200/80 border border-gray-200'
              }`}
            >
              Unread ({unreadCount})
            </button>

            <button
              onClick={() => setActiveFilter('rewards')}
              className={`px-2.5 py-1 rounded-xl transition-all ${
                activeFilter === 'rewards'
                  ? 'bg-[#0A3D2E] text-white shadow-2xs'
                  : 'bg-white text-gray-700 hover:bg-gray-200/80 border border-gray-200'
              }`}
            >
              Rewards 🎁
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-[11px] font-bold text-emerald-800 hover:text-[#0A3D2E] flex items-center gap-1"
                title="Mark all as read"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Mark all read</span>
              </button>
            )}

            {notifications.length > 0 && (
              <button
                onClick={handleClearAll}
                className="text-[11px] font-bold text-gray-400 hover:text-red-600 flex items-center gap-1"
                title="Clear all notifications"
              >
                <Trash2 className="w-3 h-3" />
                <span className="hidden sm:inline">Clear</span>
              </button>
            )}
          </div>
        </div>

        {/* NOTIFICATIONS LIST */}
        <div className="overflow-y-auto p-3 sm:p-4 space-y-2.5 flex-grow" id="notifications-items-container">
          {filteredNotifs.length === 0 ? (
            <div className="text-center py-12 space-y-2 text-gray-400">
              <Bell className="w-10 h-10 mx-auto text-gray-300 stroke-1" />
              <p className="text-sm font-semibold text-gray-600">No notifications in this view</p>
              <p className="text-xs text-gray-400">You are all caught up on your truth alerts and rewards!</p>
            </div>
          ) : (
            filteredNotifs.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleMarkAsRead(notif.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 relative group ${
                  notif.read 
                    ? 'bg-gray-50/70 border-gray-200/80 opacity-80 hover:opacity-100 hover:bg-gray-50' 
                    : 'bg-emerald-50/80 border-emerald-300 shadow-2xs ring-1 ring-emerald-200/50'
                }`}
              >
                {/* Icon */}
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                  notif.read ? 'bg-gray-200/80 text-gray-600' : 'bg-emerald-100 text-[#0A3D2E]'
                }`}>
                  {getNotifIcon(notif.type)}
                </div>

                {/* Body */}
                <div className="space-y-1 flex-grow pr-6">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className={`text-xs font-bold font-display ${notif.read ? 'text-gray-800' : 'text-[#0A3D2E]'}`}>
                      {notif.title}
                    </h4>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed">
                    {notif.message}
                  </p>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <span className="text-[10px] text-gray-400 font-medium">
                      {notif.timestamp}
                    </span>

                    {notif.pointsAwarded && (
                      <span className="text-[10px] font-extrabold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                        +{notif.pointsAwarded} PTS
                      </span>
                    )}
                  </div>
                </div>

                {/* Dismiss single notification button */}
                <button
                  onClick={(e) => handleDeleteNotif(notif.id, e)}
                  className="absolute top-2.5 right-2.5 text-gray-300 hover:text-red-500 p-1 rounded-lg hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                  title="Dismiss notification"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="p-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <span className="text-[11px] text-gray-500">
            SABI Real-Time Truth Intelligence
          </span>
          <button
            id="notifications-modal-close-action"
            onClick={onClose}
            className="bg-[#0A3D2E] hover:bg-[#0c4a37] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all active:scale-95 shadow-xs font-display"
          >
            Exit Notifications
          </button>
        </div>

      </div>
    </div>
  );
};
