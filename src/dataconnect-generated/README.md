# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetUser*](#getuser)
  - [*ListBankAccounts*](#listbankaccounts)
  - [*ListDownloadSchedules*](#listdownloadschedules)
  - [*ListStatements*](#liststatements)
  - [*ListNotifications*](#listnotifications)
- [**Mutations**](#mutations)
  - [*CreateUser*](#createuser)
  - [*CreateBankAccount*](#createbankaccount)
  - [*UpdateBankAccount*](#updatebankaccount)
  - [*DeleteBankAccount*](#deletebankaccount)
  - [*CreateDownloadSchedule*](#createdownloadschedule)
  - [*UpdateDownloadSchedule*](#updatedownloadschedule)
  - [*DeleteDownloadSchedule*](#deletedownloadschedule)
  - [*CreateStatement*](#createstatement)
  - [*CreateNotification*](#createnotification)
  - [*MarkNotificationRead*](#marknotificationread)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## GetUser
You can execute the `GetUser` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getUser(): QueryPromise<GetUserData, undefined>;

interface GetUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetUserData, undefined>;
}
export const getUserRef: GetUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUser(dc: DataConnect): QueryPromise<GetUserData, undefined>;

interface GetUserRef {
  ...
  (dc: DataConnect): QueryRef<GetUserData, undefined>;
}
export const getUserRef: GetUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getUserRef:
```typescript
const name = getUserRef.operationName;
console.log(name);
```

### Variables
The `GetUser` query has no variables.
### Return Type
Recall that executing the `GetUser` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetUserData {
  user?: {
    id: string;
    displayName: string;
    email: string;
    photoUrl?: string | null;
    role: string;
    avatar?: string | null;
    createdAt: TimestampString;
  } & User_Key;
}
```
### Using `GetUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUser } from '@dataconnect/generated';


// Call the `getUser()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUser();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getUser(dataConnect);

console.log(data.user);

// Or, you can use the `Promise` API.
getUser().then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

### Using `GetUser`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getUserRef } from '@dataconnect/generated';


// Call the `getUserRef()` function to get a reference to the query.
const ref = getUserRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getUserRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.user);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

## ListBankAccounts
You can execute the `ListBankAccounts` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listBankAccounts(): QueryPromise<ListBankAccountsData, undefined>;

interface ListBankAccountsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListBankAccountsData, undefined>;
}
export const listBankAccountsRef: ListBankAccountsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listBankAccounts(dc: DataConnect): QueryPromise<ListBankAccountsData, undefined>;

interface ListBankAccountsRef {
  ...
  (dc: DataConnect): QueryRef<ListBankAccountsData, undefined>;
}
export const listBankAccountsRef: ListBankAccountsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listBankAccountsRef:
```typescript
const name = listBankAccountsRef.operationName;
console.log(name);
```

### Variables
The `ListBankAccounts` query has no variables.
### Return Type
Recall that executing the `ListBankAccounts` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListBankAccountsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListBankAccountsData {
  bankAccounts: ({
    id: UUIDString;
    bankName: string;
    bankUrl?: string | null;
    logo?: string | null;
    accountNumber?: string | null;
    accountNumberMasked: string;
    connectionStatus: string;
    requiresOtp?: boolean | null;
    accountType?: string | null;
    createdAt: TimestampString;
    lastSyncedAt?: TimestampString | null;
  } & BankAccount_Key)[];
}
```
### Using `ListBankAccounts`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listBankAccounts } from '@dataconnect/generated';


// Call the `listBankAccounts()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listBankAccounts();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listBankAccounts(dataConnect);

console.log(data.bankAccounts);

// Or, you can use the `Promise` API.
listBankAccounts().then((response) => {
  const data = response.data;
  console.log(data.bankAccounts);
});
```

### Using `ListBankAccounts`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listBankAccountsRef } from '@dataconnect/generated';


// Call the `listBankAccountsRef()` function to get a reference to the query.
const ref = listBankAccountsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listBankAccountsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.bankAccounts);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.bankAccounts);
});
```

## ListDownloadSchedules
You can execute the `ListDownloadSchedules` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listDownloadSchedules(): QueryPromise<ListDownloadSchedulesData, undefined>;

interface ListDownloadSchedulesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListDownloadSchedulesData, undefined>;
}
export const listDownloadSchedulesRef: ListDownloadSchedulesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listDownloadSchedules(dc: DataConnect): QueryPromise<ListDownloadSchedulesData, undefined>;

interface ListDownloadSchedulesRef {
  ...
  (dc: DataConnect): QueryRef<ListDownloadSchedulesData, undefined>;
}
export const listDownloadSchedulesRef: ListDownloadSchedulesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listDownloadSchedulesRef:
```typescript
const name = listDownloadSchedulesRef.operationName;
console.log(name);
```

### Variables
The `ListDownloadSchedules` query has no variables.
### Return Type
Recall that executing the `ListDownloadSchedules` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListDownloadSchedulesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListDownloadSchedulesData {
  downloadSchedules: ({
    id: UUIDString;
    bankAccount: {
      id: UUIDString;
      bankName: string;
      accountNumberMasked: string;
    } & BankAccount_Key;
      frequency: string;
      scheduledTime?: string | null;
      targetFolder?: string | null;
      storageType?: string | null;
      nextDownloadAt: TimestampString;
      isActive: boolean;
      createdAt: TimestampString;
      lastDownloadAt?: TimestampString | null;
      statementFormat?: string | null;
      startDateOffset?: string | null;
  } & DownloadSchedule_Key)[];
}
```
### Using `ListDownloadSchedules`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listDownloadSchedules } from '@dataconnect/generated';


// Call the `listDownloadSchedules()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listDownloadSchedules();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listDownloadSchedules(dataConnect);

console.log(data.downloadSchedules);

// Or, you can use the `Promise` API.
listDownloadSchedules().then((response) => {
  const data = response.data;
  console.log(data.downloadSchedules);
});
```

### Using `ListDownloadSchedules`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listDownloadSchedulesRef } from '@dataconnect/generated';


// Call the `listDownloadSchedulesRef()` function to get a reference to the query.
const ref = listDownloadSchedulesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listDownloadSchedulesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.downloadSchedules);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.downloadSchedules);
});
```

## ListStatements
You can execute the `ListStatements` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listStatements(): QueryPromise<ListStatementsData, undefined>;

interface ListStatementsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListStatementsData, undefined>;
}
export const listStatementsRef: ListStatementsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listStatements(dc: DataConnect): QueryPromise<ListStatementsData, undefined>;

interface ListStatementsRef {
  ...
  (dc: DataConnect): QueryRef<ListStatementsData, undefined>;
}
export const listStatementsRef: ListStatementsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listStatementsRef:
```typescript
const name = listStatementsRef.operationName;
console.log(name);
```

### Variables
The `ListStatements` query has no variables.
### Return Type
Recall that executing the `ListStatements` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListStatementsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListStatementsData {
  statements: ({
    id: UUIDString;
    bankAccount: {
      bankName: string;
    };
      fileName: string;
      downloadDate: TimestampString;
      status?: string | null;
      fileRef: string;
  } & Statement_Key)[];
}
```
### Using `ListStatements`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listStatements } from '@dataconnect/generated';


// Call the `listStatements()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listStatements();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listStatements(dataConnect);

console.log(data.statements);

// Or, you can use the `Promise` API.
listStatements().then((response) => {
  const data = response.data;
  console.log(data.statements);
});
```

### Using `ListStatements`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listStatementsRef } from '@dataconnect/generated';


// Call the `listStatementsRef()` function to get a reference to the query.
const ref = listStatementsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listStatementsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.statements);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.statements);
});
```

## ListNotifications
You can execute the `ListNotifications` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listNotifications(): QueryPromise<ListNotificationsData, undefined>;

interface ListNotificationsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListNotificationsData, undefined>;
}
export const listNotificationsRef: ListNotificationsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listNotifications(dc: DataConnect): QueryPromise<ListNotificationsData, undefined>;

interface ListNotificationsRef {
  ...
  (dc: DataConnect): QueryRef<ListNotificationsData, undefined>;
}
export const listNotificationsRef: ListNotificationsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listNotificationsRef:
```typescript
const name = listNotificationsRef.operationName;
console.log(name);
```

### Variables
The `ListNotifications` query has no variables.
### Return Type
Recall that executing the `ListNotifications` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListNotificationsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListNotificationsData {
  notifications: ({
    id: UUIDString;
    message: string;
    type: string;
    isRead: boolean;
    createdAt: TimestampString;
    relatedStatementId?: UUIDString | null;
  } & Notification_Key)[];
}
```
### Using `ListNotifications`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listNotifications } from '@dataconnect/generated';


// Call the `listNotifications()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listNotifications();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listNotifications(dataConnect);

console.log(data.notifications);

// Or, you can use the `Promise` API.
listNotifications().then((response) => {
  const data = response.data;
  console.log(data.notifications);
});
```

### Using `ListNotifications`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listNotificationsRef } from '@dataconnect/generated';


// Call the `listNotificationsRef()` function to get a reference to the query.
const ref = listNotificationsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listNotificationsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.notifications);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.notifications);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateUser
You can execute the `CreateUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createUser(vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;

interface CreateUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
}
export const createUserRef: CreateUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createUser(dc: DataConnect, vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;

interface CreateUserRef {
  ...
  (dc: DataConnect, vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
}
export const createUserRef: CreateUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createUserRef:
```typescript
const name = createUserRef.operationName;
console.log(name);
```

### Variables
The `CreateUser` mutation requires an argument of type `CreateUserVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateUserVariables {
  displayName: string;
  email: string;
  photoUrl?: string | null;
  role: string;
  avatar?: string | null;
}
```
### Return Type
Recall that executing the `CreateUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateUserData {
  user_insert: User_Key;
}
```
### Using `CreateUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createUser, CreateUserVariables } from '@dataconnect/generated';

// The `CreateUser` mutation requires an argument of type `CreateUserVariables`:
const createUserVars: CreateUserVariables = {
  displayName: ..., 
  email: ..., 
  photoUrl: ..., // optional
  role: ..., 
  avatar: ..., // optional
};

// Call the `createUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createUser(createUserVars);
// Variables can be defined inline as well.
const { data } = await createUser({ displayName: ..., email: ..., photoUrl: ..., role: ..., avatar: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createUser(dataConnect, createUserVars);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
createUser(createUserVars).then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

### Using `CreateUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createUserRef, CreateUserVariables } from '@dataconnect/generated';

// The `CreateUser` mutation requires an argument of type `CreateUserVariables`:
const createUserVars: CreateUserVariables = {
  displayName: ..., 
  email: ..., 
  photoUrl: ..., // optional
  role: ..., 
  avatar: ..., // optional
};

// Call the `createUserRef()` function to get a reference to the mutation.
const ref = createUserRef(createUserVars);
// Variables can be defined inline as well.
const ref = createUserRef({ displayName: ..., email: ..., photoUrl: ..., role: ..., avatar: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createUserRef(dataConnect, createUserVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

## CreateBankAccount
You can execute the `CreateBankAccount` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createBankAccount(vars: CreateBankAccountVariables): MutationPromise<CreateBankAccountData, CreateBankAccountVariables>;

interface CreateBankAccountRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateBankAccountVariables): MutationRef<CreateBankAccountData, CreateBankAccountVariables>;
}
export const createBankAccountRef: CreateBankAccountRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createBankAccount(dc: DataConnect, vars: CreateBankAccountVariables): MutationPromise<CreateBankAccountData, CreateBankAccountVariables>;

interface CreateBankAccountRef {
  ...
  (dc: DataConnect, vars: CreateBankAccountVariables): MutationRef<CreateBankAccountData, CreateBankAccountVariables>;
}
export const createBankAccountRef: CreateBankAccountRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createBankAccountRef:
```typescript
const name = createBankAccountRef.operationName;
console.log(name);
```

### Variables
The `CreateBankAccount` mutation requires an argument of type `CreateBankAccountVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateBankAccountVariables {
  bankName: string;
  bankUrl?: string | null;
  logo?: string | null;
  accountNumber?: string | null;
  accountNumberMasked: string;
  connectionStatus: string;
  requiresOtp?: boolean | null;
  accountType?: string | null;
}
```
### Return Type
Recall that executing the `CreateBankAccount` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateBankAccountData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateBankAccountData {
  bankAccount_insert: BankAccount_Key;
}
```
### Using `CreateBankAccount`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createBankAccount, CreateBankAccountVariables } from '@dataconnect/generated';

// The `CreateBankAccount` mutation requires an argument of type `CreateBankAccountVariables`:
const createBankAccountVars: CreateBankAccountVariables = {
  bankName: ..., 
  bankUrl: ..., // optional
  logo: ..., // optional
  accountNumber: ..., // optional
  accountNumberMasked: ..., 
  connectionStatus: ..., 
  requiresOtp: ..., // optional
  accountType: ..., // optional
};

// Call the `createBankAccount()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createBankAccount(createBankAccountVars);
// Variables can be defined inline as well.
const { data } = await createBankAccount({ bankName: ..., bankUrl: ..., logo: ..., accountNumber: ..., accountNumberMasked: ..., connectionStatus: ..., requiresOtp: ..., accountType: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createBankAccount(dataConnect, createBankAccountVars);

console.log(data.bankAccount_insert);

// Or, you can use the `Promise` API.
createBankAccount(createBankAccountVars).then((response) => {
  const data = response.data;
  console.log(data.bankAccount_insert);
});
```

### Using `CreateBankAccount`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createBankAccountRef, CreateBankAccountVariables } from '@dataconnect/generated';

// The `CreateBankAccount` mutation requires an argument of type `CreateBankAccountVariables`:
const createBankAccountVars: CreateBankAccountVariables = {
  bankName: ..., 
  bankUrl: ..., // optional
  logo: ..., // optional
  accountNumber: ..., // optional
  accountNumberMasked: ..., 
  connectionStatus: ..., 
  requiresOtp: ..., // optional
  accountType: ..., // optional
};

// Call the `createBankAccountRef()` function to get a reference to the mutation.
const ref = createBankAccountRef(createBankAccountVars);
// Variables can be defined inline as well.
const ref = createBankAccountRef({ bankName: ..., bankUrl: ..., logo: ..., accountNumber: ..., accountNumberMasked: ..., connectionStatus: ..., requiresOtp: ..., accountType: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createBankAccountRef(dataConnect, createBankAccountVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.bankAccount_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.bankAccount_insert);
});
```

## UpdateBankAccount
You can execute the `UpdateBankAccount` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateBankAccount(vars: UpdateBankAccountVariables): MutationPromise<UpdateBankAccountData, UpdateBankAccountVariables>;

interface UpdateBankAccountRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateBankAccountVariables): MutationRef<UpdateBankAccountData, UpdateBankAccountVariables>;
}
export const updateBankAccountRef: UpdateBankAccountRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateBankAccount(dc: DataConnect, vars: UpdateBankAccountVariables): MutationPromise<UpdateBankAccountData, UpdateBankAccountVariables>;

interface UpdateBankAccountRef {
  ...
  (dc: DataConnect, vars: UpdateBankAccountVariables): MutationRef<UpdateBankAccountData, UpdateBankAccountVariables>;
}
export const updateBankAccountRef: UpdateBankAccountRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateBankAccountRef:
```typescript
const name = updateBankAccountRef.operationName;
console.log(name);
```

### Variables
The `UpdateBankAccount` mutation requires an argument of type `UpdateBankAccountVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateBankAccountVariables {
  id: UUIDString;
  bankName?: string | null;
  bankUrl?: string | null;
  logo?: string | null;
  accountNumber?: string | null;
  accountNumberMasked?: string | null;
  connectionStatus?: string | null;
  requiresOtp?: boolean | null;
  accountType?: string | null;
}
```
### Return Type
Recall that executing the `UpdateBankAccount` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateBankAccountData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateBankAccountData {
  bankAccount_update?: BankAccount_Key | null;
}
```
### Using `UpdateBankAccount`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateBankAccount, UpdateBankAccountVariables } from '@dataconnect/generated';

// The `UpdateBankAccount` mutation requires an argument of type `UpdateBankAccountVariables`:
const updateBankAccountVars: UpdateBankAccountVariables = {
  id: ..., 
  bankName: ..., // optional
  bankUrl: ..., // optional
  logo: ..., // optional
  accountNumber: ..., // optional
  accountNumberMasked: ..., // optional
  connectionStatus: ..., // optional
  requiresOtp: ..., // optional
  accountType: ..., // optional
};

// Call the `updateBankAccount()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateBankAccount(updateBankAccountVars);
// Variables can be defined inline as well.
const { data } = await updateBankAccount({ id: ..., bankName: ..., bankUrl: ..., logo: ..., accountNumber: ..., accountNumberMasked: ..., connectionStatus: ..., requiresOtp: ..., accountType: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateBankAccount(dataConnect, updateBankAccountVars);

console.log(data.bankAccount_update);

// Or, you can use the `Promise` API.
updateBankAccount(updateBankAccountVars).then((response) => {
  const data = response.data;
  console.log(data.bankAccount_update);
});
```

### Using `UpdateBankAccount`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateBankAccountRef, UpdateBankAccountVariables } from '@dataconnect/generated';

// The `UpdateBankAccount` mutation requires an argument of type `UpdateBankAccountVariables`:
const updateBankAccountVars: UpdateBankAccountVariables = {
  id: ..., 
  bankName: ..., // optional
  bankUrl: ..., // optional
  logo: ..., // optional
  accountNumber: ..., // optional
  accountNumberMasked: ..., // optional
  connectionStatus: ..., // optional
  requiresOtp: ..., // optional
  accountType: ..., // optional
};

// Call the `updateBankAccountRef()` function to get a reference to the mutation.
const ref = updateBankAccountRef(updateBankAccountVars);
// Variables can be defined inline as well.
const ref = updateBankAccountRef({ id: ..., bankName: ..., bankUrl: ..., logo: ..., accountNumber: ..., accountNumberMasked: ..., connectionStatus: ..., requiresOtp: ..., accountType: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateBankAccountRef(dataConnect, updateBankAccountVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.bankAccount_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.bankAccount_update);
});
```

## DeleteBankAccount
You can execute the `DeleteBankAccount` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteBankAccount(vars: DeleteBankAccountVariables): MutationPromise<DeleteBankAccountData, DeleteBankAccountVariables>;

interface DeleteBankAccountRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteBankAccountVariables): MutationRef<DeleteBankAccountData, DeleteBankAccountVariables>;
}
export const deleteBankAccountRef: DeleteBankAccountRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteBankAccount(dc: DataConnect, vars: DeleteBankAccountVariables): MutationPromise<DeleteBankAccountData, DeleteBankAccountVariables>;

interface DeleteBankAccountRef {
  ...
  (dc: DataConnect, vars: DeleteBankAccountVariables): MutationRef<DeleteBankAccountData, DeleteBankAccountVariables>;
}
export const deleteBankAccountRef: DeleteBankAccountRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteBankAccountRef:
```typescript
const name = deleteBankAccountRef.operationName;
console.log(name);
```

### Variables
The `DeleteBankAccount` mutation requires an argument of type `DeleteBankAccountVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteBankAccountVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteBankAccount` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteBankAccountData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteBankAccountData {
  bankAccount_delete?: BankAccount_Key | null;
}
```
### Using `DeleteBankAccount`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteBankAccount, DeleteBankAccountVariables } from '@dataconnect/generated';

// The `DeleteBankAccount` mutation requires an argument of type `DeleteBankAccountVariables`:
const deleteBankAccountVars: DeleteBankAccountVariables = {
  id: ..., 
};

// Call the `deleteBankAccount()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteBankAccount(deleteBankAccountVars);
// Variables can be defined inline as well.
const { data } = await deleteBankAccount({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteBankAccount(dataConnect, deleteBankAccountVars);

console.log(data.bankAccount_delete);

// Or, you can use the `Promise` API.
deleteBankAccount(deleteBankAccountVars).then((response) => {
  const data = response.data;
  console.log(data.bankAccount_delete);
});
```

### Using `DeleteBankAccount`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteBankAccountRef, DeleteBankAccountVariables } from '@dataconnect/generated';

// The `DeleteBankAccount` mutation requires an argument of type `DeleteBankAccountVariables`:
const deleteBankAccountVars: DeleteBankAccountVariables = {
  id: ..., 
};

// Call the `deleteBankAccountRef()` function to get a reference to the mutation.
const ref = deleteBankAccountRef(deleteBankAccountVars);
// Variables can be defined inline as well.
const ref = deleteBankAccountRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteBankAccountRef(dataConnect, deleteBankAccountVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.bankAccount_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.bankAccount_delete);
});
```

## CreateDownloadSchedule
You can execute the `CreateDownloadSchedule` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createDownloadSchedule(vars: CreateDownloadScheduleVariables): MutationPromise<CreateDownloadScheduleData, CreateDownloadScheduleVariables>;

interface CreateDownloadScheduleRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateDownloadScheduleVariables): MutationRef<CreateDownloadScheduleData, CreateDownloadScheduleVariables>;
}
export const createDownloadScheduleRef: CreateDownloadScheduleRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createDownloadSchedule(dc: DataConnect, vars: CreateDownloadScheduleVariables): MutationPromise<CreateDownloadScheduleData, CreateDownloadScheduleVariables>;

interface CreateDownloadScheduleRef {
  ...
  (dc: DataConnect, vars: CreateDownloadScheduleVariables): MutationRef<CreateDownloadScheduleData, CreateDownloadScheduleVariables>;
}
export const createDownloadScheduleRef: CreateDownloadScheduleRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createDownloadScheduleRef:
```typescript
const name = createDownloadScheduleRef.operationName;
console.log(name);
```

### Variables
The `CreateDownloadSchedule` mutation requires an argument of type `CreateDownloadScheduleVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateDownloadScheduleVariables {
  bankAccountId: UUIDString;
  frequency: string;
  scheduledTime?: string | null;
  targetFolder?: string | null;
  storageType?: string | null;
  nextDownloadAt: TimestampString;
  isActive: boolean;
  statementFormat?: string | null;
  startDateOffset?: string | null;
}
```
### Return Type
Recall that executing the `CreateDownloadSchedule` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateDownloadScheduleData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateDownloadScheduleData {
  downloadSchedule_insert: DownloadSchedule_Key;
}
```
### Using `CreateDownloadSchedule`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createDownloadSchedule, CreateDownloadScheduleVariables } from '@dataconnect/generated';

// The `CreateDownloadSchedule` mutation requires an argument of type `CreateDownloadScheduleVariables`:
const createDownloadScheduleVars: CreateDownloadScheduleVariables = {
  bankAccountId: ..., 
  frequency: ..., 
  scheduledTime: ..., // optional
  targetFolder: ..., // optional
  storageType: ..., // optional
  nextDownloadAt: ..., 
  isActive: ..., 
  statementFormat: ..., // optional
  startDateOffset: ..., // optional
};

// Call the `createDownloadSchedule()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createDownloadSchedule(createDownloadScheduleVars);
// Variables can be defined inline as well.
const { data } = await createDownloadSchedule({ bankAccountId: ..., frequency: ..., scheduledTime: ..., targetFolder: ..., storageType: ..., nextDownloadAt: ..., isActive: ..., statementFormat: ..., startDateOffset: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createDownloadSchedule(dataConnect, createDownloadScheduleVars);

console.log(data.downloadSchedule_insert);

// Or, you can use the `Promise` API.
createDownloadSchedule(createDownloadScheduleVars).then((response) => {
  const data = response.data;
  console.log(data.downloadSchedule_insert);
});
```

### Using `CreateDownloadSchedule`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createDownloadScheduleRef, CreateDownloadScheduleVariables } from '@dataconnect/generated';

// The `CreateDownloadSchedule` mutation requires an argument of type `CreateDownloadScheduleVariables`:
const createDownloadScheduleVars: CreateDownloadScheduleVariables = {
  bankAccountId: ..., 
  frequency: ..., 
  scheduledTime: ..., // optional
  targetFolder: ..., // optional
  storageType: ..., // optional
  nextDownloadAt: ..., 
  isActive: ..., 
  statementFormat: ..., // optional
  startDateOffset: ..., // optional
};

// Call the `createDownloadScheduleRef()` function to get a reference to the mutation.
const ref = createDownloadScheduleRef(createDownloadScheduleVars);
// Variables can be defined inline as well.
const ref = createDownloadScheduleRef({ bankAccountId: ..., frequency: ..., scheduledTime: ..., targetFolder: ..., storageType: ..., nextDownloadAt: ..., isActive: ..., statementFormat: ..., startDateOffset: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createDownloadScheduleRef(dataConnect, createDownloadScheduleVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.downloadSchedule_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.downloadSchedule_insert);
});
```

## UpdateDownloadSchedule
You can execute the `UpdateDownloadSchedule` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateDownloadSchedule(vars: UpdateDownloadScheduleVariables): MutationPromise<UpdateDownloadScheduleData, UpdateDownloadScheduleVariables>;

interface UpdateDownloadScheduleRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateDownloadScheduleVariables): MutationRef<UpdateDownloadScheduleData, UpdateDownloadScheduleVariables>;
}
export const updateDownloadScheduleRef: UpdateDownloadScheduleRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateDownloadSchedule(dc: DataConnect, vars: UpdateDownloadScheduleVariables): MutationPromise<UpdateDownloadScheduleData, UpdateDownloadScheduleVariables>;

interface UpdateDownloadScheduleRef {
  ...
  (dc: DataConnect, vars: UpdateDownloadScheduleVariables): MutationRef<UpdateDownloadScheduleData, UpdateDownloadScheduleVariables>;
}
export const updateDownloadScheduleRef: UpdateDownloadScheduleRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateDownloadScheduleRef:
```typescript
const name = updateDownloadScheduleRef.operationName;
console.log(name);
```

### Variables
The `UpdateDownloadSchedule` mutation requires an argument of type `UpdateDownloadScheduleVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateDownloadScheduleVariables {
  id: UUIDString;
  frequency?: string | null;
  scheduledTime?: string | null;
  targetFolder?: string | null;
  storageType?: string | null;
  nextDownloadAt?: TimestampString | null;
  isActive?: boolean | null;
  lastDownloadAt?: TimestampString | null;
}
```
### Return Type
Recall that executing the `UpdateDownloadSchedule` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateDownloadScheduleData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateDownloadScheduleData {
  downloadSchedule_update?: DownloadSchedule_Key | null;
}
```
### Using `UpdateDownloadSchedule`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateDownloadSchedule, UpdateDownloadScheduleVariables } from '@dataconnect/generated';

// The `UpdateDownloadSchedule` mutation requires an argument of type `UpdateDownloadScheduleVariables`:
const updateDownloadScheduleVars: UpdateDownloadScheduleVariables = {
  id: ..., 
  frequency: ..., // optional
  scheduledTime: ..., // optional
  targetFolder: ..., // optional
  storageType: ..., // optional
  nextDownloadAt: ..., // optional
  isActive: ..., // optional
  lastDownloadAt: ..., // optional
};

// Call the `updateDownloadSchedule()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateDownloadSchedule(updateDownloadScheduleVars);
// Variables can be defined inline as well.
const { data } = await updateDownloadSchedule({ id: ..., frequency: ..., scheduledTime: ..., targetFolder: ..., storageType: ..., nextDownloadAt: ..., isActive: ..., lastDownloadAt: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateDownloadSchedule(dataConnect, updateDownloadScheduleVars);

console.log(data.downloadSchedule_update);

// Or, you can use the `Promise` API.
updateDownloadSchedule(updateDownloadScheduleVars).then((response) => {
  const data = response.data;
  console.log(data.downloadSchedule_update);
});
```

### Using `UpdateDownloadSchedule`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateDownloadScheduleRef, UpdateDownloadScheduleVariables } from '@dataconnect/generated';

// The `UpdateDownloadSchedule` mutation requires an argument of type `UpdateDownloadScheduleVariables`:
const updateDownloadScheduleVars: UpdateDownloadScheduleVariables = {
  id: ..., 
  frequency: ..., // optional
  scheduledTime: ..., // optional
  targetFolder: ..., // optional
  storageType: ..., // optional
  nextDownloadAt: ..., // optional
  isActive: ..., // optional
  lastDownloadAt: ..., // optional
};

// Call the `updateDownloadScheduleRef()` function to get a reference to the mutation.
const ref = updateDownloadScheduleRef(updateDownloadScheduleVars);
// Variables can be defined inline as well.
const ref = updateDownloadScheduleRef({ id: ..., frequency: ..., scheduledTime: ..., targetFolder: ..., storageType: ..., nextDownloadAt: ..., isActive: ..., lastDownloadAt: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateDownloadScheduleRef(dataConnect, updateDownloadScheduleVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.downloadSchedule_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.downloadSchedule_update);
});
```

## DeleteDownloadSchedule
You can execute the `DeleteDownloadSchedule` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteDownloadSchedule(vars: DeleteDownloadScheduleVariables): MutationPromise<DeleteDownloadScheduleData, DeleteDownloadScheduleVariables>;

interface DeleteDownloadScheduleRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteDownloadScheduleVariables): MutationRef<DeleteDownloadScheduleData, DeleteDownloadScheduleVariables>;
}
export const deleteDownloadScheduleRef: DeleteDownloadScheduleRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteDownloadSchedule(dc: DataConnect, vars: DeleteDownloadScheduleVariables): MutationPromise<DeleteDownloadScheduleData, DeleteDownloadScheduleVariables>;

interface DeleteDownloadScheduleRef {
  ...
  (dc: DataConnect, vars: DeleteDownloadScheduleVariables): MutationRef<DeleteDownloadScheduleData, DeleteDownloadScheduleVariables>;
}
export const deleteDownloadScheduleRef: DeleteDownloadScheduleRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteDownloadScheduleRef:
```typescript
const name = deleteDownloadScheduleRef.operationName;
console.log(name);
```

### Variables
The `DeleteDownloadSchedule` mutation requires an argument of type `DeleteDownloadScheduleVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteDownloadScheduleVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteDownloadSchedule` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteDownloadScheduleData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteDownloadScheduleData {
  downloadSchedule_delete?: DownloadSchedule_Key | null;
}
```
### Using `DeleteDownloadSchedule`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteDownloadSchedule, DeleteDownloadScheduleVariables } from '@dataconnect/generated';

// The `DeleteDownloadSchedule` mutation requires an argument of type `DeleteDownloadScheduleVariables`:
const deleteDownloadScheduleVars: DeleteDownloadScheduleVariables = {
  id: ..., 
};

// Call the `deleteDownloadSchedule()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteDownloadSchedule(deleteDownloadScheduleVars);
// Variables can be defined inline as well.
const { data } = await deleteDownloadSchedule({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteDownloadSchedule(dataConnect, deleteDownloadScheduleVars);

console.log(data.downloadSchedule_delete);

// Or, you can use the `Promise` API.
deleteDownloadSchedule(deleteDownloadScheduleVars).then((response) => {
  const data = response.data;
  console.log(data.downloadSchedule_delete);
});
```

### Using `DeleteDownloadSchedule`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteDownloadScheduleRef, DeleteDownloadScheduleVariables } from '@dataconnect/generated';

// The `DeleteDownloadSchedule` mutation requires an argument of type `DeleteDownloadScheduleVariables`:
const deleteDownloadScheduleVars: DeleteDownloadScheduleVariables = {
  id: ..., 
};

// Call the `deleteDownloadScheduleRef()` function to get a reference to the mutation.
const ref = deleteDownloadScheduleRef(deleteDownloadScheduleVars);
// Variables can be defined inline as well.
const ref = deleteDownloadScheduleRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteDownloadScheduleRef(dataConnect, deleteDownloadScheduleVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.downloadSchedule_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.downloadSchedule_delete);
});
```

## CreateStatement
You can execute the `CreateStatement` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createStatement(vars: CreateStatementVariables): MutationPromise<CreateStatementData, CreateStatementVariables>;

interface CreateStatementRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateStatementVariables): MutationRef<CreateStatementData, CreateStatementVariables>;
}
export const createStatementRef: CreateStatementRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createStatement(dc: DataConnect, vars: CreateStatementVariables): MutationPromise<CreateStatementData, CreateStatementVariables>;

interface CreateStatementRef {
  ...
  (dc: DataConnect, vars: CreateStatementVariables): MutationRef<CreateStatementData, CreateStatementVariables>;
}
export const createStatementRef: CreateStatementRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createStatementRef:
```typescript
const name = createStatementRef.operationName;
console.log(name);
```

### Variables
The `CreateStatement` mutation requires an argument of type `CreateStatementVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateStatementVariables {
  bankAccountId: UUIDString;
  downloadScheduleId?: UUIDString | null;
  fileName: string;
  downloadDate: TimestampString;
  statementPeriodStart: DateString;
  statementPeriodEnd: DateString;
  fileRef: string;
  status?: string | null;
  errorMessage?: string | null;
}
```
### Return Type
Recall that executing the `CreateStatement` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateStatementData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateStatementData {
  statement_insert: Statement_Key;
}
```
### Using `CreateStatement`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createStatement, CreateStatementVariables } from '@dataconnect/generated';

// The `CreateStatement` mutation requires an argument of type `CreateStatementVariables`:
const createStatementVars: CreateStatementVariables = {
  bankAccountId: ..., 
  downloadScheduleId: ..., // optional
  fileName: ..., 
  downloadDate: ..., 
  statementPeriodStart: ..., 
  statementPeriodEnd: ..., 
  fileRef: ..., 
  status: ..., // optional
  errorMessage: ..., // optional
};

// Call the `createStatement()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createStatement(createStatementVars);
// Variables can be defined inline as well.
const { data } = await createStatement({ bankAccountId: ..., downloadScheduleId: ..., fileName: ..., downloadDate: ..., statementPeriodStart: ..., statementPeriodEnd: ..., fileRef: ..., status: ..., errorMessage: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createStatement(dataConnect, createStatementVars);

console.log(data.statement_insert);

// Or, you can use the `Promise` API.
createStatement(createStatementVars).then((response) => {
  const data = response.data;
  console.log(data.statement_insert);
});
```

### Using `CreateStatement`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createStatementRef, CreateStatementVariables } from '@dataconnect/generated';

// The `CreateStatement` mutation requires an argument of type `CreateStatementVariables`:
const createStatementVars: CreateStatementVariables = {
  bankAccountId: ..., 
  downloadScheduleId: ..., // optional
  fileName: ..., 
  downloadDate: ..., 
  statementPeriodStart: ..., 
  statementPeriodEnd: ..., 
  fileRef: ..., 
  status: ..., // optional
  errorMessage: ..., // optional
};

// Call the `createStatementRef()` function to get a reference to the mutation.
const ref = createStatementRef(createStatementVars);
// Variables can be defined inline as well.
const ref = createStatementRef({ bankAccountId: ..., downloadScheduleId: ..., fileName: ..., downloadDate: ..., statementPeriodStart: ..., statementPeriodEnd: ..., fileRef: ..., status: ..., errorMessage: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createStatementRef(dataConnect, createStatementVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.statement_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.statement_insert);
});
```

## CreateNotification
You can execute the `CreateNotification` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createNotification(vars: CreateNotificationVariables): MutationPromise<CreateNotificationData, CreateNotificationVariables>;

interface CreateNotificationRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateNotificationVariables): MutationRef<CreateNotificationData, CreateNotificationVariables>;
}
export const createNotificationRef: CreateNotificationRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createNotification(dc: DataConnect, vars: CreateNotificationVariables): MutationPromise<CreateNotificationData, CreateNotificationVariables>;

interface CreateNotificationRef {
  ...
  (dc: DataConnect, vars: CreateNotificationVariables): MutationRef<CreateNotificationData, CreateNotificationVariables>;
}
export const createNotificationRef: CreateNotificationRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createNotificationRef:
```typescript
const name = createNotificationRef.operationName;
console.log(name);
```

### Variables
The `CreateNotification` mutation requires an argument of type `CreateNotificationVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateNotificationVariables {
  message: string;
  type: string;
  relatedStatementId?: UUIDString | null;
}
```
### Return Type
Recall that executing the `CreateNotification` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateNotificationData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateNotificationData {
  notification_insert: Notification_Key;
}
```
### Using `CreateNotification`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createNotification, CreateNotificationVariables } from '@dataconnect/generated';

// The `CreateNotification` mutation requires an argument of type `CreateNotificationVariables`:
const createNotificationVars: CreateNotificationVariables = {
  message: ..., 
  type: ..., 
  relatedStatementId: ..., // optional
};

// Call the `createNotification()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createNotification(createNotificationVars);
// Variables can be defined inline as well.
const { data } = await createNotification({ message: ..., type: ..., relatedStatementId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createNotification(dataConnect, createNotificationVars);

console.log(data.notification_insert);

// Or, you can use the `Promise` API.
createNotification(createNotificationVars).then((response) => {
  const data = response.data;
  console.log(data.notification_insert);
});
```

### Using `CreateNotification`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createNotificationRef, CreateNotificationVariables } from '@dataconnect/generated';

// The `CreateNotification` mutation requires an argument of type `CreateNotificationVariables`:
const createNotificationVars: CreateNotificationVariables = {
  message: ..., 
  type: ..., 
  relatedStatementId: ..., // optional
};

// Call the `createNotificationRef()` function to get a reference to the mutation.
const ref = createNotificationRef(createNotificationVars);
// Variables can be defined inline as well.
const ref = createNotificationRef({ message: ..., type: ..., relatedStatementId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createNotificationRef(dataConnect, createNotificationVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.notification_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.notification_insert);
});
```

## MarkNotificationRead
You can execute the `MarkNotificationRead` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
markNotificationRead(vars: MarkNotificationReadVariables): MutationPromise<MarkNotificationReadData, MarkNotificationReadVariables>;

interface MarkNotificationReadRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: MarkNotificationReadVariables): MutationRef<MarkNotificationReadData, MarkNotificationReadVariables>;
}
export const markNotificationReadRef: MarkNotificationReadRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
markNotificationRead(dc: DataConnect, vars: MarkNotificationReadVariables): MutationPromise<MarkNotificationReadData, MarkNotificationReadVariables>;

interface MarkNotificationReadRef {
  ...
  (dc: DataConnect, vars: MarkNotificationReadVariables): MutationRef<MarkNotificationReadData, MarkNotificationReadVariables>;
}
export const markNotificationReadRef: MarkNotificationReadRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the markNotificationReadRef:
```typescript
const name = markNotificationReadRef.operationName;
console.log(name);
```

### Variables
The `MarkNotificationRead` mutation requires an argument of type `MarkNotificationReadVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface MarkNotificationReadVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `MarkNotificationRead` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `MarkNotificationReadData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface MarkNotificationReadData {
  notification_update?: Notification_Key | null;
}
```
### Using `MarkNotificationRead`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, markNotificationRead, MarkNotificationReadVariables } from '@dataconnect/generated';

// The `MarkNotificationRead` mutation requires an argument of type `MarkNotificationReadVariables`:
const markNotificationReadVars: MarkNotificationReadVariables = {
  id: ..., 
};

// Call the `markNotificationRead()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await markNotificationRead(markNotificationReadVars);
// Variables can be defined inline as well.
const { data } = await markNotificationRead({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await markNotificationRead(dataConnect, markNotificationReadVars);

console.log(data.notification_update);

// Or, you can use the `Promise` API.
markNotificationRead(markNotificationReadVars).then((response) => {
  const data = response.data;
  console.log(data.notification_update);
});
```

### Using `MarkNotificationRead`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, markNotificationReadRef, MarkNotificationReadVariables } from '@dataconnect/generated';

// The `MarkNotificationRead` mutation requires an argument of type `MarkNotificationReadVariables`:
const markNotificationReadVars: MarkNotificationReadVariables = {
  id: ..., 
};

// Call the `markNotificationReadRef()` function to get a reference to the mutation.
const ref = markNotificationReadRef(markNotificationReadVars);
// Variables can be defined inline as well.
const ref = markNotificationReadRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = markNotificationReadRef(dataConnect, markNotificationReadVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.notification_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.notification_update);
});
```

