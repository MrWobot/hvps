import PropertyBindingFactory from '../../mvvm/PropertyBindingFactory';
import E from '../../ui_core/E';
import i from '../../ui_core/i';
import isNullOrUndefined from '../../core/isNullOrUndefined';
import _createImageHoverButton from '../../ui_core/_createImageHoverButton';
import getAbsoluteRectangle from '../../ui_core/getAbsoluteRectangle';
import SampleType from '../../generated/enums/SampleType';
import SimpleMenu from '../../components/SimpleMenu';
import Popup from '../../tippler_ui/Popup';
import './Sample.scss';
export default class Sample{
	constructor({
		model
	}){
		const disposes = [];
		this._disposes = disposes;
		this.dispose = this.dispose.bind(this);
		this._element = E.div('sample');
		const labelElement = E.div('label');
		labelElement.textContent = model.text;
		this._element.appendChild(labelElement);
		switch(model.sampleType){
			case SampleType.HalfCycle:
				this._element.classList.add('half-cycle');	
				break;
			case SampleType.FullCycle:
				this._element.classList.add('full-cycle');
				break;
		}
		this._element.addEventListener('click', model.clicked);
		this._buttonToggleMenu = _createImageHoverButton(i('ThreeDotsVertical'), i('ThreeDotsVerticalHover'),
			'toggle-menu-button', 
			model.toggleMenu, disposes, true);
		this._element.appendChild(this._buttonToggleMenu);
		this._menu = new SimpleMenu(
		{	
			className:'sample-menu',
			items:[
				{text:'Primary Current', callback:model.generatePrimaryCurrentGraph},
				{text:'Output Voltage', callback:model.generateOutputVoltageGraph},
				{text:'First Stage Voltage', callback:model.generateFirstStageVoltageGraph}
			]
		});
		document.documentElement.appendChild(this._menu.element);
		this._menuPopup = new Popup({
			element:this._menu.element,
			model,
			propertyNameVisible:'showMenu',
			callbackShowing:()=>{
				const rect = getAbsoluteRectangle(this._element);
				console.log(rect);
				this._menu.element.style.top = String(rect.t - this._menu.element.offsetHeight)+'px';
				this._menu.element.style.left = String(rect.l+rect.w- this._menu.element.offsetWidth)+'px';
				
			}
		});
	}
	get element(){
		return this._element;
	}
	dispose(){
		this._disposes.forEach(d=>d());
		this.myBindings?.dispose();
	}
}