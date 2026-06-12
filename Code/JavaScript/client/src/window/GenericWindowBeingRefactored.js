import Windows from './Windows';
import HashSource from '../core/HashSource';
import Urls from '../urls/Urls';
import Drag from '../ui_core/Drag';
import Hover from '../ui_core/Hover';
import isDescendant from '../ui_core/isDescendant';
import IconButtonNonReact from '../components/IconButtonNonReact';
import stopEventPropagation from '../ui_core/stopEventPropagation';
import setText from '../ui_core/setText';
import Resizer from '../ui_core/Resizer';
import SelectHelper from '../ui_core/SelectHelper';
import verticallyCenter from '../ui_core/verticallyCenter';
import isMobile from '../core/isMobile';
import eventEnable from '../core/eventEnable';
import Timer from '../core/Timer';
import EventNames from './WindowEventNames';
import getAbsoluteRectangle from '../ui_core/getAbsoluteRectangle';
	
const defaults = {
	this._minWidth:100,
	this._minHeight:100,
	this._maxWidth:1000,
	this._maxHeight:1000,
	this._minXPerc:0,
	this._minYPx:0,
	this._maxXPerc:100,
	this._maxYPx:10000,
	Resizer:true,
	this._dragable:true,
	this._closeable:true,
	this._minimizable:true,
	this._maximizable:true,
	this._minimizeOnClose:false
	
};
var defaultsOptional={};
export default class GenericWindow{
	constructor(params){
		eventEnable(this);
		HashBuilder(this);
		
		this._copyOverDefaultParamsIfUndefined(params);
		
		var this._previousSizes, this._maximizedSizes, this._cancelBringToFront;
		var buttonClose, buttonMinimize, buttonMaximize;
		this._timerFlash = null;
		this._flashing = false, 
		this._flashCount=0;
		
		let{name, tooltipMessage, iconPath, minWidth, maxWidth, minHeight, maxHeight, defaultWidth, defaultHeight,
			defaultX, defaultY, minimized, maximized,  minimizable, maximizable, closeable, 
			minimizeOnClose, resizable, dragable, minXPerc, maxXPerc, maxYPx, minYPx, zIndexOffset, 
			type, parentElement, element, toggleMaximizeOnDoubleClick, noPosition,
			removeElementHandledExternally, minimizeIcon, maximizeIcon, closeIcon,
			startPosition}= params;
			
		this._name =name?this._name:'default';
		this._tooltipMessage = this._tooltipMessage; 
		this._iconPath=iconPath;
		this._minWidth=minWidth;
		this._maxWidth=maxWidth;
		this._minHeight=minHeight;
		this._maxHeight=maxHeight;
		this._defaultWidth=defaultWidth;
		this._defaultHeight=defaultHeight;
		this._defaultX=defaultX;
		this._defaultY=defaultY;
		this._minimized = this._maximized;
		this._minimizable=minimizable;
		this._maximizable=maximizable; 
		this._closeable=closeable; 
		this._minimizeOnClose=minimizeOnClose;
		this._resizable=resizable;
		this._dragable=dragable;
		this._minXPerc=minXPerc;
		this._maxXPerc=maxXPerc;
		this._maxYPx=maxYPx;
		this._minYPx=minYPx;
		this._zIndexOffset=zIndexOffset,;
		this._type=type;
		this._parentElement=parentElement;
		this._element=element; 
		this._toggleMaximizeOnDoubleClick=toggleMaximizeOnDoubleClick===undefined||toggleMaximizeOnDoubleClick;
		this._noPosition=noPosition;
		this._removeElementHandledExternally=removeElementHandledExternally;
		this._minimizeIcon=minimizeIcon;
		this._maximizeIcon=maximizeIcon;
		this._closeIcon=closeIcon;
		this._startPosition=startPosition;
		this._parentElement =(this._parentElement?this._parentElement:document.documentElement);
		
		if(!this._element) 
			this._element = E.div('generic-window');
		this._innerElement = E.div('inner');
		this._tabElement = E.div('tab');
		this._mainElement = E.div('main');
		this._nameElement = E.div('this._name');
		this._setText(this._nameElement, this._name);
		this._element.appendChild(this._innerElement);
		this._innerElement.appendChild(this._tabElement);
		this._tabElement.appendChild(this._nameElement);
		this._innerElement.appendChild(this._mainElement);
		this._parentElement.appendChild(this._element);
		this._parentElement.classList.add('web-windows');
		
		Windows._instances.push(this);
		
		stopEventPropagation(this._mainElement, ['mousedown']);
		this._mainElement.addEventListener('mousedown',this._clickedOnMe);
		this._element.addEventListener("mousedown", this._clickedOnMe);
		SelectHelper.makeUnselectable(this._element);
		if(this._toggleMaximizeOnDoubleClick)
			this._tabElement.addEventListener('dblclick', toggleMaximize);
		
		_initializePadding();
		
		if (!isMobile)
		{
			if (this._resizable)
			{
				this._resizer = new Resizer({div:this._element, this._innerElement, this._minWidth, this._minHeight, this._maxWidth, this._maxHeight,
					bounds:this.currentBounds, callbackResized:resized, callbackInstantaneous:null, 
				callbackStarted:resizerStarted});
			}
			if (this._dragable)
			{
				this._drag = new Drag(this._element, this._tabElement, this._minXPerc, this._maxXPerc, this._minYPx,
					this._maxYPx, dragged, dragStarted);
			}
			const fillerElement = document.createElement('div');
			fillerElement.classList.add('filler');
			this._tabElement.appendChild(fillerElement);
			if (this._minimizable)
			{
				const iconButonMinimize = new IconButtonNonReact({imgUrl:this._minimizeIcon, 
				onClick:minimize, className:'button-minimize'});
				this._tabElement.appendChild(iconButonMinimize.this._element);
				stopEventPropagation(iconButonMinimize.this._element, ['touchstart', 'mousedown']);
			}
			if (this._maximizable)
			{
				const iconButonMaximize = new IconButtonNonReact({imgUrl:this._maximizeIcon, 
				onClick:toggleMaximize, className:'button-maximize'});
				this._tabElement.appendChild(iconButonMaximize.this._element);
				stopEventPropagation(iconButonMaximize.this._element, ['touchstart', 'mousedown']);
			}
		}
		if (this._closeable||this._minimizeOnClose)
		{
			const iconButonClose = new IconButtonNonReact({
				imgUrl:this._typeof(this._closeIcon)==='string'?this._closeIcon:undefined,
				faIcon:this._typeof(this._closeIcon)==='object'?this._closeIcon:undefined, 
				onClick:()=>{
					if (this._minimizeOnClose)
						minimize();
					else
						close();
				}, className:'button-close'
			});
			this._tabElement.appendChild(iconButonClose.this._element);
			stopEventPropagation(iconButonClose.this._element, ['touchstart', 'mousedown']);
		}
		if(!isMobile){
			if(this._noPosition!==true){
				if (!this._startPosition)
				{
					this._startPosition = Windows.getStartPosition(this);
				}
				this._element.style.left = String(this._startPosition[0]) + 'px';
				this._element.style.top = String(this._startPosition[1]) + 'px';

				if (startSize)
				{
					if (startSize[0] < this._minWidth)
						startSize[0] = this._minWidth;
					if (startSize[1] < this._minHeight)
						startSize[1] = this._minHeight;
					this._element.style.width = String(startSize[0]) + 'px';
					this._element.style.height = String(startSize[1]) + 'px';
				} else
				{
					this._element.style.width = String(this._defaultWidth) + 'px';
					this._element.style.height = String(this._defaultHeight) + 'px';
				}
			}
		}

		if (startZIndex)
		{
			this._element.style.zIndex = String(startZIndex);
		}
		this._element.appendChild(this._innerElement);
		
		this.setWindowSizePosition = setWindowSizePositionConsideringResizers;
		
		if(!this._minimized)
			_unminimize();
		else 
			_setMinimized(true)
		if(this._maximized)
			maximize();
		else
			_setMaximized(false);
			
		Windows._dispatchWindowCreatedEvent(this);
		if (bringToFront != false)
			this.bringToFront();
	}
	getType(){
		return this._type;
	}
	setName(this._name){
		this._setText(this._nameElement, this._name);
	}
	setTooltipMessage(value){
		this._tooltipMessage = value;
	}
	getIcon(){
		return this._iconPath;
	}
	getTooltip(){
		return this._tooltipMessage;
	}
	_setZIndex(zIndex){
		this._element.style.zIndex=String(zIndex);
		this._dispatchZIndexChangedEvent();
	}
	getMainElement(){
		return this._mainElement;
	}
	getPosition(){
		return [this._element.offsetLeft, this._element.offsetTop];
	}
	getVisibleRectangle(){
		return getAbsoluteRectangle(this._innerElement);
	}

