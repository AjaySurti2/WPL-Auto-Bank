import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface BankAccount_Key {
  id: UUIDString;
  __typename?: 'BankAccount_Key';
}

export interface CreateBankAccountData {
  bankAccount_insert: BankAccount_Key;
}

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

export interface CreateDownloadScheduleData {
  downloadSchedule_insert: DownloadSchedule_Key;
}

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

export interface CreateNotificationData {
  notification_insert: Notification_Key;
}

export interface CreateNotificationVariables {
  message: string;
  type: string;
  relatedStatementId?: UUIDString | null;
}

export interface CreateStatementData {
  statement_insert: Statement_Key;
}

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

export interface CreateUserData {
  user_insert: User_Key;
}

export interface CreateUserVariables {
  displayName: string;
  email: string;
  photoUrl?: string | null;
  role: string;
  avatar?: string | null;
}

export interface DeleteBankAccountData {
  bankAccount_delete?: BankAccount_Key | null;
}

export interface DeleteBankAccountVariables {
  id: UUIDString;
}

export interface DeleteDownloadScheduleData {
  downloadSchedule_delete?: DownloadSchedule_Key | null;
}

export interface DeleteDownloadScheduleVariables {
  id: UUIDString;
}

export interface DownloadSchedule_Key {
  id: UUIDString;
  __typename?: 'DownloadSchedule_Key';
}

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

export interface MarkNotificationReadData {
  notification_update?: Notification_Key | null;
}

export interface MarkNotificationReadVariables {
  id: UUIDString;
}

export interface Notification_Key {
  id: UUIDString;
  __typename?: 'Notification_Key';
}

export interface Statement_Key {
  id: UUIDString;
  __typename?: 'Statement_Key';
}

export interface UpdateBankAccountData {
  bankAccount_update?: BankAccount_Key | null;
}

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

export interface UpdateDownloadScheduleData {
  downloadSchedule_update?: DownloadSchedule_Key | null;
}

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

export interface User_Key {
  id: string;
  __typename?: 'User_Key';
}

interface CreateUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
  operationName: string;
}
export const createUserRef: CreateUserRef;

export function createUser(vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;
export function createUser(dc: DataConnect, vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;

interface GetUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetUserData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetUserData, undefined>;
  operationName: string;
}
export const getUserRef: GetUserRef;

export function getUser(): QueryPromise<GetUserData, undefined>;
export function getUser(dc: DataConnect): QueryPromise<GetUserData, undefined>;

interface CreateBankAccountRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateBankAccountVariables): MutationRef<CreateBankAccountData, CreateBankAccountVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateBankAccountVariables): MutationRef<CreateBankAccountData, CreateBankAccountVariables>;
  operationName: string;
}
export const createBankAccountRef: CreateBankAccountRef;

export function createBankAccount(vars: CreateBankAccountVariables): MutationPromise<CreateBankAccountData, CreateBankAccountVariables>;
export function createBankAccount(dc: DataConnect, vars: CreateBankAccountVariables): MutationPromise<CreateBankAccountData, CreateBankAccountVariables>;

interface UpdateBankAccountRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateBankAccountVariables): MutationRef<UpdateBankAccountData, UpdateBankAccountVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateBankAccountVariables): MutationRef<UpdateBankAccountData, UpdateBankAccountVariables>;
  operationName: string;
}
export const updateBankAccountRef: UpdateBankAccountRef;

export function updateBankAccount(vars: UpdateBankAccountVariables): MutationPromise<UpdateBankAccountData, UpdateBankAccountVariables>;
export function updateBankAccount(dc: DataConnect, vars: UpdateBankAccountVariables): MutationPromise<UpdateBankAccountData, UpdateBankAccountVariables>;

interface DeleteBankAccountRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteBankAccountVariables): MutationRef<DeleteBankAccountData, DeleteBankAccountVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteBankAccountVariables): MutationRef<DeleteBankAccountData, DeleteBankAccountVariables>;
  operationName: string;
}
export const deleteBankAccountRef: DeleteBankAccountRef;

export function deleteBankAccount(vars: DeleteBankAccountVariables): MutationPromise<DeleteBankAccountData, DeleteBankAccountVariables>;
export function deleteBankAccount(dc: DataConnect, vars: DeleteBankAccountVariables): MutationPromise<DeleteBankAccountData, DeleteBankAccountVariables>;

interface ListBankAccountsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListBankAccountsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListBankAccountsData, undefined>;
  operationName: string;
}
export const listBankAccountsRef: ListBankAccountsRef;

export function listBankAccounts(): QueryPromise<ListBankAccountsData, undefined>;
export function listBankAccounts(dc: DataConnect): QueryPromise<ListBankAccountsData, undefined>;

