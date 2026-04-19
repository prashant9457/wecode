import React from 'react';
import { GraduationCap, Code2 } from 'lucide-react';

const SectionHeader = ({ children }) => (
    <h3 className="text-[10px] font-bold text-[#B5BAC1] uppercase tracking-wider mb-2">{children}</h3>
);

export const AcademicCredentials = ({ academic }) => (
    <div className="space-y-4">
        <div className="h-[1px] w-full bg-white/5"></div>
        <div>
            <SectionHeader>Affiliation Details</SectionHeader>
            <div className="space-y-3 pt-1">
                <div className="space-y-0.5">
                    <p className="text-[10px] font-bold text-[#80848E] uppercase tracking-tighter">Academic Hub</p>
                    <p className="text-xs font-bold text-white">{academic.university || 'Unmapped Location'}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-0.5">
                        <p className="text-[10px] font-bold text-[#80848E] uppercase tracking-tighter">Sector</p>
                        <p className="text-xs font-bold text-white">{academic.field_of_study || 'N/A'}</p>
                    </div>
                    <div className="space-y-0.5">
                        <p className="text-[10px] font-bold text-[#80848E] uppercase tracking-tighter">Level / Year</p>
                        <p className="text-xs font-bold text-white">{academic.year_of_study || 'N/A'}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export const NeuralMatrix = ({ skills }) => (
    <div className="space-y-4">
        <div className="h-[1px] w-full bg-white/5"></div>
        <div>
            <SectionHeader>Neural Capabilities (Skills)</SectionHeader>
            <div className="flex flex-wrap gap-1.5 pt-1">
                {skills?.length > 0 ? skills.map((skill, index) => {
                    const name = typeof skill === 'object' ? skill.name : skill;
                    const id = typeof skill === 'object' ? (skill.id || index) : index;
                    return (
                        <span key={id} className="px-2 py-1 bg-black/20 rounded border border-white/5 text-[10px] font-bold text-[#DBDEE1] hover:text-white transition-colors">
                            {name}
                        </span>
                    );
                }) : (
                    <p className="text-[10px] italic text-zinc-500 font-medium">Matrix currently offline.</p>
                )}
            </div>
        </div>
    </div>
);
