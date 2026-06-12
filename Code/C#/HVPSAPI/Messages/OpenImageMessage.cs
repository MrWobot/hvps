using Core.Messages.Messages;
using HVPSAPI.DataMemberNames.Messages;
using System.Runtime.Serialization;
using System.Text.Json.Serialization;

namespace HVPSAPI.Messages
{
    [DataContract]
    public class OpenImageMessage : TypedMessageBase
    {
        [JsonPropertyName(OpenImageMessageDataMemberNames.Title)]
        [JsonInclude]
        [DataMember(Name = OpenImageMessageDataMemberNames.Title)]
        public string Title { get; protected set; }
        [JsonPropertyName(OpenImageMessageDataMemberNames.DataUrl)]
        [JsonInclude]
        [DataMember(Name = OpenImageMessageDataMemberNames.DataUrl)]
        public string DataUrl { get; protected set; }
        public OpenImageMessage()
            : base()
        {
            Type = MessageTypes.OpenImageMessage;
        }
    }
}
