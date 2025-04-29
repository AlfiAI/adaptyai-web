
import { Mail, Phone, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";

const ContactInfo: React.FC = () => {
  return (
    <Card className="h-full p-6">
      <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>
      
      <div className="space-y-6">
        <div className="flex items-start space-x-4">
          <div className="text-adapty-aqua mt-1">
            <Mail className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-medium mb-1">Email</h3>
            <p className="text-gray-400">info.adaptyai@gmail.com</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-4">
          <div className="text-adapty-aqua mt-1">
            <Phone className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-medium mb-1">WhatsApp</h3>
            <p className="text-gray-400">+2760 241 8697</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-4">
          <div className="text-adapty-aqua mt-1">
            <MapPin className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-medium mb-1">Location</h3>
            <p className="text-gray-400">Cape Town, South Africa</p>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Follow Us</h3>
        <div className="flex space-x-4">
          <SocialLink href="https://facebook.com/" icon="facebook" />
          <SocialLink href="https://linkedin.com/" icon="linkedin" />
          <SocialLink href="https://instagram.com/" icon="instagram" />
          <SocialLink href="https://t.me/" icon="telegram" />
        </div>
      </div>
    </Card>
  );
};

interface SocialLinkProps {
  href: string;
  icon: "facebook" | "linkedin" | "instagram" | "telegram";
}

const SocialLink: React.FC<SocialLinkProps> = ({ href, icon }) => {
  const icons = {
    facebook: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>,
    linkedin: (
      <>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
        <rect x="2" y="9" width="4" height="12"></rect>
        <circle cx="4" cy="4" r="2"></circle>
      </>
    ),
    instagram: (
      <>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
      </>
    ),
    telegram: (
      <>
        <path d="m22 4-6 16-4-8-8-4 16-6Z" />
        <path d="M22 4 12 14" />
      </>
    )
  };

  return (
    <a href={href} className="text-gray-400 hover:text-adapty-aqua transition-colors">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        {icons[icon]}
      </svg>
    </a>
  );
};

export default ContactInfo;
