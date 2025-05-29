import { AppDataSource } from '../config';
import { User } from '../entities/User';
import bcrypt from 'bcryptjs';

// Repository for users
export const UserRepository = AppDataSource.getRepository(User);

// Get user by email
export const getUserByEmail = async (email: string): Promise<User | null> => {
  return await UserRepository.findOne({ where: { email, active: true } });
};

// Get user by ID
export const getUserById = async (id: string): Promise<User | null> => {
  return await UserRepository.findOne({ where: { id, active: true } });
};

// Create user
export const createUser = async (userData: Partial<User>): Promise<User> => {
  // Hash password if provided
  if (userData.password) {
    userData.password = await bcrypt.hash(userData.password, 10);
  }
  
  const user = UserRepository.create(userData);
  return await UserRepository.save(user);
};

// Update user
export const updateUser = async (id: string, userData: Partial<User>): Promise<User | null> => {
  // Hash password if provided
  if (userData.password) {
    userData.password = await bcrypt.hash(userData.password, 10);
  }
  
  await UserRepository.update(id, userData);
  return await UserRepository.findOne({ where: { id } });
};

// Delete user (soft delete)
export const deleteUser = async (id: string): Promise<boolean> => {
  const result = await UserRepository.update(id, { active: false });
  return result.affected ? result.affected > 0 : false;
};

// Verify password
export const verifyPassword = async (user: User, password: string): Promise<boolean> => {
  return await bcrypt.compare(password, user.password);
};

// Update last login
export const updateLastLogin = async (id: string): Promise<void> => {
  await UserRepository.update(id, { lastLoginAt: new Date() });
};
