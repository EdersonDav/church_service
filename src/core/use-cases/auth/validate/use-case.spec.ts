import { Test, TestingModule } from '@nestjs/testing';
import { Input } from './input';
import { randomUUID } from 'crypto';
import { describe, beforeEach, it, expect } from '@jest/globals';
import { ValidateUser } from './use-case';
import { FakeUserRepository } from '../../../../database/repositories/fakes';
import { faker } from '@faker-js/faker';

import { MockAuthModule } from '../mock.module';
import { UserRepository } from '../../../../database/repositories/interfaces';
import { User } from '../../../../database/entities';
import { encodePass } from '../../../helpers';

describe('# Validate User', () => {
    let use_case: ValidateUser;
    let repository: FakeUserRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [MockAuthModule],
        }).compile();

        use_case = module.get<ValidateUser>(ValidateUser);
        repository = module.get<FakeUserRepository>(UserRepository);
    });
    const password = '123456789'
    const passEncoded = encodePass(password)
    const email = faker.internet.email()

    const user: User = {
        id: randomUUID(),
        email,
        password: passEncoded,
        name: faker.person.firstName()
    } as User;

    const input: Input = {
        email,
        password
    };

    const dataResult = {
        email: user.email,
        name: user.name
    }

    it.each([
        {
            run: true,
            should: 'Should be able to user login',
            input: () => input,
            setup: () => {
                repository.getByEmail.mockResolvedValueOnce(user);
            },
            expected: (output: any) => {
                expect(output).toEqual({ data: dataResult });
                expect(repository.getByEmail).toBeTruthy();
                expect(repository.getByEmail).toHaveBeenCalledWith(input.email);
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
