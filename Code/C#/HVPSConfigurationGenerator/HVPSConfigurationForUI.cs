namespace HVPSConfigurationGenerator
{
    public struct HVPSConfigurationForUI
    {
        public float FirstStageVoltageFromRaw { get; }
        public float OutputVoltageFromRaw { get; }
        public float PrimaryCurrentFromRaw { get; }
        public HVPSConfigurationForUI(
            float firstStageVoltageFromRaw,
            float outputVoltageFromRaw,
            float primaryCurrentFromRaw)
        {
            FirstStageVoltageFromRaw = firstStageVoltageFromRaw;
            OutputVoltageFromRaw = outputVoltageFromRaw;
            PrimaryCurrentFromRaw = primaryCurrentFromRaw;
        }
    }
}