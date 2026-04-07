import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Input } from './input';
import { Output } from './output';

@Injectable()
export class CreateToken {
  constructor(
    private jwtService: JwtService
  ) { }
  async execute(input: Input): Promise<Output> {
    const data ={
      access_token: await this.jwtService.signAsync(input),
    };

    return { data };
  }
}
