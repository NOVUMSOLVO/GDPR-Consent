import { Request, Response } from 'express';
import { addAuditLog as addAuditLogToDb, getAuditLogs as getAuditLogsFromDb } from '../database/repositories/AuditRepository';

// Add an audit log entry
export const addAuditLog = async (
  action: string,
  category: string,
  userId: string,
  userName: string,
  ipAddress?: string,
  userAgent?: string,
  organizationId?: string,
  role?: string
): Promise<void> => {
  try {
    await addAuditLogToDb({
      action,
      category,
      userId,
      userName,
      ipAddress,
      userAgent,
      organizationId,
      role,
      details: {
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error adding audit log:', error);
  }
};

// Get all audit logs with pagination and filtering
export const getAuditLogs = async (req: Request, res: Response) => {
  try {
    // Parse query parameters for filtering
    const category = req.query.category as string;
    const userId = req.query.userId as string;
    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;
    const sortBy = (req.query.sortBy as string) || 'timestamp';
    const sortOrder = ((req.query.sortOrder as string)?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC') as 'ASC' | 'DESC';

    // Parse pagination parameters
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 20;

    // Create filters object
    const filters: Record<string, any> = {};

    if (category) {
      filters.category = category;
    }

    if (userId) {
      filters.userId = userId;
    }

    if (startDate && endDate) {
      filters.startDate = startDate;
      filters.endDate = endDate;
    }

    // Get logs from database with pagination and filtering
    const [logs, total] = await getAuditLogsFromDb(page, limit, filters, sortBy, sortOrder);

    return res.status(200).json({
      data: logs,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error retrieving audit logs:', error);
    return res.status(500).json({ message: 'Failed to retrieve audit logs' });
  }
};