namespace HVPSConfigurationGenerator
{
    public struct HVPSConfigurationForMicrocontroller
    {
        public float FirstStageVoltageFromRaw { get; }
        public float OutputVoltageFromRaw { get; }
        public float MaxOutputVoltageVolts { get; }
        public float DefaultOutputVoltageVolts { get; }
        public float MinOutputVoltageVolts { get; }
        public float VPsOverVadcRatio { get; }
        public float PrimaryCurrentFromRaw { get; }
        public float MaxTemperatureMosfetDegreesC { get; }
        public uint VillardCapacitorsBleedTimeConstantSeconds { get; }
        public uint PingTimeoutMilliseconds { get; }
        public uint SendPingIntervalMilliseconds { get; }
        public UInt32 IdleColour { get; }
        public UInt32 IdleFlashDelayMs { get; }
        public UInt32 LiveColour { get; }
        public UInt32 LiveFlashDelayMs { get; }
        public UInt32 RunningSystemChecksColour { get; }
        public UInt32 RunningSystemChecksFlashDelayMs { get; }
        public UInt32 ShuttingDownColour { get; }
        public UInt32 ShuttingDownFlashDelayMs { get; }
        public UInt32 ShutDownColour { get; }
        public UInt32 ShutDownFlashDelayMs { get; }
        public UInt32 ErrorColour { get; }
        public UInt32 ErrorFlashDelayMs { get; }
        public UInt32 UnknownColour { get; }
        public UInt32 UnknownFlashDelayMs { get; }

        public HVPSConfigurationForMicrocontroller(
            float firstStageVoltageFromRaw,
            float outputVoltageFromRaw,
            float maxOutputVoltageVolts,
            float defaultOutputVoltageVolts,
            float minOutputVoltageVolts,
            float vPsOverVadcRatio,
            float primaryCurrentFromRaw,
            float maxTemperatureMosfetDegreesC,
            uint villardCapacitorsBleedTimeConstantSeconds,
            uint pingTimeoutMilliseconds,
            uint sendPingIntervalMilliseconds,
            UInt32 idleColour,
            UInt32 idleFlashDelayMs,
            UInt32 liveColour,
            UInt32 liveFlashDelayMs,
            UInt32 runningSystemChecksColour,
            UInt32 runningSystemChecksFlashDelayMs,
            UInt32 shuttingDownColour,
            UInt32 shuttingDownFlashDelayMs,
            UInt32 shutDownColour,
            UInt32 shutDownFlashDelayMs,
            UInt32 errorColour,
            UInt32 errorFlashDelayMs,
            UInt32 unknownColour,
            UInt32 unknownFlashDelayMs)
        {
            FirstStageVoltageFromRaw = firstStageVoltageFromRaw;
            OutputVoltageFromRaw = outputVoltageFromRaw;
            MaxOutputVoltageVolts = maxOutputVoltageVolts;
            DefaultOutputVoltageVolts = defaultOutputVoltageVolts;
            MinOutputVoltageVolts = minOutputVoltageVolts;
            VPsOverVadcRatio = vPsOverVadcRatio;
            PrimaryCurrentFromRaw = primaryCurrentFromRaw;
            MaxTemperatureMosfetDegreesC = maxTemperatureMosfetDegreesC;
            VillardCapacitorsBleedTimeConstantSeconds = villardCapacitorsBleedTimeConstantSeconds;
            PingTimeoutMilliseconds = pingTimeoutMilliseconds;
            SendPingIntervalMilliseconds = sendPingIntervalMilliseconds;
            IdleColour = idleColour;
            IdleFlashDelayMs = idleFlashDelayMs;
            LiveColour = liveColour;
            LiveFlashDelayMs = liveFlashDelayMs;
            RunningSystemChecksColour = runningSystemChecksColour;
            RunningSystemChecksFlashDelayMs = runningSystemChecksFlashDelayMs;
            ShuttingDownColour = shuttingDownColour;
            ShuttingDownFlashDelayMs = shuttingDownFlashDelayMs;
            ShutDownColour = shutDownColour;
            ShutDownFlashDelayMs = shutDownFlashDelayMs;
            ErrorColour = errorColour;
            ErrorFlashDelayMs = errorFlashDelayMs;
            UnknownColour = unknownColour;
            UnknownFlashDelayMs = unknownFlashDelayMs;
        }
    }
}