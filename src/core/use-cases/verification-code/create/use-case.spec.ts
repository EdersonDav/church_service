import { Test, TestingModule } from '@nestjs/testing';
import { describe, beforeEach, it, expect } from '@jest/globals';
import { faker } from '@faker-js/faker';
import { randomUUID } from "crypto";

import { Input } from './input';
import { CreateVerificationCode } from './use-case';
import { MockVerificationCodeModule } from '../mock.module';
import { FakeVerificationCodeRepository, FakeEmailRepository } from '../../../../database/repositories/fakes';
import { VerificationCodeRepository, EmailRepository } from '../../../../database/repositories/interfaces';
import { User } from '../../../../database/entities';
import { encodePass, genCode } from '../../../helpers';

describe('# Create Verification Code', () => {
    let use_case: CreateVerificationCode;
    let repository: FakeVerificationCodeRepository;
    let repositoryEmail: FakeEmailRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [MockVerificationCodeModule],
        }).compile();

        use_case = module.get<CreateVerificationCode>(CreateVerificationCode);
        repository = module.get<FakeVerificationCodeRepository>(VerificationCodeRepository);
        repositoryEmail = module.get<FakeEmailRepository>(EmailRepository);
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
    const code = genCode();

    it.each([
        {
            run: true,
            should: 'Should be able to create a verification code',
            input: () => input,
            setup: () => {
                repository.save.mockResolvedValueOnce(code);
            },
            expected: (output: any) => {
                expect(output).toEqual(undefined);
                expect(repository.save).toBeTruthy();
                expect(repository.save).toHaveBeenCalledTimes(1);
                expect(repositoryEmail.sendVerificationCode).toHaveBeenCalledTimes(1)
                expect(repositoryEmail.sendVerificationCode).toHaveBeenCalledWith(user.email, code);
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
