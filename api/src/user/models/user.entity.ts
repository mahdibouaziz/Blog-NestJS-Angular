import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class userEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  name: string;
}
