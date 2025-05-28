export const TestUsers = {
  EXISTING_EMAIL: 'sydney@fife',
  INVALID_EMAIL: 'wrong@reqres.in',
};

type UserData = {
  name: string;
  job: string;
};

export const TestData: { User: Record<string, UserData> } = {
  User: {
    ALICE: { name: 'Alice', job: 'QA' },
    BOB: { name: 'Bob', job: 'Developer' },
  },
};