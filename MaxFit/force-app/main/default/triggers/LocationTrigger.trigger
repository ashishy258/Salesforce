trigger LocationTrigger on Location__c (after insert) {

    if(Trigger.isAfter && Trigger.isInsert){
        for(Location__c loc : Trigger.new){
            LocationTriggerHandler.verifyAddress(loc.Id);
        }
    }

}