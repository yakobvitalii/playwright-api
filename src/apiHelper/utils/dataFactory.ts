export const createUserPayload = () => {
  const timestamp = Date.now();
  return {
    name: `User_${timestamp}`,
    job: 'Tester'
  };
};

export function generateAuthData(overrides?: Partial<{ email: string; password: string }>) {
  const defaultData = {
    email: 'eve.holt@reqres.in',
    password: 'cityslicka',
  };

  return { ...defaultData, ...overrides };
};
