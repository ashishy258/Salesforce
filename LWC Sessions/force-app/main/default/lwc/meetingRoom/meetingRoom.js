import { LightningElement, api, wire } from 'lwc';
import pubsub from 'c/pubsub';
import {currentPageReference} from 'lightning/navigation';


export default class MeetingRoom extends LightningElement {

    @wire (currentPageReference) 
    pageRef;

    
    @api meetingRoomInfo =  {roomName:'a', roomCapacity:'3'};

    handleClickEvent(){
       
       const selectedEvent = new CustomEvent('tileclick',{
          detail:this.meetingRoomInfo
       });
       this.dispatchEvent(selectedEvent);
       console.log('abc');
       pubsub.fire('frompublisher',this.meetingRoomInfo);
      
    }
    

}