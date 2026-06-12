import eventEnable from '../core/eventEnable';
import styleFromObject from '../ui_core/styleFromObject';
import WhenFinishedModifying from '../core/WhenFinishedModifying';
import EventNames from './WindowEventNames';
import './Windows.css';
var Windows = new (function () {
    const self = this;
	const NEW_WINDOW_POSITION_OFFSET=20;
    this._instances = [];
	var zIndexOffset=100;
    this.currentBounds = {minYPx: 0, maxYPx: 1200, minXPerc: 0, maxXPerc: 100};
	eventEnable(this);
    this.getActive = function ()
    {
		return self._instances.length<1?null:self._instances[self._instances.length-1];
    };
    this.getStartPosition = function (window)
    {
		let mostActiveWindowNotThisWindow = null;
		const parentElement = window.getParentElement();
		for(var i = self._instances.length - 1; i>=0; i--){
			mostActiveWindowNotThisWindow = self._instances[i];
			if(parentElement!==undefined&&parentElement!==null){
				if(mostActiveWindowNotThisWindow.getParentElement()!==parentElement)
					continue;
			}
			if(mostActiveWindowNotThisWindow!==window)break;
		}
		if(!mostActiveWindowNotThisWindow)return [0,0];
		const otherWindowPosition = mostActiveWindowNotThisWindow.getPosition();
		return [otherWindowPosition[0]+NEW_WINDOW_POSITION_OFFSET, otherWindowPosition[1]+NEW_WINDOW_POSITION_OFFSET];
	};
    window.addEventListener("resize", function () {
        for (var i = 0; i < self._instances.length; i++)
        {
            self._instances[i]._screenResized();
        }
    }, false);
	
    this.divDragHeightTaskBarPx = document.documentElement.clientHeight / 12;
	this._whenFinishedModifyingUpdateZIndices = new WhenFinishedModifying({delay:0, callback:updateZIndices});
	this._updateZIndices = function (){
		this._whenFinishedModifyingUpdateZIndices.trigger();
	};
	function updateZIndices(){
		if(self._currentFrontInstance){
			self._currentFrontInstance._setFrontWindow(false);
			self._currentFrontInstance = null;
		}
		var zIndex = zIndexOffset;
		console.log( self._instances.length);
		var forwardness = self._instances.length-1;
		for (var i = 0; i < self._instances.length; i++)
		{
			const instance = self._instances[i];
			instance._setZIndex(zIndex++);
			instance._setForwardnessFromZeroAtFront(forwardness--);
		}
		if(self._instances.length>0){
			self._currentFrontInstance = self._instances[self._instances.length-1];
			self._currentFrontInstance._setFrontWindow(true);
		}
	}
    function isWindow(obj)
    {
		for(var i=0; i<self._instances.length; i++){
			var instance = self._instances[i];
			if(instance==obj)
				return true;
		}
		return false;
    }
	this.sendToBack = function(window){
		const instances = Windows._instances;
		instances.splice(0, 0, instances.splice(instances.indexOf(window), 1)[0]);
		Windows._updateZIndices();
	};
	this._dispatchWindowCreatedEvent = function(window){
		self.dispatchEvent({type:EventNames.WINDOW_CREATED, window});
	}
	this._dispatchWindowDestroyedEvent = function(window){
		self.dispatchEvent({type:EventNames.WINDOW_DESTROYED, window});
	}
    function focusFrontWindow(){
        self._instances[self._instances.length-1].focus();
    }
})();
window.Windows = Windows;
export default Windows;
