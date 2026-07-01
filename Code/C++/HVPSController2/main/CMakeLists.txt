idf_component_register(
	SRCS 
		"HVPSController.cpp"
		"Guids/BluetoothUUIDHelper.cpp"
		"IO/ADCChannels.cpp"
		"IO/Inputs.cpp"
		"IO/Outputs.cpp"
		"Peripherals/Addresses.cpp"
		"Peripherals/LocalUI.cpp"
		"Ports/Port_ControllingMachine.cpp"
		"ControllerCore/HighSpeedCore.cpp"
		"ControllerCore/Sampling.cpp"
		"ControllerCore/ThresholdController.cpp"
		"ControllerCore/SystemChecks.cpp"
		"ControllerCore/SystemChecksResult.cpp"
		"Broadcasting/LiveDataBroadcaster.cpp"
		"IO/PowerConditioningMonitor.cpp"
		"Temperature/MOSFETTemperatureSensor.cpp"
		"Generated/HVPS_FPGAInterface.cpp"
		"Graphics/HVPSLEDDisplay.cpp"
		"Graphics/LEDStrip.cpp"
		"IO/HVPSFPGABus.cpp"
	PRIV_REQUIRES spi_flash driver bt nvs_flash esp_adc
	INCLUDE_DIRS "."
	REQUIRES
		Shared espcoredump
)
target_compile_options(${COMPONENT_LIB} PRIVATE 
    -Wconversion 
    -Wfloat-conversion 
    -Wsign-conversion
    -Wdouble-promotion
    -Wnarrowing
    -Werror=conversion
    -Werror=float-conversion
    -Werror=sign-conversion
    -Werror=double-promotion
    -Werror=narrowing
	-Wnull-dereference
	-Werror=null-dereference
)