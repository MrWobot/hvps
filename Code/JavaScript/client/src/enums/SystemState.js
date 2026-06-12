import isNullOrUndefined from '../core/isNullOrUndefined';
const SystemState={
	Unknown:0,
	Idle:1,
	Live:2,
	RunningSystemChecks:3,
	ShuttingDown:4,
	ShutDown:5,
	Error:6,
	SamplingHalfCycle:7,
	SamplingFullCycle:8,
	CalculatingInductance:9
};
SystemState.getClassName = (value)=>{
	if(isNullOrUndefined(value)){
		return value;
	}
	switch(value){
		case SystemState.Unknown:
			return 'unknown';
		case SystemState.Idle:
			return 'idle';
		case SystemState.Live:
			return 'live';
		case SystemState.RunningSystemChecks:
			return 'running-system-checks';
		case SystemState.ShuttingDown:
			return 'shutting-down';
		case SystemState.ShutDown:
			return 'shut-down';
		case SystemState.Error:
			return 'error';
		case SystemState.SamplingHalfCycle:
			return 'sampling-half-cycle';
		case SystemState.SamplingFullCycle:
			return 'sampling-full-cycle';
		case SystemState.CalculatingInductance:
			return 'calculating-inductance';
		default:
			throw new Error(`Not implemented for value ${value}`);
	}
};
SystemState.getDescription = (value)=>{
	if(isNullOrUndefined(value)){
		return value;
	}
	switch(value){
		case SystemState.Unknown:
			return "Unknown";
		case SystemState.Idle:
			return 'Idle';
		case SystemState.Live:
			return 'Live';
		case SystemState.RunningSystemChecks:
			return 'Running System Checks';
		case SystemState.ShuttingDown:
			return 'Shutting Down';
		case SystemState.ShutDown:
			return 'Shut Down';
		case SystemState.Error:
			return 'Error';
		case SystemState.SamplingHalfCycle:
			return 'Sampling Half Cycle';
		case SystemState.SamplingFullCycle:
			return 'Sampling Full Cycle';
		case SystemState.CalculatingInductance:
			return 'Calculating Inductance';
		default:
			throw new Error(`Not implemented for value ${value}`);
	}
};
export default SystemState;