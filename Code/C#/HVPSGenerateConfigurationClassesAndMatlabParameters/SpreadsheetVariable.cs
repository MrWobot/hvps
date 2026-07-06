namespace HVPSGenerateConfigurationClassesAndMatlabParameters
{
    public class SpreadsheetVariable
    {
        public string Name { get;}
        public string ValueString { get; }
        public string GetValueAsStringForType(Type tValue) {
            if (tValue.Equals(typeof(float))){
                string floatString = ((float)double.Parse(ValueString)).ToString();
                if (!floatString.Contains("."))
                    floatString += ".0";
                return floatString + "f";
            }
            if (tValue.Equals(typeof(UInt32))) { 
                return UInt32.Parse(ValueString).ToString();
            }
            throw new NotImplementedException($"Not implemented for type {tValue.Name}");
        }
        public SpreadsheetVariable(string name, string valueString) { 
            Name = name;
            ValueString = valueString;
        }
    }
}