import { LightningElement, wire, api, track } from 'lwc';
import getAccountist from '@salesforce/apex/AccountController.getAccountist';
import updateAccounts from '@salesforce/apex/AccountController.updateAccounts';
import { getRecordNotifyChange } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import { subscribe, unsubscribe, onError, setDebugFlag, isEmpEnabled } from 'lightning/empApi';

const COLUMNS = [
    { label: 'Name', fieldName: 'Name', editable: true},
    { label: 'Amount', fieldName: 'AnnualRevenue'},
    { label: 'Number', fieldName: 'activities_count__c'},
    { label: 'Created Date', fieldName: 'CreatedDate'},
    { label: 'Type', fieldName: 'Type'},
    { label: 'Industry', fieldName: 'Industry', sortable: true},
    { label: 'URLId', fieldName: 'urlId', type: 'url', sortable: true,
                                        typeAttributes:{
                                            label: {fieldName: 'Name'},
                                            target: '_blank'

                                        } },
];

export default class ApexWireDemo extends LightningElement {

    columns = COLUMNS;
    imperatively;
    wholeData = [];
    selectedValue = '';
    options = [];
    filteredData = [];
    filterBy = '';
    FilterOptions = [];
    inputValue = '';
    disableInputSearch = false;
    sortBy = 'Name';
    sortDirection = 'asc';
    sortingOptions = [];
    draftValues = [];
    @api recordId;
    @track wiredAccountList = [];

    channelName = '/event/Account__e';
    isSubscribeDisabled = false;
    isUnsubscribeDisabled = !this.isSubscribeDisabled;

    connectedCallback() {
        this.handleSubscribe();
        // Register error listener
        this.registerErrorListener();
    }

    // Handles subscribing
    handleSubscribe() {
        // Callback invoked whenever a new event message is received
        const messageCallback = (response) => {
            console.log('New message received: ', JSON.stringify(response));
            // Response contains the payload of the new message received
            this.handleNotification(response);
        };

        // Invoke subscribe method of empApi. Pass reference to messageCallback
        subscribe(this.channelName, -1, messageCallback).then(response => {
            // Response contains the subscription information on subscribe call
            console.log('Subscription request sent to: ', JSON.stringify(response.channel));
            this.subscription = response;
            this.handleNotification(response);
        });
    }

    //this method checks if current record got updated and shows message on UI
    handleNotification(response){
        console.log('response: ', JSON.parse(JSON.stringify(response)));
        if(response.hasOwnProperty('data')){
            let jsonObj = response.data;
            
            if(jsonObj.hasOwnProperty('payload')){ 
                console.log('AShish');
                refreshApex(this.wiredAccountList);
            }
        }
    }

    registerErrorListener() {
        // Invoke onError empApi method
        onError((error) => {
            console.log('Received error from server: ', JSON.stringify(error));
            // Error contains the server-side error
        });
    }

    @wire(getAccountist)
    wiredAccounts(result){
        this.wiredAccountList = result;
        if (result.data) {
            this.FilterOptions = [{'label':'--None--', 'value':'None'}, {'label':'ALL', 'value':'ALL'}, ...this.getFilterOptions(result.data)];
            this.sortingOptions = [{'label':'urlId', 'value': 'urlId'}, ...this.getFilterOptions(result.data)];
            this.options = [{label: 'ALL', value: ''}, ...result.data.typeFieldValues];
            this.wholeData = [...this.addURLFieldToData(result.data)];
            this.filteredData = [...this.sortByMethod(this.wholeData)];
        }

        else if (result.error) {
            console.log(result.error);
        }
    }

    getFilterOptions(data){
        const arrName = Object.keys(data.recordData[0]);
        return arrName.map(item =>{
            return {'label':item, 'value': item};
        })
    }

    addURLFieldToData(data){
        return data.recordData.map(item => ({...item, urlId: "/"+item.Id}));
    }

    handleTypeChange(event){
        this.filteredData = this.wholeData;
        this.selectedValue = event.target.value;

        this.filteredData = this.wholeData.filter(item => {
            if (!this.selectedValue) {
                return item;
            }
            else {
                return (item.Type === this.selectedValue);
            }
        });
        console.log(this.filteredData);
    }

    handleFilterChange(event){
        this.filterBy = event.target.value;
        if (this.filterBy === 'None') {
            this.disableInputSearch = true;
        }
        else {
            this.disableInputSearch = false;
        }
    }

    handleSearchChange(event){
        this.filteredData = this.wholeData;
        let searchTerm = event.target.value;
        if (searchTerm) {
            
                this.filteredData = this.wholeData.filter(eachRec => {
                    if (this.filterBy === 'ALL') {
                        return Object.keys(eachRec).some(key =>{
                            return eachRec[key].toLowerCase().includes(searchTerm.toLowerCase());
                        });
                    }
                    else {
                        return eachRec[this.filterBy].toLowerCase().includes(searchTerm.toLowerCase());
                    }
                }); 
        }
        else {
            this.filteredData = this.wholeData;
        }
    }

    handleSortChange(event){
        this.sortBy = event.target.value;
        if(this.sortBy === 'urlId'){
            this.sortBy = 'Name';
        }
        //this.sortDirection = 'asc';
        console.log('from here');
        this.filteredData = [...this.sortByMethod(this.wholeData)];
    }

    handleSort(event){
        this.sortBy = event.detail.fieldName;
        this.sortDirection = event.detail.sortDirection;
        this.filteredData = [...this.sortByMethod(this.wholeData)];
    }

    sortByMethod(data){
        const cloneData = [...data];
        console.log('sortBy: ', this.sortBy, ' : ', this.sortDirection);
        cloneData.sort((a, b) => {
            if (a[this.sortBy] === b[this.sortBy]){
                return 0;
            }
            return this.sortDirection === 'desc' ?
            a[this.sortBy] > b[this.sortBy] ? -1:1 :
            a[this.sortBy] < b[this.sortBy] ? -1:1
        });
        return cloneData;
    }

    handleSortDirection(){
        this.sortDirection = this.sortDirection == 'asc' ? 'desc' : 'asc';
        this.filteredData = [...this.sortByMethod(this.wholeData)];
    }

    async handleSave(event) {
        const updatedFields = event.detail.draftValues;
        console.log('updatedFields: ', updatedFields);
        // Prepare the record IDs for getRecordNotifyChange()
        const notifyChangeIds = updatedFields.map(row => { return { "recordId": row.Id } });

        try {
            // Pass edited fields to the updateContacts Apex controller
            const result = await updateAccounts({data: updatedFields});
            console.log(JSON.stringify("Apex update result: "+ result));
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Accounts updated',
                    variant: 'success'
                })
            );

            // Refresh LDS cache and wires
            getRecordNotifyChange(notifyChangeIds);

             // Clear all draft values in the datatable
                this.draftValues = [];
                
            // Display fresh data in the datatable
            await refreshApex(this.wiredAccounts);
               
        }
        catch(error) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error updating or refreshing records',
                    message: error.body.message,
                    variant: 'error'
                })
            );
        };
    }
}