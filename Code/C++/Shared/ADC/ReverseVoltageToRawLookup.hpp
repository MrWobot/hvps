#ifndef ReverseVoltageToRawLookup_HPP
#define ReverseVoltageToRawLookup_HPP

#include <cmath>
#include <cstdint>
#include "esp_adc_cal.h"
#include "ReverseVoltageToRawLookup_Entry.hpp"

class ReverseVoltageToRawLookup {
private:
    static const char* TAG;
	ReverseVoltageToRawLookup_Entry* _entries;
	size_t nIntervals;

public:
	ReverseVoltageToRawLookup(uint16_t intervalMillivolts, esp_adc_cal_characteristics_t* adc_chars);
	~ReverseVoltageToRawLookup();

	uint16_t lookupMillivolts(uint16_t voltageMillivolts);
	uint16_t lookupVolts(float volts);

private:
	uint16_t findRawForVoltage(uint16_t targetVoltageMillivolts, esp_adc_cal_characteristics_t* adc_chars);
};
#endif
