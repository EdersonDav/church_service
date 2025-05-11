import { Test, TestingModule } from '@nestjs/testing';
import { CreateToken } from './use-case';
import { Input } from './input';
import { faker } from '@faker-js/faker';
import { JwtService } from '@nestjs/jwt';
import { MockAuthModule } from '../mock.module';
import { randomUUID } from 'crypto';

describe('# Create Token', () => {
    let use_case: CreateToken;
    let jwtService: JwtService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [MockAuthModule],
        }).compile();

        use_case = module.get<CreateToken>(CreateToken);
        jwtService = module.get<JwtService>(JwtService);
    });

    const input: Input = {
        email: faker.internet.email(),
        name: faker.person.firstName()
    };
    const access_token = randomUUID();

    it.each([
        {
            run: true,
            should: 'Should be able to create a new access token',
            input: () => input,
            setup: () => {
                jest.spyOn(jwtService, 'signAsync').mockResolvedValueOnce(access_token);
            },
            expected: (output: any) => {
                expect(output).toStrictEqual({ access_token });
                expect(jwtService.signAsync).toHaveBeenCalledWith(input);
            },
        },
    ])('$should', async ({ run, setup, input, expected }) => {
        if (!run) return;

        if (setup) setup();

        const output = await use_case.execute(input());
        expected(output);
    });
});