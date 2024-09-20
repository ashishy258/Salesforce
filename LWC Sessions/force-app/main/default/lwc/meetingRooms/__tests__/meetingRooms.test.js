import {createElement} from 'lwc';
import MeetingRooms from 'c/meetingRooms';

describe('c-meetingRooms',() =>{

    afterEach( () => {
        while(document.body.firstChild){
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('checking no. of elements', () => {
        const meetingRooms = createElement('c-meetingRooms',{is:MeetingRooms});
        document.body.appendChild(meetingRooms);

        const allMeetingRooms = meetingRooms.shadowRoot.querySelectorAll('c-meeting-room');
        expect(allMeetingRooms.length).toBe(4);
    } )

})