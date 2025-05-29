
import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Github, Globe } from 'lucide-react';
import { PersonalInfo, ColorTheme } from '@/types/resume';

interface PersonalInfoHeaderProps {
  personalInfo: PersonalInfo;
  theme: ColorTheme;
}

const PersonalInfoHeader: React.FC<PersonalInfoHeaderProps> = ({ personalInfo, theme }) => {
  return (
    <div className="px-8 py-8 border-b border-gray-200">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold tracking-tight mb-2" style={{ color: theme.text }}>
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
      </div>
      
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm" style={{ color: theme.text }}>
        {personalInfo.email && (
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4" style={{ color: theme.primary }} />
            <span>{personalInfo.email}</span>
          </div>
        )}
        {personalInfo.phone && (
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4" style={{ color: theme.primary }} />
            <span>{personalInfo.phone}</span>
          </div>
        )}
        {personalInfo.location && (
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" style={{ color: theme.primary }} />
            <span>{personalInfo.location}</span>
          </div>
        )}
        {personalInfo.linkedin && (
          <div className="flex items-center gap-2">
            <Linkedin className="h-4 w-4" style={{ color: theme.primary }} />
            <span className="truncate max-w-40">{personalInfo.linkedin}</span>
          </div>
        )}
        {personalInfo.github && (
          <div className="flex items-center gap-2">
            <Github className="h-4 w-4" style={{ color: theme.primary }} />
            <span className="truncate max-w-40">{personalInfo.github}</span>
          </div>
        )}
        {personalInfo.website && (
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4" style={{ color: theme.primary }} />
            <span className="truncate max-w-40">{personalInfo.website}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalInfoHeader;
