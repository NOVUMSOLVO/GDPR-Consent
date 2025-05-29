/**
 * NHS and CQC Compliance Configuration
 * 
 * This configuration file contains settings specific to NHS and CQC compliance
 * requirements for healthcare data management systems.
 */

// NHS Digital Technology Assessment Criteria (DTAC) Configuration
export const NHS_DTAC_CONFIG = {
  // Technical Safety Requirements
  TECHNICAL_SAFETY: {
    FAIL_SAFE_ENABLED: process.env.NHS_FAIL_SAFE_ENABLED === 'true',
    ERROR_RECOVERY_ENABLED: process.env.NHS_ERROR_RECOVERY === 'true',
    SYSTEM_MONITORING: process.env.NHS_SYSTEM_MONITORING === 'true',
    AUTOMATED_TESTING: process.env.NHS_AUTOMATED_TESTING === 'true',
  },

  // Usability Requirements
  USABILITY: {
    ACCESSIBILITY_COMPLIANCE: process.env.NHS_ACCESSIBILITY_COMPLIANCE === 'true',
    USER_CENTERED_DESIGN: process.env.NHS_USER_CENTERED_DESIGN === 'true',
    CLINICAL_WORKFLOW_SUPPORT: process.env.NHS_CLINICAL_WORKFLOW === 'true',
    TRAINING_MATERIALS: process.env.NHS_TRAINING_MATERIALS === 'true',
  },

  // Interoperability Requirements
  INTEROPERABILITY: {
    HL7_FHIR_R4_SUPPORT: process.env.FHIR_R4_ENABLED === 'true',
    NHS_DATA_STANDARDS: process.env.NHS_DATA_STANDARDS === 'true',
    LEGACY_SYSTEM_SUPPORT: process.env.NHS_LEGACY_SUPPORT === 'true',
    API_VERSIONING: process.env.NHS_API_VERSIONING === 'true',
  },

  // Data Protection Requirements
  DATA_PROTECTION: {
    GDPR_COMPLIANCE: process.env.GDPR_COMPLIANCE === 'true',
    UK_DPA_2018_COMPLIANCE: process.env.UK_DPA_2018_COMPLIANCE === 'true',
    DATA_MINIMIZATION: process.env.DATA_MINIMIZATION === 'true',
    PRIVACY_BY_DESIGN: process.env.PRIVACY_BY_DESIGN === 'true',
  }
};

// CQC Key Lines of Enquiry (KLOEs) Configuration
export const CQC_KLOE_CONFIG = {
  // Safety Requirements
  SAFETY: {
    PATIENT_SAFETY_MONITORING: process.env.PATIENT_SAFETY_MONITORING === 'true',
    INCIDENT_REPORTING: process.env.INCIDENT_REPORTING_ENABLED === 'true',
    RISK_ASSESSMENT: process.env.RISK_ASSESSMENT_ENABLED === 'true',
    SAFEGUARDING_PROTOCOLS: process.env.SAFEGUARDING_PROTOCOLS === 'true',
  },

  // Effectiveness Requirements
  EFFECTIVENESS: {
    EVIDENCE_BASED_CARE: process.env.EVIDENCE_BASED_CARE === 'true',
    CLINICAL_OUTCOMES_TRACKING: process.env.CLINICAL_OUTCOMES === 'true',
    QUALITY_IMPROVEMENT: process.env.QUALITY_IMPROVEMENT === 'true',
    BEST_PRACTICE_COMPLIANCE: process.env.BEST_PRACTICE_COMPLIANCE === 'true',
  },

  // Caring Requirements
  CARING: {
    PERSON_CENTERED_CARE: process.env.PERSON_CENTERED_CARE === 'true',
    DIGNITY_RESPECT: process.env.DIGNITY_RESPECT === 'true',
    PATIENT_INVOLVEMENT: process.env.PATIENT_INVOLVEMENT === 'true',
    CULTURAL_SENSITIVITY: process.env.CULTURAL_SENSITIVITY === 'true',
  },

  // Responsive Requirements
  RESPONSIVE: {
    INDIVIDUAL_NEEDS: process.env.INDIVIDUAL_NEEDS_SUPPORT === 'true',
    ACCESSIBILITY: process.env.ACCESSIBILITY_SUPPORT === 'true',
    COMPLAINTS_HANDLING: process.env.COMPLAINTS_HANDLING === 'true',
    SERVICE_FLEXIBILITY: process.env.SERVICE_FLEXIBILITY === 'true',
  },

  // Well-led Requirements
  WELL_LED: {
    GOVERNANCE_FRAMEWORK: process.env.GOVERNANCE_FRAMEWORK === 'true',
    LEADERSHIP_ACCOUNTABILITY: process.env.LEADERSHIP_ACCOUNTABILITY === 'true',
    CONTINUOUS_IMPROVEMENT: process.env.CONTINUOUS_IMPROVEMENT === 'true',
    STAFF_DEVELOPMENT: process.env.STAFF_DEVELOPMENT === 'true',
  }
};

