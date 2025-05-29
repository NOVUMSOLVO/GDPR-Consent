import { AppDataSource } from '../config';
import { ConsentRecord } from '../entities/ConsentRecord';
import { ConsentOption } from '../entities/ConsentOption';

// Repository for consent records
export const ConsentRecordRepository = AppDataSource.getRepository(ConsentRecord);

// Repository for consent options
export const ConsentOptionRepository = AppDataSource.getRepository(ConsentOption);

// Get consent record by email
export const getConsentByEmail = async (email: string): Promise<ConsentRecord | null> => {
  return await ConsentRecordRepository.findOne({ where: { email, active: true } });
};

// Save consent record
export const saveConsent = async (consentData: Partial<ConsentRecord>): Promise<ConsentRecord> => {
  const consent = ConsentRecordRepository.create(consentData);
  return await ConsentRecordRepository.save(consent);
};

// Update consent record
export const updateConsent = async (id: string, consentData: Partial<ConsentRecord>): Promise<ConsentRecord | null> => {
  await ConsentRecordRepository.update(id, consentData);
  return await ConsentRecordRepository.findOne({ where: { id } });
};

// Get all consent records with pagination
export const getAllConsents = async (
  page: number = 1,
  limit: number = 10,
  search?: string,
  sortBy: string = 'createdAt',
  sortOrder: 'ASC' | 'DESC' = 'DESC'
): Promise<[ConsentRecord[], number]> => {
  const queryBuilder = ConsentRecordRepository.createQueryBuilder('consent');
  
  if (search) {
    queryBuilder.where(
      'consent.email LIKE :search OR consent.firstName LIKE :search OR consent.lastName LIKE :search',
      { search: `%${search}%` }
    );
  }
  
  return await queryBuilder
    .orderBy(`consent.${sortBy}`, sortOrder)
    .skip((page - 1) * limit)
    .take(limit)
    .getManyAndCount();
};

// Delete consent record
export const deleteConsent = async (id: string): Promise<boolean> => {
  const result = await ConsentRecordRepository.update(id, { active: false });
  return result.affected ? result.affected > 0 : false;
};

// Get consent options
export const getConsentOptions = async (): Promise<ConsentOption[]> => {
  return await ConsentOptionRepository.find({ where: { active: true } });
};

// Save consent option
export const saveConsentOption = async (option: Partial<ConsentOption>): Promise<ConsentOption> => {
  const consentOption = ConsentOptionRepository.create(option);
  return await ConsentOptionRepository.save(consentOption);
};

// Update consent option
export const updateConsentOption = async (id: string, option: Partial<ConsentOption>): Promise<ConsentOption | null> => {
  await ConsentOptionRepository.update(id, option);
  return await ConsentOptionRepository.findOne({ where: { id } });
};

// Delete consent option
export const deleteConsentOption = async (id: string): Promise<boolean> => {
  const result = await ConsentOptionRepository.update(id, { active: false });
  return result.affected ? result.affected > 0 : false;
};
