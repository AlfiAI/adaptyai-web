
import * as z from 'zod';

export const agentTypes = [
  { value: 'aviation', label: 'Aviation' },
  { value: 'insurance', label: 'Insurance' },
  { value: 'sustainability', label: 'Sustainability' },
  { value: 'cybersecurity', label: 'Cybersecurity' },
  { value: 'operator', label: 'Operator' },
];

export const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  slug: z.string().min(2, 'Slug must be at least 2 characters').regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  title: z.string().min(2, 'Title must be at least 2 characters'),
  shortDescription: z.string().min(10, 'Short description must be at least 10 characters'),
  fullDescription: z.string().min(30, 'Full description must be at least 30 characters'),
  agentType: z.enum(['aviation', 'insurance', 'sustainability', 'cybersecurity', 'operator']),
  capabilities: z.string().transform(val => val.split(',').map(s => s.trim()).filter(Boolean)),
  avatarUrl: z.string().optional(),
  themeColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Must be a valid hex color code'),
});

export type FormValues = z.infer<typeof formSchema>;
