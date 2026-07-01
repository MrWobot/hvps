namespace HVPSConstants
{
    public class Constants4K:Constants
    {
        public Constants4K() : base(
            firstStageVoltageFromRaw: 1.65f,
            outputVoltageFromRaw: 18.8f,
            maxOutputVoltageVolts: 4000,
            minOutputVoltageVolts: 2000,
            powerSupplyVoltageFeedbackPotentialDividerRatio: 16.5f,
            primaryCurrentFromRaw: 0.156862745f,
            maxTemperatureMosfetDegreesC: 50,
            villardCapacitorsBleedTimeConstantSeconds: 14,
            maxFirstStageVoltage: 400,
            maxSupplyVoltage: 44.1f,
            maxPrimaryCurrent: 20,
            transformerLeakageInductance: 6.6e-6f
        )
        { 
            
        }
    }
}
