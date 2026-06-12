using Core.Messages.Messages;
using HVPSAPI.DataMemberNames.Messages;
using System.Runtime.Serialization;
using System.Text.Json.Serialization;

namespace HVPSAPI.Messages
{
    [DataContract]
    public class RanSystemChecksMessage : TypedMessageBase
    {
        public RanSystemChecksMessage()
            : base()
        {
            Type = MessageTypes.RanSystemChecks;
        }
    }
}
