'use client';
import React from 'react';
import { Bell } from 'lucide-react';
import { useAppStore } from '@/stores/appStore';
import { cn } from '@/lib/utils';

interface UserProfileProps {
  showBell?: boolean;
  showDots?: boolean;
}

export function UserProfile({ showBell = false, showDots = false }: UserProfileProps) {
  const { user, hasUnread, markAllRead } = useAppStore();

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
        <div className="w-10 h-10 bg-[#eee] rounded-full border-2 border-[#333]" />
        <div className="leading-tight">
          <p className="font-extrabold text-[15px] m-0">{user.name}</p>
          <p className="text-[10px] opacity-80 m-0">{user.role}</p>
        </div>
      </div>

      {showDots && (
        <span className="text-3xl font-bold cursor-pointer text-black select-none">⋮</span>
      )}
    </div>
  );
}
