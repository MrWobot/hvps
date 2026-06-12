using MessageTypes.Attributes;

namespace HVPSAPI.DataMemberNames.Messages
{
    [MessageType(MessageTypes.SampleData)]
    public static class SampleDataMessageDataMemberNames
    {
        public const string SampleType = "a";
        public const string Bytes = "b";
    }
}
