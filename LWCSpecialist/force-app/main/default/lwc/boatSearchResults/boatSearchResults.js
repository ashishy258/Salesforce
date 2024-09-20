import { LightningElement, api, wire, track } from 'lwc';
import getBoats from '@salesforce/apex/BoatDataService.getBoats';
import { publish, MessageContext } from 'lightning/messageService';
import BOATMC from '@salesforce/messageChannel/BoatMessageChannel__c';
import { updateRecord } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';



const SUCCESS_TITLE = 'Success';
const MESSAGE_SHIP_IT     = 'Ship it!';
const SUCCESS_VARIANT     = 'success';
const ERROR_TITLE   = 'Error';
const ERROR_VARIANT = 'error';

const columns = [
  { label: 'Name', fieldName: 'Name', editable: true   },
  { label: 'Length', fieldName: 'Length__c', editable: true   },
  { label: 'Price', fieldName: 'Price__c', type: 'currency', editable: true   },
  { label: 'Description', fieldName: 'Description__c', editable: true   },
];

export default class BoatSearchResults extends LightningElement {
  selectedBoatId;
  columns = [];
  boatTypeId = '';
  boats;
  isLoading = false;
  columns = columns;
  @track draftValues = [];
  wiredAccountResults;
  visibleRecords;
  @api cPage =1;
  // wired message context
  @wire(MessageContext)
    messageContext;

  // wired getBoats method 
  @wire(getBoats,{boatTypeId:'$boatTypeId'})
  wiredBoats(result) { 
    this.wiredAccountResults = result;
    if(result.data){
        this.boats = result.data;
    } else if(result.error){
        this.showToast('ERROR', result.error.body.message, 'error');
    }
  }

  showToast(title, message, variant) {
    const evt = new ShowToastEvent({
        title: title,
        message: message,
        variant: variant,
    });
    this.dispatchEvent(evt);
}
  
  // public function that updates the existing boatTypeId property
  // uses notifyLoading
  @api
    searchBoats(boatTypeId) {
        this.isLoading = true;
        this.notifyLoading(this.isLoading);
        this.boatTypeId = boatTypeId;
    }
  
  // this public function must refresh the boats asynchronously
  // uses notifyLoading
  @api
  async refresh() {
      this.isLoading = true;
      this.notifyLoading(this.isLoading);      
      await refreshApex(this.boats);
      this.isLoading = false;
      this.notifyLoading(this.isLoading);        
  }
  
  // this function must update selectedBoatId and call sendMessageService
  updateSelectedTile(event) { 
    this.selectedBoatId = event.detail.boatId;
    console.log('from boatsearchresult'+ this.selectedBoatId);
    this.sendMessageService(this.selectedBoatId);
  }
  
  // Publishes the selected boat Id on the BoatMC.
  sendMessageService(boatId) { 
    // explicitly pass boatId to the parameter recordId
    const message = {
      recordId: boatId
    };
    publish(this.messageContext, BOATMC, message);
  }
  
  // This method must save the changes in the Boat Editor
  // Show a toast message with the title
  // clear lightning-datatable draft values
  handleSave(event) {
    const recordInputs = event.detail.draftValues.slice().map(draft => {
        const fields = Object.assign({}, draft);
        console.log(fields);
        return { fields };
    });
    const promises = recordInputs.map(recordInput =>{
      updateRecord(recordInput);
    }
            //update boat record
        );
    Promise.all(promises)
        .then(() => {
          this.dispatchEvent(new ShowToastEvent({
            title:SUCCESS_TITLE,
            message:MESSAGE_SHIP_IT,
            variant:SUCCESS_VARIANT
          })
          );
           // Clear all draft values
          this.draftValues = [];

           // Display fresh data in the datatable
           refreshApex(this.wiredAccountResults);

        })
        .catch(error => {
          this.dispatchEvent(new ShowToastEvent({
            title:ERROR_TITLE,
            message:MESSAGE_SHIP_IT,
            variant:ERROR_VARIANT
          })
          );
        })
        .finally(() => {});
  }
  // Check the current value of isLoading before dispatching the doneloading or loading custom event
  notifyLoading(isLoading) {
    if (isLoading) {
        this.dispatchEvent(new CustomEvent('loading'));
    } else {
        this.dispatchEvent(new CustomEvent('doneloading'));
    }
}

  get isBoat(){
    if(this.boats){
      return true;
    }
    return false;
  }

  updateRecordsHandler(event){ 
    this.visibleRecords = event.detail.records;
    this.cPage = event.detail.cpage;
  }
}