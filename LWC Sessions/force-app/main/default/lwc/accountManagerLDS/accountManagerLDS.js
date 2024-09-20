import { LightningElement, wire} from 'lwc';
import {createRecord, getRecord} from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const fieldsArray = ['Account.Name','Account.Phone','Account.Website'];
export default class AccountManagerLDS extends LightningElement {

    name;
    phone;
    website;
    recordid;

    @wire(getRecord, {recordId : '$recordid', fields : fieldsArray})
    showRecord;


    changeAccountNameHandler(event){
        this.name = event.target.value;
    }
    changeAccountPhoneHandler(event){
        this.phone = event.target.value;
    }
    changeAccountWebsiteHandler(event){
        this.website = event.target.value;
    }
    
    createAccount(){
        const fields = {
            'Name': this.name,
            'Phone': this.phone,
            'Website': this.website
        };
        const recordInput = {apiName:'Account',fields};

        createRecord(recordInput).then(response =>{
            console.log('the record has been created :',response.id);
            this.recordid = response.id;
            const event = new ShowToastEvent({
                title: 'Account Created',
                message: this.recordid,
                variant: 'success',
            });
            this.dispatchEvent(event);
        }).catch(error =>{

            console.log('error : ',error.body.message);
            this.recordid = undefined;
            const event = new ShowToastEvent({
                title: 'Account Does not Created',
                message: error.body.message,
                variant: 'error',
            });
            this.dispatchEvent(event);
        });
    }
    get retAccountName(){
        if(this.showRecord.data){
            return this.showRecord.data.fields.Name.value;
        }
        return undefined;
    }
    get retAccountPhone(){
        if(this.showRecord.data){
            return this.showRecord.data.fields.Phone.value;
        }
        return undefined;
    }
    get retAccountWebsite(){
        if(this.showRecord.data){
            return this.showRecord.data.fields.Website.value;
        }
        return undefined;
    }

}