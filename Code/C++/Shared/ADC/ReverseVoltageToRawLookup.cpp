#include "ReverseVoltageToRawLookup.hpp"
#include "../../../Shared/Logging/Log.hpp"

const char* ReverseVoltageToRawLookup::TAG = "ReverseVoltageToRawLookup";
/*We are creating a lookup to interpret a voltage to a raw value.
Voltages in between the steps can be used via a linear interpolation.
*/
ReverseVoltageToRawLookup::ReverseVoltageToRawLookup(
	uint16_t intervalMillivolts, esp_adc_cal_characteristics_t* adc_chars) {

	nIntervals = static_cast<size_t>(ceilf(3300.0f / static_cast<float>(intervalMillivolts))) + 1;
	_entries = new ReverseVoltageToRawLookup_Entry[nIntervals];

	for (size_t i = 0; i < nIntervals; ++i) {
		uint16_t voltage = static_cast<uint16_t>(static_cast<int>(i) * intervalMillivolts);
		uint16_t raw = findRawForVoltage(voltage, adc_chars);
		if(raw>4095U){
			LOG_INFO("Out of range raw was returned with value %u", raw);
			abort();
		}
		_entries[i] = ReverseVoltageToRawLookup_Entry(voltage, raw);
	}
}

ReverseVoltageToRawLookup::~ReverseVoltageToRawLookup() {
	delete[] _entries;
}

uint16_t ReverseVoltageToRawLookup::lookupMillivolts(uint16_t voltageMillivolts) {
	// Binary search over precomputed _entries
	uint16_t testVoltage = _entries[0].voltage;
	if(testVoltage >=voltageMillivolts){
		return _entries[0].raw;
	}
	size_t highIndex = nIntervals - 1;
	testVoltage = _entries[highIndex].voltage;
	if(testVoltage <=voltageMillivolts){
		return _entries[highIndex].raw;
	}
	size_t lowIndex = 0;
	while (true) {
		size_t midIndex = (lowIndex + highIndex) / 2;
		if(midIndex==lowIndex||midIndex==highIndex){
			float denominator = static_cast<float>(_entries[highIndex].voltage - _entries[lowIndex].voltage);
			if (denominator <= 0) {
				return _entries[lowIndex].raw;
			}
			
			float fraction = static_cast<float>(voltageMillivolts - _entries[lowIndex].voltage) / denominator;
			uint16_t interpolated = static_cast<uint16_t>(
				static_cast<float>(_entries[highIndex].raw - _entries[lowIndex].raw) * fraction
				+ static_cast<float>(_entries[lowIndex].raw)
			);
			return interpolated;
		}
		testVoltage = _entries[midIndex].voltage;
		if(testVoltage>voltageMillivolts){
			highIndex = midIndex;
			continue;
		}
		if(testVoltage < voltageMillivolts){
			lowIndex = midIndex;
			continue;
		}
		return _entries[midIndex].raw;
	}
}

uint16_t ReverseVoltageToRawLookup::lookupVolts(float volts) {
	uint16_t millivolts = static_cast<uint16_t>(volts * 1000.0f);
	return lookupMillivolts(millivolts);
}
uint16_t ReverseVoltageToRawLookup::findRawForVoltage(
	uint16_t targetVoltageMillivolts,
	esp_adc_cal_characteristics_t* adc_chars) {

	uint16_t low = 0;
	uint16_t high = 4095;
	uint16_t voltage;
	uint16_t lowestVoltageCanReturn =  static_cast<uint16_t>(esp_adc_cal_raw_to_voltage(low, adc_chars));
	if(targetVoltageMillivolts<=lowestVoltageCanReturn)
		return low;
	uint16_t highestVoltageCanReturn =  static_cast<uint16_t>(esp_adc_cal_raw_to_voltage(high, adc_chars));
	if(targetVoltageMillivolts>=highestVoltageCanReturn)
		return high;
	while (true) {
		uint16_t mid = static_cast<uint16_t>((low + high) / 2);
		if(mid==low||high==mid){
			return low;
		}
		voltage =  static_cast<uint16_t>(esp_adc_cal_raw_to_voltage(mid, adc_chars));

		if (voltage < targetVoltageMillivolts) {
			low = mid;
			continue;
		} 
		if(voltage > targetVoltageMillivolts){
			high = mid;
			continue;
		}
		return mid;
	}
}

