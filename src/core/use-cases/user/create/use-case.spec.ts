import { Test, TestingModule } from '@nestjs/testing';
import { describe, beforeEach, it, expect } from '@jest/globals';

import { Input } from './input';
import { CreateUser } from './use-case';
import { FakeUserRepository } from '../../../../database/repositories/fakes';
import { fa, faker } from '@faker-js/faker';

import { MockUserModule } from '../mock.module';
import { UserRepository } from '../../../../database/repositories/interfaces';
import { encodePass } from '../../../helpers';

describe('# Create User', () => {
    let use_case: CreateUser;
    let repository: FakeUserRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [MockUserModule],
        }).compile();

        use_case = module.get<CreateUser>(CreateUser);
        repository = module.get<FakeUserRepository>(UserRepository);
    });

    const input: Input = { 
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
    };

    it.each([
        {
            run: true,
            should: 'Should be able to create a user',
            input: () => input,
            setup: () => {
                repository.save.mockResolvedValueOnce(input);
            },
            expected: (output: any) => {
                expect(output).toEqual({ data:{...input} });
                expect(repository.save).toBeTruthy();
                expect(repository.save).toHaveBeenCalledWith(input);
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
