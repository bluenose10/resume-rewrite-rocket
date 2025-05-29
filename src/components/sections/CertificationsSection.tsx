
import React from 'react';
import ResumeSection from '../ResumeSection';
import { ResumeData, ColorTheme } from '@/types/resume';
import { formatDate } from '@/utils/resumeHelpers';

interface CertificationsSectionProps {
  data: ResumeData;
  theme: ColorTheme;
}

const CertificationsSection: React.FC<CertificationsSectionProps> = ({ data, theme }) => {
  return (
    <ResumeSection title="Certifications & Licenses" theme={theme}>
      <div className="space-y-2">
        {data.certifications.map((cert) => (
          <div key={cert.id} className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-sm font-semibold" style={{ color: theme.text }}>
                {cert.name}
              </h3>
              <p className="text-sm" style={{ color: theme.text }}>
                {cert.issuer}
              </p>
              {cert.credentialId && (
                <p className="text-sm" style={{ color: theme.text }}>
                  Credential ID: {cert.credentialId}
                </p>
              )}
            </div>
            <div className="text-sm text-right">
              <div style={{ color: theme.text }}>
                {formatDate(cert.date)}
              </div>
              {cert.expiryDate && (
                <div style={{ color: theme.text }}>
                  Expires: {formatDate(cert.expiryDate)}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </ResumeSection>
  );
};

export default CertificationsSection;
