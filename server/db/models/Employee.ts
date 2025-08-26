import { encrypt } from 'server/services/bcrypt';
import hashIds from 'server/services/hashId';
import {
  AfterLoad,
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import JsonEmployee from '~/JsonModels/JsonEmployee';
import { EMPLOYEE_ROLE } from '~/shared/roles';

@Entity({ name: 'employees' })
export class Employee extends BaseEntity {

  // columns

  @PrimaryGeneratedColumn()
    id!: number;

  @Column({ type: 'text', nullable: false })
    name!: string;

  @Index({ unique: true })
  @Column({ type: 'text', unique: true, nullable: false })
    email!: string;

  @Column({ type: 'simple-array', nullable: false })
    roles!: EMPLOYEE_ROLE[];

  @Column({ type: 'text', nullable: false })
    password!: string;

  @Column({ type: 'boolean', default: true })
    isActive!: boolean;

  @CreateDateColumn()
    createdAt!: Date;

  @UpdateDateColumn()
    updatedAt!: Date;

  // lifecycle

  private _prevPassword?: string;

  @AfterLoad()
  private onLoad() {
    this._prevPassword = this.password;
  }

  @BeforeInsert()
  @BeforeUpdate()
  private async hashPassword() {
    if (this._prevPassword !== this.password) {
      this.password = await encrypt(this.password);
    }
  }

  // methods

  toJSON() {
    return new JsonEmployee().load({
      hashId: hashIds.encode(this.id),
      name: this.name,
      email: this.email,
      roles: this.roles,
      isActive: this.isActive,
    });
  }
}
