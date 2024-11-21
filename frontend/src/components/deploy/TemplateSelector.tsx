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
import { BusinessConfig } from "@/lib/store/deploymentStore";

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
        recommended: true,
        beta: false,
        recommendationReason: "Fully optimized template ready for testing"
      },
      {
        id: "hotel-business",
        name: "Business Hotel",
        description: "Efficient, professional service",
        beta: true,
        betaMessage: "Template in development"
      },
      {
        id: "hotel-resort",
        name: "Resort",
        description: "Vacation and leisure focused",
        beta: true,
        betaMessage: "Template in development"
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
        beta: true,
        betaMessage: "Template in development"
      },
      {
        id: "healthcare-specialist",
        name: "Specialist Office",
        description: "Specialized medical services",
        beta: true,
        betaMessage: "Template in development"
      },
      {
        id: "healthcare-dental",
        name: "Dental Practice",
        description: "Dental services focus",
        beta: true,
        betaMessage: "Template in development"
      },
    ],
  },
  {
    id: "retail",
    name: "Retail & Sales",
    icon: <BuildingStorefrontIcon className="w-8 h-8 text-purple-600" />,
    description: "Ideal for retail stores and sales teams. Handles product inquiries and order status.",
    subtypes: [
      {
        id: "retail-boutique",
        name: "Boutique Store",
        description: "Personalized, luxury experience focus",
        beta: true,
        betaMessage: "Template in development"
      },
      {
        id: "retail-business",
        name: "Business Store",
        description: "Efficient, professional service",
        beta: true,
        betaMessage: "Template in development"
      },
      {
        id: "retail-resort",
        name: "Resort",
        description: "Vacation and leisure focused",
        beta: true,
        betaMessage: "Template in development"
      },
    ],
  },
  {
    id: "education",
    name: "Education",
    icon: <AcademicCapIcon className="w-8 h-8 text-purple-600" />,
    description: "Designed for schools, universities, and educational institutions.",
    subtypes: [
      {
        id: "education-elementary",
        name: "Elementary School",
        description: "Primary education",
        beta: true,
        betaMessage: "Template in development"
      },
      {
        id: "education-highschool",
        name: "High School",
        description: "Secondary education",
        beta: true,
        betaMessage: "Template in development"
      },
      {
        id: "education-university",
        name: "University",
        description: "Higher education",
        beta: true,
        betaMessage: "Template in development"
      },
    ],
  },
  {
    id: "corporate",
    name: "Corporate Office",
    icon: <BuildingOffice2Icon className="w-8 h-8 text-purple-600" />,
    description: "Perfect for corporate environments, handling calls, meetings, and inquiries.",
    subtypes: [
      {
        id: "corporate-executive",
        name: "Executive Office",
        description: "High-level management and decision-making",
        beta: true,
        betaMessage: "Template in development"
      },
      {
        id: "corporate-midlevel",
        name: "Mid-Level Office",
        description: "Intermediate management and decision-making",
        beta: true,
        betaMessage: "Template in development"
      },
      {
        id: "corporate-entrylevel",
        name: "Entry-Level Office",
        description: "Junior-level tasks and responsibilities",
        beta: true,
        betaMessage: "Template in development"
      },
    ],
  },
  {
    id: "professional",
    name: "Professional Services",
    icon: <BriefcaseIcon className="w-8 h-8 text-purple-600" />,
    description: "Tailored for law firms, consultants, and professional service providers.",
    subtypes: [
      {
        id: "professional-law",
        name: "Law Firm",
        description: "Legal services focus",
        beta: true,
        betaMessage: "Template in development"
      },
      {
        id: "professional-consulting",
        name: "Consulting Firm",
        description: "Consulting services focus",
        beta: true,
        betaMessage: "Template in development"
      },
      {
        id: "professional-accounting",
        name: "Accounting Firm",
        description: "Accounting services focus",
        beta: true,
        betaMessage: "Template in development"
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
      settings: {
        recordCalls: false,
        transcribeCalls: false,
        analyticsEnabled: true
      },
      tone: customConfig.tone as 'professional' | 'friendly' | 'casual',
      businessHours: customConfig.businessHours,
      specialServices: customConfig.specialServices,
      specificDetails: customConfig.specificDetails,
      ...(customConfig.businessEmail && { businessEmail: customConfig.businessEmail }),
      ...(customConfig.businessPhone && { businessPhone: customConfig.businessPhone }),
      languages: ['en']
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
      tone: customConfig.tone as 'professional' | 'friendly' | 'casual',
      specialServices: customConfig.specialServices,
      specificDetails: customConfig.specificDetails,
      languages: ['en']
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
