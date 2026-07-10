#include "ThresholdController.hpp"
#include "Macros/GetFileName.hpp"
#include "Logging/Log.hpp"
#include "Storage/Flash.hpp"
const char* FLASH_NAMESPACE = "ThresholdController";
const char* DESIRED_OUTPUT_VOLTAGE = "DOVoltage";
const char* ThresholdController::getTag() {return GET_FILE_NAME;}
ThresholdController::ThresholdController(
	const HVPSConfiguration& hvpsConfiguration1,
	const HVPSConfiguration& hvpsConfiguration2,
	HVPS_FPGAInterface& fpgaInterface) noexcept:
	_hvpsConfiguration1(hvpsConfiguration1),
	_hvpsConfiguration2(hvpsConfiguration2),
	_fpgaInterface(fpgaInterface),
	_desiredOutputVoltage(0){
	/*_eventConnectionFPGAOutputsUpdated = _fpgaInterface.outputsUpdated.addHandler([&](){
		handleOutputsUpdated();
	});*/
	float currentValue;
	if(!Flash::getFloat(FLASH_NAMESPACE, DESIRED_OUTPUT_VOLTAGE, currentValue)){
		currentValue = _hvpsConfiguration1.defaultOutputVoltageVolts;
	}
	_desiredOutputVoltage = currentValue;
	LOG_INFO("Set threshold voltage as %d ", currentValue);
	_fpgaInterface.setDesiredOutputVoltage(clampAndConvertToRaw(currentValue));
}
void ThresholdController::setDesiredOutputVoltage(float value){
	_fpgaInterface.setDesiredOutputVoltage(clampAndConvertToRaw(value));
	LOG_INFO("Set threshold voltage as %d ", value);
	Flash::setFloat(FLASH_NAMESPACE, DESIRED_OUTPUT_VOLTAGE, value);
	_desiredOutputVoltage = value;
}
uint8_t ThresholdController::clampAndConvertToRaw(float value){
	clampDesiredOutputVoltage(value);
	float rawDesiredOutputVoltage = value/_hvpsConfiguration1.outputVoltageFromRaw;
	if(rawDesiredOutputVoltage>255.0f){
		rawDesiredOutputVoltage = 255.0f;
	}
	else if(rawDesiredOutputVoltage<0.0f){
		rawDesiredOutputVoltage = 0.0f;
	}
	return static_cast<uint8_t>(rawDesiredOutputVoltage);
}
void ThresholdController::clampDesiredOutputVoltage(float& value){
	if((value>_hvpsConfiguration1.maxOutputVoltageVolts)||(value>_hvpsConfiguration2.maxOutputVoltageVolts)){
		value = _hvpsConfiguration1.maxOutputVoltageVolts;
	}
	else if((value>_hvpsConfiguration1.minOutputVoltageVolts)||(value>_hvpsConfiguration2.minOutputVoltageVolts))
	{
		value = _hvpsConfiguration1.minOutputVoltageVolts;
	}
}
/*
void ThresholdController::handleOutputsUpdated(){
	
}*/
