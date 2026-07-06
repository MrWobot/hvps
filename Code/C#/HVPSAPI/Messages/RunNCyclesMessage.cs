using Core.Messages.Messages;
using HVPSAPI.DataMemberNames.Messages;
using System.Runtime.Serialization;
using System.Text.Json.Serialization;

namespace HVPSAPI.Messages
{
    [DataContract]
    public class RunNCyclesMessage : TypedMessageBase
    {
        [JsonPropertyName(RunNCyclesMessageDataMemberNames.NCycles)]
        [JsonInclude]
        [DataMember(Name = RunNCyclesMessageDataMemberNames.NCycles)]
        public byte NCycles { get; }
        public RunNCyclesMessage(byte nCycles)
            : base()
        {
            Type = MessageTypes.RunNCycles;
            NCycles = nCycles;
        }
    }
}
