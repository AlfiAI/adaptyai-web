
import FormInput from '@/components/forms/FormInput';
import FormTextarea from '@/components/forms/FormTextarea';

interface ContactFormFieldsProps {
  formData: {
    name: string;
    email: string;
    company: string;
    message: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const ContactFormFields: React.FC<ContactFormFieldsProps> = ({
  formData,
  handleChange
}) => {
  return (
    <>
      <FormInput
        id="name"
        label="Name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      
      <FormInput
        id="email"
        label="Email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      
      <FormInput
        id="company"
        label="Company"
        value={formData.company}
        onChange={handleChange}
      />
      
      <FormTextarea
        id="message"
        label="Message"
        value={formData.message}
        onChange={handleChange}
        required
      />
    </>
  );
};

export default ContactFormFields;
