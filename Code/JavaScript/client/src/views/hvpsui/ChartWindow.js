import PropertyBindingFactory from '../../mvvm/PropertyBindingFactory';
import E from '../../ui_core/E';
import isNullOrUndefined from '../../core/isNullOrUndefined';
import GenericWindow from '../../window/GenericWindow';
import './ChartWindow.scss';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
export default class ChartWindow{
	constructor({
		model,
		parentElement
	}){
		this._model = model;
		console.log(this._model);
		this.dispose = this.dispose.bind(this);
		this._generateGraph = this._generateGraph.bind(this);
		this._genericWindow = new GenericWindow({ 
			//iconPath,
			//minWidth, maxWidth, minHeight, maxHeight,
			name:model.title,
			defaultWidth:300,
			defaultHeight:300,
			minimized:false, 
			maximized:false, 
			minimizable:false, 
			maximizable:false, 
			closeable:true, 
			minimizeOnClose:false, 
			resizable:false, 
			dragable:true,  
			//type, 
			parentElement, 
			//element, 
			//toggleMaximizeOnDoubleClick:false,
			//noPosition,
			//removeElementHandledExternally, 
			//closeIcon:'',
			//startPosition,
			//getBoundsRectangle, 
			//autoHeight, 
			//noInnerPosition
		});
		this._element = this._genericWindow.getElement();
		this._element.classList.add('chart-window');
		this._innerElement = this._genericWindow.getInnerElement();
		this._canvas = document.createElement('canvas');
		this._innerElement.appendChild(this._canvas);
		this._generateGraph();
	}
	_generateGraph(){
		const data = this._model.data;
		console.log(data);
		const labels = data.map((_, i) => i);
		new Chart(this._canvas, {
			type: 'line',
			data: {
				labels,
				datasets:[{
					label: 'Primary Current (A)',
					data,
					borderColor: '#42f59c',
					backgroundColor: 'transparent',
					pointRadius: 0,
					borderWidth: 1.5
				}]
			},
			options: {
				animation: false,
				responsive: true,
				scales: {
					x: { display: false },
					y: { 
						ticks: { color: '#ccc' },
						grid: { color: '#333' }
					}
				},
				plugins: {
					legend: { labels: { color: '#ccc' } }
				}
			}
		});
		//const dataUrl = canvas.toDataURL('image/png');
		//console.log(dataUrl);
		//return dataUrl;
	}
	dispose(){
		this.myBindings?.dispose();
		this._genericWindow.dispose();
	}
}