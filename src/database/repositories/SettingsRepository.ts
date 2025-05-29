import { AppDataSource } from '../config';
import { SystemSetting } from '../entities/SystemSetting';

// Repository for system settings
export const SystemSettingRepository = AppDataSource.getRepository(SystemSetting);

// Get all settings
export const getAllSettings = async (): Promise<Record<string, any>> => {
  const settings = await SystemSettingRepository.find();
  
  // Convert to key-value object
  return settings.reduce((acc, setting) => {
    acc[setting.key] = setting.value;
    return acc;
  }, {} as Record<string, any>);
};

// Get setting by key
export const getSetting = async (key: string): Promise<any> => {
  const setting = await SystemSettingRepository.findOne({ where: { key } });
  return setting ? setting.value : null;
};

// Save setting
export const saveSetting = async (key: string, value: any, description?: string): Promise<SystemSetting> => {
  // Check if setting exists
  let setting = await SystemSettingRepository.findOne({ where: { key } });
  
  if (setting) {
    // Update existing setting
    setting.value = value;
    if (description) {
      setting.description = description;
    }
  } else {
    // Create new setting
    setting = SystemSettingRepository.create({
      key,
      value,
      description,
    });
  }
  
  return await SystemSettingRepository.save(setting);
};

// Save multiple settings
export const saveSettings = async (settings: Record<string, any>): Promise<void> => {
  const promises = Object.entries(settings).map(([key, value]) => 
    saveSetting(key, value)
  );
  
  await Promise.all(promises);
};

// Delete setting
export const deleteSetting = async (key: string): Promise<boolean> => {
  const result = await SystemSettingRepository.delete({ key });
  return result.affected ? result.affected > 0 : false;
};

// Initialize default settings
export const initializeDefaultSettings = async (): Promise<void> => {
  const defaultSettings = {
    sessionTimeoutMinutes: 30,
    enableAuditLogging: true,
    enableNotifications: false,
    dataRetentionDays: 365,
  };
  
  const descriptions = {
    sessionTimeoutMinutes: 'Admin session timeout in minutes',
    enableAuditLogging: 'Enable audit logging for system activities',
    enableNotifications: 'Enable email notifications for important events',
    dataRetentionDays: 'Number of days to retain consent records',
  };
  
  for (const [key, value] of Object.entries(defaultSettings)) {
    const setting = await SystemSettingRepository.findOne({ where: { key } });
    
    if (!setting) {
      await saveSetting(key, value, descriptions[key as keyof typeof descriptions]);
    }
  }
};
