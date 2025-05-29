
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { ColorPicker } from 'lucide-react';
import { ColorTheme } from '@/types/resume';
import { DEFAULT_THEMES } from '@/constants/themes';

interface ColorThemeSelectorProps {
  selectedTheme: ColorTheme;
  onThemeChange: (theme: ColorTheme) => void;
}

const ColorThemeSelector: React.FC<ColorThemeSelectorProps> = ({
  selectedTheme,
  onThemeChange
}) => {
  const handlePresetThemeChange = (themeId: string) => {
    const theme = DEFAULT_THEMES.find(t => t.id === themeId);
    if (theme) {
      onThemeChange(theme);
    }
  };

  const handleCustomColorChange = (colorType: keyof ColorTheme, value: string) => {
    if (colorType === 'id' || colorType === 'name') return;
    
    const customTheme: ColorTheme = {
      ...selectedTheme,
      id: 'custom',
      name: 'Custom',
      [colorType]: value
    };
    onThemeChange(customTheme);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <ColorPicker className="h-5 w-5" />
          Color Theme
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Preset Themes */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Preset Themes</Label>
          <RadioGroup
            value={selectedTheme.id}
            onValueChange={handlePresetThemeChange}
            className="grid grid-cols-1 gap-3"
          >
            {DEFAULT_THEMES.map((theme) => (
              <div key={theme.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value={theme.id} id={theme.id} />
                <Label htmlFor={theme.id} className="flex-1 flex items-center gap-3 cursor-pointer">
                  <div className="flex gap-1">
                    <div 
                      className="w-4 h-4 rounded-full border"
                      style={{ backgroundColor: theme.primary }}
                    />
                    <div 
                      className="w-4 h-4 rounded-full border"
                      style={{ backgroundColor: theme.secondary }}
                    />
                    <div 
                      className="w-4 h-4 rounded-full border"
                      style={{ backgroundColor: theme.accent }}
                    />
                  </div>
                  <span className="font-medium">{theme.name}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Custom Colors */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Custom Colors</Label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="primary-color" className="text-sm">Primary Color</Label>
              <div className="flex gap-2">
                <Input
                  id="primary-color"
                  type="color"
                  value={selectedTheme.primary}
                  onChange={(e) => handleCustomColorChange('primary', e.target.value)}
                  className="w-12 h-10 p-1 border rounded"
                />
                <Input
                  value={selectedTheme.primary}
                  onChange={(e) => handleCustomColorChange('primary', e.target.value)}
                  placeholder="#1e40af"
                  className="flex-1"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="secondary-color" className="text-sm">Secondary Color</Label>
              <div className="flex gap-2">
                <Input
                  id="secondary-color"
                  type="color"
                  value={selectedTheme.secondary}
                  onChange={(e) => handleCustomColorChange('secondary', e.target.value)}
                  className="w-12 h-10 p-1 border rounded"
                />
                <Input
                  value={selectedTheme.secondary}
                  onChange={(e) => handleCustomColorChange('secondary', e.target.value)}
                  placeholder="#3b82f6"
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ColorThemeSelector;
