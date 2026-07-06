using System;
using System.IO;
using System.Linq;
using System.Reflection;
using HVPSConstants;
using ConfigurationClassBuilder;
using FPGAConstantsGenerator;
using HVPSCore.Enums;
namespace HVPSConfigurationGenerator
{
    class Program
    {

        static void Main(string[] args)
        {
            string reposDirectory = Assembly.GetEntryAssembly()!.Location;
            while (Path.GetFileName(reposDirectory).ToLower() != "repos")
            {
                reposDirectory = Directory.GetParent(reposDirectory)!.FullName;
            }
            Constants4kV constants = new Constants4kV();
            GenerateJavaScriptConfigurations(reposDirectory, constants);
            GenerateCPlusPlusConfigurations(reposDirectory, constants);
            GenerateFPGAConstants(reposDirectory, constants);
        }
        private static void GenerateCPlusPlusConfigurations(string reposDirectory, 
            Constants constants) {

            HVPSConfigurationForMicrocontroller configurationStruct = new HVPSConfigurationForMicrocontroller
            (
                maxOutputVoltageVolts: constants.MaxOutputVoltageVolts,
                defaultOutputVoltageVolts: constants.MaxOutputVoltageVolts,
                minOutputVoltageVolts: constants.MinOutputVoltageVolts,
                pingTimeoutMilliseconds: Constants.PingTimeoutMilliseconds,
                sendPingIntervalMilliseconds: Constants.SendPingIntervalMilliseconds,
                vPsOverVadcRatio: constants.PowerSupplyVoltageFeedbackPotentialDividerRatio,
                villardCapacitorsBleedTimeConstantSeconds: constants.VillardCapacitorsBleedTimeConstantSeconds,
                /* (uint)Math.Ceiling(
                     (1d + (Constants.VillardCapacitorTolerancePercent / 100d))
                     * Constants.VillardCapacitorCapacitance
                     * (1d + (Constants.VillardCapacitorBleedResistorTolerancePercent / 100d))
                     * Constants.VillardCapacitorBleedResistance),*/
                primaryCurrentFromRaw: constants.PrimaryCurrentFromRaw,
                firstStageVoltageFromRaw: constants.FirstStageVoltageFromRaw,
                outputVoltageFromRaw: constants.OutputVoltageFromRaw,
                maxTemperatureMosfetDegreesC: constants.MaxMosfetTemperatureDegreesC,

                errorColour: constants.ErrorColour.ToUInt32(),
                liveColour: constants.LiveColour.ToUInt32(),
                idleColour: constants.IdleColour.ToUInt32(),
                runningSystemChecksColour: constants.RunningSystemChecksColour.ToUInt32(),
                shutDownColour: constants.ShutDownColour.ToUInt32(),
                shuttingDownColour: constants.ShuttingDownColour.ToUInt32(),
                unknownColour: constants.UnknownColour.ToUInt32(),

                idleFlashDelayMs: FlashHzToMilliseconds(
                    constants.IdleFlashHz),
                liveFlashDelayMs: FlashHzToMilliseconds(
                    constants.LiveFlashHz),
                runningSystemChecksFlashDelayMs: FlashHzToMilliseconds(
                    constants.RunningSystemChecksFlashHz),
                shuttingDownFlashDelayMs: FlashHzToMilliseconds(
                    constants.ShuttingDownFlashHz),
                shutDownFlashDelayMs: FlashHzToMilliseconds(
                    constants.ShutDownFlashHz),
                errorFlashDelayMs: FlashHzToMilliseconds(
                    constants.ErrorFlashHz),
                unknownFlashDelayMs: FlashHzToMilliseconds(
                    constants.UnknownFlashHz)
            );

            string dependenciesIncludePathPrefix = "";
            AlreadyWroteWatcher alreadyWroteWatcher = new AlreadyWroteWatcher();
            CPlusPlusConfigurationWriter.WriteConfigurationStructFile<HVPSConfigurationForMicrocontroller>(
                Path.Combine(
                    reposDirectory,
                    "hvps",
                    "Code",
                    "C++",
                    "HVPSController2",
                    "main",
                    "Generated",
                    "HVPSConfiguration.hpp"
                ),
                alreadyWroteWatcher,
                writtenStructName: "HVPSConfiguration");
            {
                CPlusPlusConfigurationWriter.WriteProjectSpecificConfiguration(
                    projectSpecificConfigurationFilePath: Path.Combine(
                        reposDirectory,
                        "hvps",
                        "Code",
                        "C++",
                        "HVPSController2",
                        "main",
                        "Generated",
                        "HVPSConfig.hpp"
                ),
                    configurationStruct,
                    structHppFileRelativePath: "HVPSConfiguration.hpp",
                    dependenciesIncludePathPrefix,
                    alreadyWroteWatcher,
                    writtenStructName:"HVPSConfiguration"
                );
            }
            CPlusPlusEnumWriter.Write<FPGACommand>(
                Path.Combine(
                        reposDirectory,
                        "hvps",
                        "Code",
                        "C++",
                        "HVPSController2",
                        "main",
                        "Generated",
                        "Enums"
                )
            );
            CPlusPlusEnumWriter.Write<FPGAState>(
                Path.Combine(
                        reposDirectory,
                        "hvps",
                        "Code",
                        "C++",
                        "HVPSController2",
                        "main",
                        "Generated",
                        "Enums"
                )
            );
            CPlusPlusEnumWriter.Write<FPGAError>(
                Path.Combine(
                        reposDirectory,
                        "hvps",
                        "Code",
                        "C++",
                        "HVPSController2",
                        "main",
                        "Generated",
                        "Enums"
                )
            );
        }
        private static void GenerateFPGAConstants(string reposDirectory, Constants4kV constants) {
            float maximumCurrentRampRate =
                (constants.MaxSupplyVoltage / constants.TransformerLeakageInductance);
            float maximumCurrentGainBetweenADCReading = maximumCurrentRampRate * constants.MaxADCConversionTime;
            int maxPrimaryCurrentRaw = 
                (int)Math.Floor((constants.MaxPrimaryCurrent - (maximumCurrentGainBetweenADCReading))
                / constants.PrimaryCurrentFromRaw);
            int maxFirstStageVoltageRaw = (int)Math.Floor(constants.MaxFirstStageVoltage / constants.FirstStageVoltageFromRaw);
            int maxOutputVoltageRaw = (int)Math.Floor(constants.MaxOutputVoltageVolts / constants.OutputVoltageFromRaw);
            FPGAConstantsGenerator.ConstantsGenerator.Generate(Path.Combine(
                        reposDirectory,
                        "hvps",
                        "Code",
                        "Verilog",
                        "HVPSController2",
                        "GeneratedConstants.sv"
                ),
                new Constant[] {
                    new Constant(name: "MAX_PRIMARY_CURRENT", value: maxPrimaryCurrentRaw, Format.Decimal, nBits: 8),
                    new Constant(name: "MAX_FIRST_STAGE_VOLTAGE", value: maxFirstStageVoltageRaw, Format.Decimal, nBits: 8),
                    new Constant(name: "MAX_OUTPUT_VOLTAGE", value: maxOutputVoltageRaw, Format.Decimal, nBits: 8),
                    new Constant(name: "INTERFACE_BUFFERED_DATA_LAST_INDEX", 
                        value: (constants.FpgaInterfaceBufferedDataLength*8)-1, Format.RawInteger),
                    new Constant(name: "INTERFACE_BUFFERED_DATA_LENGTH_BYTES_10BITS",
                        value: constants.FpgaInterfaceBufferedDataLength, Format.Decimal, nBits:10),
                    new Constant(name: "CAPTURE_BUFFERS_RAM_LENGTH_BYTES",
                        value: constants.FpgaCaptureBuffersLengthBytes, Format.RawInteger),
                    new Constant(name: "CAPTURE_BUFFERS_RAM_LAST_INDEX",
                        value: constants.FpgaCaptureBuffersLengthBytes - 1, Format.RawInteger)
                }
                .Concat(FPGAConstantsGenerator.ConstantsFactory.FromEnum<FPGACommand>(8))
                .Concat(FPGAConstantsGenerator.ConstantsFactory.FromEnum<FPGAState>(8))
                .Concat(FPGAConstantsGenerator.ConstantsFactory.FromEnum<FPGAError>(8))
                .ToArray()
            );
        }
        private static void GenerateJavaScriptConfigurations(string reposDirectory, Constants constants) {
            AlreadyWroteWatcher alreadyWroteWatcher = new AlreadyWroteWatcher();
            HVPSConfigurationForUI configuration = new HVPSConfigurationForUI(
                firstStageVoltageFromRaw:constants.FirstStageVoltageFromRaw,
                outputVoltageFromRaw:constants.OutputVoltageFromRaw,
                primaryCurrentFromRaw:constants.PrimaryCurrentFromRaw);
            JavaScriptConfigurationWriter.Write(Path.Combine(
                    reposDirectory,
                    "hvps",
                    "Code",
                    "JavaScript",
                    "client",
                    "src",
                    "generated",
                    "HVPSConfiguration.js"
            ), configuration, alreadyWroteWatcher,
                writtenStructName: "HVPSConfiguration");
            JavaScriptEnumWriter.Write<SampleType>(
                Path.Combine(
                        reposDirectory,
                        "hvps",
                        "Code",
                        "JavaScript",
                        "client",
                        "src",
                        "generated",
                        "enums"
                )
            );
            JavaScriptEnumWriter.Write<FPGAError>(
                Path.Combine(
                        reposDirectory,
                        "hvps",
                        "Code",
                        "JavaScript",
                        "client",
                        "src",
                        "generated",
                        "enums"
                )
            );
        }
        private static UInt32 FlashHzToMilliseconds(double hz){
            if (hz <= 0) return 0;
            double delayMs = Math.Ceiling((double)500 / hz);
            if (delayMs <= 0) return 0;
            var delay = (UInt32)delayMs;
            return delay;
        }
    }
}
