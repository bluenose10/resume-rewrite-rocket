
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { PersonalInfo } from '@/types/resume';

interface PersonalInfoFormProps {
  personalInfo: PersonalInfo;
  personalStatement: string;
  summary: string;
  onPersonalInfoChange: (field: keyof PersonalInfo, value: string) => void;
  onPersonalStatementChange: (value: string) => void;
  onSummaryChange: (value: string) => void;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
  personalInfo,
  personalStatement,
  summary,
  onPersonalInfoChange,
  onPersonalStatementChange,
  onSummaryChange
}) => {
  return (
    <>
      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={personalInfo.firstName}
                onChange={(e) => onPersonalInfoChange('firstName', e.target.value)}
                placeholder="John"
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={personalInfo.lastName}
                onChange={(e) => onPersonalInfoChange('lastName', e.target.value)}
                placeholder="Doe"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={personalInfo.email}
                onChange={(e) => onPersonalInfoChange('email', e.target.value)}
                placeholder="john@example.com"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={personalInfo.phone}
                onChange={(e) => onPersonalInfoChange('phone', e.target.value)}
                placeholder="(555) 123-4567"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={personalInfo.location}
              onChange={(e) => onPersonalInfoChange('location', e.target.value)}
              placeholder="New York, NY"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                value={personalInfo.linkedin}
                onChange={(e) => onPersonalInfoChange('linkedin', e.target.value)}
                placeholder="linkedin.com/in/johndoe"
              />
            </div>
            <div>
              <Label htmlFor="github">GitHub</Label>
              <Input
                id="github"
                value={personalInfo.github}
                onChange={(e) => onPersonalInfoChange('github', e.target.value)}
                placeholder="github.com/johndoe"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="website">Website/Portfolio</Label>
            <Input
              id="website"
              value={personalInfo.website}
              onChange={(e) => onPersonalInfoChange('website', e.target.value)}
              placeholder="www.johndoe.com"
            />
          </div>
        </CardContent>
      </Card>

      {/* Personal Statement */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Personal Statement</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={personalStatement}
            onChange={(e) => onPersonalStatementChange(e.target.value)}
            placeholder="Write a compelling personal statement that highlights your career objectives and key strengths..."
            className="min-h-[100px]"
          />
        </CardContent>
      </Card>

      {/* Professional Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Professional Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={summary}
            onChange={(e) => onSummaryChange(e.target.value)}
            placeholder="Write a brief summary of your professional background and key achievements..."
            className="min-h-[120px]"
          />
        </CardContent>
      </Card>
    </>
  );
};

export default PersonalInfoForm;