// NHS Data Security and Protection Toolkit (DSPT) Configuration
export const NHS_DSPT_CONFIG = {
  // Data Security Standards
  DATA_SECURITY: {
    ENCRYPTION_AT_REST: process.env.ENCRYPTION_AT_REST === 'true',
    ENCRYPTION_IN_TRANSIT: process.env.ENCRYPTION_IN_TRANSIT === 'true',
    ACCESS_CONTROLS: process.env.ACCESS_CONTROLS_ENABLED === 'true',
    MULTI_FACTOR_AUTH: process.env.MFA_ENABLED === 'true',
  },

  // Staff Responsibilities
  STAFF_RESPONSIBILITIES: {
    SECURITY_TRAINING: process.env.SECURITY_TRAINING_ENABLED === 'true',
    ACCEPTABLE_USE_POLICY: process.env.ACCEPTABLE_USE_POLICY === 'true',
    INCIDENT_REPORTING: process.env.SECURITY_INCIDENT_REPORTING === 'true',
    REGULAR_ASSESSMENTS: process.env.REGULAR_ASSESSMENTS === 'true',
  },

  // Secure Configuration
  SECURE_CONFIGURATION: {
    NETWORK_SECURITY: process.env.NETWORK_SECURITY_ENABLED === 'true',
    VULNERABILITY_MANAGEMENT: process.env.VULNERABILITY_MANAGEMENT === 'true',
    PATCH_MANAGEMENT: process.env.PATCH_MANAGEMENT === 'true',
    SECURE_DEVELOPMENT: process.env.SECURE_DEVELOPMENT === 'true',
  }
};

// HL7 FHIR R4 Configuration for NHS Interoperability
export const FHIR_CONFIG = {
  // FHIR Server Configuration
  SERVER: {
    BASE_URL: process.env.FHIR_BASE_URL || 'https://fhir.nhs.uk',
    VERSION: 'R4',
    TIMEOUT: parseInt(process.env.FHIR_TIMEOUT || '30000'),
    RETRY_ATTEMPTS: parseInt(process.env.FHIR_RETRY_ATTEMPTS || '3'),
  },

  // Supported FHIR Resources
  RESOURCES: {
    CONSENT: true,
    PATIENT: true,
    ORGANIZATION: true,
    PRACTITIONER: true,
    AUDIT_EVENT: true,
    PROVENANCE: true,
  },

  // FHIR Security Configuration
  SECURITY: {
    OAUTH2_ENABLED: process.env.FHIR_OAUTH2_ENABLED === 'true',
    CLIENT_ID: process.env.FHIR_CLIENT_ID || '',
    CLIENT_SECRET: process.env.FHIR_CLIENT_SECRET || '',
    SCOPE: process.env.FHIR_SCOPE || 'patient/*.read patient/*.write',
  }
};

