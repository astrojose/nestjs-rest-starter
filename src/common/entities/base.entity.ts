import {
  CreateDateColumn,
  DeleteDateColumn,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class BasicEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'updated_at',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    type: 'timestamptz',
    nullable: true,
    name: 'deleted_at',
  })
  deletedAt?: Date | null;

  @Column({ type: 'int', nullable: true, name: 'created_by' })
  createdBy?: number | null;

  @Column({ type: 'int', nullable: true, name: 'updated_by' })
  updatedBy?: number | null;

  mergeData<T>(data: T): this & T {
    return Object.assign(this as any, data);
  }
}
