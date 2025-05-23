import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt'

import { Input } from './input';
import { GetUser } from '../../user/get'
import { Output } from './output';
import { UUID } from 'crypto';

@Injectable()
export class ValidateUser {
  constructor(private readonly getUser: GetUser) { }
  async execute({ email, password }: Input): Promise<Output> {
    const {data} = await this.getUser.execute({search_by: 'email', search_data: email});
    if(!data?.password || !bcrypt.compareSync(password, data.password)) return { data: null };
    return { data: 
      {
        email: data.email || '',
        name: data.name || '',
        id: data.id || '' as UUID,
        is_verified: data.is_verified || false,
      } 
    };
    
  }
}