// Healthcare Data Standards Configuration
export const HEALTHCARE_STANDARDS_CONFIG = {
  // Data Classification
  DATA_CLASSIFICATION: {
    ENABLED: process.env.DATA_CLASSIFICATION_ENABLED === 'true',
    LEVELS: ['PUBLIC', 'INTERNAL', 'CONFIDENTIAL', 'RESTRICTED'],
    DEFAULT_LEVEL: 'CONFIDENTIAL',
  },

  // Data Retention Policies (NHS Guidelines)
  DATA_RETENTION: {
    PATIENT_DATA_YEARS: parseInt(process.env.PATIENT_DATA_RETENTION_YEARS || '7'),
    CLINICAL_DATA_YEARS: parseInt(process.env.CLINICAL_DATA_RETENTION_YEARS || '10'),
    AUDIT_LOG_YEARS: parseInt(process.env.AUDIT_LOG_RETENTION_YEARS || '7'),
    CONSENT_RECORD_YEARS: parseInt(process.env.CONSENT_RECORD_RETENTION_YEARS || '7'),
  },

  // Clinical Governance
  CLINICAL_GOVERNANCE: {
    ENABLED: process.env.CLINICAL_GOVERNANCE_ENABLED === 'true',
    QUALITY_ASSURANCE: process.env.QUALITY_ASSURANCE_ENABLED === 'true',
    CLINICAL_AUDIT: process.env.CLINICAL_AUDIT_ENABLED === 'true',
    RISK_MANAGEMENT: process.env.CLINICAL_RISK_MANAGEMENT === 'true',
  }
};

// NHS Spine Integration Configuration
export const NHS_SPINE_CONFIG = {
  // Spine Connection Settings
  CONNECTION: {
    ENABLED: process.env.NHS_SPINE_ENABLED === 'true',
    ENDPOINT: process.env.NHS_SPINE_ENDPOINT || '',
    CLIENT_ID: process.env.NHS_SPINE_CLIENT_ID || '',
    CLIENT_SECRET: process.env.NHS_SPINE_CLIENT_SECRET || '',
    TIMEOUT: parseInt(process.env.NHS_SPINE_TIMEOUT || '30000'),
  },

  // Spine Services
  SERVICES: {
    PDS_ENABLED: process.env.NHS_PDS_ENABLED === 'true', // Personal Demographics Service
    SDS_ENABLED: process.env.NHS_SDS_ENABLED === 'true', // Spine Directory Service
    MESH_ENABLED: process.env.NHS_MESH_ENABLED === 'true', // Message Exchange for Social Care and Health
  },

  // Security Configuration
  SECURITY: {
    TLS_MUTUAL_AUTH: process.env.NHS_SPINE_MUTUAL_AUTH === 'true',
    CERTIFICATE_PATH: process.env.NHS_SPINE_CERT_PATH || '',
    PRIVATE_KEY_PATH: process.env.NHS_SPINE_KEY_PATH || '',
    CA_CERTIFICATE_PATH: process.env.NHS_SPINE_CA_CERT_PATH || '',
  }
};

// Compliance Monitoring Configuration
export const COMPLIANCE_MONITORING_CONFIG = {
  // Automated Compliance Checks
  AUTOMATED_CHECKS: {
    ENABLED: process.env.COMPLIANCE_MONITORING_ENABLED === 'true',
    CHECK_INTERVAL_HOURS: parseInt(process.env.COMPLIANCE_CHECK_INTERVAL || '24'),
    ALERT_THRESHOLD: process.env.COMPLIANCE_ALERT_THRESHOLD || 'HIGH',
  },

  // Compliance Reporting
  REPORTING: {
    AUTOMATED_REPORTS: process.env.AUTOMATED_COMPLIANCE_REPORTS === 'true',
    REPORT_FREQUENCY: process.env.COMPLIANCE_REPORT_FREQUENCY || 'MONTHLY',
    STAKEHOLDER_NOTIFICATIONS: process.env.STAKEHOLDER_NOTIFICATIONS === 'true',
  },

  // Audit Requirements
  AUDIT: {
    COMPREHENSIVE_LOGGING: process.env.COMPREHENSIVE_AUDIT_LOGGING === 'true',
    REAL_TIME_MONITORING: process.env.REAL_TIME_AUDIT_MONITORING === 'true',
    TAMPER_PROTECTION: process.env.AUDIT_TAMPER_PROTECTION === 'true',
    LONG_TERM_RETENTION: process.env.AUDIT_LONG_TERM_RETENTION === 'true',
  }
};

