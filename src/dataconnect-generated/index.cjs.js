const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'wpl-auto-bank',
  location: 'us-south1'
};
exports.connectorConfig = connectorConfig;

const createUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateUser', inputVars);
}
createUserRef.operationName = 'CreateUser';
exports.createUserRef = createUserRef;

exports.createUser = function createUser(dcOrVars, vars) {
  return executeMutation(createUserRef(dcOrVars, vars));
};

const getUserRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUser');
}
getUserRef.operationName = 'GetUser';
exports.getUserRef = getUserRef;

exports.getUser = function getUser(dc) {
  return executeQuery(getUserRef(dc));
};

const createBankAccountRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateBankAccount', inputVars);
}
createBankAccountRef.operationName = 'CreateBankAccount';
exports.createBankAccountRef = createBankAccountRef;

exports.createBankAccount = function createBankAccount(dcOrVars, vars) {
  return executeMutation(createBankAccountRef(dcOrVars, vars));
};

const listBankAccountsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListBankAccounts');
}
listBankAccountsRef.operationName = 'ListBankAccounts';
exports.listBankAccountsRef = listBankAccountsRef;

exports.listBankAccounts = function listBankAccounts(dc) {
  return executeQuery(listBankAccountsRef(dc));
};

const createDownloadScheduleRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateDownloadSchedule', inputVars);
}
createDownloadScheduleRef.operationName = 'CreateDownloadSchedule';
exports.createDownloadScheduleRef = createDownloadScheduleRef;

exports.createDownloadSchedule = function createDownloadSchedule(dcOrVars, vars) {
  return executeMutation(createDownloadScheduleRef(dcOrVars, vars));
};

const updateDownloadScheduleRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateDownloadSchedule', inputVars);
}
updateDownloadScheduleRef.operationName = 'UpdateDownloadSchedule';
exports.updateDownloadScheduleRef = updateDownloadScheduleRef;

exports.updateDownloadSchedule = function updateDownloadSchedule(dcOrVars, vars) {
  return executeMutation(updateDownloadScheduleRef(dcOrVars, vars));
};

const deleteDownloadScheduleRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteDownloadSchedule', inputVars);
}
deleteDownloadScheduleRef.operationName = 'DeleteDownloadSchedule';
exports.deleteDownloadScheduleRef = deleteDownloadScheduleRef;

exports.deleteDownloadSchedule = function deleteDownloadSchedule(dcOrVars, vars) {
  return executeMutation(deleteDownloadScheduleRef(dcOrVars, vars));
};

const listDownloadSchedulesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListDownloadSchedules');
}
listDownloadSchedulesRef.operationName = 'ListDownloadSchedules';
exports.listDownloadSchedulesRef = listDownloadSchedulesRef;

exports.listDownloadSchedules = function listDownloadSchedules(dc) {
  return executeQuery(listDownloadSchedulesRef(dc));
};

const createStatementRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateStatement', inputVars);
}
createStatementRef.operationName = 'CreateStatement';
exports.createStatementRef = createStatementRef;

exports.createStatement = function createStatement(dcOrVars, vars) {
  return executeMutation(createStatementRef(dcOrVars, vars));
};

const listStatementsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListStatements');
}
listStatementsRef.operationName = 'ListStatements';
exports.listStatementsRef = listStatementsRef;

exports.listStatements = function listStatements(dc) {
  return executeQuery(listStatementsRef(dc));
};

const createNotificationRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateNotification', inputVars);
}
createNotificationRef.operationName = 'CreateNotification';
exports.createNotificationRef = createNotificationRef;

exports.createNotification = function createNotification(dcOrVars, vars) {
  return executeMutation(createNotificationRef(dcOrVars, vars));
};

const listNotificationsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListNotifications');
}
listNotificationsRef.operationName = 'ListNotifications';
exports.listNotificationsRef = listNotificationsRef;

exports.listNotifications = function listNotifications(dc) {
  return executeQuery(listNotificationsRef(dc));
};
