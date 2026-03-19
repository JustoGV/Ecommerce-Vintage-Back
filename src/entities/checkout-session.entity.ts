import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export type CheckoutSessionStatus = 'pending' | 'approved';

@Entity('checkout_sessions')
export class CheckoutSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'preference_id', unique: true })
  preferenceId: string;

  @Column({ type: 'jsonb' })
  items: Array<{ productId: string; quantity: number }>;

  @Column({ default: 'pending' })
  status: CheckoutSessionStatus;

  @Column({ name: 'payment_id', nullable: true })
  paymentId?: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
