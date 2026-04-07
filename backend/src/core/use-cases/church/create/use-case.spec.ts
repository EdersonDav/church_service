import { Test, TestingModule } from '@nestjs/testing';
import { Input } from './input';
import { describe, beforeEach, it, expect } from '@jest/globals';
import { CreateChurch } from './use-case';
import { FakeChurchRepository } from '../../../../database/repositories/fakes';
import { faker } from '@faker-js/faker';

import { MockChurchModule } from '../mock.module';
import { ChurchRepository } from '../../../../database/repositories/interfaces';
import { randomUUID } from 'crypto';

describe('# Create Church', () => {
  let use_case: CreateChurch;
  let repository: FakeChurchRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MockChurchModule],
    }).compile();

    use_case = module.get<CreateChurch>(CreateChurch);
    repository = module.get<FakeChurchRepository>(ChurchRepository);
  });

  const church = {
    name: faker.company.buzzVerb(),
    user_id: randomUUID(),
  };

  const input: Input = { ...church };
  const outPut = { data: { name: church.name, id: randomUUID() } };

  it.each([
    {
      run: true,
      should: 'Should be able to create a church',
      input: () => input,
      setup: () => {
        repository.save.mockResolvedValueOnce(outPut);
      },
      expected: (output: any) => {
        expect(output).toEqual(outPut);
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
