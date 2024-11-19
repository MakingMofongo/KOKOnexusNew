import { useTemplateStore } from '../lib/store/templateStore';
import { industryTemplates } from '../lib/constants/templates';

export function TemplateConfigForm() {
  const { 
    selectedTemplate, 
    selectedSubtype, 
    customConfig,
    setConfig 
  } = useTemplateStore();

  if (!selectedTemplate || !selectedSubtype) {
    return null;
  }

  const template = industryTemplates[selectedTemplate as keyof typeof industryTemplates];
  const subtype = template.subtypes[selectedSubtype as keyof typeof template.subtypes];
  const configFields = subtype.configFields;

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Business Name</label>
        <input
          type="text"
          value={customConfig.businessName}
          onChange={(e) => setConfig({ businessName: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300"
        />
      </div>

      {configFields.map((field) => (
        <div key={field}>
          <label className="block text-sm font-medium">
            {field.charAt(0).toUpperCase() + field.slice(1)}
          </label>
          <input
            type="text"
            value={customConfig[field] || ''}
            onChange={(e) => setConfig({ [field]: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300"
          />
        </div>
      ))}
    </div>
  );
} 