import PropertyBindingFactory from '../../mvvm/PropertyBindingFactory';
import exposeBinding  from '../../mvvm/exposeBinding';
import exposeMethod  from '../../mvvm/exposeMethod';
import eventEnable  from '../../core/eventEnable';
import isNullOrUndefined from '../../core/isNullOrUndefined';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
export default class ChartViewModel{
	constructor({title, data}){
		console.log(this);
		this._title = title;
		this._data = data;
	}
	get title(){
		return this._title;
	}
	get data(){
		return this._data;
	}
}