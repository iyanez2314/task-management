import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

describe('TasksController', () => {
  let controller: TasksController;
  let service: TasksService;

  const mockTasksService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: mockTasksService,
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    service = module.get<TasksService>(TasksService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return an array of tasks', async () => {
      const mockTasks = [
        { id: '1', title: 'Task 1', status: 'todo' },
        { id: '2', title: 'Task 2', status: 'done' },
      ];

      mockTasksService.findAll.mockResolvedValue(mockTasks);

      const result = await controller.findAll(null);

      expect(result).toEqual(mockTasks);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single task', async () => {
      const mockTask = { id: '1', title: 'Task 1', status: 'todo' };

      mockTasksService.findOne.mockResolvedValue(mockTask);

      const result = await controller.findOne('1');

      expect(result).toEqual(mockTask);
      expect(service.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('create', () => {
    it('should create a new task', async () => {
      const createDto = {
        title: 'New Task',
        description: 'Description',
        status: 'todo' as any,
        priority: 'medium' as any,
        organizationId: 'org-123',
        assigneeId: 'user-123',
        dueDate: new Date(),
      };

      const mockTask = { id: '1', ...createDto };

      mockTasksService.create.mockResolvedValue(mockTask);

      const result = await controller.create(createDto);

      expect(result).toEqual(mockTask);
      expect(service.create).toHaveBeenCalledWith(
        createDto.title,
        createDto.description,
        createDto.organizationId,
        createDto.assigneeId,
        createDto.status,
        createDto.priority,
        createDto.dueDate
      );
    });
  });

  describe('remove', () => {
    it('should delete a task', async () => {
      mockTasksService.remove.mockResolvedValue(undefined);

      await controller.remove('1');

      expect(service.remove).toHaveBeenCalledWith('1');
    });
  });
});
