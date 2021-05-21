import {
  Entity, Column, PrimaryGeneratedColumn, ManyToOne, 
  BaseEntity, JoinTable
} from 'typeorm';

import {Users} from "./Users"

@Entity()
export class ToDos extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  label: string;

  @Column()
  done: string;

  @ManyToOne(() => Users, user => user.id)
  userid: Users;
}