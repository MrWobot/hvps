namespace HVPSConstants
{
    public class Constants4kV:Constants
    {
        public Constants4kV() : base(
            firstStageVoltageFromRaw: 1.6204829f,//old value:1.65,
            maxFirstStageVoltage: 400,
            maxOutputVoltageVolts: 4000,
            maxPrimaryCurrent: 15,
            maxPrimaryCurrentFactoringInADCConversionTime:10.5f,
            maxSupplyVoltage: 44.1f,
            maxMosfetTemperatureDegreesC: 60,
            minOutputVoltageVolts: 2000,
            outputVoltageFromRaw: 40.920715f,//old value:37.64706,
            powerSupplyVoltageFeedbackPotentialDividerRatio: 16.5f,
            primaryCurrentFromRaw: 0.156862745f,
            transformerLeakageInductance: 6.6e-6f,
            villardCapacitorsBleedTimeConstantSeconds: 14,
            maxADCConversionTime: 0.00000066f//33f / 50000000f
        )
        { 
            
        }
    }
}
