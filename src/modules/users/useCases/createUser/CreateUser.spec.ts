import "reflect-metadata";

import { CreateUserUseCase } from "./CreateUserUseCase";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Create User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to create a new user", async () => {
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

    expect(createdUser).toHaveProperty("id");
    expect(createdUser.name).toEqual(user.name);
    expect(createdUser.email).toEqual(user.email);
  });
});
