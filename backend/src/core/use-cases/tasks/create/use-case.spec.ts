import { Test, TestingModule } from '@nestjs/testing';
import { Input } from './input';
import { describe, beforeEach, it, expect } from '@jest/globals';
import { CreateTask } from './use-case';
import { FakeTaskRepository } from '../../../../database/repositories/fakes';
import { faker } from '@faker-js/faker';

import { MockTaskModule } from '../mock.module';
import { TaskRepository } from '../../../../database/repositories/interfaces';

describe('# Create Task', () => {
    let use_case: CreateTask;
    let repository: FakeTaskRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [MockTaskModule],
        }).compile();

        use_case = module.get<CreateTask>(CreateTask);
        repository = module.get<FakeTaskRepository>(TaskRepository);
    });

    const task = {
        id: faker.string.uuid(),
        name: faker.company.buzzVerb(),
        icon: faker.internet.url(),
        description: faker.company.buzzAdjective(),
        sector_id: faker.string.uuid(),
    };

    const input: Input = {
        name: task.name,
        icon: task.icon,
        description: task.description,
        sector_id: task.sector_id,
    };

    it.each([
        {
            run: true,
            should: 'Should be able to create a task',
            input: () => input,
            setup: () => {
                repository.save.mockResolvedValueOnce(task);
            },
            expected: (output: any) => {
                expect(output).toEqual({ data: task });
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
