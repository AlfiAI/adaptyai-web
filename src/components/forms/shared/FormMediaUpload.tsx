
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Upload } from "lucide-react";
import { FormMediaUploadProps } from "@/types/form";

export const FormMediaUpload = ({
  id,
  label,
  urlValue,
  onUrlChange,
  selectedFile,
  onFileChange,
  accept,
  urlPlaceholder,
  uploadButtonText = "Upload",
  required,
  error
}: FormMediaUploadProps) => {
  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div className="col-span-2">
          <FormControl>
            <Input 
              placeholder={urlPlaceholder}
              value={urlValue}
              onChange={(e) => onUrlChange(e.target.value)}
              required={required}
            />
          </FormControl>
        </div>
        <div>
          <div className="relative">
            <Input
              type="file"
              id={id}
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={onFileChange}
              accept={accept}
            />
            <Button 
              type="button" 
              variant="outline" 
              className="w-full flex items-center justify-center"
            >
              <Upload className="h-4 w-4 mr-2" />
              {uploadButtonText}
            </Button>
          </div>
        </div>
      </div>
      {selectedFile && (
        <p className="text-sm mt-1 text-emerald-500">
          Selected: {selectedFile.name}
        </p>
      )}
      {error && <FormMessage>{error}</FormMessage>}
    </FormItem>
  );
};
