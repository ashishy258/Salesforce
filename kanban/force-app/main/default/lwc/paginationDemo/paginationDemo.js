import { LightningElement, wire } from 'lwc';
import getContactList from '@salesforce/apex/DataController.getContactList';
export default class PaginationDemo extends LightningElement {
    totalContacts;
    visibleRecords;
    @wire(getContactList)
    wiredContact({error,data}){
        if(data){
            this.totalContacts = data;
            console.log(this.totalContacts);
        }
        else if(error){
            console.log(error);
        }
    }
    updateContactHandler(event){
        this.visibleRecords = [...event.detail.records];
        console.log(event.detail.records);
    }
    
}