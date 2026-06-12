#pragma once
#include "SystemChecksResult.hpp"
#include <functional>
#include <string> 
#include "Generated/HVPS_FPGAInterface.hpp"
#include "Generated/Enums/FPGACommand.hpp"
#include "Generated/Enums/FPGAState.hpp"
class SystemChecks{
	private:
		static inline constexpr int DEFAULT_WAIT_FOR_STATE_TIMEOUT_MS = 10000;
	public:
		static std::shared_ptr<SystemChecksResult> run(HVPS_FPGAInterface& fpgaInterface);
		static bool run(HVPS_FPGAInterface& fpgaInterface, std::string& errorMessage);
	private:
		static void setCommand(HVPS_FPGAInterface& fpgaInterface, FPGACommand command);
		static bool waitForState(HVPS_FPGAInterface& fpgaInterface, FPGAState state, uint64_t timeoutMs  = DEFAULT_WAIT_FOR_STATE_TIMEOUT_MS);
		static bool readNextBytes(HVPS_FPGAInterface& fpgaInterface, std::string& errorMessage);
	/*
		*/
};