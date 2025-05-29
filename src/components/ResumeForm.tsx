import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ColorThemeSelector from './ColorThemeSelector';
import { ResumeData, ColorTheme, PersonalInfo, Experience, Education, Project, Achievement, Certification, Language, VolunteerExperience, Reference, Publication } from '@/types/resume';
import { DEFAULT_THEMES } from '@/constants/themes';

interface ResumeFormProps {
  onDataChange: (data: ResumeData) => void;
  onOptimize: () => void;
  isOptimizing: boolean;
}

const ResumeForm: React.FC<ResumeFormProps> = ({ onDataChange, onOptimize, isOptimizing }) => {
  const { toast } = useToast();
  
  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      github: '',
      website: ''
    },
    personalStatement: '',
    summary: '',
    experience: [],
    education: [],
    projects: [],
    skills: [],
    achievements: [],
    certifications: [],
    languages: [],
    volunteerExperience: [],
    references: [],
    publications: [],
    interests: [],
    theme: DEFAULT_THEMES[1]
  });

  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');

  const updateData = (updates: Partial<ResumeData>) => {
    const updated = { ...resumeData, ...updates };
    setResumeData(updated);
    onDataChange(updated);
  };

  const updatePersonalInfo = (field: keyof PersonalInfo, value: string) => {
    updateData({
      personalInfo: { ...resumeData.personalInfo, [field]: value }
    });
  };

  const updatePersonalStatement = (value: string) => {
    updateData({ personalStatement: value });
  };

  const updateSummary = (value: string) => {
    updateData({ summary: value });
  };

  const updateTheme = (theme: ColorTheme) => {
    updateData({ theme });
  };

  const addExperience = () => {
    const newExp: Experience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    };
    const updated = {
      ...resumeData,
      experience: [...resumeData.experience, newExp]
    };
    setResumeData(updated);
    onDataChange(updated);
  };

  const updateExperience = (id: string, field: keyof Experience, value: string | boolean) => {
    const updated = {
      ...resumeData,
      experience: resumeData.experience.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    };
    setResumeData(updated);
    onDataChange(updated);
  };

  const removeExperience = (id: string) => {
    const updated = {
      ...resumeData,
      experience: resumeData.experience.filter(exp => exp.id !== id)
    };
    setResumeData(updated);
    onDataChange(updated);
  };

  const addEducation = () => {
    const newEdu: Education = {
      id: Date.now().toString(),
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      gpa: ''
    };
    const updated = {
      ...resumeData,
      education: [...resumeData.education, newEdu]
    };
    setResumeData(updated);
    onDataChange(updated);
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    const updated = {
      ...resumeData,
      education: resumeData.education.map(edu => 
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    };
    setResumeData(updated);
    onDataChange(updated);
  };

  const removeEducation = (id: string) => {
    const updated = {
      ...resumeData,
      education: resumeData.education.filter(edu => edu.id !== id)
    };
    setResumeData(updated);
    onDataChange(updated);
  };

  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: '',
      description: '',
      technologies: '',
      link: ''
    };
    const updated = {
      ...resumeData,
      projects: [...resumeData.projects, newProject]
    };
    setResumeData(updated);
    onDataChange(updated);
  };

  const updateProject = (id: string, field: keyof Project, value: string) => {
    const updated = {
      ...resumeData,
      projects: resumeData.projects.map(proj => 
        proj.id === id ? { ...proj, [field]: value } : proj
      )
    };
    setResumeData(updated);
    onDataChange(updated);
  };

  const removeProject = (id: string) => {
    const updated = {
      ...resumeData,
      projects: resumeData.projects.filter(proj => proj.id !== id)
    };
    setResumeData(updated);
    onDataChange(updated);
  };

  const addAchievement = () => {
    const newAchievement: Achievement = {
      id: Date.now().toString(),
      title: '',
      description: '',
      date: '',
      organization: ''
    };
    updateData({ achievements: [...resumeData.achievements, newAchievement] });
  };

  const updateAchievement = (id: string, field: keyof Achievement, value: string) => {
    updateData({
      achievements: resumeData.achievements.map(achievement => 
        achievement.id === id ? { ...achievement, [field]: value } : achievement
      )
    });
  };

  const removeAchievement = (id: string) => {
    updateData({
      achievements: resumeData.achievements.filter(achievement => achievement.id !== id)
    });
  };

  const addCertification = () => {
    const newCert: Certification = {
      id: Date.now().toString(),
      name: '',
      issuer: '',
      date: '',
      expiryDate: '',
      credentialId: ''
    };
    updateData({ certifications: [...resumeData.certifications, newCert] });
  };

  const updateCertification = (id: string, field: keyof Certification, value: string) => {
    updateData({
      certifications: resumeData.certifications.map(cert => 
        cert.id === id ? { ...cert, [field]: value } : cert
      )
    });
  };

  const removeCertification = (id: string) => {
    updateData({
      certifications: resumeData.certifications.filter(cert => cert.id !== id)
    });
  };

  const addLanguage = () => {
    const newLang: Language = {
      id: Date.now().toString(),
      language: '',
      proficiency: 'Intermediate'
    };
    updateData({ languages: [...resumeData.languages, newLang] });
  };

  const updateLanguage = (id: string, field: keyof Language, value: string) => {
    updateData({
      languages: resumeData.languages.map(lang => 
        lang.id === id ? { ...lang, [field]: value } : lang
      )
    });
  };

  const removeLanguage = (id: string) => {
    updateData({
      languages: resumeData.languages.filter(lang => lang.id !== id)
    });
  };

  const addVolunteerExperience = () => {
    const newVol: VolunteerExperience = {
      id: Date.now().toString(),
      organization: '',
      role: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    };
    updateData({ volunteerExperience: [...resumeData.volunteerExperience, newVol] });
  };

  const updateVolunteerExperience = (id: string, field: keyof VolunteerExperience, value: string | boolean) => {
    updateData({
      volunteerExperience: resumeData.volunteerExperience.map(vol => 
        vol.id === id ? { ...vol, [field]: value } : vol
      )
    });
  };

  const removeVolunteerExperience = (id: string) => {
    updateData({
      volunteerExperience: resumeData.volunteerExperience.filter(vol => vol.id !== id)
    });
  };

  const addReference = () => {
    const newRef: Reference = {
      id: Date.now().toString(),
      name: '',
      title: '',
      company: '',
      email: '',
      phone: '',
      relationship: ''
    };
    updateData({ references: [...resumeData.references, newRef] });
  };

  const updateReference = (id: string, field: keyof Reference, value: string) => {
    updateData({
      references: resumeData.references.map(ref => 
        ref.id === id ? { ...ref, [field]: value } : ref
      )
    });
  };

  const removeReference = (id: string) => {
    updateData({
      references: resumeData.references.filter(ref => ref.id !== id)
    });
  };

  const addPublication = () => {
    const newPub: Publication = {
      id: Date.now().toString(),
      title: '',
      authors: '',
      publication: '',
      date: '',
      link: ''
    };
    updateData({ publications: [...resumeData.publications, newPub] });
  };

  const updatePublication = (id: string, field: keyof Publication, value: string) => {
    updateData({
      publications: resumeData.publications.map(pub => 
        pub.id === id ? { ...pub, [field]: value } : pub
      )
    });
  };

  const removePublication = (id: string) => {
    updateData({
      publications: resumeData.publications.filter(pub => pub.id !== id)
    });
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      updateData({ skills: [...resumeData.skills, newSkill.trim()] });
      setNewSkill('');
    }
  };

  const removeSkill = (index: number) => {
    updateData({ skills: resumeData.skills.filter((_, i) => i !== index) });
  };

  const addInterest = () => {
    if (newInterest.trim()) {
      updateData({ interests: [...resumeData.interests, newInterest.trim()] });
      setNewInterest('');
    }
  };

  const removeInterest = (index: number) => {
    updateData({ interests: resumeData.interests.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Color Theme Selection */}
      <ColorThemeSelector
        selectedTheme={resumeData.theme || DEFAULT_THEMES[1]}
        onThemeChange={updateTheme}
      />

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
                value={resumeData.personalInfo.firstName}
                onChange={(e) => updatePersonalInfo('firstName', e.target.value)}
                placeholder="John"
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={resumeData.personalInfo.lastName}
                onChange={(e) => updatePersonalInfo('lastName', e.target.value)}
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
                value={resumeData.personalInfo.email}
                onChange={(e) => updatePersonalInfo('email', e.target.value)}
                placeholder="john@example.com"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={resumeData.personalInfo.phone}
                onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                placeholder="(555) 123-4567"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={resumeData.personalInfo.location}
              onChange={(e) => updatePersonalInfo('location', e.target.value)}
              placeholder="New York, NY"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                value={resumeData.personalInfo.linkedin}
                onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                placeholder="linkedin.com/in/johndoe"
              />
            </div>
            <div>
              <Label htmlFor="github">GitHub</Label>
              <Input
                id="github"
                value={resumeData.personalInfo.github}
                onChange={(e) => updatePersonalInfo('github', e.target.value)}
                placeholder="github.com/johndoe"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="website">Website/Portfolio</Label>
            <Input
              id="website"
              value={resumeData.personalInfo.website}
              onChange={(e) => updatePersonalInfo('website', e.target.value)}
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
            value={resumeData.personalStatement}
            onChange={(e) => updatePersonalStatement(e.target.value)}
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
            value={resumeData.summary}
            onChange={(e) => updateSummary(e.target.value)}
            placeholder="Write a brief summary of your professional background and key achievements..."
            className="min-h-[120px]"
          />
        </CardContent>
      </Card>

      {/* Experience */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-xl">Work Experience</CardTitle>
          <Button onClick={addExperience} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Experience
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {resumeData.experience.map((exp, index) => (
            <div key={exp.id} className="space-y-4 p-4 border rounded-lg">
              <div className="flex justify-between items-start">
                <h4 className="font-medium">Experience {index + 1}</h4>
                <Button
                  onClick={() => removeExperience(exp.id)}
                  variant="ghost"
                  size="sm"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Company</Label>
                  <Input
                    value={exp.company}
                    onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                    placeholder="Company Name"
                  />
                </div>
                <div>
                  <Label>Position</Label>
                  <Input
                    value={exp.position}
                    onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                    placeholder="Job Title"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Start Date</Label>
                  <Input
                    type="month"
                    value={exp.startDate}
                    onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                  />
                </div>
                <div>
                  <Label>End Date</Label>
                  <Input
                    type="month"
                    value={exp.endDate}
                    onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                    disabled={exp.current}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`current-${exp.id}`}
                  checked={exp.current}
                  onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                />
                <Label htmlFor={`current-${exp.id}`}>Currently working here</Label>
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  value={exp.description}
                  onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                  placeholder="Describe your role, responsibilities, and achievements..."
                  className="min-h-[100px]"
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Education */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-xl">Education</CardTitle>
          <Button onClick={addEducation} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Education
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {resumeData.education.map((edu, index) => (
            <div key={edu.id} className="space-y-4 p-4 border rounded-lg">
              <div className="flex justify-between items-start">
                <h4 className="font-medium">Education {index + 1}</h4>
                <Button
                  onClick={() => removeEducation(edu.id)}
                  variant="ghost"
                  size="sm"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div>
                <Label>Institution</Label>
                <Input
                  value={edu.institution}
                  onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                  placeholder="University Name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Degree</Label>
                  <Input
                    value={edu.degree}
                    onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                    placeholder="Bachelor's, Master's, etc."
                  />
                </div>
                <div>
                  <Label>Field of Study</Label>
                  <Input
                    value={edu.field}
                    onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                    placeholder="Computer Science, Engineering, etc."
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Start Date</Label>
                  <Input
                    type="month"
                    value={edu.startDate}
                    onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                  />
                </div>
                <div>
                  <Label>End Date</Label>
                  <Input
                    type="month"
                    value={edu.endDate}
                    onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                  />
                </div>
                <div>
                  <Label>GPA (Optional)</Label>
                  <Input
                    value={edu.gpa}
                    onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                    placeholder="3.8"
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Projects */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-xl">Projects</CardTitle>
          <Button onClick={addProject} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Project
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {resumeData.projects.map((project, index) => (
            <div key={project.id} className="space-y-4 p-4 border rounded-lg">
              <div className="flex justify-between items-start">
                <h4 className="font-medium">Project {index + 1}</h4>
                <Button
                  onClick={() => removeProject(project.id)}
                  variant="ghost"
                  size="sm"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div>
                <Label>Project Name</Label>
                <Input
                  value={project.name}
                  onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                  placeholder="Project Name"
                />
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  value={project.description}
                  onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                  placeholder="Describe what the project does and your role in it..."
                  className="min-h-[80px]"
                />
              </div>

              <div>
                <Label>Technologies Used</Label>
                <Input
                  value={project.technologies}
                  onChange={(e) => updateProject(project.id, 'technologies', e.target.value)}
                  placeholder="React, Node.js, MongoDB, etc."
                />
              </div>

              <div>
                <Label>Project Link (Optional)</Label>
                <Input
                  value={project.link}
                  onChange={(e) => updateProject(project.id, 'link', e.target.value)}
                  placeholder="https://github.com/username/project"
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Achievements & Awards */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-xl">Achievements & Awards</CardTitle>
          <Button onClick={addAchievement} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Achievement
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {resumeData.achievements.map((achievement, index) => (
            <div key={achievement.id} className="space-y-4 p-4 border rounded-lg">
              <div className="flex justify-between items-start">
                <h4 className="font-medium">Achievement {index + 1}</h4>
                <Button onClick={() => removeAchievement(achievement.id)} variant="ghost" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Award/Achievement Title</Label>
                  <Input
                    value={achievement.title}
                    onChange={(e) => updateAchievement(achievement.id, 'title', e.target.value)}
                    placeholder="Employee of the Year"
                  />
                </div>
                <div>
                  <Label>Organization</Label>
                  <Input
                    value={achievement.organization}
                    onChange={(e) => updateAchievement(achievement.id, 'organization', e.target.value)}
                    placeholder="Company Name"
                  />
                </div>
              </div>

              <div>
                <Label>Date</Label>
                <Input
                  type="month"
                  value={achievement.date}
                  onChange={(e) => updateAchievement(achievement.id, 'date', e.target.value)}
                />
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  value={achievement.description}
                  onChange={(e) => updateAchievement(achievement.id, 'description', e.target.value)}
                  placeholder="Describe the achievement and its significance..."
                  className="min-h-[80px]"
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Certifications & Licenses */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-xl">Certifications & Licenses</CardTitle>
          <Button onClick={addCertification} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Certification
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {resumeData.certifications.map((cert, index) => (
            <div key={cert.id} className="space-y-4 p-4 border rounded-lg">
              <div className="flex justify-between items-start">
                <h4 className="font-medium">Certification {index + 1}</h4>
                <Button onClick={() => removeCertification(cert.id)} variant="ghost" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Certification Name</Label>
                  <Input
                    value={cert.name}
                    onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
                    placeholder="AWS Solutions Architect"
                  />
                </div>
                <div>
                  <Label>Issuing Organization</Label>
                  <Input
                    value={cert.issuer}
                    onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)}
                    placeholder="Amazon Web Services"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Issue Date</Label>
                  <Input
                    type="month"
                    value={cert.date}
                    onChange={(e) => updateCertification(cert.id, 'date', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Expiry Date (Optional)</Label>
                  <Input
                    type="month"
                    value={cert.expiryDate}
                    onChange={(e) => updateCertification(cert.id, 'expiryDate', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Credential ID (Optional)</Label>
                  <Input
                    value={cert.credentialId}
                    onChange={(e) => updateCertification(cert.id, 'credentialId', e.target.value)}
                    placeholder="ABC123DEF456"
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Languages */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-xl">Languages</CardTitle>
          <Button onClick={addLanguage} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Language
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {resumeData.languages.map((lang, index) => (
            <div key={lang.id} className="space-y-4 p-4 border rounded-lg">
              <div className="flex justify-between items-start">
                <h4 className="font-medium">Language {index + 1}</h4>
                <Button onClick={() => removeLanguage(lang.id)} variant="ghost" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Language</Label>
                  <Input
                    value={lang.language}
                    onChange={(e) => updateLanguage(lang.id, 'language', e.target.value)}
                    placeholder="Spanish, French, German, etc."
                  />
                </div>
                <div>
                  <Label>Proficiency Level</Label>
                  <Select
                    value={lang.proficiency}
                    onValueChange={(value) => updateLanguage(lang.id, 'proficiency', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                      <SelectItem value="Fluent">Fluent</SelectItem>
                      <SelectItem value="Native">Native</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Volunteer Experience */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-xl">Volunteer Experience</CardTitle>
          <Button onClick={addVolunteerExperience} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Volunteer Work
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {resumeData.volunteerExperience.map((vol, index) => (
            <div key={vol.id} className="space-y-4 p-4 border rounded-lg">
              <div className="flex justify-between items-start">
                <h4 className="font-medium">Volunteer Experience {index + 1}</h4>
                <Button onClick={() => removeVolunteerExperience(vol.id)} variant="ghost" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Organization</Label>
                  <Input
                    value={vol.organization}
                    onChange={(e) => updateVolunteerExperience(vol.id, 'organization', e.target.value)}
                    placeholder="Non-profit Organization"
                  />
                </div>
                <div>
                  <Label>Role/Position</Label>
                  <Input
                    value={vol.role}
                    onChange={(e) => updateVolunteerExperience(vol.id, 'role', e.target.value)}
                    placeholder="Volunteer Coordinator"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Start Date</Label>
                  <Input
                    type="month"
                    value={vol.startDate}
                    onChange={(e) => updateVolunteerExperience(vol.id, 'startDate', e.target.value)}
                  />
                </div>
                <div>
                  <Label>End Date</Label>
                  <Input
                    type="month"
                    value={vol.endDate}
                    onChange={(e) => updateVolunteerExperience(vol.id, 'endDate', e.target.value)}
                    disabled={vol.current}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`vol-current-${vol.id}`}
                  checked={vol.current}
                  onChange={(e) => updateVolunteerExperience(vol.id, 'current', e.target.checked)}
                />
                <Label htmlFor={`vol-current-${vol.id}`}>Currently volunteering here</Label>
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  value={vol.description}
                  onChange={(e) => updateVolunteerExperience(vol.id, 'description', e.target.value)}
                  placeholder="Describe your volunteer work and achievements..."
                  className="min-h-[100px]"
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Publications */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-xl">Publications</CardTitle>
          <Button onClick={addPublication} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Publication
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {resumeData.publications.map((pub, index) => (
            <div key={pub.id} className="space-y-4 p-4 border rounded-lg">
              <div className="flex justify-between items-start">
                <h4 className="font-medium">Publication {index + 1}</h4>
                <Button onClick={() => removePublication(pub.id)} variant="ghost" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div>
                <Label>Title</Label>
                <Input
                  value={pub.title}
                  onChange={(e) => updatePublication(pub.id, 'title', e.target.value)}
                  placeholder="Research Paper Title"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Authors</Label>
                  <Input
                    value={pub.authors}
                    onChange={(e) => updatePublication(pub.id, 'authors', e.target.value)}
                    placeholder="Smith, J., Doe, J."
                  />
                </div>
                <div>
                  <Label>Publication/Journal</Label>
                  <Input
                    value={pub.publication}
                    onChange={(e) => updatePublication(pub.id, 'publication', e.target.value)}
                    placeholder="Journal of Computer Science"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Publication Date</Label>
                  <Input
                    type="month"
                    value={pub.date}
                    onChange={(e) => updatePublication(pub.id, 'date', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Link/DOI (Optional)</Label>
                  <Input
                    value={pub.link}
                    onChange={(e) => updatePublication(pub.id, 'link', e.target.value)}
                    placeholder="https://doi.org/10.1000/xyz123"
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* References */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-xl">References</CardTitle>
          <Button onClick={addReference} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Reference
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {resumeData.references.map((ref, index) => (
            <div key={ref.id} className="space-y-4 p-4 border rounded-lg">
              <div className="flex justify-between items-start">
                <h4 className="font-medium">Reference {index + 1}</h4>
                <Button onClick={() => removeReference(ref.id)} variant="ghost" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Full Name</Label>
                  <Input
                    value={ref.name}
                    onChange={(e) => updateReference(ref.id, 'name', e.target.value)}
                    placeholder="John Smith"
                  />
                </div>
                <div>
                  <Label>Job Title</Label>
                  <Input
                    value={ref.title}
                    onChange={(e) => updateReference(ref.id, 'title', e.target.value)}
                    placeholder="Senior Manager"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Company</Label>
                  <Input
                    value={ref.company}
                    onChange={(e) => updateReference(ref.id, 'company', e.target.value)}
                    placeholder="Company Name"
                  />
                </div>
                <div>
                  <Label>Relationship</Label>
                  <Input
                    value={ref.relationship}
                    onChange={(e) => updateReference(ref.id, 'relationship', e.target.value)}
                    placeholder="Former Supervisor"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={ref.email}
                    onChange={(e) => updateReference(ref.id, 'email', e.target.value)}
                    placeholder="john@company.com"
                  />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input
                    value={ref.phone}
                    onChange={(e) => updateReference(ref.id, 'phone', e.target.value)}
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Skills */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Technical Skills</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add a skill..."
              onKeyDown={(e) => e.key === 'Enter' && addSkill()}
            />
            <Button onClick={addSkill} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {resumeData.skills.map((skill, index) => (
              <div
                key={index}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
              >
                {skill}
                <button
                  onClick={() => removeSkill(index)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Interests & Hobbies */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Interests & Hobbies</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              placeholder="Add an interest..."
              onKeyDown={(e) => e.key === 'Enter' && addInterest()}
            />
            <Button onClick={addInterest} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {resumeData.interests.map((interest, index) => (
              <div
                key={index}
                className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
              >
                {interest}
                <button
                  onClick={() => removeInterest(index)}
                  className="text-green-600 hover:text-green-800"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Optimize Button */}
      <Card>
        <CardContent className="pt-6">
          <Button 
            onClick={onOptimize} 
            disabled={isOptimizing}
            className="w-full"
            size="lg"
          >
            <Wand2 className="h-4 w-4 mr-2" />
            {isOptimizing ? 'Optimizing Resume...' : 'Optimize Resume with AI'}
          </Button>
          <p className="text-sm text-gray-600 mt-2 text-center">
            Our AI will enhance your content for better ATS compatibility and impact
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResumeForm;
