import { LightningElement, api } from 'lwc';

export default class Slider extends LightningElement {
    count = 0;
    inc = 0;
    loaded = false;
    margin = 0;
    itemleft;
    itemslide;
    itemDisplay = 0;
    slider;

    calculateItemToDisplay(){
        this.slider = this.template.querySelector(".slider-width");
        this.mainDiv = this.template.querySelector(".slider-container");
        let rect = this.mainDiv.getBoundingClientRect();
        console.log('slider: ', this.mainDiv.clientWidth);
        console.log('rect: ', rect['width']);
        console.log('screen width: ', screen.width);
        this.itemDisplay = 3;
        this.margin = 10;
        for (const key in rect) {
            if (typeof rect[key] !== "function") {
              console.log(`${key} : ${rect[key]}`);
            }
          }

        let items = this.template.querySelectorAll(".item");
        console.log(items.length);
        this.itemleft = items.length % this.itemDisplay;
        this.itemslide = Math.floor(items.length / this.itemDisplay) - 1; 
        // for (let i = 0; i < items.length; i++) {
        //     //items[i].style.width = (this.mainDiv.clientWidth / this.itemDisplay) - this.margin + "px";
        //     items[i].style.width = '200px';
        // }
        console.log('itemleft: ', this.itemleft);
        console.log('itemslide: ', this.itemslide);
    }

    renderedCallback(){
        if(!this.loaded){
            this.calculateItemToDisplay();
            this.loaded = true;
        }
    }
}