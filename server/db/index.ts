import { DataSource } from 'typeorm';
import { EMPLOYEE_ROLE } from 'app/shared/roles';
import { Employee } from 'server/db/models/Employee';

const {
  DEFAULT_ADMIN_EMAIL = 'admin@example.com',
  DEFAULT_ADMIN_PASSWORD = '123456',
  ENVIRONMENT = 'production',
} = process.env;

const AppDataSource = new DataSource({
  type: 'sqlite',
  database: './storage/db.sqlite',
  migrations: ['server/db/migrations/*.ts'],
  migrationsTableName: 'migrations',
  entities: [
    Employee,
  ],
  synchronize: ENVIRONMENT === 'development',
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

    console.log('Data Source has been initialized!');
  }
};

export default AppDataSource;