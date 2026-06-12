import i from '../../ui_core/i';
import PropertyBindingFactory from '../../mvvm/PropertyBindingFactory';
import OrderedItems from '../../tippler_ui/OrderedItems';
import E from '../../ui_core/E';
import _createImageHoverButton from '../../ui_core/_createImageHoverButton';
import _createImageHoverTextButton from '../../ui_core/_createImageHoverTextButton';
import _createTextButton from '../../ui_core/_createTextButton';
import isMobile from '../../core/isMobile';
import isNullOrUndefined from '../../core/isNullOrUndefined';
import Sample from './Sample';
import Blocker from '../../tippler_ui/Blocker';
import './DebuggingMenu.scss';
export default class DebuggingMenu{
	constructor({model, parentModel}){
		const disposes=[];
		this._disposes = disposes;
		this.dispose = this.dispose.bind(this);
		this._showChanged = this._showChanged.bind(this);
		this._element = E.div('debugging-menu');
		const controlButtonsElement = E.div('control-buttons');
		[
			_createTextButton({className:'sample-half-cycle-button', callback:model.sampleHalfCycle, disposes, 
				useMouseDown:true, text:'Sample Qrt Cycle'}),
			_createTextButton({className:'sample-full-cycle-button', callback:model.sampleFullCycle, disposes,
				useMouseDown:true, text:'Sample Fl Cycle'}),
			_createTextButton({className:'calculate-inductance-button', callback:model.calculateInductance, disposes,
				useMouseDown:true, text:'Calculate Inductance'})
		].forEach(b=>controlButtonsElement.appendChild(b));
		this._element.appendChild(controlButtonsElement);
		this._samplesElement = E.div('samples');
		this._element.appendChild(this._samplesElement);
		const samplesTitleElement = E.div('title');
		samplesTitleElement.textContent = 'Captured Samples:';
		this._sampleEntriesElement = E.div('entries');
		this._samplesElement.appendChild(samplesTitleElement);
		this._samplesElement.appendChild(this._sampleEntriesElement);
		PropertyBindingFactory.standard(this, model, 'show', this._showChanged);
		this._samplesOrderedItems = new OrderedItems({
			element:this._sampleEntriesElement,
			model, 
			propertyNameItems:'samples',
			createView:(m)=>new Sample({model:m}),
		});
		this._disconnectedBlocker = new Blocker({
			model:parentModel, 
			propertyNameBlocking:'bluetoothDisconnected'
		});
		this._element.appendChild(this._disconnectedBlocker.element);
	}
	get element(){
		return this._element;
	}
	dispose(){
		this._disposes.forEach(d=>d());
	}
	_showChanged(value){
		if(value){
			this._element.classList.add('visible');
			return;
		}
		this._element.classList.remove('visible');
	}
}