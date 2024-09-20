import { LightningElement, track, wire, api } from 'lwc';
import getAccounts from '@salesforce/apex/GetChildAccounts.getAccounts';
import getCases from '@salesforce/apex/GetChildAccounts.getCases';


export default class ChildAccountsTable extends LightningElement {

    @api recordId;
    @track accounts;
    error;
    childAccountId;
    @track caseToShow;

    @wire(getAccounts,{recordId:'$recordId'})
    getChildAcc({error,data}){
        if(data){
            this.accounts = data;
            this.error = undefined;
            console.log(accounts);
        }else if(error){
            this.error = error;
            this.accounts = undefined;
            console.log('ashish');
        }
    }


    showCases(event){

        this.childAccountId = event.currentTarget.name;
        console.log(this.childAccountId);
        getCases({childAccId: this.childAccountId})
            .then(result => {
                this.caseToShow = result;
                console.log("ashish");
                console.log(this.caseToShow);
            })
            .catch(error => {
                this.error = error;v 
            });
        
    }


}