
import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Github, Globe } from 'lucide-react';
import { PersonalInfo, ColorTheme } from '@/types/resume';

interface PersonalInfoHeaderProps {
  personalInfo: PersonalInfo;
  theme: ColorTheme;
}

const PersonalInfoHeader: React.FC<PersonalInfoHeaderProps> = ({ personalInfo, theme }) => {
  return (
    <div className="bg-gray-50 px-12 py-10 border-b-2" style={{ borderColor: theme.primary }}>
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold tracking-tight mb-3" style={{ color: theme.text }}>
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        <div className="w-24 h-1 mx-auto mb-4" style={{ backgroundColor: theme.primary }}></div>
      </div>
      
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          {personalInfo.email && (
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: theme.primary }}>
                <Mail className="h-4 w-4 text-white" />
              </div>
              <span className="font-medium" style={{ color: theme.text }}>{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: theme.primary }}>
                <Phone className="h-4 w-4 text-white" />
              </div>
              <span className="font-medium" style={{ color: theme.text }}>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.location && (
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: theme.primary }}>
                <MapPin className="h-4 w-4 text-white" />
              </div>
              <span className="font-medium" style={{ color: theme.text }}>{personalInfo.location}</span>
            </div>
          )}
          {personalInfo.linkedin && (
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: theme.primary }}>
                <Linkedin className="h-4 w-4 text-white" />
              </div>
              <span className="font-medium truncate max-w-40" style={{ color: theme.text }}>{personalInfo.linkedin}</span>
            </div>
          )}
          {personalInfo.github && (
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: theme.primary }}>
                <Github className="h-4 w-4 text-white" />
              </div>
              <span className="font-medium truncate max-w-40" style={{ color: theme.text }}>{personalInfo.github}</span>
            </div>
          )}
          {personalInfo.website && (
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: theme.primary }}>
                <Globe className="h-4 w-4 text-white" />
              </div>
              <span className="font-medium truncate max-w-40" style={{ color: theme.text }}>{personalInfo.website}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoHeader;
