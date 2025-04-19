
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormInputProps {
  id: string;
  label: string;
  type?: "text" | "email" | "tel";
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  required = false
}) => {
  return (
    <div>
      <Label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">
        {label}
      </Label>
      <Input
        type={type}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full bg-black/30 border-white/10 focus:border-adapty-aqua focus:shadow-[0_0_10px_rgba(0,255,247,0.25)]"
      />
    </div>
  );
};

export default FormInput;