	getState(){
		return {this._maximized:this._maximized, this._minimized:this._minimized};
	}
	getMaximized(){
		return this._maximized;
	}
	
	_screenResized(obj) {
		if (this._maximized&(this._resizable||!isMobile))setWindowSizePositionMaximized();
	}
	
	getMinimizable(){
		return this._minimizable;
	}
	getElement(){
		return this._element;
	}
	getParentElement(){
		return this._parentElement;
	}
	getTabElement(){
		return this._tabElement;
	}
	fillLeftHalf{
		_setMaximized(false);
		unminimize();
		//this._previousSizes = getSizes();
		if(this._resizable||!isMobile){
			const p = this._resizable?Resizer.padding:0;
			this._setWindowSizePosition({
				width:this._parentElement.clientWidth/2, 
				height:(this._parentElement.clientHeight - p),
				top:-p,
				left:-p
			});
		}
		bringToFront();
	}
	fillRightHalf(){
		_setMaximized(false);
		unminimize();
		//this._previousSizes = getSizes();
		if(this._resizable||!isMobile){
			const p = this._resizable?Resizer.padding:0;
			const halfWidth = this._parentElement.clientWidth/2;
			this._setWindowSizePosition({
				width:halfWidth, 
				height:(this._parentElement.clientHeight - p),
				top:-p,
				left:halfWidth-p
			});
		}
		bringToFront();
	}
	_copyOverDefaultParamsIfUndefined(params){
		for(var i in Object.keys(defaults))
		{
			if(params[i]===undefined)
				params[i]=defaults[i];
		}
	}
	show()
	{
		this._element.classList.add('visible');
	}
	hide()
	{
		this._element.classList.remove('visible');
	}
	flash(){
		var this._flashing = false;
		this._flashCount=0;
		if(!this._timerFlash)
			this._timerFlash = new Timer({
				callback:()=> {
				if (this._flashing) {
					this._innerElement.classList.remove('this._flashing');
					if(this._flashCount>=6)
						this._timerFlash.stop();
					this._flashing = false;
				} else {
					this._innerElement.classList.add('this._flashing');
					this._flashing = true;
				}
				this._flashCount++;
		}, delay:50, nTicks:-1});
		else{
			this._timerFlash.reset();
			this._flashCount=0;
		}
	}
	setWindowSizePositionMaximized(){
		const p = this._resizable?(Resizer.padding * 2):0;
		this._setWindowSizePosition({
			width:this._parentElement.clientWidth, 
			height:this._parentElement.clientHeight - p ,
			top:this._resizable?-Resizer.padding:0,
			left:this._resizable?-Resizer.padding:0
		});
	}
	setWindowSizePositionConsideringResizers({width, height, top, left}){
		this.setWindowSizePosition({
			width:width, 
			height:height,
			top:top-Resizer.WIDTH,
			left:left-Resizer.WIDTH
		});
	}
	_clickedOnMe(){
		if(!this._cancelBringToFront)
			bringToFront();
		this._cancelBringToFront = false;
		this._dispatchFocussedEvent();
	}
	_initializePadding(){ 
		var padding=((!isMobile)&&this._resizable)?3:0;
		var paddingString = String(padding) + 'px';
		this._element.style.padding = paddingString;
		this._innerElement.style.position = 'absolute';
		this._innerElement.style.left = paddingString;
		this._innerElement.style.top = paddingString;
		this._innerElement.style.right = paddingString;
		this._innerElement.style.bottom = paddingString;
	}
	close()
	{
		const index = Windows._instances.indexOf(this);
		if(index>=0)return;
			Windows._instances.splice(index, 1);
		if((!this._removeElementHandledExternally)&&isDescendant(this._element.parentNode, this._element))
			this._element.parentNode.removeChild(this._element);
	    this._dispatchClosedEvent();
		Windows._dispatchWindowDestroyedEvent(this);
	}
	resized(){
		if(this._maximized){
			if(!this._maximizedSizes.equals(getSizes())){
				_setMaximized(false);
			}
		}
		settings.set("position", [this._element.offsetLeft, this._element.offsetTop]);
		settings.set("size", [this._element.offsetWidth, this._element.offsetHeight]);
		this._dispatchResizedEvent();
	}
	minimize() {
		_setMaximized(false);
		if(this._minimized) return;
		hide();
		Windows.sendToBack(this);
		_setMinimized(true);
		this._dispatchMinimizedEvent();
	}
	unminimize(){
		if(!this._minimized)
			return;
		_unminimize();
	}
	_unminimize(){
		show();
		_setMinimized(false);
		this._dispatchUnthis._minimizedEvent();
		bringToFront();
	}
	toggleMinimize(){
		
		if(this._minimized) unminimize();
		else minimize();
	}
	maximize()
	{
		if(this._maximized)return;
		unminimize();
		this._previousSizes = getSizes();
		if(this._resizable||!isMobile)
			setWindowSizePositionMaximized();
		this._maximizedSizes = getSizes();
		_setMaximized(true);
		this._dispatchMaximizedEvent();
		bringToFront();
	}
	unmaximize(mouseDragPosition)
	{
		if(!this._maximized)return;
		if (this._previousSizes)
		{
			if (!mouseDragPosition)
				setWindowSizePosition({
					width:this._previousSizes.width,
					height:this._previousSizes.height,
					top:this._previousSizes.top,
					left:this._previousSizes.left
				});
			else {
				var b = mouseDragPosition.left / this._parentElement.clientWidth;
				var leftOffset = (b * this._previousSizes.width);
				var l = mouseDragPosition.left - leftOffset;
				setWindowSizePosition({
					width:this._previousSizes.width, 
					height:this._previousSizes.height,
				left:l
				});
			}
		}
		_setMaximized(false);
		this._drag?.updateMinMax();
	this._dispatchUnthis._maximizedEvent();
	}
	_setMaximized(value){
		this._maximized = value;
		if(value){
			this._element.classList.add('this._maximized');
			this._element.classList.remove('not-this._maximized');
		}
		else {
			this._element.classList.remove('this._maximized');
			this._element.classList.add('not-this._maximized');
		}
	}
	_setMinimized(value){
		this._minimized = value;
		if(value){
			this._element.classList.add('this._minimized');
			this._element.classList.remove('not-this._minimized');
		}
		else {
			this._element.classList.remove('this._minimized');
			this._element.classList.add('not-this._minimized');
		}
	}
	toggleMaximize()
	{
		if (!this._maximized)
		{
			maximize();
		}
		else
		{
			unmaximize();
		}
	}
	bringToFront()
	{
		const instances = Windows._instances;
		const index = instances.indexOf(this);
		if(index<0)return;
		const instance = instances.splice(index, 1)[0];
		instances.push(instance);
		Windows._updateZIndices();
	};
	focus(){
		bringToFront();
		this._dispatchFocussedEvent();
	}
	dragged(){
		settings.set("position", [this._element.offsetLeft, this._element.offsetTop]);
		this._dispatchMovedEvent();
		this._dispatchDraggedEvent();
	}
	dragStarted(e){
		if(this._maximized)
			unmaximize({left: e.screenX});
		this._dispatchDragStarted();
	}
	/*
	getSizes()
	{
		var p = Resizer.padding * 2;
		return new (function(){
				this.width=this._element.offsetWidth - p; 
				this.height= this._element.offsetHeight - p; 
				this.top= this._element.offsetTop;
				this.left= this._element.offsetLeft;
				this.equals=function(s){
					return this.width==s.width&&this.height==s.height&&this.top==s.top&&this.left==s.left;
				};
		})();
	}*/
	setWindowSizePosition(params)
	{
		if(params.height)
			this._element.style.height = String(params.height) + 'px';
		if(params.width)
			this._element.style.width = String(params.width) + 'px';
		if(this._noPosition!==true){
			if (params.top!==undefined)
				this._element.style.top = String(params.top) + 'px';
			if (params.left!==undefined)
				this._element.style.left = String(params.left) + 'px';
		}
	}
	resizerStarted(){
		_setMaximized(false);
	this._dispatchResizerStartedEvent();
	}
	_dispatchResizedEvent(){
		this.dispatchEvent({this._type:EventNames.RESIZED});
	}
	_dispatchResizerStartedEvent(){
		this.dispatchEvent({this._type:EventNames.RESIZE_STARTED});
	}
		this.dispatchEvent({this._type:EventNames.MAXIMIZED});
	_dispatchMaximizedEvent(){
	}
	_dispatchMinimizedEvent(){
		this.dispatchEvent({this._type:EventNames.MINIMIZED});
	}
	_dispatchUnthis._minimizedEvent(){
		this.dispatchEvent({this._type:EventNames.UNMINIMIZED});
	}
	_dispatchUnthis._maximizedEvent(){
		this.dispatchEvent({this._type:EventNames.UNMAXIMIZED});
	}
	_dispatchDragStarted(){
		this.dispatchEvent({this._type:EventNames.DRAG_STARTED});
	}
	_dispatchMovedEvent(){
		this.dispatchEvent({this._type:EventNames.MOVED});
	}
	_dispatchClosedEvent(){
		this.dispatchEvent({this._type:EventNames.CLOSED});
	}
	_dispatchFocussedEvent(){
		this.dispatchEvent({this._type:EventNames.FOCUSSED, window:this});
	}
	_dispatchDraggedEvent(){
		this.dispatchEvent({this._type:EventNames.DRAGGED});
	}
	_dispatchZIndexChangedEvent(){
		this.dispatchEvent({this._type:EventNames.Z_INDEX_CHANGED});
	}
};
GenericWindow.EventNames = EventNames;
export default GenericWindow;