using System.Runtime.InteropServices;
using Core.Graphics;

namespace HVPSConstants
{
    public class Constants
    {
        [ExcelSpreadsheetVariable]
        public float FirstStageVoltageFromRaw { get; }
        [ExcelSpreadsheetVariable]
        public float OutputVoltageFromRaw { get; }
        [ExcelSpreadsheetVariable]
        public float MaxOutputVoltageVolts { get; }
        [ExcelSpreadsheetVariable]
        public float MinOutputVoltageVolts { get; }
        [ExcelSpreadsheetVariable]
        public float PowerSupplyVoltageFeedbackPotentialDividerRatio { get; }
        [ExcelSpreadsheetVariable]
        public float PrimaryCurrentFromRaw { get; }
        [ExcelSpreadsheetVariable]
        public float MaxMosfetTemperatureDegreesC { get; }
        [ExcelSpreadsheetVariable]
        public uint VillardCapacitorsBleedTimeConstantSeconds { get; }
        [ExcelSpreadsheetVariable]
        public float MaxFirstStageVoltage { get; }
        [ExcelSpreadsheetVariable]
        public float MaxADCConversionTime { get; }
        [ExcelSpreadsheetVariable]
        public float MaxSupplyVoltage { get; }
        [ExcelSpreadsheetVariable]
        public float MaxPrimaryCurrent { get; }
        [ExcelSpreadsheetVariable]
        public float TransformerLeakageInductance { get; }
        public static uint PingTimeoutMilliseconds => 10000;
        public static UInt32 SendPingIntervalMilliseconds => 2000;
        public int FpgaInterfaceBufferedDataLength { get; }
        public int FpgaCaptureBuffersLengthBytes { get; }
        public RGB IdleColour { get; }
        public RGB LiveColour { get; }
        public RGB RunningSystemChecksColour { get; }
        public RGB ShuttingDownColour { get; }
        public RGB ShutDownColour { get; }
        public RGB ErrorColour { get; }
        public RGB UnknownColour { get; }
        public RGB RunningNCyclesColour { get; }
        public double IdleFlashHz { get; }
        public double LiveFlashHz { get; }
        public double RunningSystemChecksFlashHz { get; }
        public double ShuttingDownFlashHz { get; }
        public double ShutDownFlashHz { get; }
        public double ErrorFlashHz { get; }
        public double UnknownFlashHz { get; }
        public double RunningNCyclesFlashHz { get; }
        protected Constants(
            float firstStageVoltageFromRaw,
            float outputVoltageFromRaw,
            float maxOutputVoltageVolts,
            float minOutputVoltageVolts,
            float powerSupplyVoltageFeedbackPotentialDividerRatio,
            float primaryCurrentFromRaw,
            float maxMosfetTemperatureDegreesC,
            UInt32 villardCapacitorsBleedTimeConstantSeconds,
            float maxFirstStageVoltage,
            float maxSupplyVoltage,
            float maxPrimaryCurrent,
            float transformerLeakageInductance,
            float maxADCConversionTime,
            int fpgaInterfaceBufferedDataLength = 128,
            int fpgaCaptureBuffersLengthBytes = 768,
            RGB? idleColour = null,
            RGB? liveColour = null,
            RGB? runningSystemChecksColour = null,
            RGB? shuttingDownColour = null,
            RGB? shutDownColour = null,
            RGB? errorColour = null,
            RGB? unknownColour = null,
            RGB? runningNCyclesColour = null,
            float idleFlashHz = 2,
            float liveFlashHz = 2,
            float runningSystemChecksFlashHz = 1,
            float shuttingDownFlashHz = 1,
            float shutDownFlashHz = 0,
            float errorFlashHz = 1,
            float unknownFlashHz = 1,
            float runningNCyclesFlashHz = 1)
        {
            // Raw and voltage conversions
            FirstStageVoltageFromRaw = firstStageVoltageFromRaw;
            OutputVoltageFromRaw = outputVoltageFromRaw;
            MaxOutputVoltageVolts = maxOutputVoltageVolts;
            MinOutputVoltageVolts = minOutputVoltageVolts;
            PowerSupplyVoltageFeedbackPotentialDividerRatio = powerSupplyVoltageFeedbackPotentialDividerRatio;
            PrimaryCurrentFromRaw = primaryCurrentFromRaw;
            MaxMosfetTemperatureDegreesC = maxMosfetTemperatureDegreesC;
            VillardCapacitorsBleedTimeConstantSeconds = villardCapacitorsBleedTimeConstantSeconds;
            MaxFirstStageVoltage = maxFirstStageVoltage;
            MaxADCConversionTime = maxADCConversionTime;
            MaxSupplyVoltage = maxSupplyVoltage;
            MaxPrimaryCurrent = maxPrimaryCurrent;
            TransformerLeakageInductance = transformerLeakageInductance;

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
            RunningNCyclesColour = runningNCyclesColour ?? new RGB("#f55442");

            // LED Flash Rates
            IdleFlashHz = idleFlashHz;
            LiveFlashHz = liveFlashHz;
            RunningSystemChecksFlashHz = runningSystemChecksFlashHz;
            ShuttingDownFlashHz = shuttingDownFlashHz;
            ShutDownFlashHz = shutDownFlashHz;
            ErrorFlashHz = errorFlashHz;
            UnknownFlashHz = unknownFlashHz;
            RunningNCyclesFlashHz = runningNCyclesFlashHz;
        }
    }
}
