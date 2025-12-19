import { CreateUserData, CreateUserVariables, AdminUpsertUserData, AdminUpsertUserVariables, GetUserData, ListUsersData, UpdateUserProfileData, UpdateUserProfileVariables, DeleteUserData, DeleteUserVariables, CreateBankAccountData, CreateBankAccountVariables, UpdateBankAccountData, UpdateBankAccountVariables, DeleteBankAccountData, DeleteBankAccountVariables, ListBankAccountsData, CreateDownloadScheduleData, CreateDownloadScheduleVariables, UpdateDownloadScheduleData, UpdateDownloadScheduleVariables, DeleteDownloadScheduleData, DeleteDownloadScheduleVariables, ListDownloadSchedulesData, CreateStatementData, CreateStatementVariables, ListStatementsData, CreateNotificationData, CreateNotificationVariables, ListNotificationsData, MarkNotificationReadData, MarkNotificationReadVariables } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateUser(options?: useDataConnectMutationOptions<CreateUserData, FirebaseError, CreateUserVariables>): UseDataConnectMutationResult<CreateUserData, CreateUserVariables>;
export function useCreateUser(dc: DataConnect, options?: useDataConnectMutationOptions<CreateUserData, FirebaseError, CreateUserVariables>): UseDataConnectMutationResult<CreateUserData, CreateUserVariables>;

export function useAdminUpsertUser(options?: useDataConnectMutationOptions<AdminUpsertUserData, FirebaseError, AdminUpsertUserVariables>): UseDataConnectMutationResult<AdminUpsertUserData, AdminUpsertUserVariables>;
export function useAdminUpsertUser(dc: DataConnect, options?: useDataConnectMutationOptions<AdminUpsertUserData, FirebaseError, AdminUpsertUserVariables>): UseDataConnectMutationResult<AdminUpsertUserData, AdminUpsertUserVariables>;

export function useGetUser(options?: useDataConnectQueryOptions<GetUserData>): UseDataConnectQueryResult<GetUserData, undefined>;
export function useGetUser(dc: DataConnect, options?: useDataConnectQueryOptions<GetUserData>): UseDataConnectQueryResult<GetUserData, undefined>;

export function useListUsers(options?: useDataConnectQueryOptions<ListUsersData>): UseDataConnectQueryResult<ListUsersData, undefined>;
export function useListUsers(dc: DataConnect, options?: useDataConnectQueryOptions<ListUsersData>): UseDataConnectQueryResult<ListUsersData, undefined>;

export function useUpdateUserProfile(options?: useDataConnectMutationOptions<UpdateUserProfileData, FirebaseError, UpdateUserProfileVariables>): UseDataConnectMutationResult<UpdateUserProfileData, UpdateUserProfileVariables>;
export function useUpdateUserProfile(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateUserProfileData, FirebaseError, UpdateUserProfileVariables>): UseDataConnectMutationResult<UpdateUserProfileData, UpdateUserProfileVariables>;

export function useDeleteUser(options?: useDataConnectMutationOptions<DeleteUserData, FirebaseError, DeleteUserVariables>): UseDataConnectMutationResult<DeleteUserData, DeleteUserVariables>;
export function useDeleteUser(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteUserData, FirebaseError, DeleteUserVariables>): UseDataConnectMutationResult<DeleteUserData, DeleteUserVariables>;

export function useCreateBankAccount(options?: useDataConnectMutationOptions<CreateBankAccountData, FirebaseError, CreateBankAccountVariables>): UseDataConnectMutationResult<CreateBankAccountData, CreateBankAccountVariables>;
export function useCreateBankAccount(dc: DataConnect, options?: useDataConnectMutationOptions<CreateBankAccountData, FirebaseError, CreateBankAccountVariables>): UseDataConnectMutationResult<CreateBankAccountData, CreateBankAccountVariables>;

export function useUpdateBankAccount(options?: useDataConnectMutationOptions<UpdateBankAccountData, FirebaseError, UpdateBankAccountVariables>): UseDataConnectMutationResult<UpdateBankAccountData, UpdateBankAccountVariables>;
export function useUpdateBankAccount(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateBankAccountData, FirebaseError, UpdateBankAccountVariables>): UseDataConnectMutationResult<UpdateBankAccountData, UpdateBankAccountVariables>;

export function useDeleteBankAccount(options?: useDataConnectMutationOptions<DeleteBankAccountData, FirebaseError, DeleteBankAccountVariables>): UseDataConnectMutationResult<DeleteBankAccountData, DeleteBankAccountVariables>;
export function useDeleteBankAccount(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteBankAccountData, FirebaseError, DeleteBankAccountVariables>): UseDataConnectMutationResult<DeleteBankAccountData, DeleteBankAccountVariables>;

