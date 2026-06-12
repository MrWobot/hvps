import PropertyBindingFactory from '../../mvvm/PropertyBindingFactory';
import exposeBinding  from '../../mvvm/exposeBinding';
import exposeMethod  from '../../mvvm/exposeMethod';
import eventEnable  from '../../core/eventEnable';
import isNullOrUndefined from '../../core/isNullOrUndefined';
import HVPSUIAPI  from '../../api/HVPSUIAPI';
import DateTimeHelper from '../../core/DateTimeHelper';
import SampleViewModel from './SampleViewModel';
import Blocker from '../../tippler_ui/Blocker';
export default class DebuggingMenuViewModel{
	constructor({showChart}){
		eventEnable(this);
		const disposes = [];
		this._disposes = disposes;
		this._showChart = showChart;
		this.sampleHalfCycle = this.sampleHalfCycle.bind(this);
		this.sampleFullCycle = this.sampleFullCycle.bind(this);
		this.calculateInductance = this.calculateInductance.bind(this);
		this._handleSampleDataMessage = this._handleSampleDataMessage.bind(this);
		this._show = false;
		this._samples = [];
		exposeBinding(this, 'show', ()=>this._show);
		exposeBinding(this, 'samples', ()=>this._samples);
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
	sampleHalfCycle(){
		HVPSUIAPI.sampleHalfCycle();
	}
	sampleFullCycle(){
		HVPSUIAPI.sampleFullCycle();
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