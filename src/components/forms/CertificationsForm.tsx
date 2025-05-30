
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Plus } from 'lucide-react';
import { Certification } from '@/types/resume';

interface CertificationsFormProps {
  certifications: Certification[];
  onAdd: () => void;
  onUpdate: (id: string, field: keyof Certification, value: string) => void;
  onRemove: (id: string) => void;
}

const CertificationsForm: React.FC<CertificationsFormProps> = ({
  certifications,
  onAdd,
  onUpdate,
  onRemove
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Certifications & Licenses
          <Button onClick={onAdd} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Certification
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {certifications.map((cert) => (
          <div key={cert.id} className="border rounded-lg p-4 space-y-4">
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRemove(cert.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`cert-name-${cert.id}`}>Certification Name</Label>
                <Input
                  id={`cert-name-${cert.id}`}
                  value={cert.name}
                  onChange={(e) => onUpdate(cert.id, 'name', e.target.value)}
                  placeholder="AWS Solutions Architect"
                />
              </div>
              
              <div>
                <Label htmlFor={`cert-issuer-${cert.id}`}>Issuing Organization</Label>
                <Input
                  id={`cert-issuer-${cert.id}`}
                  value={cert.issuer}
                  onChange={(e) => onUpdate(cert.id, 'issuer', e.target.value)}
                  placeholder="Amazon Web Services"
                />
              </div>
              
              <div>
                <Label htmlFor={`cert-date-${cert.id}`}>Issue Date</Label>
                <Input
                  id={`cert-date-${cert.id}`}
                  type="date"
                  value={cert.date}
                  onChange={(e) => onUpdate(cert.id, 'date', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor={`cert-expiry-${cert.id}`}>Expiry Date</Label>
                <Input
                  id={`cert-expiry-${cert.id}`}
                  type="date"
                  value={cert.expiryDate}
                  onChange={(e) => onUpdate(cert.id, 'expiryDate', e.target.value)}
                />
              </div>
              
              <div className="md:col-span-2">
                <Label htmlFor={`cert-credential-${cert.id}`}>Credential ID</Label>
                <Input
                  id={`cert-credential-${cert.id}`}
                  value={cert.credentialId}
                  onChange={(e) => onUpdate(cert.id, 'credentialId', e.target.value)}
                  placeholder="ABC-123-XYZ"
                />
              </div>
            </div>
          </div>
        ))}
        
        {certifications.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No certifications added yet. Click "Add Certification" to get started.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CertificationsForm;