export function useListBankAccounts(options?: useDataConnectQueryOptions<ListBankAccountsData>): UseDataConnectQueryResult<ListBankAccountsData, undefined>;
export function useListBankAccounts(dc: DataConnect, options?: useDataConnectQueryOptions<ListBankAccountsData>): UseDataConnectQueryResult<ListBankAccountsData, undefined>;

export function useCreateDownloadSchedule(options?: useDataConnectMutationOptions<CreateDownloadScheduleData, FirebaseError, CreateDownloadScheduleVariables>): UseDataConnectMutationResult<CreateDownloadScheduleData, CreateDownloadScheduleVariables>;
export function useCreateDownloadSchedule(dc: DataConnect, options?: useDataConnectMutationOptions<CreateDownloadScheduleData, FirebaseError, CreateDownloadScheduleVariables>): UseDataConnectMutationResult<CreateDownloadScheduleData, CreateDownloadScheduleVariables>;

export function useUpdateDownloadSchedule(options?: useDataConnectMutationOptions<UpdateDownloadScheduleData, FirebaseError, UpdateDownloadScheduleVariables>): UseDataConnectMutationResult<UpdateDownloadScheduleData, UpdateDownloadScheduleVariables>;
export function useUpdateDownloadSchedule(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateDownloadScheduleData, FirebaseError, UpdateDownloadScheduleVariables>): UseDataConnectMutationResult<UpdateDownloadScheduleData, UpdateDownloadScheduleVariables>;

export function useDeleteDownloadSchedule(options?: useDataConnectMutationOptions<DeleteDownloadScheduleData, FirebaseError, DeleteDownloadScheduleVariables>): UseDataConnectMutationResult<DeleteDownloadScheduleData, DeleteDownloadScheduleVariables>;
export function useDeleteDownloadSchedule(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteDownloadScheduleData, FirebaseError, DeleteDownloadScheduleVariables>): UseDataConnectMutationResult<DeleteDownloadScheduleData, DeleteDownloadScheduleVariables>;

export function useListDownloadSchedules(options?: useDataConnectQueryOptions<ListDownloadSchedulesData>): UseDataConnectQueryResult<ListDownloadSchedulesData, undefined>;
export function useListDownloadSchedules(dc: DataConnect, options?: useDataConnectQueryOptions<ListDownloadSchedulesData>): UseDataConnectQueryResult<ListDownloadSchedulesData, undefined>;

export function useCreateStatement(options?: useDataConnectMutationOptions<CreateStatementData, FirebaseError, CreateStatementVariables>): UseDataConnectMutationResult<CreateStatementData, CreateStatementVariables>;
export function useCreateStatement(dc: DataConnect, options?: useDataConnectMutationOptions<CreateStatementData, FirebaseError, CreateStatementVariables>): UseDataConnectMutationResult<CreateStatementData, CreateStatementVariables>;

export function useListStatements(options?: useDataConnectQueryOptions<ListStatementsData>): UseDataConnectQueryResult<ListStatementsData, undefined>;
export function useListStatements(dc: DataConnect, options?: useDataConnectQueryOptions<ListStatementsData>): UseDataConnectQueryResult<ListStatementsData, undefined>;

export function useCreateNotification(options?: useDataConnectMutationOptions<CreateNotificationData, FirebaseError, CreateNotificationVariables>): UseDataConnectMutationResult<CreateNotificationData, CreateNotificationVariables>;
export function useCreateNotification(dc: DataConnect, options?: useDataConnectMutationOptions<CreateNotificationData, FirebaseError, CreateNotificationVariables>): UseDataConnectMutationResult<CreateNotificationData, CreateNotificationVariables>;

export function useListNotifications(options?: useDataConnectQueryOptions<ListNotificationsData>): UseDataConnectQueryResult<ListNotificationsData, undefined>;
export function useListNotifications(dc: DataConnect, options?: useDataConnectQueryOptions<ListNotificationsData>): UseDataConnectQueryResult<ListNotificationsData, undefined>;

export function useMarkNotificationRead(options?: useDataConnectMutationOptions<MarkNotificationReadData, FirebaseError, MarkNotificationReadVariables>): UseDataConnectMutationResult<MarkNotificationReadData, MarkNotificationReadVariables>;
export function useMarkNotificationRead(dc: DataConnect, options?: useDataConnectMutationOptions<MarkNotificationReadData, FirebaseError, MarkNotificationReadVariables>): UseDataConnectMutationResult<MarkNotificationReadData, MarkNotificationReadVariables>;
