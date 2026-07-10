namespace HVPSConstants
{
    public class Constants4kV:Constants
    {
        public Constants4kV():base(
            firstStageVoltageFromRaw:1.6204829f//old value:1.65,
            outputVoltageFromRaw:40.920715f//old value:37.64706,
            maxOutputVoltageVolts:4000.0f//old value:4000,
            minOutputVoltageVolts:2000.0f//old value:2000,
            powerSupplyVoltageFeedbackPotentialDividerRatio:16.5f//old value:16.5,
            primaryCurrentFromRaw:0.15686275f//old value:0.15686275,
            maxMosfetTemperatureDegreesC:60.0f//old value:60,
            villardCapacitorsBleedTimeConstantSeconds:14//old value:14,
            maxFirstStageVoltage:400.0f//old value:400,
            maxADCConversionTime:6.6E-07f//old value:6.6E-07,
            maxSupplyVoltage:44.1f//old value:44.1,
            maxPrimaryCurrent:21.25f//old value:15,
            maxPrimaryCurrentFactoringInADCConversionTime:16.84f//old value:10.5,
            transformerLeakageInductance:6.6E-06f//old value:6.6E-06
        ){
        }
    }
}
