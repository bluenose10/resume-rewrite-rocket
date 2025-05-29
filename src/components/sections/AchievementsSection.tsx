
import React from 'react';
import ResumeSection from '../ResumeSection';
import { ResumeData, ColorTheme } from '@/types/resume';
import { formatDate } from '@/utils/resumeHelpers';

interface AchievementsSectionProps {
  data: ResumeData;
  theme: ColorTheme;
}

const AchievementsSection: React.FC<AchievementsSectionProps> = ({ data, theme }) => {
  return (
    <ResumeSection title="Achievements & Awards" theme={theme}>
      <div className="space-y-2">
        {data.achievements.map((achievement) => (
          <div key={achievement.id}>
            <div className="flex justify-between items-start mb-1">
              <h3 className="text-sm font-semibold" style={{ color: theme.text }}>
                {achievement.title}
              </h3>
              <div className="text-sm" style={{ color: theme.text }}>
                {formatDate(achievement.date)}
              </div>
            </div>
            <p className="text-sm mb-1" style={{ color: theme.text }}>
              {achievement.organization}
            </p>
            {achievement.description && (
              <p className="text-sm leading-normal" style={{ color: theme.text }}>
                {achievement.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </ResumeSection>
  );
};

export default AchievementsSection;
