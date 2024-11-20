"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { SPRING } from "@/lib/constants/animations";
import { useDeploymentStore } from "@/lib/store/deploymentStore";
import {
  BuildingOffice2Icon,
  BuildingStorefrontIcon,
  HomeModernIcon,
  AcademicCapIcon,
  HeartIcon,
  BriefcaseIcon,
} from "@heroicons/react/24/outline";
import { PreConfiguredTemplates } from "./PreConfiguredTemplates";
import { CustomTemplateForm } from "./CustomTemplateForm";

interface BusinessConfig {
  businessName: string;
  settings: {
    tone: 'professional' | 'friendly' | 'casual';
    language: string[];
    recordCalls?: boolean;
    transcribeCalls?: boolean;
    model?: {
      provider: string;
      model: string;
      temperature?: number;
    };
  };
  systemPrompt?: string;
  industry?: string;
}

const industryTemplates = [
  {
    id: "hotel",
    name: "Hotel & Hospitality",
    icon: <HomeModernIcon className="w-8 h-8 text-purple-600" />,
    description: "Perfect for hotels, resorts, and hospitality businesses.",
    subtypes: [
      {
        id: "hotel-boutique",
        name: "Boutique Hotel",
        description: "Personalized, luxury experience focus",
      },
      {
        id: "hotel-business",
        name: "Business Hotel",
        description: "Efficient, professional service",
      },
      {
        id: "hotel-resort",
        name: "Resort",
        description: "Vacation and leisure focused",
      },
    ],
  },
  {
    id: "healthcare",
    name: "Healthcare",
    icon: <HeartIcon className="w-8 h-8 text-purple-600" />,
    description: "HIPAA-compliant solution for healthcare providers.",
    subtypes: [
      {
        id: "healthcare-clinic",
        name: "Medical Clinic",
        description: "General practice and appointments",
      },
      {
        id: "healthcare-specialist",
        name: "Specialist Office",
        description: "Specialized medical services",
      },
      {
        id: "healthcare-dental",
        name: "Dental Practice",
        description: "Dental services focus",
      },
    ],
  },
  {
    id: "retail",
    name: "Retail & Sales",
    icon: <BuildingStorefrontIcon className="w-8 h-8 text-purple-600" />,
    description:
      "Ideal for retail stores and sales teams. Handles product inquiries and order status.",
    subtypes: [
      {
        id: "retail-boutique",
        name: "Boutique Store",
        description: "Personalized, luxury experience focus",
      },
      {
        id: "retail-business",
        name: "Business Store",
        description: "Efficient, professional service",
      },
      {
        id: "retail-resort",
        name: "Resort",
        description: "Vacation and leisure focused",
      },
    ],
  },
  {
    id: "education",
    name: "Education",
    icon: <AcademicCapIcon className="w-8 h-8 text-purple-600" />,
    description:
      "Designed for schools, universities, and educational institutions.",
    subtypes: [
      {
        id: "education-elementary",
        name: "Elementary School",
        description: "Primary education",
      },
      {
        id: "education-highschool",
        name: "High School",
        description: "Secondary education",
      },
      {
        id: "education-university",
        name: "University",
        description: "Higher education",
      },
    ],
  },
  {
    id: "corporate",
    name: "Corporate Office",
    icon: <BuildingOffice2Icon className="w-8 h-8 text-purple-600" />,
    description:
      "Perfect for corporate environments, handling calls, meetings, and inquiries.",
    subtypes: [
      {
        id: "corporate-executive",
        name: "Executive Office",
        description: "High-level management and decision-making",
      },
      {
        id: "corporate-midlevel",
        name: "Mid-Level Office",
        description: "Intermediate management and decision-making",
      },
      {
        id: "corporate-entrylevel",
        name: "Entry-Level Office",
        description: "Junior-level tasks and responsibilities",
      },
    ],
  },
  {
    id: "professional",
    name: "Professional Services",
    icon: <BriefcaseIcon className="w-8 h-8 text-purple-600" />,
    description:
      "Tailored for law firms, consultants, and professional service providers.",
    subtypes: [
      {
        id: "professional-law",
        name: "Law Firm",
        description: "Legal services focus",
      },
      {
        id: "professional-consulting",
        name: "Consulting Firm",
        description: "Consulting services focus",
      },
      {
        id: "professional-accounting",
        name: "Accounting Firm",
        description: "Accounting services focus",
      },
    ],
  },
];

