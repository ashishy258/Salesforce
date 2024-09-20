public with sharing class GetChildAccounts {
    
    @AuraEnabled(cacheable = true)
    public static List<Account> getAccounts(Id recordId){
        List<Account> acc = [Select Id, Name, (Select Id, Status from Cases ) from Account where Account__c =: recordId];
        return acc;
    }

    @AuraEnabled
    public static List<Case> getCases(Id childAccId){
        List<Case> listCases = [Select Id, Account.Name from Case where AccountId =: childAccId];
        return listCases;
    }

    @AuraEnabled
    public static String updateBoatReviewRecord(Double rating, String parentBoatId){
        String runningUserId = UserInfo.getUserId();
        List<BoatReview__c> existingBoatReviewRecords = [SELECT Id, Rating__c, Name FROM BoatReview__c
                                                         WHERE CreatedById =: runningUserId
                                                         AND Boat__c =: parentBoatId ORDER BY LastModifiedDate DESC];
        
        BoatReview__c newReviewRec = new BoatReview__c();
        newReviewRec.Rating__c = rating;
        newReviewRec.Boat__c = parentBoatId;
        newReviewRec.Name = 'Test';

        if(!existingBoatReviewRecords.isEmpty()){
            newReviewRec.Id = existingBoatReviewRecords[0].Id;
            newReviewRec.Name = existingBoatReviewRecords[0].Name;
        }

        try {
            upsert newReviewRec;
            return 'success';

        } catch (Exception ex) {
            return ex.getMessage();
        }
    }

    @AuraEnabled(cacheable = true)
    public static Wrapper getLatestAppFeedback(String parentBoatId){
        String runningUserId = UserInfo.getUserId();
        BoatReview__c existingAppFeedbackRecord = new BoatReview__c();
        Wrapper wrap = new Wrapper();
        try{
            // existingAppFeedbackRecord = [SELECT Id, Rating__c FROM BoatReview__c
            //                              WHERE CreatedById =: runningUserId
            //                              AND Boat__c =: parentBoatId
            //                              WITH USER_MODE 
            //                              ORDER BY LastModifiedDate DESC LIMIT 1];
            String query = 'SELECT Id, Rating__c FROM BoatReview__c '+
                            + 'WHERE CreatedById =: runningUserId AND Boat__c =: parentBoatId WITH USER_MODE ORDER BY LastModifiedDate DESC LIMIT 1';
            List<BoatReview__c> appRecordsWithImages = Database.query(query);
            existingAppFeedbackRecord = appRecordsWithImages[0];
            wrap.averageAppRating = existingAppFeedbackRecord.Rating__c;
            return wrap;

        } catch (Exception ex) {
            return wrap;
        }
    }

    public class Wrapper{
        @AuraEnabled
        public Decimal averageAppRating { get; set;}
    }
}