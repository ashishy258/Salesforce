import { LightningElement, wire, api, track } from 'lwc';
import { getListInfoByName } from 'lightning/uiListsApi';
// import checkSavedItemRecord from '@salesforce/apex/SavedItemToggleController.checkSavedItemRecord';
// import insertSavedItemRecords from '@salesforce/apex/SavedItemToggleController.insertSavedItemRecords';
// import deleteSavedItemRecords from '@salesforce/apex/SavedItemToggleController.deleteSavedItemRecords';
// import SaveItemInsertedMessage from '@salesforce/label/c.Saved_Item_Inserted_Message';
// import SaveItemDeletedMessage from '@salesforce/label/c.Saved_Item_Deleted_Message';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { CurrentPageReference } from "lightning/navigation";
import { refreshApex } from '@salesforce/apex';
import { NavigationMixin } from 'lightning/navigation';
// import SAVE_ITEM_OBJECT from '@salesforce/schema/Saved_Item__c';

export default class ToggleLWC extends NavigationMixin(LightningElement) {

    showPopover = false;
    recordId;
    pageType;
    pageURL;
    wiredSaveItem;
    listViewId;
    isPageSaved = false;
    saveButtonLabel;
    iconVariant;
    saveDisabled = false;
    @api recId;
    @api showSavedItems;
    @api noOfRecordsInDropdown;
    @api alignElement;
    savedItemRecordsList = [];
    // label = {
    //     SaveItemInsertedMessage,
    //     SaveItemDeletedMessage
    // };

    get saveButtonVariant() {
        if (this.isPageSaved) {
            this.saveButtonLabel = 'Saved';
            this.iconVariant = 'inverse';
            return 'saveButton slds-button slds-button_brand';
        } else {
            this.saveButtonLabel = 'Save';
            this.iconVariant = 'brand';
            return 'saveButton slds-button slds-button_neutral';
        }
    }

    get mainContainerClass() {
        return this.alignElement === 'Left' ? 'alignLeft' : 'alignRight';
    }

    get noOfSavedItemsToShow() {
        return parseInt(this.noOfRecordsInDropdown);
    }

    get isDataExist() {
        return this.savedItemRecordsList.length > 0 ? true : false;
    }

    @wire(getListInfoByName, { objectApiName: SAVE_ITEM_OBJECT.objectApiName, listViewApiName: 'Saved_Items' })
    listInfo({ error, data }) {
        if (data) {
            this.listViewId = data.listReference.id;
        }
    }

    @wire(CurrentPageReference)
    getStateParameters(currentPageReference) {
        if (currentPageReference) {
            this.pageType = window.document.title;
            this.recordId = currentPageReference.attributes.recordId ? currentPageReference.attributes.recordId : this.recId;
            this.pageURL = window.location.href;
         }
    }

    // @wire(checkSavedItemRecord, { targetURL: '$pageURL', noOfRecords: '$noOfSavedItemsToShow' })
    // existingSavedItem(result) {
    //     this.wiredSaveItem = result;
    //     if (result.data) {
    //         this.saveDisabled = false;
    //         this.isPageSaved = result.data.isCurrentPageSaved;
    //         this.savedItemRecordsList = result.data.savedItemsList;
    //     }
    // }

    handleSaveClick() {
        this.saveDisabled = true;
        let pageSavedState = this.isPageSaved;
        this.showPopover = false;
        // if (!this.isPageSaved) {
        //     this.insertSavedItemRecords(pageSavedState);
        // } else {
        //    this.deleteSavedItemRecords(pageSavedState);
        // }  
    }

    insertSavedItemRecords(pageSavedState) {
        insertSavedItemRecords({ targetURL: this.pageURL, recordId: this.recordId, type: this.pageType })
            .then(() => {
                this.showNotification('Success', this.label.SaveItemInsertedMessage, 'success');
                this.isPageSaved = !this.isPageSaved;
                refreshApex(this.wiredSaveItem);
            })
            .catch((error) => {
                this.isPageSaved = pageSavedState;
                this.showNotification('Error', error.body.message, 'error');
                this.saveDisabled = false;
            });
    }

    deleteSavedItemRecords(pageSavedState) {
        deleteSavedItemRecords({ targetURL: this.pageURL })
            .then(() => {
                this.showNotification('Success', this.label.SaveItemDeletedMessage, 'success');
                this.isPageSaved = !this.isPageSaved;
                refreshApex(this.wiredSaveItem);
            })
            .catch((error) => {
                this.isPageSaved = pageSavedState;
                this.showNotification('Error', error.body.message, 'error');
                this.saveDisabled = false;
            });
    }

    handleDropdownClick() {
        this.showPopover = !this.showPopover;
    }

    viewSavedItemsRecords() {
        this[NavigationMixin.GenerateUrl]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: SAVE_ITEM_OBJECT.objectApiName,
                actionName: 'list'
            },
            state: {
                filterName: this.listViewId
            }
        }).then(generatedUrl => {
            window.open(generatedUrl, '_blank', 'noopener, noreferrer');
        });
    }

    showNotification(_title, _message, _variant) {
        const evt = new ShowToastEvent({
            title: _title,
            message: _message,
            variant: _variant,
        });
        this.dispatchEvent(evt);
    }
}