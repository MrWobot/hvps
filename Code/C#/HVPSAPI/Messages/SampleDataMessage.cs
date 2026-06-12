using Core.Messages.Messages;
using HVPSAPI.DataMemberNames.Messages;
using HVPSCore.Enums;
using Microsoft.Win32;
using System;
using System.Net;
using System.Runtime.Serialization;
using System.Text.Json.Serialization;
using HVPSCore.Enums;
namespace HVPSAPI.Messages
{
    [DataContract]
    public class SampleDataMessage : TypedMessageBase
    {

        [JsonPropertyName(SampleDataMessageDataMemberNames.SampleType)]
        [JsonInclude]
        [DataMember(Name = SampleDataMessageDataMemberNames.SampleType)]
        /*!< a register set when the exception caused */
        public SampleType SampleType { get; protected set; }

        [JsonPropertyName(SampleDataMessageDataMemberNames.Bytes)]
        [JsonInclude]
        [DataMember(Name = SampleDataMessageDataMemberNames.Bytes)]
        /*!< Bit mask of available EPCx registers */
        //8 bits
        public byte[] Bytes { get; protected set; }
        public SampleDataMessage()
            : base()
        {
            Type = MessageTypes.SampleData;
        }
    }
}
