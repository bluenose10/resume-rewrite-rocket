
import React, { useState } from 'react';
import ErrorBoundary from '@/components/ErrorBoundary';
import HomePage from '@/components/home/HomePage';
import ResumeBuilder from '@/components/home/ResumeBuilder';
import { ResumeDataProvider, useResumeData } from '@/contexts/ResumeDataContext';

const IndexContent = () => {
  const [showBuilder, setShowBuilder] = useState(false);
  const {
    resumeData,
    isOptimizing,
    handleDataChange,
    handleSectionReorder,
    handleToggleVisibility,
    handleResetLayout,
    handleOptimize
  } = useResumeData();

  if (showBuilder) {
    return (
      <ResumeBuilder
        resumeData={resumeData}
        isOptimizing={isOptimizing}
        onBack={() => setShowBuilder(false)}
        onDataChange={handleDataChange}
        onSectionReorder={handleSectionReorder}
        onToggleVisibility={handleToggleVisibility}
        onResetLayout={handleResetLayout}
        onOptimize={handleOptimize}
      />
    );
  }

  return <HomePage onStartBuilding={() => setShowBuilder(true)} />;
};

const Index = () => {
  return (
    <ErrorBoundary>
      <ResumeDataProvider>
        <IndexContent />
      </ResumeDataProvider>
    </ErrorBoundary>
  );
};

export default Index;
