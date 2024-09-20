public class TransactionLogHandler {

    public static void doHandleException(System.Exception ex, string processName){
        Error_Log__c transactionLog = new Error_Log__c(
        	Log_Details__c = ex.getStackTraceString() + ' <br/> ' + ex.getMessage() +
        					' <br/> ' + ex.getCause() + ' <br/> ' + ex.getTypeName() + ' <br/> ' + ex.getLineNumber(),
        	Log_DateTime__c = System.now(),
        	Process_Name__c = processName
        );
        insert transactionLog;
    }
    public static void doHandleExceptionWithError(string errors, string processName){
        Error_Log__c transactionLog = new Error_Log__c(
        	Log_Details__c = errors,
        	Log_DateTime__c = System.now(),
        	Process_Name__c = processName
        );
        insert transactionLog;
    }
}