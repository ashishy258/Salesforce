import { LightningElement,wire } from 'lwc';
import searchDrug from '@salesforce/apex/DrugController.searchDrug';
export default class List extends LightningElement {

    drugRecord;
    errors;
    descr;
    @wire(searchDrug)
    wiredRecords({error,data}){

        this.drugRecord = data;
        this.errors = error;
    }
    handleEvent(event){
        const eventval = event.detail;

        searchDrug({
            searchParam : eventval
        })
        .then(result =>{
            this.drugRecord=result;
            this.errors = undefined;
        })
        .catch(error =>{
            this.drugRecord=undefined;
            this.errors = error;
        })


    }
    
}