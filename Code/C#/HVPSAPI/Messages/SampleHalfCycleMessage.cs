using Core.Messages.Messages;
using System.Runtime.Serialization;
using System.Text.Json.Serialization;

namespace HVPSAPI.Messages
{
    [DataContract]
    public class SampleHalfCycleMessage : TypedMessageBase
    {
        public SampleHalfCycleMessage()
            : base()
        {
            Type = MessageTypes.SampleHalfCycle;
        }
    }
}
