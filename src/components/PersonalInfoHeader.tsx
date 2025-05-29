
import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Github, Globe } from 'lucide-react';
import { PersonalInfo, ColorTheme } from '@/types/resume';

interface PersonalInfoHeaderProps {
  personalInfo: PersonalInfo;
  theme: ColorTheme;
}

const PersonalInfoHeader: React.FC<PersonalInfoHeaderProps> = ({ personalInfo, theme }) => {
  return (
    <div className="bg-white px-8 py-6 border-b" style={{ borderColor: theme.primary }}>
      <div className="text-center mb-4">
        <h1 className="text-3xl font-bold mb-2" style={{ color: theme.text }}>
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        <div className="w-16 h-0.5 mx-auto" style={{ backgroundColor: theme.primary }}></div>
      </div>
      
      <div className="max-w-3xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
          {personalInfo.email && (
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <Mail className="h-3 w-3" style={{ color: theme.primary }} />
              <span style={{ color: theme.text }}>{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <Phone className="h-3 w-3" style={{ color: theme.primary }} />
              <span style={{ color: theme.text }}>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.location && (
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <MapPin className="h-3 w-3" style={{ color: theme.primary }} />
              <span style={{ color: theme.text }}>{personalInfo.location}</span>
            </div>
          )}
          {personalInfo.linkedin && (
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <Linkedin className="h-3 w-3" style={{ color: theme.primary }} />
              <span className="truncate max-w-40" style={{ color: theme.text }}>{personalInfo.linkedin}</span>
            </div>
          )}
          {personalInfo.github && (
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <Github className="h-3 w-3" style={{ color: theme.primary }} />
              <span className="truncate max-w-40" style={{ color: theme.text }}>{personalInfo.github}</span>
            </div>
          )}
          {personalInfo.website && (
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <Globe className="h-3 w-3" style={{ color: theme.primary }} />
              <span className="truncate max-w-40" style={{ color: theme.text }}>{personalInfo.website}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoHeader;
