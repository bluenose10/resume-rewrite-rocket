
import React, { useState } from 'react';
import ErrorBoundary from '@/components/ErrorBoundary';
import HomePage from '@/components/home/HomePage';
import ResumeBuilder from '@/components/home/ResumeBuilder';
import { ResumeDataProvider } from '@/contexts/ResumeDataContext';

const IndexContent = () => {
  const [showBuilder, setShowBuilder] = useState(false);

  if (showBuilder) {
    return <ResumeBuilder />;
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
