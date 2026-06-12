import E from '../ui_core/E';
import isNullOrUndefinedOrEmptyString from '../core/isNullOrUndefinedOrEmptyString';
import isNullOrUndefined from '../core/isNullOrUndefined';
import _createImageHoverButton from '../ui_core/_createImageHoverButton';
import _createImageHoverTextButton from '../ui_core/_createImageHoverTextButton';
import _createTextButton from '../ui_core/_createTextButton';
import './SimpleMenu.css';
export default class SimpleMenu{
    constructor({items, className}) {
		const disposes = [];
		this._disposes = disposes;
		this.dispose = this.dispose.bind(this);
		this._element = E.div('simple-menu');
		if(!isNullOrUndefinedOrEmptyString(className)){
			this._element.classList.add(className);
		}
		items.forEach(item=>{
			const {text, icon, iconHover, callback} = item;
			let itemElement;
			if(text){
				if(icon){
					itemElement = _createImageHoverTextButton(
						item.icon, 
						!isNullOrUndefined(iconHover)?iconHover:icon, 
						'item', 
						callback, 
						disposes, 
						text, 
						true
					);
				}
				else{
					itemElement = _createTextButton({
						className:'item', 
						callback, 
						disposes, 
						useMouseDown:true, 
						text
					});
				}
			}
			else{
				itemElement = _createImageHoverButton(
					icon, 
					!isNullOrUndefined(iconHover)?iconHover:icon,
					'item', 
					callback,
					disposes
				);
			}
			this._element.appendChild(itemElement);
		});
	}
	get element(){
		return this._element;
	}
	dispose(){
		this._disposes.forEach(d=>d());
	}
}