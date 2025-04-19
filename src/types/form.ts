
export interface BaseFormFieldProps {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
}

export interface FileUploadProps extends BaseFormFieldProps {
  accept?: string;
  currentFileUrl?: string;
  onFileChange: (file: File | null) => void;
  buttonText?: string;
}

export interface FormMediaUploadProps extends BaseFormFieldProps {
  urlValue: string;
  onUrlChange: (value: string) => void;
  selectedFile: File | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  accept: string;
  urlPlaceholder: string;
  uploadButtonText?: string;
}
