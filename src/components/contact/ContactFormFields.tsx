
import FormInput from '@/components/forms/FormInput';
import FormTextarea from '@/components/forms/FormTextarea';

interface ContactFormFields {
  name: string;
  email: string;
  company: string;
  message: string;
}

interface ContactFormFieldsProps {
  formData: ContactFormFields;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const ContactFormFields: React.FC<ContactFormFieldsProps> = ({ formData, handleChange }) => {
  return (
    <>
      <FormInput
        id="name"
        label="Your Name"
        type="text"
        value={formData.name}
        onChange={handleChange}
        required
      />
      
      <FormInput
        id="email"
        label="Email Address"
        type="email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      
      <FormInput
        id="company"
        label="Company Name"
        type="text"
        value={formData.company}
        onChange={handleChange}
      />
      
      <FormTextarea
        id="message"
        label="Message"
        value={formData.message}
        onChange={handleChange}
        required
        rows={5}
      />
    </>
  );
};

export default ContactFormFields;
