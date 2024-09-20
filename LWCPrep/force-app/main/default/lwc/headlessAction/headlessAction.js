import { LightningElement, api } from 'lwc';
import getString from '@salesforce/apex/AccountController.getString';

export default class HeadlessAction extends LightningElement {
    @api recordId;
    @api invoke () { 
        getString()
            .then(result => {
                console.log(result);
                console.log(this.recordId);
            })
            .catch(error =>{
                console.error(error);
            });
        }
}