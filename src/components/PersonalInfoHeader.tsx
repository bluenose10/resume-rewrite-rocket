
import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Github, Globe } from 'lucide-react';
import { PersonalInfo, ColorTheme } from '@/types/resume';

interface PersonalInfoHeaderProps {
  personalInfo: PersonalInfo;
  theme: ColorTheme;
}

const PersonalInfoHeader: React.FC<PersonalInfoHeaderProps> = ({ personalInfo, theme }) => {
  return (
    <div className="px-8 py-6 text-center">
      <h1 className="text-2xl font-bold tracking-wide mb-3" style={{ color: theme.text }}>
        {personalInfo.firstName} {personalInfo.lastName}
      </h1>
      
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm" style={{ color: theme.text }}>
        {personalInfo.email && (
          <div className="flex items-center gap-1">
            <Mail className="h-3 w-3" style={{ color: theme.primary }} />
            <span>{personalInfo.email}</span>
          </div>
        )}
        {personalInfo.phone && (
          <div className="flex items-center gap-1">
            <Phone className="h-3 w-3" style={{ color: theme.primary }} />
            <span>{personalInfo.phone}</span>
          </div>
        )}
        {personalInfo.location && (
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" style={{ color: theme.primary }} />
            <span>{personalInfo.location}</span>
          </div>
        )}
        {personalInfo.linkedin && (
          <div className="flex items-center gap-1">
            <Linkedin className="h-3 w-3" style={{ color: theme.primary }} />
            <span className="truncate max-w-36">{personalInfo.linkedin}</span>
          </div>
        )}
        {personalInfo.github && (
          <div className="flex items-center gap-1">
            <Github className="h-3 w-3" style={{ color: theme.primary }} />
            <span className="truncate max-w-36">{personalInfo.github}</span>
          </div>
        )}
        {personalInfo.website && (
          <div className="flex items-center gap-1">
            <Globe className="h-3 w-3" style={{ color: theme.primary }} />
            <span className="truncate max-w-36">{personalInfo.website}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalInfoHeader;
