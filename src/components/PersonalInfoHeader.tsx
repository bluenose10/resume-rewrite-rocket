
import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Github, Globe } from 'lucide-react';
import { PersonalInfo, ColorTheme } from '@/types/resume';

interface PersonalInfoHeaderProps {
  personalInfo: PersonalInfo;
  theme: ColorTheme;
}

const PersonalInfoHeader: React.FC<PersonalInfoHeaderProps> = ({ personalInfo, theme }) => {
  return (
    <div className="bg-white px-8 py-6">
      {/* Name - left aligned, large but not excessive */}
      <h1 className="text-2xl font-bold mb-3" style={{ color: theme.text }}>
        {personalInfo.firstName} {personalInfo.lastName}
      </h1>
      
      {/* Contact Information - horizontal layout */}
      <div className="text-sm mb-2" style={{ color: theme.text }}>
        <div className="flex flex-wrap items-center gap-1">
          {personalInfo.email && (
            <>
              <span>{personalInfo.email}</span>
              {(personalInfo.phone || personalInfo.location) && <span className="mx-2">|</span>}
            </>
          )}
          {personalInfo.phone && (
            <>
              <span>{personalInfo.phone}</span>
              {personalInfo.location && <span className="mx-2">|</span>}
            </>
          )}
          {personalInfo.location && (
            <span>{personalInfo.location}</span>
          )}
        </div>
      </div>

      {/* Website/Portfolio Links */}
      {(personalInfo.linkedin || personalInfo.github || personalInfo.website) && (
        <div className="text-sm mb-3" style={{ color: theme.text }}>
          <div className="flex flex-wrap items-center gap-1">
            {personalInfo.linkedin && (
              <>
                <span>{personalInfo.linkedin}</span>
                {(personalInfo.github || personalInfo.website) && <span className="mx-2">|</span>}
              </>
            )}
            {personalInfo.github && (
              <>
                <span>{personalInfo.github}</span>
                {personalInfo.website && <span className="mx-2">|</span>}
              </>
            )}
            {personalInfo.website && (
              <span>{personalInfo.website}</span>
            )}
          </div>
        </div>
      )}

      {/* Clean horizontal separator */}
      <div className="w-full h-px bg-gray-300"></div>
    </div>
  );
};

export default PersonalInfoHeader;
