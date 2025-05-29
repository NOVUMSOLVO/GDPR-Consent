import { AppDataSource } from '../config';
import { AuditLog } from '../entities/AuditLog';
import { Between, Like } from 'typeorm';

// Repository for audit logs
export const AuditLogRepository = AppDataSource.getRepository(AuditLog);

// Add audit log
export const addAuditLog = async (auditData: Partial<AuditLog>): Promise<AuditLog> => {
  const auditLog = AuditLogRepository.create(auditData);
  return await AuditLogRepository.save(auditLog);
};

// Get audit logs with pagination and filtering
export const getAuditLogs = async (
  page: number = 1,
  limit: number = 20,
  filters: Record<string, any> = {},
  sortBy: string = 'timestamp',
  sortOrder: 'ASC' | 'DESC' = 'DESC'
): Promise<[AuditLog[], number]> => {
  const whereClause: Record<string, any> = {};
  
  // Apply filters
  if (filters.category) {
    whereClause.category = filters.category;
  }
  
  if (filters.action) {
    whereClause.action = Like(`%${filters.action}%`);
  }
  
  if (filters.userId) {
    whereClause.userId = filters.userId;
  }
  
  if (filters.startDate && filters.endDate) {
    whereClause.timestamp = Between(
      new Date(filters.startDate),
      new Date(filters.endDate)
    );
  }
  
  return await AuditLogRepository.findAndCount({
    where: whereClause,
    order: { [sortBy]: sortOrder },
    skip: (page - 1) * limit,
    take: limit,
  });
};

// Get audit log by ID
export const getAuditLogById = async (id: string): Promise<AuditLog | null> => {
  return await AuditLogRepository.findOne({ where: { id } });
};

// Get audit log statistics
export const getAuditLogStatistics = async (): Promise<any> => {
  // Get count by category
  const categoryStats = await AuditLogRepository
    .createQueryBuilder('audit')
    .select('audit.category', 'category')
    .addSelect('COUNT(*)', 'count')
    .groupBy('audit.category')
    .getRawMany();
  
  // Get count by day for the last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const dailyStats = await AuditLogRepository
    .createQueryBuilder('audit')
    .select('DATE(audit.timestamp)', 'date')
    .addSelect('COUNT(*)', 'count')
    .where('audit.timestamp >= :startDate', { startDate: thirtyDaysAgo })
    .groupBy('DATE(audit.timestamp)')
    .orderBy('date', 'ASC')
    .getRawMany();
  
  return {
    totalCount: await AuditLogRepository.count(),
    categoryStats,
    dailyStats,
  };
};
