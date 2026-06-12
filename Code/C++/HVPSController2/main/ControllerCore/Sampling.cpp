#include "Sampling.hpp"
#include <memory>
#include "Logging/Log.hpp"
#include "../Ports/Port_ControllingMachine.hpp"
#include "Timing/Delay.hpp"
#include "Macros/IncludeLineOnEnd.hpp"
#include "../IO/Inputs.hpp"
#include "Timing/TimeHelper.hpp"
#include <cstring>
bool Sampling::sampleHalfCycle(HVPS_FPGAInterface& fpgaInterface, std::string& errorMessage, 
	std::unique_ptr<uint8_t[]>& sampleBytes, size_t& sampleBytesLength){
	setCommand(fpgaInterface, FPGACommand::SAMPLE_HALF_CYCLE);
	if(!waitForState(fpgaInterface, FPGAState::SAMPLED_HALF_CYCLE)){
		errorMessage = "Failed to receive SAMPLED_HALF_CYCLE";
		return false;
	}
	if(!readSampleBytes(fpgaInterface, errorMessage, sampleBytes, sampleBytesLength)){
		return false;
	}
	return true;
}
bool Sampling::sampleFullCycle(HVPS_FPGAInterface& fpgaInterface, std::string& errorMessage, 
	std::unique_ptr<uint8_t[]>& sampleBytes, size_t& sampleBytesLength){
	setCommand(fpgaInterface, FPGACommand::SAMPLE_FULL_CYCLE);
	if(!waitForState(fpgaInterface, FPGAState::SAMPLED_FULL_CYCLE)){
		errorMessage = "Failed to receive SAMPLED_FULL_CYCLE";
		return false;
	}
	if(!readSampleBytes(fpgaInterface, errorMessage, sampleBytes, sampleBytesLength)){
		return false;
	}
	return true;
}
bool Sampling::calculateInductance(HVPS_FPGAInterface& fpgaInterface, std::string& errorMessage,
	float& inductanceHenries){
	return false;
}
bool Sampling::readSampleBytes(HVPS_FPGAInterface& fpgaInterface, std::string& errorMessage, 
	std::unique_ptr<uint8_t[]>& sampleBytes, size_t& sampleBytesLength){
	uint8_t buffered_data[128];
	if(!readNextBytes(fpgaInterface, buffered_data, errorMessage)){
		return false;
	}
	size_t bufferLength = (size_t)buffered_data[1] << 8 | buffered_data[0];
	if(bufferLength < 2){
		errorMessage = "Invalid buffer length";
		return false;
	}
	sampleBytes = std::make_unique<uint8_t[]>(bufferLength);
	sampleBytesLength = (bufferLength-2)>126 ?126:bufferLength-2;
	memcpy(sampleBytes.get(), buffered_data+2, sampleBytesLength);
	size_t nBytesRead = 128;
	size_t nLeftToRead;
	while(true){
		nLeftToRead = bufferLength > nBytesRead ? bufferLength - nBytesRead : 0;
		if(nLeftToRead<128){
			break;
		}
		if(!readNextBytes(fpgaInterface, buffered_data, errorMessage)){
			return false;
		}
		memcpy(sampleBytes.get()+sampleBytesLength, buffered_data, 128);
		nBytesRead+=128;
		sampleBytesLength+=128;
	}
	if(nLeftToRead>0){
		if(!readNextBytes(fpgaInterface, buffered_data, errorMessage)){
			return false;
		}
		memcpy(sampleBytes.get()+sampleBytesLength, buffered_data, nLeftToRead);
		sampleBytesLength+=nLeftToRead;
	}
	return true;
}
bool Sampling::readNextBytes(HVPS_FPGAInterface& fpgaInterface, uint8_t (&buffered_data) [128], std::string& errorMessage){
	setCommand(fpgaInterface, FPGACommand::NONE);
	if(!waitForState(fpgaInterface, FPGAState::NONE)){
		errorMessage = "Failed to receive NONE";
		return false;
	}
	setCommand(fpgaInterface, FPGACommand::READ_NEXT_DATA_BYTES);
	if(!waitForState(fpgaInterface, FPGAState::NEXT_DATA_BYTES)){
		errorMessage = "Failed to receive NONE";
		return false;
	}
	fpgaInterface.getBufferedData(buffered_data);
	return true;
}
bool Sampling::waitForState(HVPS_FPGAInterface& fpgaInterface, FPGAState state, uint64_t timeoutMs /* = DEFAULT_WAIT_FOR_STATE_TIMEOUT_MS*/)
{
	uint8_t desiredState = static_cast<uint8_t>(state);
	uint64_t timeoutAtMs = TimeHelper::ms()+ timeoutMs;
	while(true){
		uint8_t actualState = fpgaInterface.getState();
		LOG_INFO("Actual state was: %" PRIu8, actualState);
		LOG_INFO("Desired state was: %" PRIu8, desiredState);
		if(actualState==desiredState){
			return true;
		}
		if(TimeHelper::ms()>=timeoutAtMs){
			return false;
		}
	}
}
void Sampling::setCommand(HVPS_FPGAInterface& fpgaInterface, FPGACommand command)
{
	fpgaInterface.setCommand(static_cast<uint8_t>(command));
}