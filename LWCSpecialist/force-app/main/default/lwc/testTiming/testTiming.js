import { LightningElement } from 'lwc';

export default class TestTiming extends LightningElement {
    changeHandler(event){
        var a = event.detail.value;
        var m = new Date(a);
        console.log(a);
        console.log(m.toISOString());
        console.log(m.getTime());
        const c = new Date();
        c.setTime(m.getTime());
        console.log(c);
        var theBigDay = new Date('July 1, 1999');
        var sameAsBigDay = new Date();
        sameAsBigDay.setTime(theBigDay.getTime());
        console.log(sameAsBigDay);
    }
}
