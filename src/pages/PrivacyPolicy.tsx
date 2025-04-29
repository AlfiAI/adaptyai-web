
import PageContainer from '@/components/layout/PageContainer';
import Section from '@/components/layout/Section';

const PrivacyPolicy = () => {
  return (
    <PageContainer>
      <Section>
        <div className="container max-w-4xl mx-auto">
          <h1 className="mb-8">Privacy Policy</h1>
          
          <div className="prose prose-invert max-w-none">
            <p>Last Updated: April 29, 2025</p>
            
            <h2>Introduction</h2>
            <p>
              At Adapty AI ("we", "our", or "us"), we value your privacy and are committed to protecting your personal data. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website 
              or use our services.
            </p>
            
            <h2>Information We Collect</h2>
            <p>We may collect the following types of information:</p>
            <ul>
              <li><strong>Personal Information:</strong> Name, email address, phone number, and company details when you contact us or sign up for our services.</li>
              <li><strong>Usage Information:</strong> How you interact with our website, including pages visited and time spent.</li>
              <li><strong>Technical Information:</strong> IP address, browser type, device information, and cookies.</li>
            </ul>
            
            <h2>How We Use Your Information</h2>
            <p>We may use the information we collect for various purposes, including:</p>
            <ul>
              <li>Providing and improving our services</li>
              <li>Communicating with you about our products and services</li>
              <li>Analyzing usage patterns to enhance user experience</li>
              <li>Sending newsletters and marketing communications (with your consent)</li>
              <li>Complying with legal obligations</li>
            </ul>
            
            <h2>Disclosure of Your Information</h2>
            <p>We may share your information with:</p>
            <ul>
              <li>Service providers who perform functions on our behalf</li>
              <li>Professional advisers such as lawyers, auditors, and insurers</li>
              <li>Regulatory authorities when required by law</li>
            </ul>
            
            <h2>Data Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information from unauthorized access, 
              alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic 
              storage is 100% secure, and we cannot guarantee absolute security.
            </p>
            
            <h2>Your Data Protection Rights</h2>
            <p>Depending on your location, you may have certain rights regarding your personal information, including:</p>
            <ul>
              <li>Right to access your personal information</li>
              <li>Right to correct inaccurate or incomplete data</li>
              <li>Right to erasure of your personal information</li>
              <li>Right to restrict or object to processing</li>
              <li>Right to data portability</li>
              <li>Right to withdraw consent</li>
            </ul>
            
            <h2>Cookies</h2>
            <p>
              We use cookies and similar tracking technologies to enhance your browsing experience. You can set your 
              browser to refuse all or some browser cookies, but this may limit your ability to use certain features of our website.
            </p>
            
            <h2>Third-Party Links</h2>
            <p>
              Our website may contain links to third-party websites. We have no control over and assume no responsibility 
              for the content, privacy policies, or practices of any third-party sites or services.
            </p>
            
            <h2>Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new 
              Privacy Policy on this page and updating the "Last Updated" date.
            </p>
            
            <h2>Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
              <br />
              Email: info.adaptyai@gmail.com
            </p>
          </div>
        </div>
      </Section>
    </PageContainer>
  );
};

export default PrivacyPolicy;
