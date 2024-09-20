import { LightningElement, wire, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { CurrentPageReference } from "lightning/navigation";
import getNavigationalTopics from '@salesforce/apex/CustomTopicCatalogController.getNavigationalTopics';

export default class CustomTopicCatalogLWC extends NavigationMixin(LightningElement) {

    @track managedTopics = [];
    selectedItemValue = [];
    topicId;
    isLoaded = false;
    baseURL;
    parentId;
    isRendered = false;

    @wire(CurrentPageReference)
    getStateParameters(currentPageReference) {
        if (currentPageReference) {
            this.topicId = currentPageReference.attributes.recordId;
         }
    }
    
    @wire(getNavigationalTopics)
    wiredTopics(result){
        if (result.data) {
            let res = result.data.replace(/"children"/g, '"items"');
            this.managedTopics = JSON.parse(res).managedTopics;
            this.baseURL = window.location.origin;
            this.findElement(this.managedTopics);
            this.findParents(this.managedTopics);
            this.createItemsList(this.managedTopics);
        }
        else if (result.error) {
            console.log(result.error);
        }
    }

    createItemsList(data){
        if(data.length){
            data.forEach(element => {
                element.label = element.topic.name;
                element.name = element.topic.id;
                element.href = this.baseURL + '/s/topic/' + element.topic.id;
                element.expanded = (this.selectedItemValue.includes(element.id) ? 'true' : 'false');
                element.hasChildren = element.items.length ? true : false;
                this.createItemsList(element.items);
            });
        } 
    }

    findElement(data){
        if(data.length){
            data.forEach(elem => {
                if(elem.topic.id == this.topicId){
                    this.selectedItemValue.push(elem.id);
                    this.parentId = elem.parent != null ? elem.parent.id : undefined;
                } else{
                    this.findElement(elem.items);
                }
            });
        }
    }

    findParents(data){
        if(data.length){
            data.forEach(elem => {
                if(elem.id == this.parentId){
                    this.selectedItemValue.push(elem.id);
                    this.parentId = elem.parent != null ? elem.parent.id : undefined;
                    this.findParents(this.managedTopics);
                } else{
                    this.findParents(elem.items);
                }
            });
        }
    }

    // navigateToTopic() {
    //     this[NavigationMixin.Navigate]({
    //         type: 'standard__webPage',
    //         attributes: {
    //             url: 'https://testlwc3-dev-ed.my.site.com/iphoneAccessories/s/topic/' + this.selectedItemValue
    //         }
    //     });
    // }

    // handleChevronClick(event){
    //     let elem = this.template.querySelector(`[data-name="${event.target.dataset.key}"]`);
    //     let ariaExpanded = elem.getAttribute('aria-expanded') == 'true' ? 'false' : 'true';
    //     elem.setAttribute('aria-expanded', ariaExpanded);
    // }

    // renderedCallback() {
    //     if(!this.isLoaded){
    //         let elem = this.template.querySelector(`[data-name="${this.topicId}"]`);
    //         elem.setAttribute('aria-selected', 'true');
    //         this.isLoaded = true;
    //     }
    // }
}