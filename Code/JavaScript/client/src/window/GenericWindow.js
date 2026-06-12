import Windows from './Windows';
import HashSource from '../core/HashSource';
import Urls from '../urls/Urls';
import Drag from '../ui_core/Drag';
import Hover from '../ui_core/Hover';
import isDescendant from '../ui_core/isDescendant';
import HandledManager from '../core/HandledManager';
import markEventAsHandled from '../core/markEventAsHandled';
import Resizer from '../ui_core/Resizer';
import SelectHelper from '../ui_core/SelectHelper';
import verticallyCenter from '../ui_core/verticallyCenter';
import eventEnable from '../core/eventEnable';
import Timer from '../core/Timer';
import EventNames from './WindowEventNames';
import getAbsoluteRectangle from '../ui_core/getAbsoluteRectangle';
import _createImageHoverButton from '../ui_core/_createImageHoverButton';
import icon from '../ui_core/i';
import getSize from '../ui_core/getSize';
	
const defaults = {
	minWidth:100,
	minHeight:100,
	maxWidth:1000,
	maxHeight:1000,
	resizable:true,
	dragable:true,
	closeable:true,
	minimizable:true,
	maximizable:true,
	minimizeOnClose:false
	
};
var defaultsOptional={};
const GenericWindow= function(params){
	var self = this;
	eventEnable(this);
	this._hash = HashSource.next();
	for(var i in Object.keys(defaults))
	{
		if(params[i]===undefined)
			params[i]=defaults[i];
	}
	
	var previousSizes, maximizedSizes, cancelBringToFront;
	var buttonClose, buttonMinimize, buttonMaximize;
	var timerFlash, flashing = false, flashCount=0;
	var forwardness = null;
	var name = params.name;
	var tooltipMessage=params.tooltipMessage;
	let{ iconPath, minWidth, maxWidth, minHeight, maxHeight,
	defaultWidth, defaultHeight, minimized, maximized, 
	minimizable, maximizable, closeable, 
		minimizeOnClose, resizable, dragable, zIndexOffset, 
		type, parentElement, element, 
		toggleMaximizeOnDoubleClick, noPosition,
		removeElementHandledExternally, minimizeIcon,
		maximizeIcon, closeIcon,
		startPosition, getBoundsRectangle, autoHeight, noInnerPosition}= params;
	const disposes = [];
	const resizableOrIsNotMobile = true;
	if(!parentElement)
		parentElement = document.documentElement;
	
	if(!getBoundsRectangle)getBoundsRectangle = ()=>{
		return {x:0, y:0, width:parentElement.offsetWidth, height:parentElement.offsetHeight};
	};
	if(!element)
		element = document.createElement('div');
	element.classList.add('generic-window');
	
	const divInner = document.createElement('div');
	divInner.classList.add('inner');
	
	const tabElement = document.createElement('div');
	tabElement.classList.add('tab');
	
	const divMain = document.createElement('div');
	divMain.classList.add('main');
	
	var nameElement = document.createElement('div');
	nameElement.classList.add('name');
	if(name)
		nameElement.textContent = name;
	element.appendChild(divInner);
	divInner.appendChild(tabElement);
	tabElement.appendChild(nameElement);
	divInner.appendChild(divMain);
	parentElement.appendChild(element);
	
	this.dispose = close;
	this.getType= function(){
		return type;
	};
	Windows._instances.push(this);
	
	this.flash = flash;
	
	this.getHash=function(){
		return this._hash;
	};
	this.setName = function(name){
		nameElement =  name;
	};
	this.getForwardness = function(){
		return forwardness;
	};
	this.setTooltipMessage = function(value){
		tooltipMessage = value;
	};
	this.getIcon=function(){
		return iconPath;
	};
	this.getTooltip = function(){
		return tooltipMessage;
	};
	this._setZIndex=function(zIndex){
		element.style.zIndex=String(zIndex);
	};
	this.getState=function(){
		return {maximized:maximized, minimized:minimized};
	};
	this.getMaximized=function(){
		return maximized;
	};
	this._setFrontWindow= function(value){
		if(value)
			element.classList.add('front-window');
		else
			element.classList.remove('front-window');
	};
	this.maximize = maximize;
	this.unmaximize = unmaximize;
	this.minimize = minimize;
	this.toggleMinimize = toggleMinimize;
	this.unminimize=unminimize;
	this.close = close;
	this.focus = focus;
	this.bringToFront = bringToFront;
	this.toggleMaximize = toggleMaximize;
	this._setForwardnessFromZeroAtFront = function(value){
		if(value===forwardness)return;
		forwardness = value;
		dispatchForwardnessChanged();
	};
	this._screenResized=function(obj) {
		if (maximized&(resizableOrIsNotMobile))setWindowSizePositionMaximized();
	}
	
	this.getMinimizable=function(){
		return minimizable;
	};
	this.getElement = function(){
		return element;
	};
	this.getInnerElement = function(){
		return divInner;
	};
	this.getParentElement = function(){
		return parentElement;
	};
	this.getTabElement = function(){
		return tabElement;
	};
	this.getNameElement = function(){
		return nameElement;
	};
	this.fillLeftHalf = function(){
		_setMaximized(false);
		unminimize();
		//previousSizes = getSizes();
		if(resizableOrIsNotMobile){
			setWindowSizePosition({
				width:parentElement.clientWidth/2, 
				height:(parentElement.clientHeight),
				top:0,
				left:0
			});
		}
		bringToFront();
	};
	this.fillRightHalf = function(){
		_setMaximized(false);
		unminimize();
		//previousSizes = getSizes();
		if(resizableOrIsNotMobile){
			const halfWidth = parentElement.clientWidth/2;
			setWindowSizePosition({
				width:halfWidth, 
				height:(parentElement.clientHeight),
				top:0,
				left:halfWidth
			});
		}
		bringToFront();
	};
	divMain.addEventListener('mousedown',clickedOnMe);
	this.getMainElement = function(){
		return divMain;
	};
	this.getPosition = function(){
		return [element.offsetLeft, element.offsetTop];
	};
	this.getVisibleRectangle=function(){
		return getAbsoluteRectangle(divInner);
	};
	this.getVisibleSize=function(){
		return getSize(divInner);
	};
	parentElement.classList.add('web-windows');
	SelectHelper.makeUnselectable(element);
	
	document.body.appendChild(element);
	element.addEventListener("mousedown", clickedOnMe);
	if(maximizable&&(toggleMaximizeOnDoubleClick===undefined||toggleMaximizeOnDoubleClick))
		tabElement.addEventListener('dblclick', toggleMaximize);
	initializePadding();
	if (resizable)
	{
		self._resizer = new Resizer({element, minWidth, minHeight, maxWidth, maxHeight,
			getBoundsRectangle, callbackResized:resized, callbackInstantaneous:null, 
			callbackStarted:resizerStarted, callbackFinished:resizerFinished});
	}
	if (dragable)
	{
		self._drag = new Drag({element, handleElement:tabElement, getBoundsRectangle, 
		callbackDragged:dragged, callbackStarted:dragStarted});
	}
		const fillerElement = document.createElement('div');
		fillerElement.classList.add('filler');
		tabElement.appendChild(fillerElement);
		if (minimizable)
		{
			const minimizeIconType = typeof(minimizeIcon);
			
			const iconButonMinimize = _createImageHoverButton(icon('Minimize'), icon('MinimizeHover'), 
				'button-minimize', (e)=>{
					if(!HandledManager.handled(e)){
						minimize(e);
					}
				}, disposes, markMouseDownTouchStartEventAsHandled);
			tabElement.appendChild(iconButonMinimize);
		}
		if (maximizable)
		{
			const iconButonMaximize = _createImageHoverButton(icon('Maximize'), icon('MaximizeHover'), 
				'button-maximize', (e)=>{
					if(!HandledManager.handled(e)){
						toggleMaximize(e);
					}
				}, disposes, markMouseDownTouchStartEventAsHandled);
			tabElement.appendChild(iconButonMaximize);
		}
	if (closeable||minimizeOnClose)
	{
		
		const iconButonClose = _createImageHoverButton(icon('Close'), icon('CloseHover'), 
				'button-close', (e)=>{
					if(!HandledManager.handled(e)){
						if (minimizeOnClose)
							minimize();
						else
							close();
					}
				}, disposes, markMouseDownTouchStartEventAsHandled);
		tabElement.appendChild(iconButonClose);
	}
	if(noPosition!==true){
		if (!startPosition)
		{
			startPosition = Windows.getStartPosition(this);
		}
		let x = startPosition[0], y=startPosition[1];
		const boundsRectangle = getBoundsRectangle();
		const boundsRectangleRight = boundsRectangle.x+boundsRectangle.w;
		const boundsRectangleBottom = boundsRectangle.y+boundsRectangle.h;
		if(x<boundsRectangle.x)
			x=boundsRectangle.x;
		else if(x+defaultWidth>boundsRectangleRight)
				x = boundsRectangleRight- defaultWidth;
		if(y<boundsRectangle.y)
			y=boundsRectangle.y;
		else if(y+defaultHeight>boundsRectangleBottom)
				y = boundsRectangleRight- defaultWidth;
		if(y<boundsRectangle.y)
			y = boundsRectangle.y;
		element.style.left = String(x) + 'px';
		element.style.top = String(y) + 'px';
		element.style.width = String(defaultWidth) + 'px';
		element.style.height = String(defaultHeight) + 'px';
	}
	element.appendChild(divInner);
	
	this.setWindowSizePosition = setWindowSizePositionConsideringResizers;
	if(!minimized)_unminimize();
	else _setMinimized(true)
	if(maximized)
		maximize();
	else
		_setMaximized(false);
		
	Windows._dispatchWindowCreatedEvent(self);
	if (bringToFront != false)self.bringToFront();
	function markMouseDownTouchStartEventAsHandled(){
		markEventAsHandled('mousedown');
		markEventAsHandled('touchstart');
	}
	function show()
	{
		element.classList.add('visible');
	}
	function hide()
	{
		element.classList.remove('visible');
	}
	function flash(){
		var flashing = false;
		flashCount=0;
		if(!timerFlash)
			timerFlash = new Timer({
				callback:()=> {
				if (flashing) {
					divInner.classList.remove('flashing');
					if(flashCount>=6)
						timerFlash.stop();
					flashing = false;
				} else {
					divInner.classList.add('flashing');
					flashing = true;
				}
				flashCount++;
		}, delay:50, nTicks:-1});
		else{
			timerFlash.reset();
			flashCount=0;
		}
	}
	function setWindowSizePositionMaximized(){
		setWindowSizePosition({
			width:parentElement.clientWidth, 
			height:parentElement.clientHeight,
			top:0,
			left:0
		});
	}
	function setWindowSizePositionConsideringResizers({width, height, top, left}){
		setWindowSizePosition({
			width:width, 
			height:height,
			top:top-Resizer.WIDTH,
			left:left-Resizer.WIDTH
		});
	}
	function clickedOnMe(e){
		if (!e) e = window.event;
		_clickedOnMe();
	}
	function _clickedOnMe(){
		if(!cancelBringToFront)
			bringToFront();
		cancelBringToFront = false;
		dispatchFocussedEvent();
	}
	function initializePadding(){ 
		var paddingString = '0px';
		element.style.padding = paddingString;
		if(!noPosition)
		divInner.style.position = autoHeight?'relative':'absolute';
		if(!noInnerPosition){
			divInner.style.left = paddingString;
			divInner.style.top = paddingString;
			divInner.style.right = paddingString;
			divInner.style.bottom = paddingString;
		}
	}
	function close()
	{
		const index = Windows._instances.indexOf(self);
		if(index>=0)
			Windows._instances.splice(index, 1);
		if((!removeElementHandledExternally)&&isDescendant(element.parentNode, element))
			element.parentNode.removeChild(element);
		disposes.forEach(d=>d());
		dispatchClosedEvent();
		Windows._dispatchWindowDestroyedEvent(self);
	}
	function resized(){
		if(maximized){
			if(!maximizedSizes.equals(getSizes())){
				_setMaximized(false);
			}
		}
		dispatchResizedEvent();
	}
	function minimize() {
		_setMaximized(false);
		if(minimized) return;
		hide();
		Windows.sendToBack(self);
		_setMinimized(true);
		dispatchMinimizedEvent();
	}
	function unminimize(){
		if(!minimized)
			return;
		_unminimize();
		bringToFront();
	}
	function _unminimize(){
		show();
		_setMinimized(false);
		dispatchUnminimizedEvent();
	}
	function toggleMinimize(){
		
		if(minimized) unminimize();
		else minimize();
	}
	function maximize()
	{
		if(maximized)return;
		unminimize();
		previousSizes = getSizes();
		if(resizableOrIsNotMobile)
			setWindowSizePositionMaximized();
		maximizedSizes = getSizes();
		_setMaximized(true);
		dispatchMaximizedEvent();
		bringToFront();
	}
	function unmaximize(mouseDragPosition)
	{
		if(!maximized)return;
		if (previousSizes)
		{
			if (!mouseDragPosition)
				setWindowSizePosition({
					width:previousSizes.width,
					height:previousSizes.height,
					top:previousSizes.top,
					left:previousSizes.left
				});
			else {
				var b = mouseDragPosition.left / parentElement.clientWidth;
				var leftOffset = (b * previousSizes.width);
				var l = mouseDragPosition.left - leftOffset;
				setWindowSizePosition({
					width:previousSizes.width, 
					height:previousSizes.height,
				left:l
				});
			}
		}
		_setMaximized(false);
		self._drag?.updateBounds();
		dispatchUnmaximizedEvent();
	}
	function _setMaximized(value){
		maximized = value;
		if(value){
			element.classList.add('maximized');
			element.classList.remove('not-maximized');
		}
		else {
			element.classList.remove('maximized');
			element.classList.add('not-maximized');
		}
	}
	function _setMinimized(value){
		minimized = value;
		if(value){
			element.classList.add('minimized');
			element.classList.remove('not-minimized');
		}
		else {
			element.classList.remove('minimized');
			element.classList.add('not-minimized');
		}
	}
	function toggleMaximize()
	{
		if (!maximized)
		{
			maximize();
		}
		else
		{
			unmaximize();
		}
	}
	function bringToFront()
	{
		const instances = Windows._instances;
		const index = instances.indexOf(self);
		if(index<0)return;
		const instance = instances.splice(index, 1)[0];
		instances.push(instance);
		Windows._updateZIndices();
	};
	function focus(){
		bringToFront();
		dispatchFocussedEvent();
	}
	function dragged(){
		dispatchMovedEvent();
		dispatchDraggedEvent();
	}
	function dragStarted(e){
		_clickedOnMe();
		if(maximized)
			unmaximize({left: e.screenX});
		dispatchDragStarted();
	}
	function getSizes()
	{
		return new (function(){
				var self = this;
				this.width=element.offsetWidth; 
				this.height= element.offsetHeight; 
				this.top= element.offsetTop;
				this.left= element.offsetLeft;
				this.equals=function(s){
					return self.width==s.width&&self.height==s.height&&self.top==s.top&&self.left==s.left;
				};
		})();
	}

	function setWindowSizePosition(params)
	{
		if(params.height)
			element.style.height = String(params.height) + 'px';
		if(params.width)
			element.style.width = String(params.width) + 'px';
		if(noPosition!==true){
			if (params.top!==undefined)
				element.style.top = String(params.top) + 'px';
			if (params.left!==undefined)
				element.style.left = String(params.left) + 'px';
		}
	}
	function resizerStarted(){
		_setMaximized(false);
		dispatchResizerStartedEvent();
	}
	function resizerFinished(){
		dispatchResizerFinishedEvent();
	}
	function dispatchResizedEvent(){
		self.dispatchEvent({type:EventNames.RESIZED});
	}
	function dispatchResizerStartedEvent(){
		self.dispatchEvent({type:EventNames.RESIZE_STARTED});
	}
	function dispatchResizerFinishedEvent(){
		self.dispatchEvent({type:EventNames.RESIZE_FINISHED});
	}
	function dispatchMaximizedEvent(){
		self.dispatchEvent({type:EventNames.MAXIMIZED});
	}
	function dispatchMinimizedEvent(){
		self.dispatchEvent({type:EventNames.MINIMIZED});
	}
	function dispatchUnminimizedEvent(){
		self.dispatchEvent({type:EventNames.UNMINIMIZED});
	}
	function dispatchUnmaximizedEvent(){
		self.dispatchEvent({type:EventNames.UNMAXIMIZED});
	}
	function dispatchDragStarted(){
		self.dispatchEvent({type:EventNames.DRAG_STARTED});
	}
	function dispatchMovedEvent(){
		self.dispatchEvent({type:EventNames.MOVED});
	}
	function dispatchClosedEvent(){
		self.dispatchEvent({type:EventNames.CLOSED});
	}
	function dispatchFocussedEvent(){
		self.dispatchEvent({type:EventNames.FOCUSSED, window:self});
	}
	function dispatchDraggedEvent(){
		self.dispatchEvent({type:EventNames.DRAGGED});
	}
	function dispatchZIndexChangedEvent(){
		self.dispatchEvent({type:EventNames.Z_INDEX_CHANGED});
	}
	function dispatchForwardnessChanged(){
		self.dispatchEvent({type:EventNames.FORWARDNESS_CHANGED, forwardness});
	}
};
GenericWindow.EventNames = EventNames;
export default GenericWindow;