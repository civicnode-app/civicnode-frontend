'use client';
import React from 'react';
import { Bell } from 'lucide-react';
import { useAppStore } from '@/stores/appStore';

interface UserProfileProps {
  showBell?: boolean;
  showDots?: boolean;
}

export function UserProfile({ showBell = false, showDots = false }: UserProfileProps) {
  const { user, hasUnread, markAllRead } = useAppStore();
  const initials = user.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('') || 'U';

  return (
    <div className="flex items-center gap-5">
      {showBell && (
        <button
          onClick={markAllRead}
          className="relative text-2xl cursor-pointer focus:outline-none"
          aria-label="Notifications"
        >
          <Bell size={26} className="text-black" />
          {hasUnread && (
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-600 rounded-full border-2 border-[#588157]" />
          )}
        </button>
      )}

      <div className="bg-[#a3b18a] px-5 py-1.5 rounded-full flex items-center gap-3 text-white shadow-md">
        <div className="w-10 h-10 bg-[#eee] rounded-full border-2 border-[#333] overflow-hidden flex items-center justify-center text-[#333] text-sm font-bold">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={`${user.name} avatar`}
              className="w-full h-full object-cover"
            />
          ) : (
            <span>{initials}</span>
          )}
        </div>
        <div className="leading-tight">
          <p className="font-extrabold text-[15px] m-0">{user.name}</p>
          <p className="text-[10px] opacity-80 m-0">{user.role.toUpperCase()}</p>
        </div>
      </div>

      {showDots && (
        <span className="text-3xl font-bold cursor-pointer text-black select-none">⋮</span>
      )}
    </div>
  );
}
