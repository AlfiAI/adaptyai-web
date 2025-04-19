
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface FormTextareaProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
  rows?: number;
}

const FormTextarea: React.FC<FormTextareaProps> = ({
  id,
  label,
  value,
  onChange,
  required = false,
  rows = 5
}) => {
  return (
    <div>
      <Label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">
        {label}
      </Label>
      <Textarea
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        required={required}
        rows={rows}
        className="w-full bg-black/30 border-white/10 focus:border-adapty-aqua focus:shadow-[0_0_10px_rgba(0,255,247,0.25)]"
      />
    </div>
  );
};

export default FormTextarea;
