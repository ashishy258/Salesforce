import { LightningElement, api, track } from 'lwc';
export default class StarRating extends LightningElement {

    @track stars;
    @track componentClass = '';
    @api color;

    _maximumNumberOfStars = 15;
    _showHalfStars = false;
    _halfStarVisible = false;
    _readOnly = false;
    _rating = 0;
    _ratingAsInteger = 0;
    _numberOfStars = 5;
    _spaceBetween = 'small';
    _size = 'medium';


    get size() {
        return this._size;
    }
    @api
    set size(value) {
        this._size = value;
        this.componentClass = this.getComponentClassNames();
    }

    get maximumNumberOfStars() {
        return this._maximumNumberOfStars;
    }

    get numberOfStars() {
        return this._numberOfStars;
    }

    @api
    set numberOfStars(value) {
        this._numberOfStars =
            value && value >= this.maximumNumberOfStars
                ? this.maximumNumberOfStars
                : value;
        this.componentClass = this.getComponentClassNames();
        this.stars = this.getStarsArray();
    }

    @api
    set rating(value) {
        this._ratingAsInteger = parseInt(value, 10);
        this._rating = Number(value);
        this.setRating(this._rating);
        this.componentClass = this.getComponentClassNames();
    }
    get rating() {
        return this._rating;
    }

    get spaceBetween() {
        return 'space-' + this._spaceBetween;
    }
    @api
    set spaceBetween(value) {
        this._spaceBetween = value;
        this.componentClass = this.getComponentClassNames();
    }

    set halfStarVisible(value) {
        this._halfStarVisible = value;
    }
    get halfStarVisible() {
        return this._halfStarVisible;
    }

    get readOnly() {
        return this._readOnly;
    }
    
    get readOnlyStar(){
        return this._readOnly;
    }

    @api
    set readOnlyStar(value) {
        this._readOnly = !!value;
        this.componentClass = this.getComponentClassNames();
    }

    get showHalfStars() {
        return this._showHalfStars;
    }

    @api
    set showHalfStars(value) {
        this._showHalfStars = !!value;
        //update halfStarVisible
        this.setHalfStarVisible();
        this.componentClass = this.getComponentClassNames();
    }

    connectedCallback() {
        this.stars = this.getStarsArray();
        this.componentClass = this.getComponentClassNames();
    }

    getComponentClassNames() {
        const classNames = ['rating'];
        classNames.push(
            this.rating ? 'value-' + this._ratingAsInteger : 'value-0'
        );
        classNames.push(this.halfStarVisible ? 'half' : '');
        classNames.push(this.size);
        classNames.push(this.readOnly ? 'read-only' : '');
        classNames.push(this.spaceBetween);

        return classNames.join(' ');
    }

    getStarsArray(numOfStars) {
        if (!numOfStars) {
            numOfStars = this.numberOfStars;
        }

        let stars = [];
        let rating = this.rating;
        for (let i = 0; i < numOfStars; i++) {
            let star = {
                id: 'star-' + i,
                value: i + 1,
                class:"star value-empty"
            };
            if(i < rating){
                star.class = "star value-filled";
            }
            if(this.halfStarVisible && i === this._ratingAsInteger){
                star.class = "star value-half";
            }
            stars.push(star);
        }
        return stars;
    }

    onStarClicked(event) {
        if (!this.interactionPossible()) {
            return;
        }
        if (event && !event.target) {
            return;
        }
        let targetEl = event.target;
        let ratingValue = this.getStarRatingValue(targetEl);
        this.setRating(ratingValue);

        //trigger ratingchange event
        this.dispatchEvent(
            new CustomEvent('ratingchange', {
                detail: {
                    rating: this.rating
                }
            })
        );
    }

    getStarRatingValue(targetEl) {
        if (!targetEl) {
            return 0;
        }
        let starEl = targetEl.closest('div[data-rating]');
        if (!starEl) {
            return 0;
        }
        let ratingValue = this.getRatingValue(starEl);
        return ratingValue;
    }

    getRatingValue(starEl) {
        return starEl ? parseInt(starEl.getAttribute('data-rating'), 10) : 0;
    }

    setRating(value) {
        let newRating = 0;
        if (value >= 0 && value <= this.maximumNumberOfStars) {
            newRating = value;
        }

        //limit max value to max number of stars
        if (value > this.maximumNumberOfStars) {
            newRating = this.numberOfStars;
        }
        this._rating = newRating;

        //update _ratingAsInteger. rating parsed to int for the value-[n] modifier
        this._ratingAsInteger = parseInt(this.rating.toString(), 10);
        this.setHalfStarVisible();
        this.stars = this.getStarsArray();
    }

    setHalfStarVisible() {
        //update halfStarVisible
        if (this.showHalfStars) {
            //check if custom function is given
            this.halfStarVisible = this.getHalfStarVisible(this.rating);
        } else {
            this.halfStarVisible = false;
        }
    }

    getHalfStarVisible(rating) {
        return Math.abs(rating % 1) > 0;
    }

    interactionPossible() {
        return !this.readOnly;
    }
}