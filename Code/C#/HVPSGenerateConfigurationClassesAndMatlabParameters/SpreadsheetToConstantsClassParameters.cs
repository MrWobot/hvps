using ClosedXML.Excel;
using Core.Exceptions;
namespace HVPSGenerateConfigurationClassesAndMatlabParameters
{
    public class SpreadsheetToConstantsClassParameters
    {
        public string RelativePathSpreadsheet { get; }
        public string ClassName { get; }
        public Type ConstantsClassType{ get; }
        public SpreadsheetToConstantsClassParameters(string relativePathSpreadsheet, string className, Type constantsClassType) { 
            RelativePathSpreadsheet = relativePathSpreadsheet;
            ClassName = className;
            ConstantsClassType = constantsClassType;
        }
    }
}