interface CreateDownloadScheduleRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateDownloadScheduleVariables): MutationRef<CreateDownloadScheduleData, CreateDownloadScheduleVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateDownloadScheduleVariables): MutationRef<CreateDownloadScheduleData, CreateDownloadScheduleVariables>;
  operationName: string;
}
export const createDownloadScheduleRef: CreateDownloadScheduleRef;

export function createDownloadSchedule(vars: CreateDownloadScheduleVariables): MutationPromise<CreateDownloadScheduleData, CreateDownloadScheduleVariables>;
export function createDownloadSchedule(dc: DataConnect, vars: CreateDownloadScheduleVariables): MutationPromise<CreateDownloadScheduleData, CreateDownloadScheduleVariables>;

interface UpdateDownloadScheduleRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateDownloadScheduleVariables): MutationRef<UpdateDownloadScheduleData, UpdateDownloadScheduleVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateDownloadScheduleVariables): MutationRef<UpdateDownloadScheduleData, UpdateDownloadScheduleVariables>;
  operationName: string;
}
export const updateDownloadScheduleRef: UpdateDownloadScheduleRef;

export function updateDownloadSchedule(vars: UpdateDownloadScheduleVariables): MutationPromise<UpdateDownloadScheduleData, UpdateDownloadScheduleVariables>;
export function updateDownloadSchedule(dc: DataConnect, vars: UpdateDownloadScheduleVariables): MutationPromise<UpdateDownloadScheduleData, UpdateDownloadScheduleVariables>;

interface DeleteDownloadScheduleRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteDownloadScheduleVariables): MutationRef<DeleteDownloadScheduleData, DeleteDownloadScheduleVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteDownloadScheduleVariables): MutationRef<DeleteDownloadScheduleData, DeleteDownloadScheduleVariables>;
  operationName: string;
}
export const deleteDownloadScheduleRef: DeleteDownloadScheduleRef;

export function deleteDownloadSchedule(vars: DeleteDownloadScheduleVariables): MutationPromise<DeleteDownloadScheduleData, DeleteDownloadScheduleVariables>;
export function deleteDownloadSchedule(dc: DataConnect, vars: DeleteDownloadScheduleVariables): MutationPromise<DeleteDownloadScheduleData, DeleteDownloadScheduleVariables>;

interface ListDownloadSchedulesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListDownloadSchedulesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListDownloadSchedulesData, undefined>;
  operationName: string;
}
export const listDownloadSchedulesRef: ListDownloadSchedulesRef;

export function listDownloadSchedules(): QueryPromise<ListDownloadSchedulesData, undefined>;
export function listDownloadSchedules(dc: DataConnect): QueryPromise<ListDownloadSchedulesData, undefined>;

interface CreateStatementRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateStatementVariables): MutationRef<CreateStatementData, CreateStatementVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateStatementVariables): MutationRef<CreateStatementData, CreateStatementVariables>;
  operationName: string;
}
export const createStatementRef: CreateStatementRef;

export function createStatement(vars: CreateStatementVariables): MutationPromise<CreateStatementData, CreateStatementVariables>;
export function createStatement(dc: DataConnect, vars: CreateStatementVariables): MutationPromise<CreateStatementData, CreateStatementVariables>;

interface ListStatementsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListStatementsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListStatementsData, undefined>;
  operationName: string;
}
export const listStatementsRef: ListStatementsRef;

export function listStatements(): QueryPromise<ListStatementsData, undefined>;
export function listStatements(dc: DataConnect): QueryPromise<ListStatementsData, undefined>;

interface CreateNotificationRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateNotificationVariables): MutationRef<CreateNotificationData, CreateNotificationVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateNotificationVariables): MutationRef<CreateNotificationData, CreateNotificationVariables>;
  operationName: string;
}
export const createNotificationRef: CreateNotificationRef;

export function createNotification(vars: CreateNotificationVariables): MutationPromise<CreateNotificationData, CreateNotificationVariables>;
export function createNotification(dc: DataConnect, vars: CreateNotificationVariables): MutationPromise<CreateNotificationData, CreateNotificationVariables>;

interface ListNotificationsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListNotificationsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListNotificationsData, undefined>;
  operationName: string;
}
export const listNotificationsRef: ListNotificationsRef;

export function listNotifications(): QueryPromise<ListNotificationsData, undefined>;
export function listNotifications(dc: DataConnect): QueryPromise<ListNotificationsData, undefined>;

interface MarkNotificationReadRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: MarkNotificationReadVariables): MutationRef<MarkNotificationReadData, MarkNotificationReadVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: MarkNotificationReadVariables): MutationRef<MarkNotificationReadData, MarkNotificationReadVariables>;
  operationName: string;
}
export const markNotificationReadRef: MarkNotificationReadRef;

export function markNotificationRead(vars: MarkNotificationReadVariables): MutationPromise<MarkNotificationReadData, MarkNotificationReadVariables>;
export function markNotificationRead(dc: DataConnect, vars: MarkNotificationReadVariables): MutationPromise<MarkNotificationReadData, MarkNotificationReadVariables>;

