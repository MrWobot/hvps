using Core.Messages.Messages;
using System.Runtime.Serialization;
using System.Text.Json.Serialization;

namespace HVPSAPI.Messages
{
    [DataContract]
    public class CalculateInductanceMessage : TypedMessageBase
    {
        public CalculateInductanceMessage()
            : base()
        {
            Type = MessageTypes.CalculateInductance;
        }
    }
}
