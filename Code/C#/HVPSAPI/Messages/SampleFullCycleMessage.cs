using Core.Messages.Messages;
using System.Runtime.Serialization;
using System.Text.Json.Serialization;

namespace HVPSAPI.Messages
{
    [DataContract]
    public class SampleFullCycleMessage : TypedMessageBase
    {
        public SampleFullCycleMessage()
            : base()
        {
            Type = MessageTypes.SampleFullCycle;
        }
    }
}
