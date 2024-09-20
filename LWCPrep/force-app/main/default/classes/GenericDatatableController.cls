public with sharing class GenericDatatableController {
 
    public static String sObjectName;
    public static Boolean pagination;
    public static Boolean searchable;
    public static Decimal pageSize;
    @AuraEnabled
    public static TableInfoWrapper getTableInfo(String parentMetadataName){
        TableInfoWrapper tableInfoWrapper = new TableInfoWrapper();
        try{
            tableInfoWrapper.columns = getFields(parentMetadataName);
            tableInfoWrapper.objectName = sObjectName;
            tableInfoWrapper.isPagination = pagination;
            tableInfoWrapper.isSearchable = searchable;
            tableInfoWrapper.recordsOnPage = pageSize;
            Set<String> fieldSet = new Set<String>();
            for(FieldWrapper fieldWrapper : tableInfoWrapper.columns){
                if(fieldWrapper.type == 'url'){
                    fieldSet.add(fieldWrapper.urlLabel);
                    fieldSet.add(fieldWrapper.urlValue);
                } else{
                    fieldSet.add(fieldWrapper.fieldName);
                }
            }
            if(fieldSet.size() > 0){
                tableInfoWrapper.tableData = getRecords(sObjectName,fieldSet);
            }
        }catch (Exception exp){
            System.debug('Exception Message ::'+exp.getMessage() + ' At Line Number ::'+exp.getLineNumber());
            throw new AuraHandledException(exp.getMessage() +  ' at Line '+exp.getLineNumber());
        }
        system.debug('tableInfoWrapper: ' + tableInfoWrapper);
        return tableInfoWrapper;
 
    }

    public class TableInfoWrapper{
        @AuraEnabled public List<FieldWrapper> columns {get;set;}
        @AuraEnabled public List<sObject> tableData {get;set;}
        @AuraEnabled public String objectName {get;set;}
        @AuraEnabled public Boolean isPagination {get;set;}
        @AuraEnabled public Boolean isSearchable {get;set;}
        @AuraEnabled public Decimal recordsOnPage {get;set;}
    }

    private static List<FieldWrapper> getFields(String parentMetadataName){
        List<FieldWrapper> fieldWrappers = new List<FieldWrapper>();
        Generic_Datatable__mdt parentMdt = [SELECT Id, Object_API_Name__c, Is_Pagination__c, Is_Searchable__c, Records_On_Page__c FROM Generic_Datatable__mdt WHERE MasterLabel =: parentMetadataName LIMIT 1];
        List<Generic_Datatable_Details__mdt> childMdtList = [SELECT Id, Label, Field_API_Name__c, Datatype__c, URL_Label__c, URL_Link__c, Column_Order__c FROM Generic_Datatable_Details__mdt WHERE Generic_Datatable__c =: parentMdt.Id ORDER BY Column_Order__c ASC];
        sObjectName = parentMdt.Object_API_Name__c;
        pagination = parentMdt.Is_Pagination__c;
        searchable = parentMdt.Is_Searchable__c;
        pageSize = parentMdt.Records_On_Page__c;
        for(Generic_Datatable_Details__mdt childMdt : childMdtList){
            system.debug('label: ' + childMdt.Label);
            FieldWrapper wrapper = new FieldWrapper();
            wrapper.label = childMdt.Label;
            wrapper.type = childMdt.Datatype__c;
            if(childMdt.Datatype__c == 'url'){
                wrapper.urlLabel = childMdt.URL_Label__c;
                wrapper.urlValue = childMdt.URL_Link__c; 
            } else{
                wrapper.fieldName = childMdt.Field_API_Name__c;
            }
            fieldWrappers.add(wrapper);
        }
        return fieldWrappers;
    }

    private static List<sObject> getRecords(String sObjectName,  Set<String> fieldSet) {
        List<sObject> lstResult = new List<sObject>();
        String result = '[]';
        List<String> fieldList = new List<String>(fieldSet);
        String query = 'SELECT ' + String.join(fieldList,',') + ' FROM ' + sObjectName;
        for (SObject sobj : Database.query(query)) {
            lstResult.add(sobj);
        }
        if (lstResult.size() > 0) {
            result = JSON.serialize(lstResult);
        }
        return lstResult;
    }

    public class FieldWrapper{
        @AuraEnabled public String label {get;set;}
        @AuraEnabled public String type {get;set;}
        @AuraEnabled public String fieldName {get;set;}
        @AuraEnabled public String urlLabel {get;set;}
        @AuraEnabled public String urlValue {get;set;}
    }
}