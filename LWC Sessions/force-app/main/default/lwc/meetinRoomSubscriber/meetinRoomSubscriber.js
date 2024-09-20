import { LightningElement, wire } from 'lwc';
import pubsub from 'c/pubsub';
import { CurrentPageReference } from 'lightning/navigation';

export default class MeetinRoomSubscriber extends LightningElement {

    @wire (CurrentPageReference) 
    pageRef;

    details = {};

    connectedCallback() {
        console.log('hij');
        pubsub.register('frompublisher', this.sutUpDetails.bind(this), this);
    }
     
    disconnectedCallback() {
        unregisterAllListeners(this);
    }

    sutUpDetails(payload){
        console.log('klm');
        this.details = payload;
    }

}