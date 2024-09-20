import { LightningElement } from 'lwc';

export default class AccountManagerForm extends LightningElement {

    recordId;
    handleSuccess(event){
        this.recordId = event.detail.id;
    }
}