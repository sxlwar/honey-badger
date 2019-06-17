import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class SubscriptionEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column({ readonly: true })
    subscribedAt: string;
}
