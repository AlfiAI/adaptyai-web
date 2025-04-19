
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface Option {
  value: string;
  label: string;
}

interface FormSelectProps {
  id: string;
  label: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  required?: boolean;
}

const FormSelect: React.FC<FormSelectProps> = ({
  id,
  label,
  value,
  options,
  onChange,
  required = false
}) => {
  return (
    <div>
      <Label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">
        {label}
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={id} className="w-full bg-black/30 border-white/10 focus:border-adapty-aqua focus:shadow-[0_0_10px_rgba(0,255,247,0.25)]">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          {/* Replace the empty string value with a meaningful default */}
          <SelectItem value="_default">Select {label.toLowerCase()}</SelectItem>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default FormSelect;
