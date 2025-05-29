import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { addAuditLog } from './audit.controller';
import { JWT_CONFIG } from '../config';
import { getUserByEmail, verifyPassword, updateLastLogin } from '../database/repositories/UserRepository';

export const login = async (req: Request, res: Response) => {
  try {
    console.log('Login attempt:', req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      console.log('Missing email or password');
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user by email
    const user = await getUserByEmail(email);

    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('User found, verifying password');
    // Verify password using bcrypt
    const isPasswordValid = await verifyPassword(user, password);

    if (!isPasswordValid) {
      console.log('Password verification failed');
      // Log failed login attempt
      await addAuditLog(
        'Failed login attempt',
        'auth',
        user.id,
        `${user.firstName} ${user.lastName}`,
        req.ip || '',
        req.get('User-Agent') || '',
        user.organizationId || '',
        user.role
      );

      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('Password verified, generating token');

    // Generate JWT token
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId
    };

    const token = (jwt as any).sign(payload, JWT_CONFIG.SECRET, {
      expiresIn: JWT_CONFIG.EXPIRY
    });

    // Update last login timestamp
    await updateLastLogin(user.id);

    // Log successful login
    await addAuditLog(
      'User logged in',
      'auth',
      user.id,
      `${user.firstName} ${user.lastName}`,
      req.ip || '',
      req.get('User-Agent') || '',
      user.organizationId || '',
      user.role
    );

    return res.status(200).json({
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        organizationId: user.organizationId,
        organizationName: user.organizationName
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'An error occurred during login' });
  }
};

export const validateToken = (req: Request, res: Response) => {
  // The auth middleware already validated the token, so we just return success
  // The req.user is attached by the middleware
  return res.status(200).json({
    valid: true,
    message: 'Token is valid',
    user: req.user
  });
};

// Logout is handled client-side by removing the token
// but we can log it here for audit trail
export const logout = (req: Request, res: Response) => {
  // Log logout
  if (req.user) {
    addAuditLog(
      'User logged out',
      'auth',
      req.user.userId,
      req.user.email,
      req.ip,
      req.get('User-Agent'),
      req.user.organizationId,
      req.user.role
    );
  }

  return res.status(200).json({ message: 'Logged out successfully' });
};
