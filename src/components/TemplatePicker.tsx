import React, { useState } from 'react';
import { FileText, Briefcase, Code, GraduationCap, X } from 'lucide-react';
import { TEMPLATES, Template } from '../constants/templates';

interface TemplatePickerProps {
  onSelectTemplate: (content: string) => void;
  onClose: () => void;
}

const categoryIcons = {
  business: Briefcase,
  technical: Code,
  educational: GraduationCap,
  general: FileText,
};

const categoryColors = {
  business: 'bg-blue-100 text-blue-700 border-blue-200',
  technical: 'bg-purple-100 text-purple-700 border-purple-200',
  educational: 'bg-green-100 text-green-700 border-green-200',
  general: 'bg-gray-100 text-gray-700 border-gray-200',
};

const TemplatePicker: React.FC<TemplatePickerProps> = ({ onSelectTemplate, onClose }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  const handleSelect = (template: Template) => {
    setSelectedTemplate(template);
    setPreviewMode(true);
  };

  const handleConfirm = () => {
    if (selectedTemplate) {
      onSelectTemplate(selectedTemplate.content);
      onClose();
    }
  };

  const handleBack = () => {
    setPreviewMode(false);
    setSelectedTemplate(null);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            {previewMode && (
              <button
                onClick={handleBack}
                className="p-1 hover:bg-gray-100 rounded-md transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            )}
            <h2 className="text-xl font-semibold text-gray-900">
              {previewMode ? selectedTemplate?.name : 'Choose a Template'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          {previewMode && selectedTemplate ? (
            /* Preview Mode */
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${categoryColors[selectedTemplate.category]}`}>
                  {selectedTemplate.category}
                </span>
                <span className="text-gray-500 text-sm">{selectedTemplate.description}</span>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-auto">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                  {selectedTemplate.content}
                </pre>
              </div>
            </div>
          ) : (
            /* Template Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {TEMPLATES.map((template) => {
                const IconComponent = categoryIcons[template.category];
                return (
                  <button
                    key={template.id}
                    onClick={() => handleSelect(template)}
                    className="text-left p-4 border rounded-lg hover:border-blue-500 hover:shadow-md transition-all group"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${categoryColors[template.category]}`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {template.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {template.description}
                        </p>
                        <span className={`inline-block mt-2 px-2 py-0.5 rounded text-xs font-medium ${categoryColors[template.category]}`}>
                          {template.category}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {previewMode && (
          <div className="flex items-center justify-end gap-3 p-4 border-t bg-gray-50">
            <button
              onClick={handleBack}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Use This Template
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplatePicker;
