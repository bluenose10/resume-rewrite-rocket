
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface ConfirmationEmailProps {
  userName: string
  confirmationUrl: string
}

export const ConfirmationEmail = ({
  userName,
  confirmationUrl,
}: ConfirmationEmailProps) => (
  <Html>
    <Head />
    <Preview>Welcome to ResumeAI - Confirm your account to get started</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoContainer}>
          <Text style={logo}>📄 ResumeAI</Text>
        </Section>
        
        <Heading style={h1}>Welcome to ResumeAI!</Heading>
        
        <Text style={heroText}>
          Hi {userName}, thank you for creating an account with ResumeAI. 
          You're just one step away from building your perfect resume with AI precision.
        </Text>
        
        <Section style={buttonContainer}>
          <Button style={button} href={confirmationUrl}>
            Confirm Your Account
          </Button>
        </Section>
        
        <Text style={text}>
          Once confirmed, you'll be able to:
        </Text>
        
        <Section style={features}>
          <Text style={featureItem}>✨ Create AI-optimized resumes</Text>
          <Text style={featureItem}>🎯 Get ATS-friendly formatting</Text>
          <Text style={featureItem}>🚀 Access professional templates</Text>
          <Text style={featureItem}>📊 Track your resume performance</Text>
        </Section>
        
        <Text style={text}>
          If the button doesn't work, copy and paste this link into your browser:
        </Text>
        <Text style={linkText}>{confirmationUrl}</Text>
        
        <Text style={footer}>
          Best regards,<br />
          The ResumeAI Team
        </Text>
      </Container>
    </Body>
  </Html>
)

export default ConfirmationEmail

const main = {
  backgroundColor: '#0f172a',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
  padding: '20px 0',
}

const container = {
  backgroundColor: '#1e293b',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '12px',
  margin: '0 auto',
  padding: '40px 20px',
  maxWidth: '600px',
}

const logoContainer = {
  textAlign: 'center' as const,
  marginBottom: '32px',
}

const logo = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#00C3FF',
  margin: '0',
}

const h1 = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  margin: '0 0 24px',
  lineHeight: '1.3',
}

const heroText = {
  color: '#e2e8f0',
  fontSize: '16px',
  lineHeight: '1.6',
  textAlign: 'center' as const,
  margin: '0 0 32px',
}

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
}

const button = {
  backgroundColor: '#00C3FF',
  borderRadius: '8px',
  color: '#000000',
  display: 'inline-block',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  padding: '14px 28px',
  textAlign: 'center' as const,
}

const text = {
  color: '#e2e8f0',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '16px 0',
}

const features = {
  margin: '24px 0',
  padding: '20px',
  backgroundColor: 'rgba(0, 195, 255, 0.1)',
  borderRadius: '8px',
  border: '1px solid rgba(0, 195, 255, 0.2)',
}

const featureItem = {
  color: '#e2e8f0',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '8px 0',
}

const linkText = {
  color: '#00C3FF',
  fontSize: '12px',
  lineHeight: '1.4',
  wordBreak: 'break-all' as const,
  margin: '16px 0',
}

const footer = {
  color: '#94a3b8',
  fontSize: '14px',
  lineHeight: '1.6',
  textAlign: 'center' as const,
  margin: '32px 0 0',
}
