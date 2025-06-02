
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface PasswordResetEmailProps {
  userName: string
  resetUrl: string
}

export const PasswordResetEmail = ({
  userName,
  resetUrl,
}: PasswordResetEmailProps) => (
  <Html>
    <Head />
    <Preview>Reset your ResumeAI password</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoContainer}>
          <Text style={logo}>📄 ResumeAI</Text>
        </Section>
        
        <Heading style={h1}>Password Reset Request</Heading>
        
        <Text style={heroText}>
          Hi {userName}, we received a request to reset your ResumeAI password. 
          If you didn't make this request, you can safely ignore this email.
        </Text>
        
        <Section style={buttonContainer}>
          <Button style={button} href={resetUrl}>
            Reset Your Password
          </Button>
        </Section>
        
        <Text style={text}>
          This link will expire in 24 hours for security reasons. If you need to reset your password after that, you'll need to request a new reset link.
        </Text>
        
        <Text style={text}>
          If the button doesn't work, copy and paste this link into your browser:
        </Text>
        <Text style={linkText}>{resetUrl}</Text>
        
        <Section style={securityNote}>
          <Text style={securityText}>
            🔒 Security tip: Make sure to choose a strong password that you don't use anywhere else.
          </Text>
        </Section>
        
        <Text style={footer}>
          Best regards,<br />
          The ResumeAI Team
        </Text>
      </Container>
    </Body>
  </Html>
)

export default PasswordResetEmail

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

const linkText = {
  color: '#00C3FF',
  fontSize: '12px',
  lineHeight: '1.4',
  wordBreak: 'break-all' as const,
  margin: '16px 0',
}

const securityNote = {
  margin: '24px 0',
  padding: '16px',
  backgroundColor: 'rgba(255, 193, 7, 0.1)',
  borderRadius: '8px',
  border: '1px solid rgba(255, 193, 7, 0.2)',
}

const securityText = {
  color: '#ffc107',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '0',
}

const footer = {
  color: '#94a3b8',
  fontSize: '14px',
  lineHeight: '1.6',
  textAlign: 'center' as const,
  margin: '32px 0 0',
}
