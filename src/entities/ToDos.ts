import {
  Entity, Column, PrimaryGeneratedColumn, ManyToMany, 
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

  
}