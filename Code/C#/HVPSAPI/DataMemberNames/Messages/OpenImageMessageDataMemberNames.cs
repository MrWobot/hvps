using MessageTypes.Attributes;

namespace HVPSAPI.DataMemberNames.Messages
{
    [MessageType(MessageTypes.OpenImageMessage)]
    public static class OpenImageMessageDataMemberNames
    {
        public const string DataUrl = "d";
        public const string Title = "t";
    }
}
