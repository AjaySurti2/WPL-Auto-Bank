# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.




### React
For each operation, there is a wrapper hook that can be used to call the operation.

Here are all of the hooks that get generated:
```ts
import { useCreateUser, useGetUser, useCreateBankAccount, useListBankAccounts, useCreateDownloadSchedule, useUpdateDownloadSchedule, useDeleteDownloadSchedule, useListDownloadSchedules, useCreateStatement, useListStatements } from '@dataconnect/generated/react';
// The types of these hooks are available in react/index.d.ts

const { data, isPending, isSuccess, isError, error } = useCreateUser(createUserVars);

const { data, isPending, isSuccess, isError, error } = useGetUser();

const { data, isPending, isSuccess, isError, error } = useCreateBankAccount(createBankAccountVars);

const { data, isPending, isSuccess, isError, error } = useListBankAccounts();

const { data, isPending, isSuccess, isError, error } = useCreateDownloadSchedule(createDownloadScheduleVars);

const { data, isPending, isSuccess, isError, error } = useUpdateDownloadSchedule(updateDownloadScheduleVars);

const { data, isPending, isSuccess, isError, error } = useDeleteDownloadSchedule(deleteDownloadScheduleVars);

const { data, isPending, isSuccess, isError, error } = useListDownloadSchedules();

const { data, isPending, isSuccess, isError, error } = useCreateStatement(createStatementVars);

const { data, isPending, isSuccess, isError, error } = useListStatements();

```

Here's an example from a different generated SDK:

```ts
import { useListAllMovies } from '@dataconnect/generated/react';

function MyComponent() {
  const { isLoading, data, error } = useListAllMovies();
  if(isLoading) {
    return <div>Loading...</div>
  }
  if(error) {
    return <div> An Error Occurred: {error} </div>
  }
}

// App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MyComponent from './my-component';

function App() {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>
    <MyComponent />
  </QueryClientProvider>
}
```



## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { createUser, getUser, createBankAccount, listBankAccounts, createDownloadSchedule, updateDownloadSchedule, deleteDownloadSchedule, listDownloadSchedules, createStatement, listStatements } from '@dataconnect/generated';


// Operation CreateUser:  For variables, look at type CreateUserVars in ../index.d.ts
const { data } = await CreateUser(dataConnect, createUserVars);

// Operation GetUser: 
const { data } = await GetUser(dataConnect);

// Operation CreateBankAccount:  For variables, look at type CreateBankAccountVars in ../index.d.ts
const { data } = await CreateBankAccount(dataConnect, createBankAccountVars);

// Operation ListBankAccounts: 
const { data } = await ListBankAccounts(dataConnect);

// Operation CreateDownloadSchedule:  For variables, look at type CreateDownloadScheduleVars in ../index.d.ts
const { data } = await CreateDownloadSchedule(dataConnect, createDownloadScheduleVars);

// Operation UpdateDownloadSchedule:  For variables, look at type UpdateDownloadScheduleVars in ../index.d.ts
const { data } = await UpdateDownloadSchedule(dataConnect, updateDownloadScheduleVars);

// Operation DeleteDownloadSchedule:  For variables, look at type DeleteDownloadScheduleVars in ../index.d.ts
const { data } = await DeleteDownloadSchedule(dataConnect, deleteDownloadScheduleVars);

// Operation ListDownloadSchedules: 
const { data } = await ListDownloadSchedules(dataConnect);

// Operation CreateStatement:  For variables, look at type CreateStatementVars in ../index.d.ts
const { data } = await CreateStatement(dataConnect, createStatementVars);

// Operation ListStatements: 
const { data } = await ListStatements(dataConnect);


```