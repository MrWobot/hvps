import PropertyBindingFactory from '../../mvvm/PropertyBindingFactory';
import exposeBinding  from '../../mvvm/exposeBinding';
import exposeMethod  from '../../mvvm/exposeMethod';
import eventEnable  from '../../core/eventEnable';
import isNullOrUndefined from '../../core/isNullOrUndefined';
import HVPSUIAPI  from '../../api/HVPSUIAPI';
import DateTimeHelper from '../../core/DateTimeHelper';
import SampleViewModel from './SampleViewModel';
const REGEXP_VALIDATE_NUMBER = /^[0-9]+$/;
export default class DebuggingMenuViewModel{
	constructor({showChart}){
		eventEnable(this);
		const disposes = [];
		this._disposes = disposes;
		this._showChart = showChart;
		this.sampleHalfCycle = this.sampleHalfCycle.bind(this);
		this.sampleFullCycle = this.sampleFullCycle.bind(this);
		this.runNCycles = this.runNCycles.bind(this);
		this.calculateInductance = this.calculateInductance.bind(this);
		this._setCustomStrValid = this._setCustomStrValid.bind(this);
		this._handleSampleDataMessage = this._handleSampleDataMessage.bind(this);
		this._show = false;
		this._samples = [];
		this._customStr = '';
		this._customStrValid = true;
		exposeBinding(this, 'show', ()=>this._show);
		exposeBinding(this, 'samples', ()=>this._samples);
		exposeBinding(this, 'customStr', ()=>this._customStr, (value)=>this._customStr = value);
		exposeBinding(this, 'customStrValid', ()=>this._customStrValid);
		disposes.push(HVPSUIAPI.addEventListener('sampleDataMessage', this._handleSampleDataMessage));
	}
	get show(){
		return this._show;
	}
	set show(value){
		if(this._show === value)return;
		this._show = value;
		this.bindingsHandler.changed('show', this._show);
	}
	get customStr(){
		return this._customStr;
	}
	set customStr(value){
		if(value===this._customStr)
			return;
		this._customStr = value;
		this.bindingsHandler.changed('customStr', value);
	}
	get customStrValid(){
		return this._customStrValid;
	}
	_setCustomStrValid(value){
		if(value===this._customStrValid){
			return;
		}
		this._customStrValid = value;
		this.bindingsHandler.changed('customStrValid', value);
	}
	sampleHalfCycle(){
		HVPSUIAPI.sampleHalfCycle();
	}
	sampleFullCycle(){
		HVPSUIAPI.sampleFullCycle();
	}
	runNCycles(){
		if(!REGEXP_VALIDATE_NUMBER.test(this.customStr)){
			this._setCustomStrValid(false);
			return;
		}
		const nCycles = parseInt(this.customStr);
		this._setCustomStrValid(true);
		HVPSUIAPI.runNCycles({nCycles});
	}
	calculateInductance(){
		HVPSUIAPI.calculateInductance();
	}
	_handleSampleDataMessage({sampleDataMessage}){
		const text = DateTimeHelper.getPrependAndTime(new Date().getTime());
		const {sampleType, bytes} = sampleDataMessage;
		const sampleViewModel = new SampleViewModel({text, sampleType, bytes, showChart:this._showChart});
		this._samples.unshift(sampleViewModel);
		this.bindingsHandler.changed('samples', this._samples);
	}
}