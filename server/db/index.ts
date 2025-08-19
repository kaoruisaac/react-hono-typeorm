import { DataSource } from 'typeorm';
import { Employee } from './models/Employee';
import { EMPLOYEE_ROLE } from '~/shared/roles';

const {
  DEFAULT_ADMIN_EMAIL = 'admin@example.com',
  DEFAULT_ADMIN_PASSWORD = '123456',
} = process.env

const AppDataSource = new DataSource({
  type: 'sqlite',
  database: './storage/db.sqlite',
  entities: [
    Employee,
  ],
  synchronize: true,
  logging: true,
});

export const initializeDB = async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();

    // Create default admin user
    const employee = await Employee.findOne({ where: { email: DEFAULT_ADMIN_EMAIL } });

    if (!employee) {
      await Employee.create({
        name: 'Admin',
        email: DEFAULT_ADMIN_EMAIL,
        password: DEFAULT_ADMIN_PASSWORD,
        roles: [EMPLOYEE_ROLE.ADMIN],
      }).save();
    }

    console.log("Data Source has been initialized!");
  }
};