import PropertyBindingFactory from '../../mvvm/PropertyBindingFactory';
import exposeBinding  from '../../mvvm/exposeBinding';
import exposeMethod  from '../../mvvm/exposeMethod';
import eventEnable  from '../../core/eventEnable';
import isNullOrUndefined from '../../core/isNullOrUndefined';
import HVPSConfiguration from '../../generated/HVPSConfiguration';
import OpenImageMessage from '../../generated/messages/OpenImageMessage';
import ChartViewModel from './ChartViewModel';
export default class SampleViewModel{
	constructor({text, sampleType, bytes, showChart}){
		console.log(this);
		this._text = text;
		this._showChart = showChart;
		this._sampleType = sampleType;
		this._showMenu = false;
		this.clicked = this.clicked.bind(this);
		this.generatePrimaryCurrentGraph = this.generatePrimaryCurrentGraph.bind(this);
		this.generateOutputVoltageGraph = this.generateOutputVoltageGraph.bind(this);
		this.generateFirstStageVoltageGraph = this.generateFirstStageVoltageGraph.bind(this);
		this.toggleMenu = this.toggleMenu.bind(this);
		this._primaryCurrents =[];
		this._outputVoltages =[];
		this._firstStageVoltages =[];
		var i = 0;
		while(i<bytes.length){
			const primaryCurrentRaw = bytes[i++];
			const outputVoltageRaw = bytes[i++];
			const firstStageVoltageRaw = bytes[i++];
			this._primaryCurrents.push(primaryCurrentRaw * HVPSConfiguration.primaryCurrentFromRaw);
			this._outputVoltages.push(outputVoltageRaw * HVPSConfiguration.outputVoltageFromRaw);
			this._firstStageVoltages.push(firstStageVoltageRaw * HVPSConfiguration.firstStageVoltageThresholdVolts);
		}
		exposeBinding(this, 'showMenu', ()=>this.showMenu, (value)=>this.showMenu = value);
	}
	get text(){
		return this._text;
	}
	get sampleType(){
		return this._sampleType;
	}
	get showMenu(){
		return this._showMenu;
	}
	set showMenu(value){
		if(this._showMenu===value)return;
		this._showMenu = value;
		this.bindingsHandler.changed('showMenu', value);
	}
	toggleMenu(){
		this.showMenu = !this.showMenu;
	}
	clicked(){
		this.showMenu = true;
	}
	generatePrimaryCurrentGraph(){
		this._showChart(new ChartViewModel({title:'Primary Current', data: this._primaryCurrents}));
	}
	generateOutputVoltageGraph(){
		this._showChart(new ChartViewModel({title:'Output Voltage', data: this._outputVoltages}));
	}
	generateFirstStageVoltageGraph(){
		this._showChart(new ChartViewModel({title:'First Stage Voltage', data: this._firstStageVoltages}));
	}
}