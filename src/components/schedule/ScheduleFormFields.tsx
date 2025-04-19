
import FormInput from '@/components/forms/FormInput';
import FormSelect from '@/components/forms/FormSelect';

interface ScheduleFormFieldsProps {
  formData: {
    name: string;
    email: string;
    company: string;
    phone: string;
    topic: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleTopicChange: (value: string) => void;
  selectedDate: string | null;
  selectedTime: string | null;
  topicOptions: Array<{ value: string; label: string; }>;
}

const ScheduleFormFields: React.FC<ScheduleFormFieldsProps> = ({
  formData,
  handleChange,
  handleTopicChange,
  selectedDate,
  selectedTime,
  topicOptions
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
      
      <FormInput
        id="phone"
        label="Phone"
        type="tel"
        value={formData.phone}
        onChange={handleChange}
      />
      
      <FormSelect
        id="topic"
        label="Topic"
        value={formData.topic}
        onChange={handleTopicChange}
        options={topicOptions}
        required
      />
      
      <div className="py-4">
        <h3 className="text-lg font-medium mb-2">Selected Slot</h3>
        {selectedDate && selectedTime ? (
          <p className="text-adapty-aqua">
            {new Date(selectedDate).toLocaleDateString('en-US', { 
              weekday: 'long',
              month: 'long', 
              day: 'numeric',
              year: 'numeric'
            })} at {selectedTime}
          </p>
        ) : (
          <p className="text-gray-400">Please select a date and time</p>
        )}
      </div>
    </>
  );
};

export default ScheduleFormFields;
