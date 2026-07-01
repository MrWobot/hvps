using System.Runtime.InteropServices;
using Core.Graphics;

namespace HVPSConstants
{
    public class Constants
    {
        public float FirstStageVoltageFromRaw { get; }
        public float OutputVoltageFromRaw { get; }
        public float MaxOutputVoltageVolts { get; }
        public float MinOutputVoltageVolts { get; }
        public float PowerSupplyVoltageFeedbackPotentialDividerRatio { get; }
        public float PrimaryCurrentFromRaw { get; }
        public float MaxTemperatureMosfetDegreesC { get; }
        public uint VillardCapacitorsBleedTimeConstantSeconds { get; }
        public float MaxFirstStageVoltage { get; }
        public float MaxADCConversionTime { get; }
        public float MaxSupplyVoltage { get; }
        public float MaxPrimaryCurrent { get; }
        public float TransformerLeakageInductance { get; }
        public uint PingTimeoutMilliseconds { get; }
        public uint SendPingIntervalMilliseconds { get; }
        public int FpgaInterfaceBufferedDataLength { get; }
        public int FpgaCaptureBuffersLengthBytes { get; }
        public RGB IdleColour { get; }
        public RGB LiveColour { get; }
        public RGB RunningSystemChecksColour { get; }
        public RGB ShuttingDownColour { get; }
        public RGB ShutDownColour { get; }
        public RGB ErrorColour { get; }
        public RGB UnknownColour { get; }
        public double IdleFlashHz { get; }
        public double LiveFlashHz { get; }
        public double RunningSystemChecksFlashHz { get; }
        public double ShuttingDownFlashHz { get; }
        public double ShutDownFlashHz { get; }
        public double ErrorFlashHz { get; }
        public double UnknownFlashHz { get; }
        protected Constants(
            float firstStageVoltageFromRaw,
            float outputVoltageFromRaw,
            float maxOutputVoltageVolts,
            float minOutputVoltageVolts,
            float powerSupplyVoltageFeedbackPotentialDividerRatio,
            float primaryCurrentFromRaw,
            float maxTemperatureMosfetDegreesC,
            UInt32 villardCapacitorsBleedTimeConstantSeconds,
            float maxFirstStageVoltage,
            float maxSupplyVoltage,
            float maxPrimaryCurrent,
            float transformerLeakageInductance,
            UInt32 pingTimeoutMilliseconds = 10000,
            UInt32 sendPingIntervalMilliseconds = 2000,
            int fpgaInterfaceBufferedDataLength = 128,
            int fpgaCaptureBuffersLengthBytes = 768,
            float maxADCConversionTime = 33f / 50000000f,
            RGB? idleColour = null,
            RGB? liveColour = null,
            RGB? runningSystemChecksColour = null,
            RGB? shuttingDownColour = null,
            RGB? shutDownColour = null,
            RGB? errorColour = null,
            RGB? unknownColour = null,
            float idleFlashHz = 2,
            float liveFlashHz = 2,
            float runningSystemChecksFlashHz = 1,
            float shuttingDownFlashHz = 1,
            float shutDownFlashHz = 0,
            float errorFlashHz = 1,
            float unknownFlashHz = 1)
        {
            // Raw and voltage conversions
            FirstStageVoltageFromRaw = firstStageVoltageFromRaw;
            OutputVoltageFromRaw = outputVoltageFromRaw;
            MaxOutputVoltageVolts = maxOutputVoltageVolts;
            MinOutputVoltageVolts = minOutputVoltageVolts;
            PowerSupplyVoltageFeedbackPotentialDividerRatio = powerSupplyVoltageFeedbackPotentialDividerRatio;
            PrimaryCurrentFromRaw = primaryCurrentFromRaw;
            MaxTemperatureMosfetDegreesC = maxTemperatureMosfetDegreesC;
            VillardCapacitorsBleedTimeConstantSeconds = villardCapacitorsBleedTimeConstantSeconds;
            MaxFirstStageVoltage = maxFirstStageVoltage;
            MaxADCConversionTime = maxADCConversionTime;
            MaxSupplyVoltage = maxSupplyVoltage;
            MaxPrimaryCurrent = maxPrimaryCurrent;
            TransformerLeakageInductance = transformerLeakageInductance;

            // Network and FPGA sizing
            PingTimeoutMilliseconds = pingTimeoutMilliseconds;
            SendPingIntervalMilliseconds = sendPingIntervalMilliseconds;
            FpgaInterfaceBufferedDataLength = fpgaInterfaceBufferedDataLength;
            FpgaCaptureBuffersLengthBytes = fpgaCaptureBuffersLengthBytes;

            // LED Colours
            IdleColour = idleColour ?? new RGB("#24aee0");
            LiveColour = liveColour ?? new RGB("#ff0000");
            RunningSystemChecksColour = runningSystemChecksColour ?? new RGB("#FF1500");
            ShuttingDownColour = shuttingDownColour ?? new RGB("#8B4000");
            ShutDownColour = shutDownColour ?? new RGB("#00ff00");
            ErrorColour = errorColour ?? new RGB("#f7075f");
            UnknownColour = unknownColour ?? new RGB("#ffffff");

            // LED Flash Rates
            IdleFlashHz = idleFlashHz;
            LiveFlashHz = liveFlashHz;
            RunningSystemChecksFlashHz = runningSystemChecksFlashHz;
            ShuttingDownFlashHz = shuttingDownFlashHz;
            ShutDownFlashHz = shutDownFlashHz;
            ErrorFlashHz = errorFlashHz;
            UnknownFlashHz = unknownFlashHz;
        }
    }
}
