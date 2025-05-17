import { Test, TestingModule } from '@nestjs/testing';
import { describe, beforeEach, it, expect } from '@jest/globals';

import { Input } from './input';
import { CreateVerificationCode } from './use-case';
import { FakeVerificationCodeRepository } from '../../../../database/repositories/fakes';
import { faker } from '@faker-js/faker';

import { MockVerificationCodeModule } from '../mock.module';
import { VerificationCodeRepository } from '../../../../database/repositories/interfaces';
import { User } from '../../../../database/entities';
import { randomUUID } from "crypto";
import { encodePass } from '../../../helpers';

describe('# Create Verification Code', () => {
    let use_case: CreateVerificationCode;
    let repository: FakeVerificationCodeRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [MockVerificationCodeModule],
        }).compile();

        use_case = module.get<CreateVerificationCode>(CreateVerificationCode);
        repository = module.get<FakeVerificationCodeRepository>(VerificationCodeRepository);
    });

    const user: User = {
        email: faker.internet.email(),
        id: randomUUID(),
        is_verified: false,
        name: faker.person.firstName(),
        password: encodePass(faker.internet.url()),
    }

    const input: Input = { 
        user
    };

    it.each([
        {
            run: true,
            should: 'Should be able to create a verification code',
            input: () => input,
            setup: () => {
                repository.save.mockResolvedValueOnce(true);
            },
            expected: (output: any) => {
                expect(output).toEqual({ created: true });
                expect(repository.save).toBeTruthy();
                expect(repository.save).toHaveBeenCalledTimes(1);
            },
        },
    ])('$should', async ({ run, setup, input, expected }) => {
        if (!run) return;

        if (setup) setup();

        use_case
            .execute(input() as Input)
            .then(expected)
            .catch(expected);
    });
});
