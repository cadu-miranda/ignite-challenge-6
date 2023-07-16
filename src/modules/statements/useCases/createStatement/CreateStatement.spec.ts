import "reflect-metadata";

import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { OperationType } from "../../entities/Statement";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;

describe("Create Statement", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();

    inMemoryStatementsRepository = new InMemoryStatementsRepository();

    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);

    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("should be able to make a new deposit", async () => {
    const user = {
      name: "User Test",
      email: "usertest@email.com",
      password: "1234",
    };

    const createdUser = await createUserUseCase.execute({
      name: user.name,
      email: user.email,
      password: user.password,
    });

    const statement = await createStatementUseCase.execute({
      user_id: createdUser?.id as string,
      type: OperationType.DEPOSIT,
      amount: 100,
      description: "Deposit test",
    });

    expect(statement).toHaveProperty("id");
  });

  it("should be able to make a new withdraw", async () => {
    const user = {
      name: "User Test",
      email: "usertest@email.com",
      password: "1234",
    };

    await createUserUseCase.execute({
      name: user.name,
      email: user.email,
      password: user.password,
    });

    const createdUser = await inMemoryUsersRepository.findByEmail(user.email);

    await createStatementUseCase.execute({
      user_id: createdUser?.id as string,
      type: OperationType.DEPOSIT,
      amount: 100,
      description: "Deposit test",
    });

    const withdraw = await createStatementUseCase.execute({
      user_id: createdUser?.id as string,
      type: OperationType.WITHDRAW,
      amount: 50,
      description: "Withdraw test",
    });

    expect(withdraw).toHaveProperty("id");
  });
});
