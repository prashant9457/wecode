import React from 'react';
import { cn } from '@/lib/utils';

const UserAvatar = ({ 
    username, 
    profilePicture, 
    isOnline = false, 
    size = "md", // "sm", "md", "lg", "xl"
    className,
    showStatus = true
}) => {
    const initials = username ? username[0].toUpperCase() : '?';
    
    const sizeClasses = {
        sm: "w-8 h-8 text-xs",
        md: "w-10 h-10 text-sm",
        lg: "w-12 h-12 text-lg",
        xl: "w-16 h-16 text-2xl"
    };

    const statusSizeClasses = {
        sm: "w-2.5 h-2.5",
        md: "w-3 h-3",
        lg: "w-3.5 h-3.5",
        xl: "w-4.5 h-4.5"
    };

    return (
        <div className={cn("relative shrink-0", className)}>
            <div className={cn(
                "rounded-full bg-[#1e1f22] overflow-hidden flex items-center justify-center font-bold uppercase border border-white/5 shadow-inner transition-transform group-hover:scale-105",
                sizeClasses[size] || sizeClasses.md
            )}>
                {profilePicture ? (
                    <img src={profilePicture} alt={username} className="w-full h-full object-cover" />
                ) : (
                    <span className="text-[#dbdee1]">{initials}</span>
                )}
            </div>
            
            {showStatus && (
                <div className={cn(
                    "absolute -bottom-0.5 -right-0.5 rounded-full z-10",
                    statusSizeClasses[size] || statusSizeClasses.md
                )}>
                    <div className={cn(
                        "w-full h-full rounded-full transition-colors duration-500",
                        isOnline ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" : "bg-rose-500/80 shadow-[0_0_8px_rgba(244,63,94,0.3)]"
                    )}></div>
                </div>
            )}
        </div>
    );
};

export default UserAvatar;
