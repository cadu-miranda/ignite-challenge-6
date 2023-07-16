import "reflect-metadata";

import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { OperationType } from "../../entities/Statement";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe("Get Statement Operation", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();

    inMemoryStatementsRepository = new InMemoryStatementsRepository();

    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);

    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );

    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("should be able to get a statement operation", async () => {
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

    const transaction = await getStatementOperationUseCase.execute({
      user_id: createdUser?.id as string,
      statement_id: statement.id as string,
    });

    expect(transaction).toHaveProperty("id");
  });
});
