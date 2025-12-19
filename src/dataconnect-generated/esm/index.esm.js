import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'example',
  service: 'wpl-auto-bank',
  location: 'us-south1'
};

export const createUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateUser', inputVars);
}
createUserRef.operationName = 'CreateUser';

export function createUser(dcOrVars, vars) {
  return executeMutation(createUserRef(dcOrVars, vars));
}

export const adminUpsertUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AdminUpsertUser', inputVars);
}
adminUpsertUserRef.operationName = 'AdminUpsertUser';

export function adminUpsertUser(dcOrVars, vars) {
  return executeMutation(adminUpsertUserRef(dcOrVars, vars));
}

export const getUserRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUser');
}
getUserRef.operationName = 'GetUser';

export function getUser(dc) {
  return executeQuery(getUserRef(dc));
}

export const listUsersRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListUsers');
}
listUsersRef.operationName = 'ListUsers';

export function listUsers(dc) {
  return executeQuery(listUsersRef(dc));
}

export const updateUserProfileRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateUserProfile', inputVars);
}
updateUserProfileRef.operationName = 'UpdateUserProfile';

export function updateUserProfile(dcOrVars, vars) {
  return executeMutation(updateUserProfileRef(dcOrVars, vars));
}

export const deleteUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteUser', inputVars);
}
deleteUserRef.operationName = 'DeleteUser';

export function deleteUser(dcOrVars, vars) {
  return executeMutation(deleteUserRef(dcOrVars, vars));
}

export const createBankAccountRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateBankAccount', inputVars);
}
createBankAccountRef.operationName = 'CreateBankAccount';

export function createBankAccount(dcOrVars, vars) {
  return executeMutation(createBankAccountRef(dcOrVars, vars));
}

export const updateBankAccountRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateBankAccount', inputVars);
}
updateBankAccountRef.operationName = 'UpdateBankAccount';

export function updateBankAccount(dcOrVars, vars) {
  return executeMutation(updateBankAccountRef(dcOrVars, vars));
}

export const deleteBankAccountRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteBankAccount', inputVars);
}
deleteBankAccountRef.operationName = 'DeleteBankAccount';

export function deleteBankAccount(dcOrVars, vars) {
  return executeMutation(deleteBankAccountRef(dcOrVars, vars));
}

export const listBankAccountsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListBankAccounts');
}
listBankAccountsRef.operationName = 'ListBankAccounts';

export function listBankAccounts(dc) {
  return executeQuery(listBankAccountsRef(dc));
}

export const createDownloadScheduleRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateDownloadSchedule', inputVars);
}
createDownloadScheduleRef.operationName = 'CreateDownloadSchedule';

export function createDownloadSchedule(dcOrVars, vars) {
  return executeMutation(createDownloadScheduleRef(dcOrVars, vars));
}

export const updateDownloadScheduleRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateDownloadSchedule', inputVars);
}
updateDownloadScheduleRef.operationName = 'UpdateDownloadSchedule';

export function updateDownloadSchedule(dcOrVars, vars) {
  return executeMutation(updateDownloadScheduleRef(dcOrVars, vars));
}

export const deleteDownloadScheduleRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteDownloadSchedule', inputVars);
}
deleteDownloadScheduleRef.operationName = 'DeleteDownloadSchedule';

export function deleteDownloadSchedule(dcOrVars, vars) {
  return executeMutation(deleteDownloadScheduleRef(dcOrVars, vars));
}

export const listDownloadSchedulesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListDownloadSchedules');
}
listDownloadSchedulesRef.operationName = 'ListDownloadSchedules';

export function listDownloadSchedules(dc) {
  return executeQuery(listDownloadSchedulesRef(dc));
}

export const createStatementRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateStatement', inputVars);
}
createStatementRef.operationName = 'CreateStatement';

export function createStatement(dcOrVars, vars) {
  return executeMutation(createStatementRef(dcOrVars, vars));
}

export const listStatementsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListStatements');
}
listStatementsRef.operationName = 'ListStatements';

export function listStatements(dc) {
  return executeQuery(listStatementsRef(dc));
}

export const createNotificationRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateNotification', inputVars);
}
createNotificationRef.operationName = 'CreateNotification';

export function createNotification(dcOrVars, vars) {
  return executeMutation(createNotificationRef(dcOrVars, vars));
}

export const listNotificationsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListNotifications');
}
listNotificationsRef.operationName = 'ListNotifications';

export function listNotifications(dc) {
  return executeQuery(listNotificationsRef(dc));
}

export const markNotificationReadRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'MarkNotificationRead', inputVars);
}
markNotificationReadRef.operationName = 'MarkNotificationRead';

export function markNotificationRead(dcOrVars, vars) {
  return executeMutation(markNotificationReadRef(dcOrVars, vars));
}

