import { JwtService } from '@nestjs/jwt';

export class FakeJWT extends JwtService {
    sign = jest.fn();
    signAsync = jest.fn();
    verify = jest.fn();
    verifyAsync = jest.fn();
    decode = jest.fn();
}