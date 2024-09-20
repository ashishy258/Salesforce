import { LightningElement } from 'lwc';

export default class MeetingRooms extends LightningElement {
    selectedTileName;
    meetingRoomsInfo = [
        {roomName:'a', roomCapacity:'3'},
        {roomName:'b', roomCapacity:'5'},
        {roomName:'c', roomCapacity:'4'},
        {roomName:'d', roomCapacity:'2'}
    ];

    handleSelectedTile(event){
        console.log('def');
        const fromChild = event.detail;
        this.selectedTileName = fromChild.roomName;
    }
}