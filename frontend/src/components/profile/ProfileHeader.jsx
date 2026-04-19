import React from 'react';
import { ChevronLeft, Settings, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProfileHeader = ({ isOwnProfile, isEditing, setIsEditing }) => {
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-between mb-12">
            <button 
                onClick={() => isEditing ? setIsEditing(false) : navigate('/dashboard')} 
                className="flex items-center gap-2 text-zinc-500 hover:text-white transition-all group font-black text-[10px] uppercase tracking-[0.3em]"
            >
                <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                {isEditing ? 'Back' : 'Back to Hub'}
            </button>
            
            {isOwnProfile && (
                 <button 
                    onClick={() => setIsEditing(!isEditing)} 
                    className="p-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors text-white"
                 >
                     {isEditing ? <CheckCircle2 size={20} /> : <Settings size={20} />}
                 </button>
            )}
        </div>
    );
};

export default ProfileHeader;
