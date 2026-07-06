// See https://aka.ms/new-console-template for more information
using Core.FileSystem;
using Core.Strings;
using System.Reflection;
using System.Text;
using ConfigurationClassBuilder;
using HVPSConstants;
using Core.Exceptions;

namespace HVPSGenerateConfigurationClassesAndMatlabParameters
{
    static class Program
    {
        private const string CONSTANTS_VARIABLE_NAME_COLUMN = "F";
        private const string CONSTANTS_VARIABLE_NAME_COLUMN_TITLE = "Variable Name";
        public const string CONSTANTS_VALUE_COLUMN = "D";
        private const string MATLAB_SIMULATION_PARAMETERS_VARIABLE_NAME_COLUMN = "G";
        private const string MATLAB_SIMULATION_PARAMETERS_VARIABLE_NAME_COLUMN_TITLE = "Simulation Parameter Name";
        public const string MATLAB_SIMULATION_PARAMETERS_VALUE_COLUMN = "D";
        public static void Main(string[] args)
        {
            string hvpsProjectDirectory = ProjectDirectoryHelper.FindFromExecuting();
            string thisApplicationProjectDirectory = Directory.GetParent(Environment.CurrentDirectory)!.Parent!.Parent!.FullName;
            string outputDirectory = Path.Combine(thisApplicationProjectDirectory, "output");
            DirectoryHelper.DeleteRecursively(outputDirectory);
            Directory.CreateDirectory(outputDirectory);
            ParseSpreadsheetsToConstantsClasses(hvpsProjectDirectory, outputDirectory,
                new SpreadsheetToConstantsClassParameters("Spreadsheets\\4kV.xlsx", "Constants4kV", typeof(Constants4kV))
            );
            ParseSpreadsheetToMatlabSimulationParameters(hvpsProjectDirectory, "Spreadsheets\\4kV.xlsx", outputDirectory, "SimulationParameters.m");
        }
        private static void ParseSpreadsheetToMatlabSimulationParameters(string projectDirectory, string relativePathSpreadsheet, 
            string outputDirectory, string parametersFileName) {

            string spreadsheetFilePath = Path.Combine(projectDirectory, relativePathSpreadsheet);
            SpreadsheetVariable[] spreadsheetVariables = SpreadsheetReader.Read(
                spreadsheetFilePath, MATLAB_SIMULATION_PARAMETERS_VARIABLE_NAME_COLUMN_TITLE, 
                MATLAB_SIMULATION_PARAMETERS_VARIABLE_NAME_COLUMN, MATLAB_SIMULATION_PARAMETERS_VALUE_COLUMN);
            StringBuilder sb = new StringBuilder();
            foreach (SpreadsheetVariable spreadsheetVariable in spreadsheetVariables) {
                sb.AppendLine($"{spreadsheetVariable.Name} = {spreadsheetVariable.ValueString};");
            }
            File.WriteAllText(Path.Combine(outputDirectory, parametersFileName), sb.ToString());
        }
        private static void ParseSpreadsheetsToConstantsClasses(string projectDirectory, string outputDirectory, params SpreadsheetToConstantsClassParameters[] parameterss)
        {
            var parseSpreadsheetToConstantsClass = Create_ParseSpreadsheetToConstantsClass(projectDirectory, outputDirectory);
            foreach(var parameters in parameterss)
            {
                parseSpreadsheetToConstantsClass(parameters);
            }
        }
        private static Action<SpreadsheetToConstantsClassParameters> Create_ParseSpreadsheetToConstantsClass(string projectDirectory, string outputDirectory) {

            return (SpreadsheetToConstantsClassParameters parameters) =>
            {
                string spreadsheetFilePath = Path.Combine(projectDirectory, parameters.RelativePathSpreadsheet);
                SpreadsheetVariable[] spreadsheetVariables = SpreadsheetReader.Read(
                    spreadsheetFilePath, CONSTANTS_VARIABLE_NAME_COLUMN_TITLE, CONSTANTS_VARIABLE_NAME_COLUMN, CONSTANTS_VALUE_COLUMN);
                ConfigMember[] members = ConfigMemberFactory.GetConfigurationMembers(parameters.ConstantsClassType)
                .Where(c=>c.HasAttribute<ExcelSpreadsheetVariable>()).ToArray();
                var spreadsheetVariableConfigMemberPairs = ValidateMatch(spreadsheetVariables, members, spreadsheetFilePath, parameters.ConstantsClassType.Name);

                string constantsClassContent = GenerateConstantsClass(spreadsheetVariableConfigMemberPairs, parameters.ClassName, parameters.ConstantsClassType);
                string constantsClassFilePath = Path.Combine(outputDirectory, $"{parameters.ClassName}.cs");
                File.WriteAllText(constantsClassFilePath, constantsClassContent);
            };
        }
        private static Tuple<SpreadsheetVariable, ConfigMember>[] ValidateMatch(SpreadsheetVariable[] spreadsheetVariables, ConfigMember[] members, string spreadsheetFilePath, string className)
        {
            Dictionary<string, ConfigMember> mapNameToConfigMember= members.ToDictionary(v => v.Name, v => v);
            foreach (var spreadsheetVariable in spreadsheetVariables) { 
                if(!mapNameToConfigMember.ContainsKey(spreadsheetVariable.Name))
                {
                    throw new ValidationException($"The class {className} did not contain a property for {spreadsheetVariable.Name}");
                }
            }
            Dictionary<string, SpreadsheetVariable> mapNameToSpreadsheetVariable= spreadsheetVariables.ToDictionary(v => v.Name, v => v);
            var spreadsheetVariableConfigMemberPairs = new List<Tuple<SpreadsheetVariable, ConfigMember>>();
            foreach (ConfigMember configMember in members)
            {
                if (!mapNameToSpreadsheetVariable.TryGetValue(configMember.Name, out SpreadsheetVariable? spreadsheetVariable))
                {
                    throw new ValidationException($"The spreadsheet \"{spreadsheetFilePath}\" did not contain a property for {configMember.Name}");
                }
                spreadsheetVariableConfigMemberPairs.Add(new Tuple<SpreadsheetVariable, ConfigMember>(spreadsheetVariable, configMember));
            }
            return spreadsheetVariableConfigMemberPairs.ToArray();
        }
        private static string GenerateConstantsClass(
            Tuple<SpreadsheetVariable, ConfigMember>[] spreadsheetVariableConfigMembers, string className, Type typeConfiguration) { 
            StringBuilder sb = new StringBuilder();
            sb.AppendLine("namespace HVPSConstants");
            sb.AppendLine("{");
            sb.AppendLine($"    public class {className}:Constants");
            sb.AppendLine("    {");
            sb.Append($"        public {className}():base(");
            bool first = true;
            object instance = Activator.CreateInstance(typeConfiguration)!;
            foreach (var spreadsheetVariableConfigMember in spreadsheetVariableConfigMembers)
            {
                SpreadsheetVariable spreadsheetVariable = spreadsheetVariableConfigMember.Item1;
                ConfigMember configMember = spreadsheetVariableConfigMember.Item2;
                if (first) first = false;
                else sb.Append(",");
                sb.AppendLine();
                sb.Append($"            {StringHelper.LowerCamelCase(spreadsheetVariable.Name)}:{spreadsheetVariable.GetValueAsStringForType(configMember.ValueType)}//old value:{configMember.GetCSharpValueString(instance)}");
            }
            sb.AppendLine();
            sb.AppendLine("        ){");
            sb.AppendLine("        }");
            sb.AppendLine("    }");
            sb.AppendLine("}");
            return sb.ToString();
        }
    }
}