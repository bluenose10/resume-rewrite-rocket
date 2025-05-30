
import { Certification } from '@/types/resume';

interface UseCertificationsProps {
  certifications: Certification[];
  onUpdate: (certifications: Certification[]) => void;
}

export const useCertifications = ({ certifications, onUpdate }: UseCertificationsProps) => {
  const addCertification = () => {
    const newCertification: Certification = {
      id: Date.now().toString(),
      name: '',
      issuer: '',
      date: '',
      expiryDate: '',
      credentialId: ''
    };
    onUpdate([...certifications, newCertification]);
  };

  const updateCertification = (id: string, field: keyof Certification, value: string) => {
    onUpdate(
      certifications.map(cert => 
        cert.id === id ? { ...cert, [field]: value } : cert
      )
    );
  };

  const removeCertification = (id: string) => {
    onUpdate(certifications.filter(cert => cert.id !== id));
  };

  return {
    addCertification,
    updateCertification,
    removeCertification
  };
};
