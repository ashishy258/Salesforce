public class LeadProcessor implements Database.Batchable<sObject> {

    public Database.QueryLocator start(Database.BatchableContext bc) {
        return Database.getQueryLocator(
            'SELECT LeadSource FROM Lead'
        );
    }
    public void execute(Database.BatchableContext bc, List<Lead> scope){
        // process each batch of records
        List<Lead> leadsToUpdate = new List<Lead>();
        for (Lead l : scope) {
            l.LeadSource = 'Dreamforce';
            leadsToUpdate.add(l);
        }
        update leadsToUpdate;
    }
    public void finish(Database.BatchableContext bc){
        AsyncApexJob job = [SELECT Id, Status, NumberOfErrors,
            JobItemsProcessed,
            TotalJobItems, CreatedBy.Email
            FROM AsyncApexJob
            WHERE Id = :bc.getJobId()];
            
        System.debug('Job status: ' + job.Status);
    }
}