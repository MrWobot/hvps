#pragma once
#include <functional>
#include <string> 
#include "Generated/HVPS_FPGAInterface.hpp"
#include "Generated/Enums/FPGACommand.hpp"
#include "Generated/Enums/FPGAState.hpp"
class Sampling{
	private:
		static inline constexpr int DEFAULT_WAIT_FOR_STATE_TIMEOUT_MS = 10000;
	public:
		static bool sampleHalfCycle(HVPS_FPGAInterface& fpgaInterface, std::string& errorMessage, 
			std::unique_ptr<uint8_t[]>& sampleBytes, size_t& sampleBytesLength);
		static bool sampleFullCycle(HVPS_FPGAInterface& fpgaInterface, std::string& errorMessage, 
			std::unique_ptr<uint8_t[]>& sampleBytes, size_t& sampleBytesLength);
		static bool calculateInductance(HVPS_FPGAInterface& fpgaInterface, std::string& errorMessage,
			float& inductanceHenries);
	private:
	
		static bool readSampleBytes(HVPS_FPGAInterface& fpgaInterface, std::string& errorMessage, 
			std::unique_ptr<uint8_t[]>& sampleBytes, size_t& sampleBytesLength);
		static bool readNextBytes(HVPS_FPGAInterface& fpgaInterface, uint8_t (&buffered_data)[128],  std::string& errorMessage);
		static bool waitForState(HVPS_FPGAInterface& fpgaInterface, FPGAState state, uint64_t timeoutMs  = DEFAULT_WAIT_FOR_STATE_TIMEOUT_MS);
		static void setCommand(HVPS_FPGAInterface& fpgaInterface, FPGACommand command);
	/*
		*/
};