export function TemplateSelector() {
  const { setStep, setSelectedTemplate, setIndustry } = useDeploymentStore();
  const [selectedMainType, setSelectedMainType] = useState<string | null>(null);
  const [selectedSubtype, setSelectedSubtype] = useState<string | null>(null);
  const [showCustomization, setShowCustomization] = useState(false);
  const [customConfig, setCustomConfig] = useState({
    businessName: "",
    businessEmail: "",
    businessPhone: "",
    industry: "",
    businessType: "",
    tone: "professional",
    specificDetails: [],
    businessHours: {
      timezone: "America/New_York",
      schedule: [{ days: ["MONDAY", "FRIDAY"], hours: "9:00-17:00" }],
    },
    specialServices: [],
    complianceRequirements: [],
    productCategories: [],
    specializations: [],
  });

  const handleSelectTemplate = (templateId: string, subTypeId?: string) => {
    const template = industryTemplates.find((t) => t.id === templateId);
    if (template) {
      setSelectedTemplate(subTypeId || templateId);
      setIndustry(templateId);
      setSelectedSubtype(subTypeId || null);
      setShowCustomization(true);
    }
  };

  const handleCustomizationComplete = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customConfig.businessName?.trim()) {
      alert("Please enter a business name");
      return;
    }

    const store = useDeploymentStore.getState();
    store.updateBusinessConfig({
      businessName: customConfig.businessName,
      businessEmail: customConfig.businessEmail,
      businessPhone: customConfig.businessPhone,
      settings: {
        recordCalls: false,
        transcribeCalls: false,
        analyticsEnabled: true,
      },
      businessHours: customConfig.businessHours,
      specialServices: customConfig.specialServices,
      specificDetails: customConfig.specificDetails,
    });

    setStep("voice");
  };

  const handleTemplateSelect = (templateId: string, subtype: string) => {
    const store = useDeploymentStore.getState();
    const businessConfig = store.businessConfig;

    console.log('Template Selection:', {
      templateId,
      subtype,
      businessConfig
    });

    if (!businessConfig.businessName) {
      console.error("Business name is missing from config");
      return;
    }

    const [mainIndustry] = templateId.split('-');
    const template = industryTemplates[mainIndustry]?.subtypes[templateId];
    
    console.log('Found template:', {
      mainIndustry,
      templateId,
      hasTemplate: !!template,
      systemPrompt: template?.systemPrompt
    });

    if (!template) {
      console.error("Template not found:", templateId);
      return;
    }

    store.updateBusinessConfig({
      businessName: businessConfig.businessName,
      industry: mainIndustry,
      settings: {
        recordCalls: false,
        transcribeCalls: true,
        analyticsEnabled: true
      },
      languages: ['en'],
      tone: 'professional'
    });
    
    store.setSelectedTemplate(templateId);
    store.setSystemPrompt(template.systemPrompt);
    store.setStep("voice");
  };

  if (showCustomization) {
    return (
      <div className="max-w-4xl mx-auto">
        <CustomTemplateForm
          config={customConfig}
          setConfig={setCustomConfig}
          onSubmit={handleCustomizationComplete}
          selectedTemplate={selectedMainType}
          selectedSubtype={selectedSubtype}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {selectedMainType ? (
        <div>
          <h3 className="heading-3 mb-6">Select Specific Type</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {industryTemplates
              .find((t) => t.id === selectedMainType)
              ?.subtypes.map((subtype) => (
                <motion.button
                  key={subtype.id}
                  className="glass-panel p-6 text-left hover:ring-2 hover:ring-purple-600"
                  whileHover={{ scale: 1.02 }}
                  onClick={() =>
                    handleSelectTemplate(selectedMainType, subtype.id)
                  }
                >
                  <h4 className="text-lg font-bold mb-2">{subtype.name}</h4>
                  <p className="text-sm text-gray-600">{subtype.description}</p>
                </motion.button>
              ))}
          </div>
          <button
            onClick={() => setSelectedMainType(null)}
            className="mt-6 text-purple-600 hover:text-purple-700"
          >
            ← Back to main templates
          </button>
        </div>
      ) : (
        <PreConfiguredTemplates
          templates={industryTemplates}
          onSelect={(id) => setSelectedMainType(id)}
        />
      )}
    </div>
  );
}