// Patient Safety Configuration
export const PATIENT_SAFETY_CONFIG = {
  // Safety Monitoring
  MONITORING: {
    ENABLED: process.env.PATIENT_SAFETY_MONITORING === 'true',
    REAL_TIME_ALERTS: process.env.PATIENT_SAFETY_ALERTS === 'true',
    INCIDENT_TRACKING: process.env.PATIENT_SAFETY_INCIDENTS === 'true',
    RISK_SCORING: process.env.PATIENT_SAFETY_RISK_SCORING === 'true',
  },

  // Safety Protocols
  PROTOCOLS: {
    DATA_VALIDATION: process.env.PATIENT_DATA_VALIDATION === 'true',
    DOUBLE_VERIFICATION: process.env.PATIENT_DOUBLE_VERIFICATION === 'true',
    ERROR_PREVENTION: process.env.PATIENT_ERROR_PREVENTION === 'true',
    SAFETY_CHECKS: process.env.PATIENT_SAFETY_CHECKS === 'true',
  },

  // Incident Response
  INCIDENT_RESPONSE: {
    AUTOMATED_DETECTION: process.env.INCIDENT_AUTO_DETECTION === 'true',
    IMMEDIATE_ALERTS: process.env.INCIDENT_IMMEDIATE_ALERTS === 'true',
    ESCALATION_PROCEDURES: process.env.INCIDENT_ESCALATION === 'true',
    ROOT_CAUSE_ANALYSIS: process.env.INCIDENT_ROOT_CAUSE === 'true',
  }
};

// Export all configurations
export const NHS_CQC_CONFIG = {
  NHS_DTAC: NHS_DTAC_CONFIG,
  CQC_KLOE: CQC_KLOE_CONFIG,
  NHS_DSPT: NHS_DSPT_CONFIG,
  FHIR: FHIR_CONFIG,
  HEALTHCARE_STANDARDS: HEALTHCARE_STANDARDS_CONFIG,
  NHS_SPINE: NHS_SPINE_CONFIG,
  COMPLIANCE_MONITORING: COMPLIANCE_MONITORING_CONFIG,
  PATIENT_SAFETY: PATIENT_SAFETY_CONFIG,
};

// Validation function to ensure all required NHS/CQC settings are configured
export const validateNHSCQCCompliance = (): { isCompliant: boolean; issues: string[] } => {
  const issues: string[] = [];

  // Check NHS DTAC compliance
  if (!NHS_DTAC_CONFIG.TECHNICAL_SAFETY.FAIL_SAFE_ENABLED) {
    issues.push('NHS DTAC: Fail-safe mechanisms must be enabled');
  }

  if (!NHS_DTAC_CONFIG.INTEROPERABILITY.HL7_FHIR_R4_SUPPORT) {
    issues.push('NHS DTAC: HL7 FHIR R4 support must be enabled');
  }

  // Check CQC KLOEs compliance
  if (!CQC_KLOE_CONFIG.SAFETY.PATIENT_SAFETY_MONITORING) {
    issues.push('CQC KLOEs: Patient safety monitoring must be enabled');
  }

  if (!CQC_KLOE_CONFIG.WELL_LED.GOVERNANCE_FRAMEWORK) {
    issues.push('CQC KLOEs: Governance framework must be enabled');
  }

  // Check NHS DSPT compliance
  if (!NHS_DSPT_CONFIG.DATA_SECURITY.ENCRYPTION_AT_REST) {
    issues.push('NHS DSPT: Encryption at rest must be enabled');
  }

  if (!NHS_DSPT_CONFIG.DATA_SECURITY.ENCRYPTION_IN_TRANSIT) {
    issues.push('NHS DSPT: Encryption in transit must be enabled');
  }

  return {
    isCompliant: issues.length === 0,
    issues
  };
};

export default NHS_CQC_CONFIG;
